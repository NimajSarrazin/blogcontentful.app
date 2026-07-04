"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MAX_READING_HISTORY,
  parseReadingHistory,
  serializeReadingHistory,
  READING_HISTORY_STORAGE_KEY,
  type ReadingHistoryEntry,
} from "@/lib/reading-history";

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = parseReadingHistory(
      localStorage.getItem(READING_HISTORY_STORAGE_KEY)
    );
    setHistory(stored);
    setReady(true);
  }, []);

  const addToHistory = useCallback((entry: Omit<ReadingHistoryEntry, "readAt">) => {
    setHistory((prev) => {
      const next = [
        { ...entry, readAt: new Date().toISOString() },
        ...prev.filter((item) => item.slug !== entry.slug),
      ].slice(0, MAX_READING_HISTORY);

      localStorage.setItem(
        READING_HISTORY_STORAGE_KEY,
        serializeReadingHistory(next)
      );
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(READING_HISTORY_STORAGE_KEY);
  }, []);

  return { history, ready, addToHistory, clearHistory };
}
