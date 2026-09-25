const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
]);

const ALLOWED_EXT = new Set(['.pdf', '.docx', '.png', '.jpg', '.jpeg']);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 60);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.has(ext) || !ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error('Unsupported file format. Only PDF, DOCX, PNG, JPG are allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

module.exports = upload;
