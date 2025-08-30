const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const Tesseract = require('tesseract.js');
const { ensureDir, rmrf } = require('../utils/fsx');

// Simple image OCR
async function ocrImage(filePath) {
  const { data } = await Tesseract.recognize(filePath, 'eng');
  return { text: data.text || '' };
}

// Convert scanned PDFs to images then OCR each page
function runPdftoppm(pdfPath, outDir, dpi = 200) {
  const bin = process.env.PDFTOPPM_PATH || 'pdftoppm';
  return new Promise((resolve, reject) => {
    execFile(bin, ['-r', String(dpi), '-png', pdfPath, path.join(outDir, 'page')], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function ocrPdfViaPoppler(pdfPath, dpi = 200) {
  const outDir = path.join(path.dirname(pdfPath), `ppm_${Date.now()}`);
  await ensureDir(outDir);
  try {
    await runPdftoppm(pdfPath, outDir, dpi);
    const files = (await fs.promises.readdir(outDir))
      .filter(f => f.endsWith('.png'))
      .sort((a, b) => {
        const na = parseInt(a.match(/page-(\d+)\.png/)[1]);
        const nb = parseInt(b.match(/page-(\d+)\.png/)[1]);
        return na - nb;
      });
    let full = '';
    for (let i = 0; i < files.length; i++) {
      const imgPath = path.join(outDir, files[i]);
      const { data } = await Tesseract.recognize(imgPath, 'eng');
      full += `\n\n--- Page ${i + 1} ---\n\n` + (data.text || '');
    }
    return { text: full.trim() };
  } finally {
    await rmrf(outDir);
  }
}

module.exports = { ocrImage, ocrPdfViaPoppler };
