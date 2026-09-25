require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const DEMO = {
  name: 'Demo User',
  email: 'demo@cvision.ai',
  password: 'Demo1234!',
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set (server/.env).');
  await mongoose.connect(uri);

  let user = await User.findOne({ email: DEMO.email });
  if (user) {
    user.name = DEMO.name;
    user.password = DEMO.password; // re-hashed by pre-save hook
    await user.save();
    console.log(`Demo user reset: ${DEMO.email}`);
  } else {
    user = await User.create(DEMO);
    console.log(`Demo user created: ${DEMO.email}`);
  }
  console.log(`Login with email "${DEMO.email}" and password "${DEMO.password}"`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
