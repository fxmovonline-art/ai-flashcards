'use client';

import React from 'react';

interface SummaryScreenProps {
  onRestart: () => void; // Generate New Set
  onStartOver: () => void; // Practice same set from beginning
  onReviewRemaining: () => void; // Practice only review cards
  stats: {
    total: number;
    learned: number;
    review: number;
  };
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ 
  onRestart, 
  onStartOver, 
  onReviewRemaining, 
  stats 
}) => {
  const percentage = Math.round((stats.learned / stats.total) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">AI Session Complete!</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-md leading-relaxed">
        You know <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.learned}</span> out of <span className="font-bold">{stats.total}</span> cards — <span className="font-black">{percentage}%</span>
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mb-12">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <div className="text-4xl font-black text-green-600 tabular-nums">{stats.learned}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Learned</div>
        </div>
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <div className="text-4xl font-black text-amber-600 tabular-nums">{stats.review}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">To Review</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full max-w-2xl">
        {stats.review > 0 && (
          <button 
            onClick={onReviewRemaining}
            className="flex-1 min-w-50 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            Review Remaining ({stats.review})
          </button>
        )}
        
        <button 
          onClick={onStartOver}
          className="flex-1 min-w-50 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-lg rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95"
        >
          Start Over
        </button>
        
        <button 
          onClick={onRestart}
          className="flex-1 min-w-50 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg rounded-2xl shadow-xl hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
        >
          Generate New Set
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
