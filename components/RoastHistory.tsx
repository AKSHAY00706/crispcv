"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry } from "@/hooks/useRoastHistory";
import { Trash2 } from "lucide-react";

interface Props {
  history:      HistoryEntry[];
  onSelect:     (entry: HistoryEntry) => void;
  onClear:      () => void;
}

export default function RoastHistory({ history, onSelect, onClear }: Props) {
  if (!history.length) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-body text-xs tracking-widest uppercase opacity-50">Recent Roasts</p>
        <button onClick={onClear} className="opacity-40 hover:opacity-80 transition-opacity">
          <Trash2 size={13} />
        </button>
      </div>
      <AnimatePresence>
        {history.map(entry => (
          <motion.button
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => onSelect(entry)}
            className="w-full text-left px-4 py-3 rounded-xl border border-current/10 hover:border-ember/40 hover:bg-ember/5 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="font-body text-sm opacity-80 truncate">{entry.label}</span>
              <span className="font-display text-lg text-ember ml-2 shrink-0">{entry.result.overallScore}/10</span>
            </div>
            <p className="font-body text-xs opacity-40 mt-0.5">{entry.intensity} · {new Date(entry.createdAt).toLocaleDateString()}</p>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
