const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const aiService = require('../services/aiService');

async function analyzeResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    if (!resume.extractedText || resume.extractedText.replace(/\s/g, '').length < 20) {
      return res.status(400).json({ message: 'Empty CV: this resume has no extracted text to analyze.' });
    }
    resume.status = 'processing';
    await resume.save();

    try {
      const result = await aiService.analyzeResume(resume.extractedText);
      const analysis = await Analysis.findOneAndUpdate(
        { resume: resume._id, user: req.user._id },
        {
          resume: resume._id,
          user: req.user._id,
          score: result.score,
          scoreBreakdown: result.scoreBreakdown,
          profile: result.profile,
          skills: result.skills,
          experience: result.experience,
          education: result.education,
          certifications: result.certifications,
          languages: result.languages,
          projects: result.projects,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          recommendations: result.recommendations,
          aiProvider: result.aiProvider,
          aiModel: result.aiModel,
          aiNotice: result.aiNotice || '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      resume.status = 'analyzed';
      await resume.save();
      res.status(201).json({ analysis });
    } catch (err) {
      resume.status = 'failed';
      await resume.save();
      if (err.status === 503) {
        return res.status(503).json({ message: 'AI service is not configured (XAI_API_KEY missing). Add it to server/.env.' });
      }
      return res.status(502).json({ message: err.message || 'AI API failure. Please try again.' });
    }
  } catch (err) {
    next(err);
  }
}

async function getAnalysis(req, res, next) {
  try {
    const analysis = await Analysis.findOne({
      resume: req.params.resumeId,
      user: req.user._id,
    }).populate('resume');
    if (!analysis) return res.status(404).json({ message: 'No analysis found for this resume yet.' });
    res.json({ analysis });
  } catch (err) {
    next(err);
  }
}

async function improveResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    const result = await aiService.improveResume(resume.extractedText);
    await Analysis.findOneAndUpdate(
      { resume: resume._id, user: req.user._id },
      { $set: { improvements: result.improvements } },
      { upsert: false }
    ).catch(() => {});
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume, getAnalysis, improveResume };
