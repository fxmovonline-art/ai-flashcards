'use client';

import React, { useState } from 'react';
import FlashCard from './FlashCard';

interface CardData {
  question: string;
  answer: string;
}

interface FlashcardScreenProps {
  onComplete: (results: Record<number, 'learned' | 'review'>) => void;
  onCancel: () => void;
  flashcards: CardData[];
}

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ onComplete, onCancel, flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedStatus, setLearnedStatus] = useState<Record<number, 'learned' | 'review'>>({});

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    } else {
      onComplete(learnedStatus);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  const setStatus = (status: 'learned' | 'review') => {
    setLearnedStatus(prev => ({
      ...prev,
      [currentIndex]: status
    }));
    // After marking, optionally flip back or move to next
    // For this UX, we'll just keep it flipped so they can see their choice
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-6 px-4 space-y-6 animate-in fade-in duration-500">
      {/* Top Header/Progress */}
      <div className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Progress</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">
              {currentIndex + 1}<span className="text-slate-300 dark:text-slate-700 mx-1">/</span>{flashcards.length}
            </span>
          </div>

          <button 
            onClick={onCancel}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
          
          <div className="flex space-x-1">
            {flashcards.map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-6 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-indigo-600 h-8 shadow-[0_0_12px_rgba(79,70,229,0.4)]' 
                    : learnedStatus[idx] === 'learned'
                      ? 'bg-green-500 opacity-60'
                      : learnedStatus[idx] === 'review'
                        ? 'bg-amber-500 opacity-60'
                        : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(99,102,241,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Card Area */}
      <div className="w-full relative py-4">
        <FlashCard 
          question={currentCard.question}
          answer={currentCard.answer}
          isFlipped={flipped}
          onFlip={() => setFlipped(!flipped)}
          status={learnedStatus[currentIndex]}
        />
        
        {/* Learned/Review Buttons (On Back Only) */}
        <div className={`mt-2 flex justify-center space-x-4 transition-all duration-500 ${flipped ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'}`}>
          <button 
            onClick={() => setStatus('review')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
              learnedStatus[currentIndex] === 'review'
                ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25'
                : 'bg-white dark:bg-slate-900 border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Review Again</span>
          </button>
          
          <button 
            onClick={() => setStatus('learned')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
              learnedStatus[currentIndex] === 'learned'
                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-white dark:bg-slate-900 border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Got it!</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-6 pt-0">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`group flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold transition-all ${
            currentIndex === 0 
              ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed' 
              : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md'
          }`}
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button 
          onClick={onCancel}
          className="flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Cancel</span>
        </button>
        
        <button 
          onClick={handleNext}
          className="group flex items-center space-x-2 px-12 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xl hover:shadow-indigo-500/10 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{currentIndex === flashcards.length - 1 ? 'Finish Study' : 'Next Card'}</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlashcardScreen;
