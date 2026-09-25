// Centralized error handler — never leak stack traces with secrets in production.
function errorMiddleware(err, req, res, next) {
  // Multer errors
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum allowed size is 10 MB.' });
  }
  if (err && /Unsupported file format/.test(err.message || '')) {
    return res.status(400).json({ message: err.message });
  }
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500
      ? 'Something went wrong on the server. Please try again.'
      : err.message || 'Request failed.';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
}

module.exports = errorMiddleware;
