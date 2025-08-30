# Server

## Quick start
```bash
cd server
npm install
npm start
```

### OCR for scanned PDFs
Install Poppler for `pdftoppm`:
- macOS: `brew install poppler`
- Ubuntu/Debian: `sudo apt-get install poppler-utils`
- Windows: install Poppler and add `pdftoppm` to PATH.

You can set `PDFTOPPM_PATH` env var if needed.


## CORS for global hosting
Set allowed origins via environment variable:
```bash
# allow any origin (development)
export ALLOWED_ORIGINS='*'

# restrict to your domains (production)
export ALLOWED_ORIGINS='https://yourapp.com,https://staging.yourapp.com'
```
