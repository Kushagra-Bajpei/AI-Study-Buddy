import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const apiError = err.response?.data?.error;
      const errorMessage = typeof apiError === 'string' 
        ? apiError 
        : (apiError?.message || 'Registration failed. Please try again.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length === 0
    ? null
    : form.password.length < 6
    ? 'weak'
    : form.password.length < 10
    ? 'medium'
    : 'strong';

  return (
    <div className="min-h-screen hero-gradient dark:bg-gray-950 dark:[background:none] flex flex-col">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">AI Study Buddy</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="card p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create your account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Start your AI-powered learning journey today
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-5 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="input-label">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Kushagra Bajpei"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="input-label">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="input-label">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className="input pl-10 pr-10"
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
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

                {/* Password strength */}
                {passwordStrength && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex gap-1 flex-1">
                      {['weak', 'medium', 'strong'].map((level, i) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i === 0 && passwordStrength
                              ? 'bg-red-400'
                              : i === 1 && (passwordStrength === 'medium' || passwordStrength === 'strong')
                              ? 'bg-yellow-400'
                              : i === 2 && passwordStrength === 'strong'
                              ? 'bg-emerald-400'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength === 'strong'
                          ? 'text-emerald-500'
                          : passwordStrength === 'medium'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

              <button
                id="register-submit"
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
                    Creating account…
                  </span>
                ) : (
                  <>
                    Create Account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Benefits */}
            <div className="mt-5 space-y-1.5">
              {['Free forever, no credit card', 'AI-powered personalization', 'Progress tracking included'].map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
