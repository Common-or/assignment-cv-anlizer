const fs = require('fs');
const path = require('path');

let tesseract = null;
try {
  // Lazy optional dependency — keeps `npm install` light if OCR is unused.
  tesseract = require('tesseract.js');
} catch (e) {
  tesseract = null;
}

async function ocrImage(filePath) {
  if (!tesseract) {
    throw new Error('OCR engine is not installed. Run `npm install tesseract.js` on the server.');
  }
  try {
    const { data } = await tesseract.recognize(filePath, 'eng');
    return (data && data.text ? String(data.text) : '').trim();
  } catch (err) {
    throw new Error(`OCR failed: ${err.message}`);
  }
}

module.exports = { ocrImage };
