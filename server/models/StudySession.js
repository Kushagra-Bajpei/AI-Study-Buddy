const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['notes', 'quiz', 'plan'],
      required: true,
    },
    content: {
      type: String,
    },
    score: {
      type: Number,
      default: null,
    },
    totalQuestions: {
      type: Number,
      default: null,
    },
    percentage: {
      type: Number,
      default: null,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
