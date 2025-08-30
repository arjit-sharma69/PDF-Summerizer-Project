const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractFromPdf(filePath) {
  const dataBuffer = await fs.promises.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return { text: data.text || '', numPages: data.numpages || data.numrender || 1 };
}

module.exports = { extractFromPdf };
