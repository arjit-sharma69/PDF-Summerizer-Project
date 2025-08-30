# PDF Summarizer – MERN + Material UI

- Drag & drop PDF/Image upload
- PDF text extraction
- OCR for images & scanned PDFs
- Short / Medium / Long toggle
- Copy button (top-right of summary)
- Dark/Light theme

## Run locally

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm run dev
```

If the server falls back to a different port, set `VITE_API_BASE` in `client/.env` to match.


## Deploying with CORS
- **Server** (Express): set `ALLOWED_ORIGINS` to your frontend domain(s).
- **Client** (React): set `VITE_API_BASE` to your server URL, e.g.
  ```bash
  VITE_API_BASE=https://api.yourapp.com
  ```
Then rebuild the client with `npm run build` and deploy the static files.

> Dev tip: leave `ALLOWED_ORIGINS='*'` locally and run the client at `http://localhost:5173` while the server runs on `http://localhost:5000`.
