import type { Metadata } from "next";
import { Playfair_Display, Special_Elite, Courier_Prime } from "next/font/google";
import "../styles/textures.css";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const special  = Special_Elite   ({ subsets: ["latin"], weight: "400", variable: "--font-special" });
const courier  = Courier_Prime   ({ subsets: ["latin"], weight: ["400","700"], variable: "--font-courier" });

export const metadata: Metadata = {
  title:       "CrispCV — Roast Your Portfolio & Resume",
  description: "AI-powered brutal feedback for your portfolio and resume. Five roast levels from gentle to CHARCOAL.",
  openGraph: {
    title:       "CrispCV 🔥",
    description: "Get your portfolio roasted by AI. No mercy.",
    type:        "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`theme-hellfire dark ${playfair.variable} ${special.variable} ${courier.variable}`}>
      <body className="min-h-screen transition-colors duration-500 bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
