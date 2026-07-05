import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/progress');
      setData(res.data);
    } catch {
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getScoreColor = (pct) => {
    if (pct >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (pct >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (pct) => {
    if (pct >= 70) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (pct >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getBarColor = (pct) => {
    if (pct >= 70) return 'from-emerald-400 to-teal-500';
    if (pct >= 50) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-rose-500';
  };

  return (
    <Layout>
      <div className="mb-6 animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            My Progress
          </h1>
          <p className="page-subtitle">Track your learning journey over time</p>
        </div>
        <button
          id="progress-refresh"
          onClick={fetchData}
          disabled={loading}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={<BookOpen className="h-5 w-5" />} label="Topics Studied" value={data?.totalTopics ?? 0} color="primary" />
          <StatsCard icon={<Brain className="h-5 w-5" />} label="Quizzes Taken" value={data?.totalQuizzes ?? 0} color="purple" />
          <StatsCard icon={<TrendingUp className="h-5 w-5" />} label="Avg. Score" value={`${data?.averageScore ?? 0}%`} color={data?.averageScore >= 70 ? 'green' : data?.averageScore >= 50 ? 'orange' : 'red'} />
          <StatsCard icon={<AlertTriangle className="h-5 w-5" />} label="Weak Areas" value={data?.weakAreas?.length ?? 0} color="orange" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quiz History */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Quiz History
          </h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : data?.quizHistory?.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {[...data.quizHistory].reverse().map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold ${getScoreBg(q.percentage)}`}>
                    <span className={getScoreColor(q.percentage)}>{q.percentage}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{q.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getBarColor(q.percentage)} rounded-full transition-all duration-700`}
                          style={{ width: `${q.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{q.score}/{q.totalQuestions}</span>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 ${q.percentage >= 50 ? 'text-emerald-500' : 'text-red-400'}`}>
                    {q.percentage >= 50 ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Trophy className="h-8 w-8 text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No quiz history yet</p>
              <p className="text-xs text-gray-400 mt-1">Take a quiz to see your results here</p>
            </div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Weak Areas to Focus
          </h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : data?.weakAreas?.length > 0 ? (
            <div className="space-y-3">
              {data.weakAreas.map((w, i) => (
                <div key={i} className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{w.topic}</p>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{Math.round(w.averageScore)}% avg</span>
                  </div>
                  <div className="h-2 bg-orange-200 dark:bg-orange-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                      style={{ width: `${Math.round(w.averageScore)}%` }}
                    />
                  </div>
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1.5">{w.attempts} attempt{w.attempts !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You're doing great!</p>
              <p className="text-xs text-gray-400 mt-1">No weak areas detected yet</p>
            </div>
          )}
        </div>

        {/* Topics Studied */}
        <div className="card p-6 md:col-span-2">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary-500" />
            Topics Studied
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          ) : data?.studiedTopics?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.studiedTopics.map((t, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{t.topic}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-gray-400">{t.count} session{t.count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen className="h-8 w-8 text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No topics studied yet</p>
              <p className="text-xs text-gray-400 mt-1">Generate notes or take a quiz to get started</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
