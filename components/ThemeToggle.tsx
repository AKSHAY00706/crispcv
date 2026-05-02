"use client";
import { useTheme } from "@/hooks/useTheme";
import { Flame, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "hellfire";

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full border font-body text-sm
        transition-all duration-500
        ${isDark
          ? "bg-ash-mid border-ember text-parchment-DEFAULT hover:bg-ash-light"
          : "bg-parchment-dark border-ink-mid text-ink-DEFAULT hover:bg-parchment-DEFAULT"}
      `}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute left-3"
      >
        <Flame size={16} className="text-ember" />
      </motion.div>
      <motion.div
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute left-3"
      >
        <Sun size={16} className="text-ink-mid" />
      </motion.div>
      <span className="ml-5">{isDark ? "Hellfire" : "Parchment"}</span>
    </motion.button>
  );
}
