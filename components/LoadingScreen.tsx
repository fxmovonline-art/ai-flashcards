'use client';

import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 animate-in fade-in duration-700">
      <div className="relative group">
        <div className="w-32 h-32 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-t-transparent border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite] opacity-70"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-10 h-10 text-indigo-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Generating your flashcards...</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-lg leading-relaxed">
          Our AI is reading your conversation and distilling key insights into interactive study cards.
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
