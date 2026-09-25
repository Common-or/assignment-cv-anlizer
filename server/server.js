require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', ai: process.env.XAI_API_KEY ? 'configured' : 'missing-key' })
);

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/jobs', jobRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use(errorMiddleware);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`CVision AI server on :${PORT}`)))
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
