function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateRegister({ name, email, password }) {
  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!isEmail(email)) errors.push('A valid email is required.');
  if (!password || String(password).length < 6) errors.push('Password must be at least 6 characters.');
  return errors;
}

function validateJob({ title, description }) {
  const errors = [];
  if (!title || String(title).trim().length < 2) errors.push('Job title is required.');
  if (!description || String(description).trim().length < 20)
    errors.push('Job description must be at least 20 characters.');
  return errors;
}

module.exports = { isEmail, validateRegister, validateJob };
