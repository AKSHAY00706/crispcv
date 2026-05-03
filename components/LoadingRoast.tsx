"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoastIntensity } from "@/lib/gemini";

const STAGES: Record<RoastIntensity, { messages: string[]; emoji: string; color: string }> = {
  light: {
    emoji: "☕",
    color: "#A0845C",
    messages: [
      "Brewing a gentle assessment…",
      "Reading your work with kind eyes…",
      "Finding the constructive angles…",
      "Preparing actionable feedback…",
      "Almost done — keeping it supportive…",
    ],
  },
  medium: {
    emoji: "🔥",
    color: "#E8612C",
    messages: [
      "Scanning your portfolio…",
      "Identifying the red flags…",
      "Cross-referencing best practices…",
      "Calculating your score…",
      "Writing the honest verdict…",
    ],
  },
  dark: {
    emoji: "💀",
    color: "#C84020",
    messages: [
      "Gordon has entered the kitchen…",
      "Finding every flaw in full detail…",
      "This is going to sting a little…",
      "Documenting the crimes against UX…",
      "Final verdict incoming — brace yourself…",
    ],
  },
  espresso: {
    emoji: "🌋",
    color: "#B8301A",
    messages: [
      "Sharpening the knives…",
      "Calculating maximum damage…",
      "Your portfolio is sweating…",
      "Dismantling your life choices…",
      "No survivors expected…",
    ],
  },
  charcoal: {
    emoji: "☠️",
    color: "#8B0000",
    messages: [
      "☠️ CHARCOAL MODE ENGAGED ☠️",
      "Initiating total annihilation…",
      "Turning your portfolio to ash…",
      "The AI is personally offended…",
      "Preparing the most savage roast ever generated…",
    ],
  },
};

const COOKING_STEPS = [
  { label: "Fetching content",   pct: 18  },
  { label: "Analyzing design",   pct: 38  },
  { label: "Reading content",    pct: 55  },
  { label: "Scoring categories", pct: 72  },
  { label: "Writing roast",      pct: 88  },
  { label: "Finalizing verdict", pct: 97  },
];

export default function LoadingRoast({ intensity }: { intensity: RoastIntensity }) {
  const stage      = STAGES[intensity];
  const [msgIdx, setMsgIdx]   = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    // Cycle messages every 2.4s
    const msgTimer = setInterval(() => {
      setMsgIdx(i => (i + 1) % stage.messages.length);
    }, 2400);

    // Advance steps every 2.2s
    const stepTimer = setInterval(() => {
      setStepIdx(i => {
        const next = Math.min(i + 1, COOKING_STEPS.length - 1);
        setProgress(COOKING_STEPS[next].pct);
        return next;
      });
    }, 2200);

    return () => { clearInterval(msgTimer); clearInterval(stepTimer); };
  }, [stage]);

  return (
    <div className="flex flex-col items-center justify-center py-14 space-y-8">

      {/* ── Central fire animation ── */}
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        {/* Pulse rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: stage.color + "55", inset: 0 }}
            animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.7, 0] }}
            transition={{ duration: 2, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* Main emoji */}
        <motion.div
          className="text-5xl z-10 select-none"
          animate={{ scale: [1, 1.12, 0.96, 1.08, 1], rotate: [0, -5, 5, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 16px ${stage.color})` }}
        >
          {stage.emoji}
        </motion.div>
      </div>

      {/* ── Status message ── */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-special text-base text-center px-4"
            style={{ color: stage.color }}
          >
            {stage.messages[msgIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Progress bar with steps ── */}
      <div className="w-full max-w-sm space-y-3 px-4">
        <div className="flex justify-between font-mono text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          <span>Processing</span>
          <span>{progress}%</span>
        </div>

        {/* Track */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ background: `linear-gradient(90deg, ${stage.color}88, ${stage.color})`, boxShadow: `0 0 10px ${stage.color}88` }}
          />
        </div>

        {/* Step labels */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {COOKING_STEPS.map((step, i) => (
            <div
              key={step.label}
              className="flex items-center gap-1 font-mono text-[10px] tracking-tight"
              style={{ color: i <= stepIdx ? stage.color : "var(--text-muted)", opacity: i <= stepIdx ? 1 : 0.4 }}
            >
              <motion.span
                animate={i === stepIdx ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {i < stepIdx ? "✓" : i === stepIdx ? "→" : "·"}
              </motion.span>
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fun fact at the bottom ── */}
      <p className="font-mono text-xs text-center px-8" style={{ color: "var(--text-muted)", opacity: 0.45 }}>
        {intensity === "charcoal"
          ? "This model has seen 30,000 portfolios. Yours won't survive."
          : "Analyzing your entire portfolio in one pass — no shortcuts."}
      </p>
    </div>
  );
}