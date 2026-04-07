import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient dark:bg-gray-950 dark:[background:none] flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">AI Study Buddy</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="card p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-5 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="input-label">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="input-label">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
