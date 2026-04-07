import React from 'react';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
        style={{ borderWidth: size === 'lg' ? '3px' : '2px' }}
      />
      {size === 'lg' && (
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          AI is thinking…
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
