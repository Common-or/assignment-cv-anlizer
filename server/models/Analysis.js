const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Other' },
    level: { type: String, default: 'Intermediate' },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    scoreBreakdown: { type: Object, default: {} },
    profile: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    skills: { type: [skillSchema], default: [] },
    experience: { type: Array, default: [] },
    education: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
    languages: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    aiProvider: { type: String, default: 'xai' }, // xai | fallback
    aiModel: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', analysisSchema);
