"use client";
import { motion } from "framer-motion";
import type { RoastResult } from "@/lib/gemini";

const CATEGORY_LABELS: Record<keyof RoastResult["categories"], string> = {
  design:       "Design",
  content:      "Content",
  ux:           "UX/Flow",
  originality:  "Originality",
  presentation: "Presentation",
  impact:       "Impact"
};

const scoreColor = (s: number) =>
  s >= 8 ? "#4ade80" : s >= 5 ? "#E8612C" : "#ef4444";

interface Props { result: RoastResult }

export default function ScoreCard({ result }: Props) {
  return (
    <div id="roast-card" className="w-full space-y-6 p-6 rounded-2xl border border-current/20 burn-edge">
      {/* overall */}
      <div className="text-center space-y-2">
        <p className="font-body text-xs tracking-widest uppercase opacity-50">Overall Score</p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-8xl font-display font-black"
          style={{ color: scoreColor(result.overallScore) }}
        >
          {result.overallScore}<span className="text-4xl opacity-40">/10</span>
        </motion.div>
        <p className="font-display text-xl italic opacity-80">"{result.tagline}"</p>
        <span className="inline-block px-4 py-1 rounded-full bg-ember/20 text-ember font-body text-sm border border-ember/40">
          VERDICT: {result.verdict}
        </span>
      </div>

      {/* category bars */}
      <div className="space-y-3">
        {(Object.entries(result.categories) as [keyof RoastResult["categories"], number][]).map(([key, score], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="space-y-1"
          >
            <div className="flex justify-between font-body text-xs">
              <span className="opacity-70">{CATEGORY_LABELS[key]}</span>
              <span style={{ color: scoreColor(score) }}>{score}/10</span>
            </div>
            <div className="h-1.5 rounded-full bg-current/10">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${score * 10}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                style={{ backgroundColor: scoreColor(score), boxShadow: `0 0 8px ${scoreColor(score)}88` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* roast paragraph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="p-4 rounded-xl bg-current/5 border border-current/10"
      >
        <p className="font-body text-sm leading-relaxed opacity-90 italic">
          "{result.roastParagraph}"
        </p>
      </motion.div>

      {/* fixes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="space-y-2"
      >
        <p className="font-body text-xs tracking-widest uppercase opacity-50">What To Fix</p>
        {result.fixes.map((fix, i) => (
          <div key={i} className="flex gap-3 items-start font-body text-sm">
            <span className="text-ember mt-0.5 shrink-0">→</span>
            <span className="opacity-80">{fix}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
