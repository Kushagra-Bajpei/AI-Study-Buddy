import React from 'react';

const SkeletonCard = ({ lines = 3, className = '' }) => {
  return (
    <div className={`card p-6 animate-pulse ${className}`}>
      <div className="skeleton h-4 w-1/3 mb-4 rounded-lg" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3 rounded-lg mb-3"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
      <div className="skeleton h-3 w-1/2 rounded-lg mt-2" />
    </div>
  );
};

export const SkeletonNotes = () => (
  <div className="card p-8 animate-pulse space-y-5">
    <div className="skeleton h-5 w-1/4 rounded-lg" />
    <div className="skeleton h-3 w-full rounded-lg" />
    <div className="skeleton h-3 w-5/6 rounded-lg" />
    <div className="skeleton h-3 w-4/5 rounded-lg" />
    <div className="skeleton h-5 w-1/3 rounded-lg mt-6" />
    <div className="skeleton h-3 w-full rounded-lg" />
    <div className="skeleton h-3 w-3/4 rounded-lg" />
    <div className="skeleton h-3 w-5/6 rounded-lg" />
    <div className="skeleton h-5 w-2/5 rounded-lg mt-6" />
    <div className="skeleton h-3 w-full rounded-lg" />
    <div className="skeleton h-3 w-4/5 rounded-lg" />
  </div>
);

export default SkeletonCard;
