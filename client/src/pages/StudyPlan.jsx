import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  ChevronDown,
  Clock,
  Zap,
  BookOpen,
  ChevronRight,
  Target,
} from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';

const levels = [
  { value: 'beginner', label: '🌱 Beginner' },
  { value: 'intermediate', label: '🚀 Intermediate' },
  { value: 'advanced', label: '🔥 Advanced' },
];

const difficultyColor = {
  Easy: 'badge-green',
  Medium: 'badge-yellow',
  Hard: 'badge-red',
  'Very Hard': 'badge-red',
};

const StudyPlan = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);
  const [meta, setMeta] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setLoading(true); setError(''); setPlan(null); setExpandedDay(0); setMeta(null);
    try {
      const { data } = await api.post('/ai/plan', { topic: topic.trim(), level });
      setPlan(data.plan);
      setMeta({ topic: data.topic, level: data.level });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate study plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 animate-fade-in">
        <h1 className="page-title flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-pink-500" />
          Study Plan
        </h1>
        <p className="page-subtitle">Get a personalized 7-day study roadmap for any topic</p>
      </div>

      <div className="card p-6 mb-6 animate-slide-up">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="plan-topic" className="input-label">Topic to master</label>
              <input
                id="plan-topic"
                type="text"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setError(''); }}
                className="input"
                placeholder="e.g., JavaScript, Organic Chemistry, Guitar…"
              />
            </div>
            <div className="sm:w-44">
              <label htmlFor="plan-level" className="input-label">Level</label>
              <div className="relative">
                <select id="plan-level" value={level} onChange={(e) => setLevel(e.target.value)} className="select pr-8">
                  {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">{error}</div>
          )}
          <button id="plan-generate-btn" type="submit" disabled={loading || !topic.trim()} className="btn btn-primary">
            <Sparkles className="h-4 w-4" />
            {loading ? 'Building your plan…' : 'Generate 7-Day Plan'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <SkeletonCard key={i} lines={4} />)}
        </div>
      )}

      {!loading && plan && (
        <div className="animate-slide-up space-y-6">
          {/* Plan Header */}
          <div className="card p-6 bg-gradient-to-br from-primary-500 to-accent-600 text-white border-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold mb-1">{plan.title}</h2>
                <p className="text-primary-100 text-sm leading-relaxed">{plan.overview}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-extrabold">{plan.totalHours || 14}</p>
                  <p className="text-xs text-primary-100">total hours</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="badge bg-white/20 text-white border-0">
                <CalendarDays className="h-3 w-3" /> 7 days
              </div>
              <div className="badge bg-white/20 text-white border-0 capitalize">
                <Target className="h-3 w-3" /> {meta?.level}
              </div>
              <div className="badge bg-white/20 text-white border-0">
                <BookOpen className="h-3 w-3" /> {meta?.topic}
              </div>
            </div>
          </div>

          {/* Day Cards */}
          <div className="space-y-3">
            {plan.days?.map((day, i) => (
              <div key={day.day} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Day number */}
                  <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                    i < 2 ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                    : i < 4 ? 'bg-gradient-to-br from-violet-400 to-violet-600'
                    : i < 6 ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500'
                  }`}>
                    {day.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{day.title}</p>
                      {day.difficulty && (
                        <span className={difficultyColor[day.difficulty] || 'badge-primary'}>
                          {day.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" /> {day.duration}
                      </span>
                      <span className="text-xs text-gray-400">{day.focus}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expandedDay === i ? 'rotate-90' : ''}`} />
                </button>

                {expandedDay === i && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-slide-up">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Topics */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Topics
                        </p>
                        <ul className="space-y-1.5">
                          {day.topics?.map((t, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-primary-400 mt-2" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Tasks */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Tasks
                        </p>
                        <ul className="space-y-1.5">
                          {day.tasks?.map((t, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="flex-shrink-0 mt-0.5 text-primary-500">→</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {day.resources?.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">📎 Resources</p>
                        {day.resources.map((r, j) => (
                          <p key={j} className="text-xs text-blue-600 dark:text-blue-400">{r}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => { setPlan(null); setTopic(''); setMeta(null); }}
            className="btn btn-secondary btn-sm"
          >
            Create New Plan
          </button>
        </div>
      )}

      {!loading && !plan && !error && (
        <div className="card p-12 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Your plan will appear here</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Enter a topic and we'll build a detailed 7-day study roadmap for you
          </p>
        </div>
      )}
    </Layout>
  );
};

export default StudyPlan;
