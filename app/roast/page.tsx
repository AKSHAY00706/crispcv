"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ScoreCard from "@/components/ScoreCard";
import ThemeToggle from "@/components/ThemeToggle";
import type { RoastResult, RoastIntensity } from "@/lib/gemini";

interface Stored { result: RoastResult; label: string; intensity: RoastIntensity }

const VERDICT_CONFIG: Record<string, { color: string; emoji: string; subtext: string }> = {
  CREMATED:  { color: "#E8612C", emoji: "🔥", subtext: "Ouch. Time to rebuild from scratch." },
  DESTROYED: { color: "#ef4444", emoji: "💀", subtext: "Nothing left but ashes." },
  ROASTED:   { color: "#E8612C", emoji: "🌋", subtext: "Properly cooked." },
  SINGED:    { color: "#f59e0b", emoji: "☕", subtext: "Needs more heat to get there." },
  SURVIVED:  { color: "#4ade80", emoji: "✅", subtext: "Actually not bad. Rare." },
  PASSABLE:  { color: "#60a5fa", emoji: "🤷", subtext: "Middle of the road." },
};

const INTENSITY_LABELS: Record<RoastIntensity, string> = {
  light: "Light Roast ☕", medium: "Medium 🔥",
  dark: "Dark 💀", espresso: "Espresso 🌋", charcoal: "CHARCOAL ☠️",
};

const DEBRIS = ["💀","🔥","☠️","💥","🫠","🔥"].map((e, i) => ({
  emoji: e,
  left:  `${4 + i * 17}%`,
  top:   `${5 + (i * 19) % 70}%`,
  dur:   `${5 + (i % 4)}s`,
  delay: `${i * 0.7}s`,
}));

export default function RoastPage() {
  const router = useRouter();
  const [data, setData]         = useState<Stored | null>(null);
  const [revealed, setRevealed] = useState(false);
  const confettiFired           = useRef(false);

  // Parallax for score number
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 22, damping: 36 });
  const springY = useSpring(mouseY, { stiffness: 22, damping: 36 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("crispCV-result");
    if (!raw) { router.replace("/"); return; }
    try {
      const parsed = JSON.parse(raw) as Stored;
      setData(parsed);
      setTimeout(() => setRevealed(true), 350);
      if (!confettiFired.current && parsed.result.overallScore >= 7) {
        confettiFired.current = true;
        import("canvas-confetti").then(({ default: confetti }) => {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 },
            colors: ["#E8612C","#F4845F","#B8431A","#F2E8D0"] });
        });
      }
    } catch { router.replace("/"); }
  }, []);

  const handleShare = () => {
    if (!data) return;
    const text = [
      "🔥 I just got roasted by CrispCV",
      "",
      `Score: ${data.result.overallScore}/10 — ${data.result.verdict}`,
      `"${data.result.tagline}"`,
      "",
      data.result.roastParagraph,
      "",
      `Top fix: ${data.result.fixes[0]}`,
      "",
      "Roast yours → crispCV.app",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => toast.success("📋 Full roast copied!"));
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <motion.div animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl">🔥</motion.div>
    </div>
  );

  const vc = VERDICT_CONFIG[data.result.verdict] ?? VERDICT_CONFIG["ROASTED"];

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>

      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Soft ambient — no neon */}
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: 480, height: 480, top: "-8%", right: "-8%",
            background: `radial-gradient(circle, ${vc.color}12, transparent 65%)` }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute rounded-full blur-3xl"
          style={{ width: 280, height: 280, bottom: "-5%", left: "-5%",
            background: "radial-gradient(circle, #E8612C0C, transparent 65%)" }} />

        {/* Floating debris */}
        {DEBRIS.map((d, i) => (
          <div key={i} className="absolute text-xl select-none"
            style={{ left: d.left, top: d.top,
              animation: `floatDebris ${d.dur} ${d.delay} ease-in-out infinite`, opacity: 0 }}>
            {d.emoji}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes floatDebris {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          30%     { transform: translateY(-20px) rotate(10deg); opacity: 0.22; }
          70%     { transform: translateY(-8px) rotate(-6deg); opacity: 0.15; }
        }
      `}</style>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-24">

        {/* ── TOP BAR ── */}
        <div className="flex justify-between items-center py-5">
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/")} whileHover={{ x: -3 }}
            className="flex items-center gap-2 font-special text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={15} /> Back
          </motion.button>
          <ThemeToggle />
        </div>

        {/* ── SCORE HERO ── */}
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center space-y-4 py-4">

              {/* 3D parallax score */}
              <motion.div
                style={{
                  rotateX: springY, rotateY: springX,
                  transformPerspective: "800px", transformStyle: "preserve-3d",
                }}
                className="inline-block score-reveal"
              >
                <span className="font-display font-black block"
                  style={{
                    fontSize: "clamp(5.5rem, 20vw, 9.5rem)",
                    color: vc.color,
                    /* 3D shadow only — absolutely NO white neon glow */
                    textShadow: `5px 8px 0 ${vc.color}28`,
                    lineHeight: 1,
                  }}>
                  {data.result.overallScore}
                </span>
                <span className="font-display font-black text-3xl"
                  style={{ color: vc.color, opacity: 0.3 }}>/10</span>
              </motion.div>

              {/* Verdict badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 180 }}
              >
                <span className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-display font-black text-xl text-white"
                  style={{
                    background: vc.color,
                    /* Soft shadow — NOT neon ring */
                    boxShadow: `0 4px 20px ${vc.color}40`,
                  }}>
                  <span>{vc.emoji}</span>
                  <span>{data.result.verdict}</span>
                </span>
              </motion.div>

              {/* Subtext & tagline — fully visible on both themes */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="space-y-1.5"
              >
                <p className="font-mono text-sm font-bold" style={{ color: vc.color }}>
                  {vc.subtext}
                </p>
                <p className="font-display text-xl italic px-6"
                  style={{ color: "var(--text-primary)" }}>
                  &ldquo;{data.result.tagline}&rdquo;
                </p>
              </motion.div>

              {/* Meta pills */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-3 flex-wrap"
              >
                <span className="font-mono text-xs px-3 py-1 rounded-full"
                  style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  {INTENSITY_LABELS[data.intensity]}
                </span>
                <span style={{ color: "var(--text-muted)", opacity: 0.5 }}>·</span>
                <span className="font-mono text-xs max-w-[240px] truncate" style={{ color: "var(--text-muted)" }}>
                  {data.label}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SCORE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 28 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4"
        >
          <ScoreCard result={data.result} />
        </motion.div>

        {/* ── ACTION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-2 gap-3 mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-special text-sm burn-edge"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
          >
            <RotateCcw size={15} /> Roast Another
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-special text-sm text-white"
            style={{ background: "var(--accent)", boxShadow: "0 4px 18px var(--accent-glow)" }}
          >
            <Share2 size={15} /> Share Roast
          </motion.button>
        </motion.div>

        {/* ── CHARCOAL UPSELL ── */}
        {data.intensity !== "charcoal" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ delay: 1.4 }}
            className="mt-4 p-4 rounded-2xl burn-edge text-center space-y-2"
            style={{ background: "var(--bg-card)" }}
          >
            <p className="font-special text-sm" style={{ color: "var(--text-muted)" }}>
              Think you can handle more heat?
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/")}
              className="font-mono text-xs px-4 py-2 rounded-xl"
              style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}
            >
              ☠️ Try CHARCOAL mode
            </motion.button>
          </motion.div>
        )}

        <p className="text-center font-mono text-xs mt-8 pb-4"
          style={{ color: "var(--text-muted)", opacity: 0.3 }}>
          CRISPCV · Powered by Groq · Nothing stored
        </p>
      </div>
    </main>
  );
}