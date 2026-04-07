import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className={`relative h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-200
        text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
        hover:text-gray-800 dark:hover:text-gray-200 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
