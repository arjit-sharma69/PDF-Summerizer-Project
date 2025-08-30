const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { extractFromPdf } = require('./extractors/pdf');
const { ocrImage, ocrPdfViaPoppler } = require('./extractors/ocr');
const { summarize } = require('./summarize');

const app = express();
app.use(express.json({ limit: '10mb' }));

// --- CORS configuration for global hosting ---
// Set ALLOWED_ORIGINS env as comma-separated list, e.g. 
// "https://yourapp.com,https://staging.yourapp.com"
const allowed = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow same-origin or curl/postman
    if (allowed.includes('*') || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin not allowed'));
  },
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Store uploads on disk (temp)
const upload = multer({ dest: path.join(__dirname, '../../.uploads') });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 1) Extract text from upload (pdf / image)
app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const mimetype = req.file.mimetype || '';

    let text = '';
    let method = '';
    let numPages = 1;

    if (mimetype.includes('pdf')) {
      // Try native PDF text first
      const pdfResult = await extractFromPdf(filePath);
      text = pdfResult.text || '';
      numPages = pdfResult.numPages || 1;
      method = 'pdf-parse';

      // If looks like a scanned PDF (very little text), OCR page images
      const tooShort = (text.replace(/\s+/g, '').length < 100);
      if (tooShort) {
        const ocr = await ocrPdfViaPoppler(filePath, 200); // 200 DPI
        text = ocr.text;
        method = 'ocr-pdf';
      }
    } else if (mimetype.startsWith('image/')) {
      const { text: imgText } = await ocrImage(filePath);
      text = imgText;
      method = 'ocr-image';
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Clean up
    fs.promises.unlink(filePath).catch(() => {});

    res.json({ text, meta: { method, numPages } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Extraction failed', details: String(err.message || err) });
  }
});

// 2) Summarize provided text
app.post('/api/summarize', async (req, res) => {
  try {
    const { text = '', length = 'medium' } = req.body || {};
    if (!text.trim()) return res.status(400).json({ error: 'Empty text' });

    const result = summarize(text, length);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Summarization failed', details: String(err.message || err) });
  }
});

const START = Number(process.env.PORT) || 5000;
const http = require('http');

function listenOn(port) {
  const srv = http.createServer(app);
  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      listenOn(port + 1);
    } else {
      throw err;
    }
  });
  srv.listen(port, () => console.log(`Server running on :${port}`));
}

listenOn(START);
