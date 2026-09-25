const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    scoreBreakdown: { type: Object, default: {} },
    matchingSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    matchingExperience: { type: String, default: '' },
    missingExperience: { type: String, default: '' },
    matchingEducation: { type: String, default: '' },
    keywordScore: { type: Number, default: 0 },
    recommendations: { type: [String], default: [] },
    explanation: { type: [String], default: [] },
    aiProvider: { type: String, default: 'xai' },
    aiModel: { type: String, default: '' },
    aiNotice: { type: String, default: '' },
  },
  { timestamps: true }
);

matchSchema.index({ user: 1, job: 1, resume: 1 });

module.exports = mongoose.model('Match', matchSchema);
