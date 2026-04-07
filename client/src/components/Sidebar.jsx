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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
  { to: '/notes', icon: <FileText className="h-4 w-4" />, label: 'Generate Notes' },
  { to: '/quiz', icon: <Brain className="h-4 w-4" />, label: 'Take Quiz' },
  { to: '/plan', icon: <CalendarDays className="h-4 w-4" />, label: 'Study Plan' },
  { to: '/progress', icon: <BarChart3 className="h-4 w-4" />, label: 'Progress' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
              AI Study
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">
              Buddy
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="flex items-center justify-between px-2">
          <ThemeToggle />
          {!collapsed && (
            <button
              id="sidebar-logout"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          )}
        </div>

        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 mt-2">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
