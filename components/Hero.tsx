"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center space-y-4 py-8"
    >
      <div className="flex items-center justify-center gap-3">
        <motion.span
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-5xl"
        >🔥</motion.span>
        <h1 className="font-display text-6xl md:text-7xl font-black tracking-tight">
          Crisp<span className="text-ember">CV</span>
        </h1>
        <motion.span
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.2 }}
          className="text-5xl"
        >🔥</motion.span>
      </div>
      <p className="font-body text-lg opacity-60 max-w-md mx-auto">
        Drop your portfolio or resume. We will roast it until it is crispy.
      </p>
      <div className="flex gap-2 justify-center flex-wrap">
        {["Brutally Honest", "AI-Powered", "Zero Sugarcoating"].map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full border border-ember/30 text-ember font-body text-xs">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
