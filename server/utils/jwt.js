const jwt = require('jsonwebtoken');

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ id: user._id.toString(), email: user.email }, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };
