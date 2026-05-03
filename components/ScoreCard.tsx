"use client";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { RoastResult } from "@/lib/gemini";

const scoreColor = (s: number) =>
  s >= 8 ? "#4ade80" : s >= 6 ? "#E8612C" : s >= 4 ? "#f59e0b" : "#ef4444";

const LABELS: Record<keyof RoastResult["categories"], string> = {
  design: "Design", content: "Content", ux: "UX / Flow",
  originality: "Originality", presentation: "Presentation", impact: "Impact",
};

const RADAR_SHORT: Record<keyof RoastResult["categories"], string> = {
  design: "Design", content: "Content", ux: "UX",
  originality: "Original", presentation: "Present.", impact: "Impact",
};

function getScore(v: any): number {
  if (typeof v === "number") return v;
  return typeof v?.score === "number" ? v.score : 0;
}
function getWrong(v: any): string {
  if (typeof v === "object" && v?.whatIsWrong) return v.whatIsWrong;
  return "";
}

interface Props { result: RoastResult }

export default function ScoreCard({ result }: Props) {
  const cats    = result.categories;
  const catKeys = Object.keys(cats) as (keyof typeof cats)[];

  const radarData = catKeys.map(k => ({
    subject: RADAR_SHORT[k],
    value:   getScore(cats[k]),
  }));

  return (
    <div className="space-y-5">

      {/* ── 1. RADAR + SCORE BARS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl burn-edge" style={{ background: "var(--bg-card)" }}
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
            Category radar
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 10, right: 26, bottom: 10, left: 26 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject"
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }} />
              <Radar name="Score" dataKey="value"
                stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score bars */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl burn-edge space-y-3" style={{ background: "var(--bg-card)" }}
        >
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            Score breakdown
          </p>
          {catKeys.map((key, i) => {
            const score = getScore(cats[key]);
            const color = scoreColor(score);
            return (
              <motion.div key={key}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="space-y-1"
              >
                <div className="flex justify-between font-mono text-xs">
                  <span style={{ color: "var(--text-primary)" }}>{LABELS[key]}</span>
                  <span style={{ color, fontWeight: "bold" }}>{score}/10</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ duration: 0.9, delay: 0.6 + i * 0.07, ease: "easeOut" }}
                    style={{ background: color, boxShadow: `0 0 6px ${color}55` }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── 2. ROAST PARAGRAPH — chat bubble (comes BEFORE "what's wrong") ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        {/* Avatar row */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ background: "var(--accent)" }}>
            🔥
          </div>
          <div>
            <p className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              CrispCV AI
            </p>
            <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              Just told you the truth · live
            </p>
          </div>
        </div>

        {/* Chat bubble */}
        <div className="ml-4 p-5 rounded-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-accent)",
            borderTopLeftRadius: 4,
          }}>
          <p className="font-special text-sm leading-relaxed italic" style={{ color: "var(--text-primary)" }}>
            &ldquo;{result.roastParagraph}&rdquo;
          </p>
        </div>

        <p className="font-mono text-xs ml-4" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
          Generated from a one-time scan. Nothing stored.
        </p>
      </motion.div>

      {/* ── 3. WHAT IS ACTUALLY WRONG (per-category) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        className="p-5 rounded-2xl burn-edge space-y-3" style={{ background: "var(--bg-card)" }}
      >
        <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
          What is actually wrong
        </p>

        <div className="space-y-2">
          {catKeys.map((key, i) => {
            const score = getScore(cats[key]);
            const wrong = getWrong(cats[key]);
            if (!wrong) return null;
            const color = scoreColor(score);
            return (
              <motion.div key={key}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg-secondary)" }}
              >
                {/* Score pill — always visible */}
                <span className="shrink-0 mt-0.5 font-mono text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: color + "28", color, border: `1px solid ${color}55` }}>
                  {score}
                </span>
                <div className="space-y-0.5 min-w-0">
                  {/* Category name — use text-primary for full visibility */}
                  <p className="font-mono text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                    {LABELS[key]}
                  </p>
                  {/* The critique — use text-primary with slight opacity for readability */}
                  <p className="font-special text-xs leading-snug"
                    style={{ color: "var(--text-primary)", opacity: 0.82 }}>
                    {wrong}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 4. IMPROVEMENT ROADMAP — HIGH / MED / NICE TO HAVE ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
        className="p-5 rounded-2xl burn-edge space-y-5" style={{ background: "var(--bg-card)" }}
      >
        <div className="flex justify-between items-center">
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            Improvement roadmap
          </p>
          <span className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}>
            {result.fixes.length} FIXES
          </span>
        </div>

        {/* HIGH priority (fixes 0-1) */}
        {result.fixes.slice(0, 2).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest" style={{ color: "#ef4444" }}>
                — HIGH PRIORITY
              </span>
              <div className="flex-1 h-px" style={{ background: "#ef444433" }} />
            </div>
            {result.fixes.slice(0, 2).map((fix, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.05 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg-secondary)" }}
              >
                <span className="badge-high shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                  HIGH
                </span>
                <p className="font-special text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {fix}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* MED priority (fixes 2-3) */}
        {result.fixes.slice(2, 4).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest" style={{ color: "#f59e0b" }}>
                — MEDIUM
              </span>
              <div className="flex-1 h-px" style={{ background: "#f59e0b33" }} />
            </div>
            {result.fixes.slice(2, 4).map((fix, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg-secondary)" }}
              >
                <span className="badge-med shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                  MED
                </span>
                <p className="font-special text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {fix}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* NICE TO HAVE (fixes 4+) */}
        {result.fixes.slice(4).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest" style={{ color: "#60a5fa" }}>
                — NICE TO HAVE
              </span>
              <div className="flex-1 h-px" style={{ background: "#60a5fa33" }} />
            </div>
            {result.fixes.slice(4).map((fix, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.35 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg-secondary)" }}
              >
                <span className="badge-nice shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                  NICE
                </span>
                <p className="font-special text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {fix}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}