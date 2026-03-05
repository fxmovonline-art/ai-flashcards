"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getHistory } from "@/app/actions/flashcards";
import { useSession } from "next-auth/react";

interface HistoryItem {
  id: string;
  title: string;
  createdAt: Date;
}

interface HistoryContextType {
  history: HistoryItem[];
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useSession();

  const refreshHistory = useCallback(async () => {
    if (status !== "authenticated") {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to refresh history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <HistoryContext.Provider value={{ history, isLoading, refreshHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
