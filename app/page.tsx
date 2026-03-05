'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TextInputScreen from '@/components/TextInputScreen';
import LoadingScreen from '@/components/LoadingScreen';
import FlashcardScreen from '@/components/FlashcardScreen';
import SummaryScreen from '@/components/SummaryScreen';
import { saveSession, getSession } from './actions/flashcards';
import { useHistory } from '@/components/HistoryProvider';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Screen = 'input' | 'loading' | 'study' | 'summary';

interface Flashcard {
  question: string;
  answer: string;
}

interface SessionStats {
  total: number;
  learned: number;
  review: number;
  unlearnedTemplates: Flashcard[];
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [transcript, setTranscript] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [originalFlashcards, setOriginalFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ total: 0, learned: 0, review: 0, unlearnedTemplates: [] });
  const [error, setError] = useState<string | null>(null);
  const [guestUsed, setGuestUsed] = useState(false);
  
  const { data: session } = useSession();
  const { refreshHistory } = useHistory();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  // Check generic localStorage for guest usage on mount
  useEffect(() => {
    const used = localStorage.getItem('guest_used');
    if (used) setGuestUsed(true);
  }, []);

  const loadSession = useCallback(async (id: string) => {
    setError(null);
    setCurrentScreen('loading');
    try {
      const studySession = await getSession(id);
      if (studySession) {
        setTranscript(studySession.content);
        setOriginalFlashcards(studySession.cards);
        setCurrentFlashcards(studySession.cards);
        setCurrentScreen('study');
      } else {
        throw new Error("Session not found");
      }
    } catch (err: any) {
      setError(err.message);
      setCurrentScreen('input');
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  const generateFlashcards = async (text: string, count: number) => {
    setError(null);

    // Guest limit check
    if (!session && guestUsed) {
      setError('Guest limit reached. Please sign in to generate more flashcards and save your history.');
      return;
    }

    setCurrentScreen('loading');

    const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('Gemini API Key is missing. Please set NEXT_PUBLIC_AI_API_KEY in .env.local');
      setCurrentScreen('input');
      return;
    }

    try {
      const prompt = `You are a study assistant. Read the following text and generate exactly ${count} flashcards. Each flashcard must have a clear question and a concise answer based only on the content provided. Return the result as a JSON array in this format: [{"question": "...", "answer": "..."}]. Do not add any explanation outside the JSON array.\n\nContent:\n${text}`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        throw new Error('AI response did not contain a valid JSON array of flashcards.');
      }

      const parsedCards = JSON.parse(jsonMatch[0]);
      
      // Save to Database only if logged in
      if (session) {
        const title = text.split('\n')[0].substring(0, 50) || "Untitled Session";
        await saveSession(title, text, parsedCards);
        await refreshHistory();
      } else {
        // Mark guest as used
        localStorage.setItem('guest_used', 'true');
        setGuestUsed(true);
      }

      setOriginalFlashcards(parsedCards);
      setCurrentFlashcards(parsedCards);
      setCurrentScreen('study');
    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err.message || 'An unexpected error occurred during generation.');
      setCurrentScreen('input');
    }
  };

  const handleStart = (text: string, count: number) => {
    setTranscript(text);
    setCardCount(count);
    generateFlashcards(text, count);
  };

  const handleStudyComplete = (results: Record<number, 'learned' | 'review'>) => {
    const total = currentFlashcards.length;
    const learned = Object.values(results).filter(s => s === 'learned').length;
    const review = total - learned;
    
    // result indices map to currentFlashcards indices
    const unlearnedCards = currentFlashcards.filter((_, idx: number) => results[idx] !== 'learned');
    
    setSessionStats({ 
      total, 
      learned, 
      review,
      unlearnedTemplates: unlearnedCards
    });

    setCurrentScreen('summary');
  };

  const handleReviewRemaining = () => {
    const remaining = sessionStats.unlearnedTemplates;
    if (remaining.length > 0) {
      setCurrentFlashcards(remaining);
      setCurrentScreen('study');
    }
  };

  const handleStartOver = () => {
    setCurrentFlashcards(originalFlashcards);
    setCurrentScreen('study');
  };

  const handleRestart = () => {
    setCurrentScreen('input');
    setTranscript('');
    setOriginalFlashcards([]);
    setCurrentFlashcards([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {currentScreen === 'input' && (
        <>
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 flex items-center space-x-3 animate-in slide-in-from-top duration-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">{error}</span>
            </div>
          )}
          <TextInputScreen onStart={handleStart} initialText={transcript} initialCount={cardCount} />
        </>
      )}
      
      {currentScreen === 'loading' && (
        <LoadingScreen />
      )}
      
      {currentScreen === 'study' && (
        <FlashcardScreen 
          onComplete={handleStudyComplete} 
          onCancel={handleRestart}
          flashcards={currentFlashcards} 
        />
      )}
      
      {currentScreen === 'summary' && (
        <SummaryScreen 
          onRestart={handleRestart} 
          onStartOver={handleStartOver}
          onReviewRemaining={handleReviewRemaining}
          stats={sessionStats} 
        />
      )}
    </div>
  );
}
