const User = require('../models/User');
const StudySession = require('../models/StudySession');

// @desc    Get user progress stats
// @route   GET /api/progress
const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recentSessions = await StudySession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalTopics = user.studiedTopics.length;
    const totalQuizzes = user.quizHistory.length;

    let averageScore = 0;
    if (totalQuizzes > 0) {
      const total = user.quizHistory.reduce(
        (sum, q) => sum + (q.percentage || 0),
        0
      );
      averageScore = Math.round(total / totalQuizzes);
    }

    res.json({
      totalTopics,
      totalQuizzes,
      averageScore,
      weakAreas: user.weakAreas,
      studiedTopics: user.studiedTopics,
      quizHistory: user.quizHistory,
      recentSessions,
    });
  } catch (error) {
    console.error('Progress error:', error.message);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
};

module.exports = { getProgress };
