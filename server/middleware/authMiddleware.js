const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid or missing authorization token.' });
    }
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const msg = err && err.name === 'TokenExpiredError' ? 'Token expired. Please log in again.' : 'Invalid token.';
      return res.status(401).json({ message: msg });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
