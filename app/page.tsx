"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import InputPanel from "@/components/InputPanel";
import IntensitySelector from "@/components/IntensitySelector";
import ThemeToggle from "@/components/ThemeToggle";
import RoastHistory from "@/components/RoastHistory";
import CooldownBanner from "@/components/CooldownBanner";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useRoastHistory } from "@/hooks/useRoastHistory";
import type { RoastIntensity } from "@/lib/gemini";

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  left: `${8 + i * 11.5}%`,
  delay: `${i * 0.45}s`,
  duration: `${2.2 + (i % 3) * 0.6}s`,
  size: 2 + (i % 3),
  color: i % 2 === 0 ? "#F4845F" : "#E8612C",
}));

const DEBRIS = ["🔥","💀","☕","☠️","💥","🫠"].map((e, i) => ({
  emoji: e,
  left:  `${6 + i * 16}%`,
  top:   `${10 + (i * 17) % 72}%`,
  dur:   `${5 + (i % 3)}s`,
  delay: `${i * 0.9}s`,
}));

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border-accent))" }} />
      {label
        ? <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{label}</span>
        : <span style={{ color: "var(--accent)", opacity: 0.4 }}>✦</span>}
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border-accent), transparent)" }} />
    </div>
  );
}

const FAQ_ITEMS = [
  { q: "Is the roast actually useful?", a: "Yes. Llama 3.3 70B reads your entire portfolio and gives specific, actionable feedback — not generic tips. Every fix is ranked by impact." },
  { q: "Will this hurt my feelings?", a: "Depends on the intensity. Light Roast is constructive. CHARCOAL mode will make you stare at the ceiling before you rebuild everything." },
  { q: "Do you store my portfolio data?", a: "Zero. Your content is sent to Groq, roasted, and the result comes back. Nothing is logged, stored, or sold. Ever." },
  { q: "What portfolios work best?", a: "Any public URL or pasted resume text. Works best on developer and design portfolios with at least a few hundred words of content." },
  { q: "Can I share my roast?", a: "Yes — the result page has a one-click share button that copies your full roast card to clipboard. Screenshot it, tweet it, cry about it." },
];

export default function Home() {
  const router = useRouter();
  const [intensity, setIntensity] = useState<RoastIntensity>("medium");
  const [loading, setLoading]     = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const { history, addEntry, clearHistory } = useRoastHistory();

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 28, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 28, damping: 32 });
  const rotX    = useTransform(springY, [-1, 1], ["5deg", "-5deg"]);
  const rotY    = useTransform(springX, [-1, 1], ["-5deg", "5deg"]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleRoast = async (data: { inputType: "url" | "text"; url?: string; resumeText?: string }) => {
    setLoading(true);
    try {
      const res  = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intensity, _trap: "" }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429) { setCooldownMs(json.resetInMs); toast.error("🔥 Rate limit! Cool down first."); }
        else toast.error(json.error ?? "Something exploded.");
        return;
      }
      const label = data.url ?? "Resume";
      addEntry({ label, intensity, result: json.result });
      sessionStorage.setItem("crispCV-result", JSON.stringify({ result: json.result, label, intensity }));
      router.push("/roast");
    } catch { toast.error("Network error."); }
    finally  { setLoading(false); }
  };

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>

      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full blur-3xl"
          style={{ width: 550, height: 550, top: "-15%", left: "-10%", background: "radial-gradient(circle, #E8612C14, transparent 65%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ width: 380, height: 380, bottom: "-8%", right: "-8%", background: "radial-gradient(circle, #B8431A0E, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute bottom-0 rounded-full"
            style={{ left: p.left, width: p.size, height: 8, background: p.color,
              animation: `floatUp ${p.duration} ${p.delay} ease-out infinite`, opacity: 0.6 }} />
        ))}
        {DEBRIS.map((d, i) => (
          <div key={i} className="absolute text-xl select-none"
            style={{ left: d.left, top: d.top,
              animation: `floatDebris ${d.dur} ${d.delay} ease-in-out infinite`, opacity: 0 }} >
            {d.emoji}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-130px) scale(0.2); opacity: 0; }
        }
        @keyframes floatDebris {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          30%     { transform: translateY(-20px) rotate(10deg); opacity: 0.22; }
          70%     { transform: translateY(-8px) rotate(-6deg); opacity: 0.15; }
        }
      `}</style>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-24">

        {/* ── NAVBAR — logo only, no big title ── */}
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-5"
        >
          {/* Small wordmark — NOT the big hero title */}
          <div className="flex items-center gap-2">
            <span className="text-lg" style={{ filter: "drop-shadow(0 0 6px #E8612C88)" }}>🔥</span>
            <span className="font-display font-black text-base" style={{ color: "var(--text-primary)" }}>
              Crisp<span style={{ color: "var(--accent)" }}>CV</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ApiKeyModal onSave={() => toast.success("🔥 Groq key saved!")} />
            <ThemeToggle />
          </div>
        </motion.nav>

        {/* ── HERO — big title with 3D parallax ── */}
        <div className="text-center space-y-5 pt-4 pb-8">
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: "900px", transformStyle: "preserve-3d" }}
            className="inline-block"
          >
            <motion.h1
              initial={{ opacity: 0, y: -28, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 85 }}
              className="font-display font-black"
              style={{
                fontSize: "clamp(4rem, 14vw, 7.5rem)",
                lineHeight: 1,
                color: "var(--text-primary)",
                /* Subtle 3D depth — not neon, not blinding */
                textShadow: "4px 6px 0px var(--accent-dark), 0 0 30px #E8612C1A",
              }}
            >
              Crisp<span style={{
                color: "var(--accent)",
                textShadow: "4px 6px 0px #7A2A0A, 0 0 25px #E8612C55",
              }}>CV</span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-special text-lg md:text-xl" style={{ color: "var(--text-muted)" }}>
              Your portfolio might be costing you interviews.
            </p>
            <p className="font-special text-lg md:text-xl font-bold mt-1" style={{ color: "var(--accent)" }}>
              Find out exactly why — and how to fix it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-2 justify-center flex-wrap"
          >
            {[
              { label: "Brutally Honest", icon: "🗡️" },
              { label: "14s avg response", icon: "⚡" },
              { label: "Zero data stored", icon: "🔒" },
              { label: "Free forever",    icon: "🆓" },
            ].map((tag, i) => (
              <motion.span
                key={tag.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.58 + i * 0.07 }}
                whileHover={{ scale: 1.07, y: -3 }}
                className="px-3 py-1.5 rounded-full font-mono text-xs tracking-wide"
                style={{ border: "1px solid var(--border-accent)", color: "var(--accent)", background: "var(--accent-glow)" }}
              >
                {tag.icon} {tag.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── MAIN CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 60 }}
          className="rounded-3xl burn-edge overflow-hidden"
          style={{ background: "var(--bg-card)", boxShadow: "0 20px 60px #E8612C0E, 0 6px 24px #00000018" }}
        >
          <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
          <div className="p-6 md:p-8 space-y-6">
            <IntensitySelector value={intensity} onChange={setIntensity} />
            <div className="h-px" style={{ background: "var(--border)" }} />
            <InputPanel onSubmit={handleRoast} loading={loading} />
          </div>
        </motion.div>

        <AnimatePresence>
          {cooldownMs > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
              <CooldownBanner resetInMs={cooldownMs} onExpire={() => setCooldownMs(0)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3 mt-6"
        >
          {[
            { icon: "⚡", value: "3/hr",      label: "Free Roasts" },
            { icon: "🧠", value: "Llama 3.3", label: "70B Model"   },
            { icon: "🔒", value: "0 bytes",   label: "Data Stored" },
          ].map((s, i) => (
            <motion.div key={s.label} whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl burn-edge text-center"
              style={{ background: "var(--bg-card)" }}>
              <span className="text-2xl">{s.icon}</span>
              <span className="font-display font-black text-sm" style={{ color: "var(--accent)" }}>{s.value}</span>
              <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── WHAT WE ANALYZE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-10 space-y-4">
          <Divider label="What we analyze" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: "🎨", title: "Design",       desc: "Typography, color, spacing, hierarchy" },
              { icon: "✍️", title: "Content",      desc: "Clarity, hooks, proof, your actual voice" },
              { icon: "⚡", title: "UX & Flow",    desc: "Navigation, load feel, interaction logic" },
              { icon: "💡", title: "Originality",  desc: "Does it feel like a template or a person?" },
              { icon: "📣", title: "Presentation", desc: "First impression in 7 seconds" },
              { icon: "🎯", title: "Impact",       desc: "Will a recruiter remember this tomorrow?" },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.07 }}
                whileHover={{ y: -4 }}
                className="p-4 rounded-2xl burn-edge space-y-1.5" style={{ background: "var(--bg-card)" }}>
                <span className="text-2xl">{item.icon}</span>
                <p className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                <p className="font-special text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── HOW IT WORKS ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="mt-10 space-y-4">
          <Divider label="How it works" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: "01", icon: "📥", title: "Submit",      desc: "Paste URL or drop resume PDF" },
              { step: "02", icon: "🌡️", title: "Intensity",   desc: "Light Roast to CHARCOAL" },
              { step: "03", icon: "🔥", title: "Get Roasted", desc: "Score, breakdown, fixes" },
            ].map((item, i) => (
              <motion.div key={item.step}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-4 rounded-2xl burn-edge space-y-2" style={{ background: "var(--bg-card)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>{item.step}</span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                <p className="font-special text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── INTENSITY GUIDE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-10 space-y-4">
          <Divider label="Intensity guide" />
          <div className="space-y-2">
            {[
              { level: "Light Roast", emoji: "☕", color: "#A0845C", desc: "Kind mentor energy. Specific but gentle. Great for beginners." },
              { level: "Medium",      emoji: "🔥", color: "#E8612C", desc: "Honest and direct. No sugarcoating, but still professional." },
              { level: "Dark",        emoji: "💀", color: "#C84020", desc: "Gordon Ramsay mode. Every flaw gets called out by name." },
              { level: "Espresso",    emoji: "🌋", color: "#B8301A", desc: "Savage. Will make you question your entire design education." },
              { level: "CHARCOAL",    emoji: "☠️", color: "#8B0000", desc: "Total annihilation. Roast comedian + world-class UX expert. No mercy." },
            ].map((item, i) => (
              <motion.div key={item.level}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15 + i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl burn-edge"
                style={{ background: "var(--bg-card)" }}>
                <span className="text-xl w-7 text-center">{item.emoji}</span>
                <span className="font-display font-bold text-sm w-28 shrink-0" style={{ color: item.color }}>{item.level}</span>
                <span className="font-special text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-10 space-y-3">
          <Divider label="Questions you will probably ask" />
          {FAQ_ITEMS.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 + i * 0.06 }}
              className="rounded-2xl burn-edge overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="font-special text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.q}</span>
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                  style={{ color: "var(--accent)", fontSize: 20, lineHeight: 1, flexShrink: 0 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-4 font-special text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* ── HISTORY ── */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
              <Divider label="Recent roasts" />
              <RoastHistory
                history={history}
                onSelect={e => {
                  sessionStorage.setItem("crispCV-result", JSON.stringify({ result: e.result, label: e.label, intensity: e.intensity }));
                  router.push("/roast");
                }}
                onClear={clearHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center font-mono text-xs mt-10 pb-4" style={{ color: "var(--text-muted)", opacity: 0.25 }}>
          CRISPCV © 2025 · Groq · Llama 3.3 70B · No data stored · Ever
        </p>
      </div>
    </main>
  );
}