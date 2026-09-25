const express = require('express');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume, listResumes, getResume, deleteResume } = require('../controllers/cvController');

const router = express.Router();

router.use(auth);

router.post('/upload', upload.single('file'), uploadResume);
router.get('/', listResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
