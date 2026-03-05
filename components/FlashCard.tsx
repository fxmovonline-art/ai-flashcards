'use client';

import React from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
  status?: 'learned' | 'review' | null;
}

const FlashCard: React.FC<FlashcardProps> = ({ question, answer, isFlipped, onFlip, status }) => {
  return (
    <div className="w-full max-w-lg mx-auto h-87.5 perspective-1000 group">
      <div 
        onClick={onFlip}
        className={`relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-10 text-center transition-colors group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50">
          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/70">Question</span>
            {status === 'learned' && (
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            )}
            {status === 'review' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
            )}
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white leading-snug">
            {question}
          </h3>
          
          <div className="absolute bottom-8 text-slate-400 dark:text-slate-600 text-xs font-semibold uppercase tracking-widest flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Click to Flip
          </div>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-br from-indigo-500/5 via-white to-white dark:from-indigo-500/10 dark:via-slate-900 dark:to-slate-900 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center justify-center p-10 text-center overflow-auto scrollbar-hide">
          <span className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70">Answer</span>
          
          <p className="text-xl sm:text-2xl leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            {answer}
          </p>
          
          <div className="absolute bottom-6 flex items-center space-x-1.5 opacity-40">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default FlashCard;
