"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Eye, EyeOff, X } from "lucide-react";

interface Props { onSave: (key: string) => void }

export default function ApiKeyModal({ onSave }: Props) {
  const [key, setKey]       = useState("");
  const [show, setShow]     = useState(false);
  const [open, setOpen]     = useState(false);

  const save = () => {
    if (key.trim().length < 10) return;
    sessionStorage.setItem("crispCV-gemini-key", key.trim());
    onSave(key.trim());
    setOpen(false);
    setKey("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-current/20 font-body text-xs opacity-60 hover:opacity-100 hover:border-ember/40 transition-all"
      >
        <Key size={13} /> API Key
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl border border-current/20 bg-[var(--bg-card)] space-y-4 burn-edge"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl font-bold">Gemini API Key</h3>
                <button onClick={() => setOpen(false)} className="opacity-40 hover:opacity-100">
                  <X size={18} />
                </button>
              </div>

              <p className="font-body text-sm opacity-60">
                Your key is stored in sessionStorage only — never sent to our servers.
                Get a free key at{" "}
                <a href="https://aistudio.google.com/app/apikey" target="_blank"
                  className="text-ember underline">aistudio.google.com</a>
              </p>

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-current/20 bg-transparent font-mono text-sm focus:outline-none focus:border-ember"
                />
                <button
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80"
                >
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              <button
                onClick={save}
                disabled={key.trim().length < 10}
                className="w-full py-3 rounded-xl bg-ember text-white font-body text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_#E8612C66] transition-all"
              >
                Save Key
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
