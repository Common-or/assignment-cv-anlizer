const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, default: '' }, // local path under uploads/
    extractedText: { type: String, default: '' },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'analyzed', 'failed'],
      default: 'uploaded',
    },
    label: { type: String, default: '' }, // e.g. "Frontend", "Full Stack", "Internship" (multi-version support)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
