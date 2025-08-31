# PDF & Image Summarizer — React + Express + Material UI (OCR + PDF Parsing)

## ✨ Features

- ✅ Drag & drop upload (**PDF**, **PNG/JPG/WebP**)
- ✅ **PDF text extraction** (keeps line breaks) using `pdf-parse`
- ✅ **OCR** for images & scanned/image‑PDFs using `tesseract.js` + Poppler’s `pdftoppm`
- ✅ **Summary length toggle**: **SHORT | MEDIUM | LONG**
- ✅ **Copy** button in the **top‑right** of the summary box
- ✅ **Dark/Light** theme (persists)
- ✅ **CORS** for global hosting (restrict by domain via env var)

## 🧩 Problem-Solving Approach

The project addresses the challenge of extracting and summarizing content from both **text-based PDFs** and **scanned/image-based documents**. The solution follows a structured pipeline:

1. **Input Handling**  
   Users upload PDFs or images via a React frontend with Material UI, using a drag-and-drop interface for convenience and validation.

2. **Text Extraction**  
   - For **text-based PDFs**, the server uses `pdf-parse` to quickly extract text.  
   - If the PDF lacks embedded text (scanned files), **Poppler (`pdftoppm`)** converts each page into PNG images, which are then processed by **Tesseract.js** for OCR.  
   - Direct image uploads (JPG/PNG) are OCR’d with Tesseract.js.

3. **Summarization**  
   Extracted text is split into sentences using `natural`. After removing common stopwords (`stopword`), word frequencies are calculated. Sentences are scored and the top ones are selected based on the chosen length (**SHORT | MEDIUM | LONG**).

4. **Output & Interaction**  
   The React frontend presents the summary in a clean Material UI card with a **copy button** for reuse. Users can adjust summary length and toggle between light/dark themes for a polished experience.

---

## 🧩 Libraries Used (Beginner‑Friendly)

### Frontend
- **React** / **ReactDOM** — UI framework and DOM renderer.
- **Material UI (`@mui/material`)** — polished, accessible components (Buttons, Paper, AppBar, etc.).
- **MUI Icons (`@mui/icons-material`)** — icons like copy, upload, sun/moon.
- **Emotion (`@emotion/*`)** — styling engine MUI uses for theming.
- **react-dropzone** — drag & drop file uploads with acceptance & drag states.
- **axios** — promise‑based HTTP client.
- **Vite** — dev server & build tool. Reads `VITE_*` env vars at build time.

### Backend
- **Express** — minimal web framework for routes (`/api/extract`, `/api/summarize`).  
- **cors** — enables **Cross‑Origin** requests (frontend ↔ backend across domains).
- **multer** — handles `multipart/form-data` uploads (the file itself).
- **pdf-parse** — extracts **real text** from **text‑based PDFs** quickly.
- **tesseract.js** — **OCR** for images & scanned PDFs (turns pixels into text).
- **stopword** — removes common words before scoring sentences.
- **natural** — sentence tokenizer and NLP utilities.
- **(System)** **Poppler** (`pdftoppm`) — converts PDF pages to PNG for OCR.

---

---

## 🛠️ Prerequisites

- **Node.js** v18+ (or v20+ recommended)
- **Poppler** (`pdftoppm`) for scanned PDFs → images → OCR
  - macOS: `brew install poppler`
  - Ubuntu/Debian: `sudo apt-get install poppler-utils`
  - Windows: install Poppler and add its `bin` to PATH (or set `PDFTOPPM_PATH`)
- **tesseract.js** downloads English trained data automatically on first run

---

## 🚀 Quick Start (Local Development)

### 1) Start the server
```bash
cd server
npm install

# Allow any origin locally (dev)
export ALLOWED_ORIGINS='*'       # macOS/Linux
# setx ALLOWED_ORIGINS "*"       # Windows PowerShell (user env)

npm start
# → prints "Server running on :5000" (or :5001 if 5000 is in use)
```

### 2) Start the client
```bash
cd client
npm install

# Point the frontend to your server URL (default is localhost:5000)
printf "VITE_API_BASE=http://localhost:5000
" > .env   # macOS/Linux
# "VITE_API_BASE=http://localhost:5000" | Out-File -Encoding ascii .env  # Windows

npm run dev
# open http://localhost:5173
```

> If the server fell back to a different port (e.g., 5001), update `client/.env` accordingly and restart `npm run dev`.

---

👉 **Live Demo:** [https://pdf-summerizer-project-frontend.onrender.com](https://pdf-summerizer-project-frontend.onrender.com)
