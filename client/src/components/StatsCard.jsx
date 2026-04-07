import React from 'react';

const StatsCard = ({ icon, label, value, subtitle, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-rose-500',
    pink: 'from-pink-500 to-rose-500',
  };

  const bgMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    green: 'bg-emerald-50 dark:bg-emerald-900/20',
    orange: 'bg-orange-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
  };

  return (
    <div className="card card-hover p-5 flex items-start gap-4 animate-fade-in">
      <div
        className={`flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-md`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
        )}
        {trend !== undefined && (
          <p
            className={`text-xs font-medium mt-1 ${
              trend >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
