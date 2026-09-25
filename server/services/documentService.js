const fs = require('fs');
const path = require('path');
const { ocrImage } = require('./ocrService');

async function extractPdfText(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return String(data.text || '').trim();
}

async function extractDocxText(filePath) {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  return String(result.value || '').trim();
}

function isImageExt(ext) {
  return ['.png', '.jpg', '.jpeg'].includes(ext);
}

/**
 * Produces a clean text representation of the CV, using OCR for images
 * and for image-based (scanned) PDFs with little extractable text.
 */
async function extractTextFromFile(filePath, originalName, mimetype) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    let text = '';
    try {
      text = await extractPdfText(filePath);
    } catch (err) {
      throw new Error(`Could not read PDF: ${err.message}`);
    }
    // Scanned PDF heuristic: almost no text -> try OCR page render fallback.
    // We cannot rasterize PDFs without extra native deps, so report clearly.
    if (text.replace(/\s/g, '').length < 50) {
      throw new Error(
        'This PDF appears to be scanned/image-based and contains no extractable text. ' +
          'Please upload a PNG/JPG export of the CV so OCR can process it, or a text-based PDF.'
      );
    }
    return text;
  }

  if (ext === '.docx') {
    try {
      const text = await extractDocxText(filePath);
      if (text.replace(/\s/g, '').length < 10) throw new Error('Empty CV: no text found in DOCX.');
      return text;
    } catch (err) {
      throw new Error(`Could not read DOCX: ${err.message}`);
    }
  }

  if (isImageExt(ext)) {
    const text = await ocrImage(filePath);
    if (text.replace(/\s/g, '').length < 10) {
      throw new Error('OCR produced no readable text. Try a clearer image or a PDF/DOCX file.');
    }
    return text;
  }

  throw new Error('Unsupported file format. Only PDF, DOCX, PNG, JPG are allowed.');
}

function cleanText(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

module.exports = { extractTextFromFile, cleanText };
