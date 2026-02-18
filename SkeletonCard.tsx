import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-xl p-6 h-full flex flex-col border border-slate-800">
      <div className="flex justify-between mb-4">
        <div className="h-6 w-20 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="h-8 w-3/4 bg-slate-800 rounded mb-4 animate-pulse"></div>
      <div className="space-y-2 mb-6 flex-grow">
        <div className="h-4 w-full bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-full bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="pt-4 border-t border-slate-800">
        <div className="h-4 w-16 bg-slate-800 rounded mb-2 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-slate-800 rounded-full animate-pulse"></div>
          <div className="h-6 w-24 bg-slate-800 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;