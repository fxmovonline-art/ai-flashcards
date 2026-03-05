'use client';

import React, { useState, useEffect } from 'react';

interface TextInputScreenProps {
  onStart: (text: string, count: number) => void;
  initialText?: string;
  initialCount?: number;
}

const TextInputScreen: React.FC<TextInputScreenProps> = ({ onStart, initialText = '', initialCount = 10 }) => {
  const [text, setText] = useState(initialText);
  const [count, setCount] = useState(initialCount);
  const minLength = 100;

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleClear = () => {
    setText('');
  };

  const isButtonDisabled = text.length < minLength;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
      <div className="max-w-3xl w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-indigo-500/10">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Create Your <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600">Flashcards</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Paste your conversation transcript or study notes below. Our AI will extract the most important concepts for you.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
              placeholder="Paste at least 100 characters of text here..."
            />
            
            <div className="absolute bottom-4 right-4 flex items-center space-x-4">
              {text.length > 0 && (
                <button 
                  onClick={handleClear}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Clear Text
                </button>
              )}
              <div className={`px-3 py-1 rounded-full text-xs font-bold tabular-nums ${text.length >= minLength ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                {text.length} characters
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex flex-col items-start space-y-1">
              <label htmlFor="card-count" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Number of flashcards
              </label>
              <p className="text-xs text-slate-500">More cards mean more detailed analysis</p>
            </div>
            
            <select
              id="card-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full sm:w-32 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value={5}>5 Cards</option>
              <option value={10}>10 Cards</option>
              <option value={15}>15 Cards</option>
              <option value={20}>20 Cards</option>
            </select>
          </div>
          
          <button
            onClick={() => onStart(text, count)}
            disabled={isButtonDisabled}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
              isButtonDisabled 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale' 
                : 'bg-linear-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white shadow-indigo-500/25 hover:scale-[1.01]'
            }`}
          >
            {isButtonDisabled ? `Need ${minLength - text.length} more characters` : 'Generate Flashcards'}
          </button>
        </div>
        
        {isButtonDisabled && text.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-amber-600 dark:text-amber-400 animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Input too short for quality analysis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInputScreen;
