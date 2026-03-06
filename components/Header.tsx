'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SidebarWrapper from './SidebarWrapper';
import { Suspense } from 'react';

export default function Header() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              A
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Flash<span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => setIsHowItWorksOpen(true)}
              className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              How it Works
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl animate-in slide-in-from-right duration-300">
            <Suspense fallback={<div className="p-8">Loading history...</div>}>
              <SidebarWrapper onClose={() => setIsMenuOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      {/* How it Works Modal */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 md:px-0">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsHowItWorksOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How it Works</h2>
                  <p className="text-slate-500 dark:text-slate-400">Generate flashcards from your transcriptions in seconds.</p>
                </div>
                <button 
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Paste Your Content</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Simply paste any lecture notes, transcriptions, or study material into the text input area.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">AI Magic</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Our advanced AI analyzes the text to identify key concepts and creates interactive flashcards automatically.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Study and Retain</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Review your flashcards, track your learning progress, and save the generated cards for later study sessions.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsHowItWorksOpen(false)}
                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
