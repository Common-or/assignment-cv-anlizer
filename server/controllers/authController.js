const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { validateRegister, isEmail } = require('../utils/validators');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    const errors = validateRegister({ name, email, password });
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name: String(name).trim(), email: String(email).toLowerCase().trim(), password });
    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!isEmail(email) || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

module.exports = { register, login, me };
