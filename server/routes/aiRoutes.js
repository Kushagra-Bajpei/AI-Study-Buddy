const express = require('express');
const router = express.Router();
const {
  generateNotes,
  generateQuiz,
  generatePlan,
  saveQuizResult,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/notes', protect, generateNotes);
router.post('/quiz', protect, generateQuiz);
router.post('/plan', protect, generatePlan);
router.post('/quiz/result', protect, saveQuizResult);

module.exports = router;
