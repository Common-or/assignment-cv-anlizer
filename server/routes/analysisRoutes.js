const express = require('express');
const auth = require('../middleware/authMiddleware');
const { analyzeResume, getAnalysis, improveResume } = require('../controllers/analysisController');

const router = express.Router();

router.use(auth);

router.post('/:resumeId', analyzeResume);
router.get('/:resumeId', getAnalysis);
router.post('/:resumeId/improve', improveResume);

module.exports = router;
