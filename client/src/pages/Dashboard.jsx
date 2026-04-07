import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Brain,
  CalendarDays,
  BarChart3,
  AlertTriangle,
  Clock,
  BookOpen,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import SkeletonCard from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const typeIcon = { notes: <FileText className="h-3.5 w-3.5" />, quiz: <Brain className="h-3.5 w-3.5" />, plan: <CalendarDays className="h-3.5 w-3.5" /> };
const typeColor = { notes: 'badge-primary', quiz: 'badge-yellow', plan: 'badge-green' };
const typeLabel = { notes: 'Notes', quiz: 'Quiz', plan: 'Plan' };

const quickActions = [
  { to: '/notes', icon: <FileText className="h-6 w-6" />, label: 'Generate Notes', desc: 'AI-powered study notes', color: 'from-blue-500 to-indigo-600', id: 'dash-action-notes' },
  { to: '/quiz', icon: <Brain className="h-6 w-6" />, label: 'Take a Quiz', desc: 'Test your knowledge', color: 'from-violet-500 to-purple-600', id: 'dash-action-quiz' },
  { to: '/plan', icon: <CalendarDays className="h-6 w-6" />, label: 'Study Plan', desc: '7-day roadmap', color: 'from-pink-500 to-rose-500', id: 'dash-action-plan' },
  { to: '/progress', icon: <BarChart3 className="h-6 w-6" />, label: 'My Progress', desc: 'Track your growth', color: 'from-emerald-500 to-teal-500', id: 'dash-action-progress' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/progress');
        setStats(data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ready to learn something new today?
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" />
            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">AI Ready</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-8 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Topics Studied"
            value={stats?.totalTopics ?? 0}
            subtitle="unique topics"
            color="primary"
          />
          <StatsCard
            icon={<Brain className="h-5 w-5" />}
            label="Quizzes Taken"
            value={stats?.totalQuizzes ?? 0}
            subtitle="total attempts"
            color="purple"
          />
          <StatsCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg. Score"
            value={`${stats?.averageScore ?? 0}%`}
            subtitle="across all quizzes"
            color={stats?.averageScore >= 70 ? 'green' : stats?.averageScore >= 50 ? 'orange' : 'red'}
          />
          <StatsCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Weak Areas"
            value={stats?.weakAreas?.length ?? 0}
            subtitle="need attention"
            color="orange"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              id={action.id}
              key={action.to}
              to={action.to}
              className="card card-hover p-5 flex flex-col gap-3 group cursor-pointer animate-slide-up"
            >
              <div
                className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
              >
                {action.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {action.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200 mt-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Weak Areas
            </h2>
            <Link to="/progress" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : stats?.weakAreas?.length > 0 ? (
            <div className="space-y-2">
              {stats.weakAreas.slice(0, 4).map((w) => (
                <div key={w.topic} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/40">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {w.topic}
                  </span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 ml-3 flex-shrink-0">
                    {Math.round(w.averageScore)}% avg
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No weak areas!</p>
              <p className="text-xs text-gray-400 mt-1">Take some quizzes to get insights</p>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-500" />
              Recent Activity
            </h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : stats?.recentSessions?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentSessions.slice(0, 5).map((s) => (
                <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0">{typeIcon[s.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{s.topic}</p>
                    <p className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={typeColor[s.type]}>{typeLabel[s.type]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-10 w-10 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No sessions yet</p>
              <p className="text-xs text-gray-400 mt-1">Generate your first notes to get started</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
