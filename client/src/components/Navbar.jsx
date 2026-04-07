import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Brain,
  CalendarDays,
  BarChart3,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
  { to: '/notes', icon: <FileText className="h-5 w-5" />, label: 'Notes' },
  { to: '/quiz', icon: <Brain className="h-5 w-5" />, label: 'Quiz' },
  { to: '/plan', icon: <CalendarDays className="h-5 w-5" />, label: 'Plan' },
  { to: '/progress', icon: <BarChart3 className="h-5 w-5" />, label: 'Progress' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">AI Study Buddy</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative ml-auto w-64 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-sm text-gray-900 dark:text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-0.5 overflow-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    isActive ? 'nav-link-active' : 'nav-link'
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="px-3 pb-6 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              {user && (
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
