const fs = require('fs');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { extractTextFromFile, cleanText } = require('../services/documentService');

async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded. Attach a PDF, DOCX, PNG or JPG.' });
    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: req.file.filename,
      status: 'processing',
      label: String(req.body?.label || '').slice(0, 60),
    });

    try {
      const raw = await extractTextFromFile(req.file.path, req.file.originalname, req.file.mimetype);
      const cleaned = cleanText(raw);
      if (!cleaned || cleaned.replace(/\s/g, '').length < 20) {
        throw new Error('Empty CV: no readable text could be extracted.');
      }
      resume.extractedText = cleaned.slice(0, 60000);
      resume.status = 'uploaded';
      await resume.save();
      res.status(201).json({ resume });
    } catch (err) {
      resume.status = 'failed';
      await resume.save();
      // Keep the file for debugging but surface a useful message
      return res.status(422).json({ message: err.message || 'Could not extract text from this file.', resumeId: resume._id });
    }
  } catch (err) {
    next(err);
  }
}

async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    next(err);
  }
}

async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    res.json({ resume });
  } catch (err) {
    next(err);
  }
}

async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    if (resume.fileUrl) {
      const path = require('path');
      const p = path.join(__dirname, '..', 'uploads', resume.fileUrl);
      fs.promises.unlink(p).catch(() => {});
    }
    await Analysis.deleteMany({ resume: resume._id, user: req.user._id });
    await resume.deleteOne();
    res.json({ message: 'Resume deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadResume, listResumes, getResume, deleteResume };
