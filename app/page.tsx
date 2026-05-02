"use client";
import { useState } from "react";
import { useRouter }      from "next/navigation";
import { toast }          from "sonner";
import Hero               from "@/components/Hero";
import InputPanel         from "@/components/InputPanel";
import IntensitySelector  from "@/components/IntensitySelector";
import ThemeToggle        from "@/components/ThemeToggle";
import RoastHistory       from "@/components/RoastHistory";
import CooldownBanner     from "@/components/CooldownBanner";
import ApiKeyModal        from "@/components/ApiKeyModal";
import { useRoastHistory } from "@/hooks/useRoastHistory";
import type { RoastIntensity } from "@/lib/gemini";

export default function Home() {
  const router                         = useRouter();
  const [intensity, setIntensity]      = useState<RoastIntensity>("medium");
  const [loading, setLoading]          = useState(false);
  const [cooldownMs, setCooldownMs]    = useState(0);
  const { history, addEntry, clearHistory } = useRoastHistory();

  const handleRoast = async (data: { inputType: "url" | "text"; url?: string; resumeText?: string }) => {
    setLoading(true);
    try {
      const res  = await fetch("/api/roast", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, intensity, _trap: "" })
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setCooldownMs(json.resetInMs);
          toast.error("🔥 Too many roasts! Take a breather.");
        } else {
          toast.error(json.error ?? "Something broke in the kitchen.");
        }
        return;
      }

      const label = data.url ?? "Resume";
      addEntry({ label, intensity, result: json.result });
      sessionStorage.setItem("crispCV-result", JSON.stringify({
        result: json.result, label, intensity
      }));
      router.push("/roast");

    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 pb-16 space-y-8">

      {/* top bar */}
      <div className="flex justify-between items-center pt-4">
        <ApiKeyModal onSave={() => toast.success("API key saved!")} />
        <ThemeToggle />
      </div>

      <Hero />

      {/* cooldown banner */}
      {cooldownMs > 0 && (
        <CooldownBanner resetInMs={cooldownMs} onExpire={() => setCooldownMs(0)} />
      )}

      {/* main card */}
      <div className="space-y-6 p-6 rounded-2xl border border-current/10 bg-[var(--bg-card)] burn-edge">
        <IntensitySelector value={intensity} onChange={setIntensity} />
        <div className="border-t border-current/10" />
        <InputPanel onSubmit={handleRoast} loading={loading} />
      </div>

      {/* history */}
      <RoastHistory
        history={history}
        onSelect={entry => {
          sessionStorage.setItem("crispCV-result", JSON.stringify({
            result: entry.result, label: entry.label, intensity: entry.intensity
          }));
          router.push("/roast");
        }}
        onClear={clearHistory}
      />

      <p className="text-center font-body text-xs opacity-25">
        3 free roasts per hour · Powered by Gemini 1.5 Pro · No data stored
      </p>
    </main>
  );
}
