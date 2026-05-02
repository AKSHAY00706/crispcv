"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { RoastIntensity } from "@/lib/gemini";

const MESSAGES: Record<RoastIntensity, string[]> = {
  light:    ["Reading your work politely…", "Finding the gentle truths…", "Preparing constructive feedback…"],
  medium:   ["Scanning with honest eyes…", "Spotting the red flags…", "Writing the verdict…"],
  dark:     ["Gordon has entered the kitchen…", "Dismantling your life choices…", "This is gonna sting…"],
  espresso: ["Sharpening the knives…", "Calculating maximum damage…", "No survivors…"],
  charcoal: ["INITIATING TOTAL ANNIHILATION…", "Turning portfolio to ash…", "☠️ CHARCOAL MODE ENGAGED ☠️"]
};

export default function LoadingRoast({ intensity }: { intensity: RoastIntensity }) {
  const msgs = MESSAGES[intensity];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 1800);
    return () => clearInterval(t);
  }, [msgs]);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative w-20 h-20">
        {[0,1,2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-ember"
            animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🔥</div>
      </div>
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="font-body text-sm opacity-70"
      >
        {msgs[idx]}
      </motion.p>
    </div>
  );
}
