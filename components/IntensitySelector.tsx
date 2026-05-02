"use client";
import { motion } from "framer-motion";
import type { RoastIntensity } from "@/lib/gemini";

const LEVELS: { value: RoastIntensity; label: string; emoji: string; desc: string }[] = [
  { value: "light",    label: "Light Roast",  emoji: "☕", desc: "Gentle nudges" },
  { value: "medium",   label: "Medium",       emoji: "🔥", desc: "Honest truths" },
  { value: "dark",     label: "Dark",         emoji: "💀", desc: "No sugarcoating" },
  { value: "espresso", label: "Espresso",     emoji: "🌋", desc: "Savage mode" },
  { value: "charcoal", label: "CHARCOAL",     emoji: "☠️", desc: "Total annihilation" }
];

interface Props {
  value: RoastIntensity;
  onChange: (v: RoastIntensity) => void;
}

export default function IntensitySelector({ value, onChange }: Props) {
  const activeIdx = LEVELS.findIndex(l => l.value === value);

  return (
    <div className="w-full space-y-3">
      <p className="font-display text-sm tracking-widest uppercase opacity-60">Roast Intensity</p>
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((level, i) => (
          <motion.button
            key={level.value}
            onClick={() => onChange(level.value)}
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -2 }}
            className={`
              flex-1 min-w-[80px] flex flex-col items-center gap-1 px-3 py-3 rounded-xl border
              font-body text-xs transition-all duration-300 cursor-pointer
              ${value === level.value
                ? "border-ember bg-ember/10 text-ember shadow-[0_0_20px_#E8612C33]"
                : "border-current/20 opacity-50 hover:opacity-80"}
              ${level.value === "charcoal" && value === "charcoal" ? "animate-pulse-fire" : ""}
            `}
          >
            <span className="text-xl">{level.emoji}</span>
            <span className="font-bold leading-tight text-center">{level.label}</span>
            <span className="opacity-60 text-[10px]">{level.desc}</span>
          </motion.button>
        ))}
      </div>
      {/* heat bar */}
      <div className="h-1.5 rounded-full bg-current/10 overflow-hidden">
        <motion.div
          className="h-full flame-meter-fill rounded-full"
          animate={{ width: `${((activeIdx + 1) / LEVELS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
