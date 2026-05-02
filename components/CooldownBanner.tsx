"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

interface Props { resetInMs: number; onExpire: () => void }

export default function CooldownBanner({ resetInMs, onExpire }: Props) {
  const [msLeft, setMsLeft] = useState(resetInMs);

  useEffect(() => {
    if (msLeft <= 0) { onExpire(); return; }
    const t = setInterval(() => {
      setMsLeft(prev => {
        if (prev <= 1000) { clearInterval(t); onExpire(); return 0; }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(msLeft / 60_000);
  const secs = Math.floor((msLeft % 60_000) / 1000);

  return (
    <AnimatePresence>
      {msLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-ember/30 bg-ember/10 font-body text-sm"
        >
          <Clock size={15} className="text-ember animate-pulse" />
          <span className="opacity-80">
            Rate limit hit — next roast in{" "}
            <span className="text-ember font-bold">
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
