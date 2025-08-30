const natural = require('natural');
const { removeStopwords } = require('stopword');

const tokenizer = new natural.SentenceTokenizer();

function wordFreqMap(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const filtered = removeStopwords(words);
  const freq = new Map();
  for (const w of filtered) freq.set(w, (freq.get(w) || 0) + 1);
  return freq;
}

function scoreSentences(sentences, freq) {
  return sentences.map((s, idx) => {
    const tokens = s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    const filtered = removeStopwords(tokens);
    const score = filtered.reduce((acc, t) => acc + (freq.get(t) || 0), 0) / (filtered.length + 1);
    return { idx, s, score };
  });
}

function pickCount(total, length) {
  if (length === 'short') return Math.min(3, total);
  if (length === 'long') return Math.min(Math.max(8, Math.ceil(total * 0.25)), Math.max(12, total));
  return Math.min(5, total); // medium
}

function summarize(raw, length = 'medium') {
  const text = String(raw || '').replace(/\s+\n/g, '\n').trim();
  const limited = text.length > 15000 ? text.slice(0, 15000) : text;
  const sentences = tokenizer.tokenize(limited).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return { summary: '', highlights: [] };

  const freq = wordFreqMap(limited);
  const scored = scoreSentences(sentences, freq).sort((a, b) => b.score - a.score);
  const k = pickCount(sentences.length, length);
  const top = scored.slice(0, k).sort((a, b) => a.idx - b.idx); // keep original order

  const summary = top.map(t => t.s.trim()).join(' ');
  const highlights = scored.slice(0, Math.min(5, scored.length)).map(t => t.s.trim());

  return { summary, highlights };
}

module.exports = { summarize };
