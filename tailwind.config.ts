import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body:    ["Special Elite", "cursive"],
        mono:    ["Courier Prime", "monospace"]
      },
      colors: {
        ember:   { DEFAULT: "#E8612C", light: "#F4845F", dark: "#B8431A" },
        ash:     { DEFAULT: "#1A1814", mid: "#2C2720", light: "#3D3530" },
        parchment: { DEFAULT: "#F2E8D0", dark: "#E8D9B8", cream: "#FAF4E8" },
        ink:     { DEFAULT: "#2C1810", mid: "#4A2C1A", light: "#6B4226" }
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")"
      },
      animation: {
        "flicker":    "flicker 3s infinite alternate",
        "rise":       "rise 0.6s ease-out forwards",
        "burn-in":    "burnIn 0.8s ease-out forwards",
        "smoke":      "smoke 4s ease-out infinite",
        "pulse-fire": "pulseFire 2s ease-in-out infinite"
      },
      keyframes: {
        flicker:   { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.85" } },
        rise:      { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        burnIn:    { "0%": { clipPath: "inset(100% 0 0 0)" }, "100%": { clipPath: "inset(0% 0 0 0)" } },
        smoke:     { "0%": { transform: "translateY(0) scale(1)", opacity: "0.6" }, "100%": { transform: "translateY(-60px) scale(1.4)", opacity: "0" } },
        pulseFire: { "0%,100%": { boxShadow: "0 0 20px #E8612C66" }, "50%": { boxShadow: "0 0 40px #E8612CAA, 0 0 80px #E8612C44" } }
      }
    }
  },
  plugins: []
};
export default config;
