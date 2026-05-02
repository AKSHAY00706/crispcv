"use client";
import { useState, useCallback } from "react";
import { useDropzone }           from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, FileText, AlignLeft, Upload, X, Loader2 } from "lucide-react";
import { validatePdfFile }       from "@/lib/validators";
import { extractTextFromPdf }    from "@/lib/pdfExtractor";

type InputMode = "url" | "pdf" | "text";

interface Props {
  onSubmit: (data: { inputType: "url" | "text"; url?: string; resumeText?: string }) => void;
  loading:  boolean;
}

export default function InputPanel({ onSubmit, loading }: Props) {
  const [mode, setMode]             = useState<InputMode>("url");
  const [url, setUrl]               = useState("");
  const [resumeText, setResumeText] = useState("");
  const [pdfName, setPdfName]       = useState("");
  const [pdfText, setPdfText]       = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileErr, setFileErr]       = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const err = validatePdfFile(file);
    if (err) { setFileErr(err); return; }
    setFileErr("");
    setPdfName(file.name);
    setPdfLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
    } catch {
      setFileErr("Could not extract text from PDF. Try pasting it instead.");
      setPdfName("");
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1
  });

  const handleSubmit = () => {
    if (mode === "url")  onSubmit({ inputType: "url",  url });
    if (mode === "text") onSubmit({ inputType: "text", resumeText });
    if (mode === "pdf")  onSubmit({ inputType: "text", resumeText: pdfText });
  };

  const canSubmit = !loading && !pdfLoading && (
    (mode === "url"  && url.trim().length > 5)         ||
    (mode === "text" && resumeText.trim().length > 50) ||
    (mode === "pdf"  && pdfText.length > 50)
  );

  const tabs = [
    { id: "url"  as InputMode, label: "Portfolio URL", Icon: Link2     },
    { id: "pdf"  as InputMode, label: "Resume PDF",    Icon: FileText  },
    { id: "text" as InputMode, label: "Paste Resume",  Icon: AlignLeft }
  ];

  return (
    <div className="w-full space-y-4">
      {/* tabs */}
      <div className="flex rounded-xl overflow-hidden border border-current/20">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 font-body text-sm
              transition-all duration-300
              ${mode === id ? "bg-ember text-white" : "opacity-50 hover:opacity-80"}
            `}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "url" && (
          <motion.div key="url" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && canSubmit && handleSubmit()}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent font-body text-sm focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember/50 placeholder:opacity-40"
            />
          </motion.div>
        )}

        {mode === "pdf" && (
          <motion.div key="pdf" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive ? "border-ember bg-ember/5" : "border-current/20 hover:border-ember/50"}
              `}
            >
              <input {...getInputProps()} />
              {pdfLoading ? (
                <div className="flex items-center justify-center gap-2 font-body text-sm opacity-60">
                  <Loader2 size={18} className="animate-spin text-ember" />
                  Extracting text from PDF…
                </div>
              ) : pdfName ? (
                <div className="flex items-center justify-center gap-2 font-body text-sm">
                  <FileText size={18} className="text-ember" />
                  <span>{pdfName}</span>
                  <span className="text-xs opacity-40">({Math.round(pdfText.length/1000)}k chars)</span>
                  <button
                    onClick={e => { e.stopPropagation(); setPdfName(""); setPdfText(""); }}
                    className="ml-1 opacity-50 hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={24} className="mx-auto opacity-40" />
                  <p className="font-body text-sm opacity-60">
                    {isDragActive ? "Drop it — we will handle the rest" : "Drag & drop your resume PDF or click to browse"}
                  </p>
                  <p className="font-body text-xs opacity-40">Max 5 MB · Text-layer PDFs work best</p>
                </div>
              )}
            </div>
            {fileErr && <p className="text-red-400 text-xs mt-2 font-body">{fileErr}</p>}
          </motion.div>
        )}

        {mode === "text" && (
          <motion.div key="text" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value.slice(0, 8000))}
              placeholder="Paste your resume text here…&#10;&#10;Name, experience, skills, projects — the more you give, the crispier the roast."
              rows={9}
              className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent font-body text-sm focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember/50 placeholder:opacity-40 resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs opacity-30 font-body">Min 50 chars</span>
              <span className={`text-xs font-body ${resumeText.length > 7500 ? "text-ember" : "opacity-30"}`}>
                {resumeText.length} / 8000
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* honeypot */}
      <input name="_trap" type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

      <motion.button
        onClick={handleSubmit}
        disabled={!canSubmit}
        whileTap={{ scale: 0.96 }}
        whileHover={canSubmit ? { scale: 1.01 } : {}}
        className={`
          w-full py-4 rounded-xl font-display text-lg tracking-wide transition-all duration-300 relative overflow-hidden
          ${canSubmit
            ? "bg-ember text-white shadow-[0_0_30px_#E8612C55] hover:shadow-[0_0_50px_#E8612C88] cursor-pointer"
            : "opacity-30 cursor-not-allowed bg-current/20"}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" /> Roasting in progress…
          </span>
        ) : (
          "Roast It 🔥"
        )}
      </motion.button>
    </div>
  );
}
