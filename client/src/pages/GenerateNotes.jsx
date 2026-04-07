import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { SkeletonNotes } from '../components/SkeletonCard';
import api from '../services/api';

const levels = [
  { value: 'beginner', label: '🌱 Beginner' },
  { value: 'intermediate', label: '🚀 Intermediate' },
  { value: 'advanced', label: '🔥 Advanced' },
];

const GenerateNotes = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setLoading(true);
    setError('');
    setNotes('');
    setMeta(null);
    try {
      const { data } = await api.post('/ai/notes', { topic: topic.trim(), level });
      setNotes(data.content);
      setMeta({ topic: data.topic, level: data.level });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestions = [
    'Photosynthesis', 'React Hooks', 'World War II', 'Calculus Integration',
    'Machine Learning', 'DNA Replication', 'French Revolution', 'Python OOP',
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="page-title flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-500" />
          Generate Notes
        </h1>
        <p className="page-subtitle">
          Enter any topic and get AI-generated structured study notes instantly
        </p>
      </div>

      {/* Form Card */}
      <div className="card p-6 mb-6 animate-slide-up">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="notes-topic" className="input-label">
                Topic to study
              </label>
              <input
                id="notes-topic"
                type="text"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setError(''); }}
                className="input"
                placeholder="e.g., Photosynthesis, React Hooks, World War II…"
              />
            </div>
            <div className="sm:w-44">
              <label htmlFor="notes-level" className="input-label">
                Level
              </label>
              <div className="relative">
                <select
                  id="notes-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="select pr-8"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            id="notes-generate-btn"
            type="submit"
            disabled={loading || !topic.trim()}
            className="btn btn-primary w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? 'Generating…' : 'Generate Notes'}
          </button>
        </form>
      </div>

      {/* Loading */}
      {loading && <SkeletonNotes />}

      {/* Notes Result */}
      {!loading && notes && (
        <div className="card p-6 md:p-8 animate-slide-up">
          {/* Notes header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary-500" />
                <h2 className="font-bold text-gray-900 dark:text-white">{meta?.topic}</h2>
                <span className="badge badge-primary capitalize">{meta?.level}</span>
              </div>
              <p className="text-xs text-gray-400">AI-generated study notes</p>
            </div>
            <button
              id="notes-copy-btn"
              onClick={handleCopy}
              className="btn btn-secondary btn-sm flex-shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Markdown content */}
          <div className="prose-study">
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>

          {/* Generate another */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
            <button
              onClick={() => { setNotes(''); setTopic(''); setMeta(null); }}
              className="btn btn-secondary btn-sm"
            >
              Clear & Start Over
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !notes && !error && (
        <div className="card p-12 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            Your notes will appear here
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Enter a topic above and click "Generate Notes" to get started
          </p>
        </div>
      )}
    </Layout>
  );
};

export default GenerateNotes;
