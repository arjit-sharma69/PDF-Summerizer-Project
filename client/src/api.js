import axios from 'axios';

// For global hosting, set VITE_API_BASE to your backend URL (e.g., https://api.yourapp.com)
// Falls back to localhost for dev.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export async function extractFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await axios.post(`${BASE}/api/extract`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function summarizeText(text, length) {
  const { data } = await axios.post(`${BASE}/api/summarize`, { text, length });
  return data;
}
