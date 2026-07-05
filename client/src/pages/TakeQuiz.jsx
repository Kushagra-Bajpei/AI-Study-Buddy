import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const levels = [
  { value: 'beginner', label: '🌱 Beginner' },
  { value: 'intermediate', label: '🚀 Intermediate' },
  { value: 'advanced', label: '🔥 Advanced' },
];

const TakeQuiz = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [quizMeta, setQuizMeta] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setLoading(true); setError('');
    setQuestions([]); setCurrentQ(0); setSelected(null);
    setAnswered(false); setScore(0); setFinished(false);
    setAnswers([]); setSaved(false); setQuizMeta(null);
    try {
      const { data } = await api.post('/ai/quiz', { topic: topic.trim(), level });
      setQuestions(data.questions);
      setQuizMeta({ topic: data.topic, level: data.level });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === questions[currentQ].answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { question: questions[currentQ].question, selected: option, correct, correctAnswer: questions[currentQ].answer, explanation: questions[currentQ].explanation }]);
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      await api.post('/ai/quiz/result', {
        topic: quizMeta.topic,
        score,
        totalQuestions: questions.length,
        level: quizMeta.level,
      });
      setSaved(true);
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setQuestions([]); setCurrentQ(0); setSelected(null);
    setAnswered(false); setScore(0); setFinished(false);
    setAnswers([]); setSaved(false); setQuizMeta(null);
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const q = questions[currentQ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="page-title flex items-center gap-2">
          <Brain className="h-6 w-6 text-violet-500" />
          Take a Quiz
        </h1>
        <p className="page-subtitle">Test your knowledge with AI-generated MCQs</p>
      </div>

      {/* Setup Form */}
      {questions.length === 0 && !loading && (
        <div className="card p-6 mb-6 animate-slide-up">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="quiz-topic" className="input-label">Topic</label>
                <input
                  id="quiz-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => { setTopic(e.target.value); setError(''); }}
                  className="input"
                  placeholder="e.g., Python lists, The Solar System…"
                />
              </div>
              <div className="sm:w-44">
                <label htmlFor="quiz-level" className="input-label">Difficulty</label>
                <div className="relative">
                  <select id="quiz-level" value={level} onChange={(e) => setLevel(e.target.value)} className="select pr-8">
                    {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">{error}</div>
            )}
            <button id="quiz-generate-btn" type="submit" disabled={!topic.trim()} className="btn btn-primary">
              <Sparkles className="h-4 w-4" />
              Generate Quiz (5 MCQs)
            </button>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card p-16 flex flex-col items-center animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Crafting your quiz…</p>
        </div>
      )}

      {/* Active Quiz */}
      {!loading && questions.length > 0 && !finished && (
        <div className="animate-slide-up">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
              {currentQ + 1} / {questions.length}
            </span>
          </div>

          {/* Question card */}
          <div className="card p-6 md:p-8 mb-4">
            <div className="flex items-start gap-3 mb-6">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {currentQ + 1}
              </span>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                {q.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrect = opt === q.answer;
                let optStyle = 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer';
                if (answered) {
                  if (isCorrect) optStyle = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 cursor-default';
                  else if (isSelected && !isCorrect) optStyle = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default';
                  else optStyle = 'border-gray-200 dark:border-gray-700 cursor-default opacity-60';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={answered}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${optStyle}`}
                  >
                    <span className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      answered && isCorrect ? 'border-emerald-500 bg-emerald-500 text-white'
                      : answered && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500'
                    }`}>
                      {answered && isCorrect ? <CheckCircle2 className="h-4 w-4" /> : answered && isSelected ? <XCircle className="h-4 w-4" /> : ['A','B','C','D'][i]}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className={`mt-4 p-4 rounded-xl border ${selected === q.answer ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} animate-slide-up`}>
                <p className={`text-sm font-semibold mb-1 ${selected === q.answer ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {selected === q.answer ? '✅ Correct!' : `❌ Incorrect. The answer was: ${q.answer}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{q.explanation}</p>
              </div>
            )}
          </div>

          {answered && (
            <div className="flex justify-end">
              <button id="quiz-next-btn" onClick={handleNext} className="btn btn-primary">
                {currentQ + 1 < questions.length ? 'Next Question →' : 'See Results 🎉'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {finished && (
        <div className="animate-slide-up space-y-6">
          {/* Score card */}
          <div className="card p-8 text-center">
            <div className={`h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg ${
              percentage >= 70 ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
              : percentage >= 40 ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-red-400 to-rose-500'
            }`}>
              {percentage}%
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {percentage >= 70 ? '🎉 Great job!' : percentage >= 40 ? '📚 Keep studying!' : '💪 Don\'t give up!'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              You got <strong className="text-gray-900 dark:text-white">{score} out of {questions.length}</strong> correct on "{quizMeta?.topic}"
            </p>
            {percentage < 50 && (
              <div className="inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                This topic will be marked as a weak area
              </div>
            )}
            <div className="flex justify-center gap-3 mt-6">
              {!saved ? (
                <button id="quiz-save-btn" onClick={handleSave} disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving…' : '💾 Save Result'}
                </button>
              ) : (
                <span className="btn btn-secondary cursor-default">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Saved!
                </span>
              )}
              <button id="quiz-retry-btn" onClick={handleRetry} className="btn btn-secondary">
                <RotateCcw className="h-4 w-4" /> New Quiz
              </button>
            </div>
          </div>

          {/* Answer review */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" /> Answer Review
            </h3>
            <div className="space-y-4">
              {answers.map((a, i) => (
                <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {a.correct ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.question}</p>
                  </div>
                  {!a.correct && (
                    <p className="text-xs ml-6 text-red-600 dark:text-red-400 mb-1">Your answer: {a.selected}</p>
                  )}
                  <p className="text-xs ml-6 text-emerald-600 dark:text-emerald-400 font-medium">Correct: {a.correctAnswer}</p>
                  <p className="text-xs ml-6 text-gray-500 dark:text-gray-400 mt-1">{a.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TakeQuiz;
