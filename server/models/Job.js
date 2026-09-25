const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, required: true },
    source: { type: String, default: 'manual' },
    url: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
