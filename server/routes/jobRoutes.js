const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createJob,
  listJobs,
  getJob,
  deleteJob,
  matchJob,
  jobMatches,
  matchHistory,
} = require('../controllers/jobController');

const router = express.Router();

router.use(auth);

router.post('/', createJob);
router.get('/', listJobs);
router.get('/matches/history', matchHistory);
router.get('/:id', getJob);
router.delete('/:id', deleteJob);
router.post('/:jobId/match/:resumeId', matchJob);
router.get('/:jobId/matches', jobMatches);

module.exports = router;
