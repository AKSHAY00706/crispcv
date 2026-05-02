"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion }    from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast }     from "sonner";
import ScoreCard     from "@/components/ScoreCard";
import ThemeToggle   from "@/components/ThemeToggle";
import type { RoastResult, RoastIntensity } from "@/lib/gemini";

interface Stored { result: RoastResult; label: string; intensity: RoastIntensity }

export default function RoastPage() {
  const router = useRouter();
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("crispCV-result");
    if (!raw) { router.replace("/"); return; }
    try { setData(JSON.parse(raw)); } catch { router.replace("/"); }
  }, []);

  const handleShare = () => {
    const text = `I got ${data?.result.overallScore}/10 on CrispCV 🔥 "${data?.result.tagline}" — crispCV.app`;
    navigator.clipboard.writeText(text).then(() => toast.success("Copied roast to clipboard!"));
  };

  if (!data) return null;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 pb-16 space-y-6">
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-body text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <p className="font-body text-xs tracking-widest uppercase opacity-40">Roasting</p>
        <h2 className="font-display text-2xl font-bold opacity-80 truncate">{data.label}</h2>
        <span className="inline-block px-3 py-1 rounded-full border border-ember/30 text-ember font-body text-xs">
          {data.intensity.toUpperCase()} ROAST
        </span>
      </motion.div>

      <ScoreCard result={data.result} />

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex-1 py-3 rounded-xl border border-current/20 font-body text-sm hover:border-ember/40 transition-all"
        >
          Roast Another
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl bg-ember text-white font-body text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#E8612C66] transition-all"
        >
          <Share2 size={15} /> Share Roast
        </button>
      </div>
    </main>
  );
}
