const Job = require('../models/Job');
const Match = require('../models/Match');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { validateJob } = require('../utils/validators');
const aiService = require('../services/aiService');

async function createJob(req, res, next) {
  try {
    const { title, company, location, description, source, url } = req.body || {};
    const errors = validateJob({ title, description });
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const job = await Job.create({
      user: req.user._id,
      title: String(title).trim(),
      company: String(company || '').slice(0, 160),
      location: String(location || '').slice(0, 160),
      description: String(description),
      source: String(source || 'manual').slice(0, 40),
      url: String(url || '').slice(0, 500),
    });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

async function listJobs(req, res, next) {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

async function getJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    await Match.deleteMany({ job: job._id, user: req.user._id });
    await job.deleteOne();
    res.json({ message: 'Job deleted.' });
  } catch (err) {
    next(err);
  }
}

async function matchJob(req, res, next) {
  try {
    const { jobId, resumeId } = req.params;
    const job = await Job.findOne({ _id: jobId, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    const analysis = await Analysis.findOne({ resume: resume._id, user: req.user._id });
    if (!analysis) return res.status(400).json({ message: 'Analyze the CV first (POST /api/analysis/:resumeId).' });

    const candidate = {
      profile: analysis.profile,
      skills: analysis.skills,
      experience: analysis.experience,
      education: analysis.education,
      certifications: analysis.certifications,
      projects: analysis.projects,
      languages: analysis.languages,
    };

    try {
      const result = await aiService.matchResumeWithJob(candidate, job.description);
      const match = await Match.create({
        user: req.user._id,
        resume: resume._id,
        job: job._id,
        overallScore: result.overallScore,
        scoreBreakdown: result.scoreBreakdown,
        matchingSkills: result.matchingSkills,
        missingSkills: result.missingSkills,
        matchingExperience: result.matchingExperience,
        missingExperience: result.missingExperience,
        matchingEducation: result.matchingEducation,
        keywordScore: result.keywordScore,
        recommendations: result.recommendations,
        explanation: result.explanation,
        aiProvider: result.aiProvider,
        aiModel: result.aiModel,
      });
      res.status(201).json({ match });
    } catch (err) {
      return res.status(err.status || 502).json({ message: err.message || 'AI matching failed.' });
    }
  } catch (err) {
    next(err);
  }
}

async function jobMatches(req, res, next) {
  try {
    const matches = await Match.find({ job: req.params.jobId, user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resume job');
    res.json({ matches });
  } catch (err) {
    next(err);
  }
}

async function matchHistory(req, res, next) {
  try {
    const matches = await Match.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('resume job');
    res.json({ matches });
  } catch (err) {
    next(err);
  }
}

module.exports = { createJob, listJobs, getJob, deleteJob, matchJob, jobMatches, matchHistory };
