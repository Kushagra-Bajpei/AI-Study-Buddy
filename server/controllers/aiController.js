const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const StudySession = require('../models/StudySession');

// Initialize Gemini with the API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Mock generators for fallback (when API quota is hit)
const generateMockNotes = (topic, level) => {
  return `## 📚 Introduction to ${topic}
This is an AI-generated introduction to **${topic}** for ${level} level. 

## 🔑 Key Concepts
- **Concept 1**: Essential foundation of ${topic}.
- **Concept 2**: Understanding the core mechanics.
- **Concept 3**: Why this matters in the real world.

## 💡 Real-World Examples
1. Practical application in daily life.
2. How scientists and engineers use ${topic}.

## ✅ Quick Summary
- ${topic} is a fundamental concept.
- Mastering it requires consistent practice.

*Note: This content is generated in fallback mode due to API quota limits.*`;
};

const generateMockQuiz = (topic) => {
  return [
    { question: `What is a primary characteristic of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option A", explanation: `${topic} is best understood by its primary characteristic.` },
    { question: `Which of the following is related to ${topic}?`, options: ["Term 1", "Term 2", "Term 3", "Term 4"], answer: "Term 1", explanation: "This term is directly linked to the core theory." },
    { question: `True or False: ${topic} is always constant.`, options: ["True", "False", "Both", "None"], answer: "False", explanation: "It varies depending on external factors." },
    { question: `What is the most common use case for ${topic}?`, options: ["Use 1", "Use 2", "Use 3", "Use 4"], answer: "Use 2", explanation: "Usage varies across different industries." },
    { question: `Who is traditionally associated with the study of ${topic}?`, options: ["Person A", "Person B", "Person C", "Person D"], answer: "Person C", explanation: "Historically, Person C pioneered this field." }
  ];
};

const generateMockPlan = (topic) => {
  return {
    title: `7-Day ${topic} Mastery Plan`,
    overview: `A structured roadmap to help you master ${topic} in one week.`,
    totalHours: 14,
    days: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Foundations of ${topic}`,
      focus: `Mastering the basics of ${topic}`,
      topics: [`Subtopic ${i * 2 + 1}`, `Subtopic ${i * 2 + 2}`],
      tasks: ["Read introduction", "Watch tutorial", "Practice exercises"],
      duration: "2 hours",
      difficulty: i < 3 ? "Easy" : "Medium",
      resources: ["Online documentation", "Video lectures"]
    }))
  };
};

// Helper: Call Gemini API
const callAI = async (prompt, type, topic, level) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing in .env!');
    throw new Error('API Key missing');
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return { content: response.text(), fallback: false };
  } catch (error) {
    console.warn(`⚠️ Gemini API failed (${error.message}). Falling back to Mock AI.`);
    
    if (type === 'notes') return { content: generateMockNotes(topic, level), fallback: true };
    if (type === 'quiz') return { content: JSON.stringify(generateMockQuiz(topic)), fallback: true };
    if (type === 'plan') return { content: JSON.stringify(generateMockPlan(topic)), fallback: true };
    
    throw error;
  }
};

// Helper: Update studied topics
const updateStudiedTopics = async (user, topic) => {
  const idx = user.studiedTopics.findIndex((t) => t.topic === topic);
  if (idx > -1) {
    user.studiedTopics[idx].count += 1;
    user.studiedTopics[idx].lastStudied = Date.now();
  } else {
    user.studiedTopics.push({ topic, count: 1 });
  }
};

// @desc    Generate AI notes for a topic
// @route   POST /api/ai/notes
const generateNotes = async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const user = await User.findById(req.user._id);
    const isWeak = user.weakAreas.some((w) => w.topic === topic);

    const focusNote = isWeak
      ? ' This is a weak area for this student — provide extra simple explanations, more examples, and include common misconceptions.'
      : '';

    const prompt = `Explain "${topic}" comprehensively for a ${level} level student.${focusNote}

Structure your response with these exact markdown sections:
## 📚 Introduction
[Brief engaging intro — what it is and why it matters]

## 🔑 Key Concepts
[List and explain the most important concepts with bullet points]

## 💡 Real-World Examples
[2-3 concrete, relatable examples]

## ⚙️ How It Works
[Step-by-step breakdown]

## ✅ Quick Summary
[5 bullet-point takeaways]

## 🚀 What to Learn Next
[3 recommended next topics]

Use clear language, emojis for visual appeal, and make it engaging for students.`;

    const { content, fallback } = await callAI(prompt, 'notes', topic, level);

    await StudySession.create({
      userId: req.user._id,
      topic,
      type: 'notes',
      content,
      level,
      isFallback: fallback
    });

    await updateStudiedTopics(user, topic);
    await user.save();

    res.json({ content, topic, level, isFallback: fallback });
  } catch (error) {
    console.error('Notes error:', error.message);
    res.status(500).json({
      error: 'Failed to generate notes. Please check your API key and try again.',
    });
  }
};

// @desc    Generate AI quiz for a topic
// @route   POST /api/ai/quiz
const generateQuiz = async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const prompt = `Create exactly 5 multiple choice questions about "${topic}" for a ${level} level student.

Return ONLY a valid JSON array (no markdown, no explanation, just the JSON):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief explanation of why this answer is correct"
  }
]

Make questions progressively harder. Ensure all 4 options are plausible.`;

    const { content, fallback } = await callAI(prompt, 'quiz', topic, level);

    // Robust JSON extraction
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('AI did not return valid quiz format');

    const questions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz data');
    }

    await StudySession.create({
      userId: req.user._id,
      topic,
      type: 'quiz',
      content: JSON.stringify(questions),
      level,
      isFallback: fallback
    });

    res.json({ questions, topic, level, isFallback: fallback });
  } catch (error) {
    console.error('Quiz error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz. Please try again.' });
  }
};

// @desc    Generate AI 7-day study plan
// @route   POST /api/ai/plan
const generatePlan = async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const user = await User.findById(req.user._id);
    const weakAreas = user.weakAreas.map((w) => w.topic);
    const weakContext =
      weakAreas.length > 0
        ? ` Also reinforce these weak areas if relevant: ${weakAreas.join(', ')}.`
        : '';

    const prompt = `Create a detailed 7-day study plan for learning "${topic}" at a ${level} level.${weakContext}

Return ONLY valid JSON (no markdown, no explanation):
{
  "title": "7-Day ${topic} Mastery Plan",
  "overview": "2-3 sentence overview of what the student will achieve",
  "totalHours": 14,
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "focus": "Main focus area",
      "topics": ["subtopic 1", "subtopic 2"],
      "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"],
      "duration": "2 hours",
      "difficulty": "Easy",
      "resources": ["Resource or activity suggestion"]
    }
  ]
}`;

    const { content, fallback } = await callAI(prompt, 'plan', topic, level);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return valid plan format');

    const plan = JSON.parse(jsonMatch[0]);

    await StudySession.create({
      userId: req.user._id,
      topic,
      type: 'plan',
      content: JSON.stringify(plan),
      level,
      isFallback: fallback
    });

    await updateStudiedTopics(user, topic);
    await user.save();

    res.json({ plan, topic, level, isFallback: fallback });
  } catch (error) {
    console.error('Plan error:', error.message);
    res.status(500).json({ error: 'Failed to generate study plan. Please try again.' });
  }
};

// @desc    Save quiz result and update weak areas
// @route   POST /api/ai/quiz/result
const saveQuizResult = async (req, res) => {
  try {
    const { topic, score, totalQuestions, level = 'beginner' } = req.body;

    if (!topic || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(req.user._id);
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save to quiz history
    user.quizHistory.push({ topic, score, totalQuestions, percentage });

    // Update weak areas logic
    if (percentage < 50) {
      const weakIdx = user.weakAreas.findIndex((w) => w.topic === topic);
      if (weakIdx > -1) {
        const existing = user.weakAreas[weakIdx];
        existing.averageScore = Math.round(
          (existing.averageScore * existing.attempts + percentage) /
            (existing.attempts + 1)
        );
        existing.attempts += 1;
      } else {
        user.weakAreas.push({ topic, averageScore: percentage, attempts: 1 });
      }
    } else {
      // Remove from weak areas if passed
      user.weakAreas = user.weakAreas.filter((w) => w.topic !== topic);
    }

    // Update studied topics
    await updateStudiedTopics(user, topic);
    await user.save();

    // Update the session score
    await StudySession.findOneAndUpdate(
      { userId: req.user._id, topic, type: 'quiz' },
      { score, totalQuestions, percentage },
      { sort: { createdAt: -1 } }
    );

    res.json({
      message: 'Quiz result saved successfully',
      percentage,
      isWeakArea: percentage < 50,
      passed: percentage >= 50,
    });
  } catch (error) {
    console.error('Save result error:', error.message);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
};

module.exports = { generateNotes, generateQuiz, generatePlan, saveQuizResult };
