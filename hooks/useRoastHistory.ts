"use client";
import { useState, useEffect } from "react";
import type { RoastResult, RoastIntensity } from "@/lib/gemini";

export interface HistoryEntry {
  id:        string;
  label:     string;
  intensity: RoastIntensity;
  result:    RoastResult;
  createdAt: number;
}

const KEY      = "crispCV-history";
const MAX_HIST = 3;

export function useRoastHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const addEntry = (entry: Omit<HistoryEntry, "id" | "createdAt">) => {
    const next: HistoryEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() };
    setHistory(prev => {
      const updated = [next, ...prev].slice(0, MAX_HIST);
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(KEY);
    setHistory([]);
  };

  return { history, addEntry, clearHistory };
}
