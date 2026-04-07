import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Brain,
  CalendarDays,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Smart Notes',
    desc: 'Generate structured, example-rich notes on any topic in seconds using Claude AI.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'Adaptive Quizzes',
    desc: 'Take 5-question MCQ quizzes that adapt to your weak areas over time.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: '7-Day Study Plans',
    desc: 'Get personalized day-by-day plans with tasks, topics, and time estimates.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Progress Tracking',
    desc: 'Track your quiz scores, weak areas, and learning streaks over time.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
];

const perks = [
  'Powered by Claude 3.5 Sonnet AI',
  'Smart weak-area detection',
  'Personalized recommendations',
  'Dark mode & beautiful UI',
];

const Landing = () => {
  return (
    <div className="min-h-screen hero-gradient dark:bg-gray-950 dark:[background:none]">
      {/* Nav */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base">
            AI Study Buddy
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            id="landing-login"
            to="/login"
            className="btn btn-secondary text-sm"
          >
            Sign In
          </Link>
          <Link
            id="landing-get-started"
            to="/register"
            className="btn btn-primary text-sm"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6">
          <Zap className="h-3.5 w-3.5" />
          Powered by Claude 3.5 Sonnet
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6 text-balance">
          Study{' '}
          <span className="gradient-text">smarter</span>
          {' '}with your{' '}
          <br className="hidden md:block" />
          personal AI tutor
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate beautiful notes, take adaptive quizzes, and build 7-day study plans
          on any topic — all powered by AI and personalized to your weak areas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            id="hero-cta-primary"
            to="/register"
            className="btn btn-primary btn-lg w-full sm:w-auto"
          >
            <Sparkles className="h-5 w-5" />
            Start Learning Free
          </Link>
          <Link
            id="hero-cta-secondary"
            to="/login"
            className="btn btn-secondary btn-lg w-full sm:w-auto"
          >
            Already have an account?
          </Link>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              {perk}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Everything you need to learn better
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Four AI-powered tools that work together to give you the most effective study experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card card-hover p-6 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 shadow-md`}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter your topic', desc: 'Type any subject or subtopic you want to study, from Calculus to World History.' },
              { step: '02', title: 'Choose what to generate', desc: 'Pick notes, a quiz, or a 7-day study plan — whatever fits your learning style.' },
              { step: '03', title: 'Track & improve', desc: 'Your weak areas are detected automatically and future content is personalized to help you.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-start">
                <div className="text-4xl font-black gradient-text mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 p-10 md:p-14 text-center shadow-glow">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23fff fill-opacity=0.05%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          <div className="relative">
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 text-yellow-300 fill-yellow-300" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to ace your studies?
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Join thousands of students using AI to learn faster, retain more, and score higher.
            </p>
            <Link
              id="cta-banner-register"
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 duration-200"
            >
              Get Started — It's Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">AI Study Buddy</span>
        </div>
        <p className="text-xs text-gray-400">
          AI Study Buddy {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Landing;
