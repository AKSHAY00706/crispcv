import type { Metadata } from "next";
import { Playfair_Display, Special_Elite, Courier_Prime } from "next/font/google";
import "../styles/textures.css";
import "./globals.css";
import { Toaster } from "sonner";
import CustomCursor from "@/components/CustomCursor";

const playfair = Playfair_Display({
  subsets: ["latin"], variable: "--font-playfair",
  weight: ["400","700","900"], style: ["normal","italic"],
});
const special = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-special" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400","700"], variable: "--font-courier" });

export const metadata: Metadata = {
  title: "CrispCV — Get Roasted. Get Better.",
  description: "AI-powered brutal feedback for your portfolio and resume. Five roast levels from gentle to CHARCOAL.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "CrispCV 🔥 — Roast My Portfolio",
    description: "Drop your portfolio URL or resume. We roast it until it is crispy.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning prevents the hydration error caused by
    // the theme class being applied by JS before React hydrates
    <html lang="en" suppressHydrationWarning
      className={`${playfair.variable} ${special.variable} ${courier.variable}`}>
      <head>
        {/* Runs before React — reads saved theme, applies it, NO mismatch */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('crispCV-theme')||'hellfire';document.documentElement.classList.add('theme-'+t);if(t==='hellfire')document.documentElement.classList.add('dark');}catch(e){}})();`
        }} />
      </head>
      <body className="min-h-screen">
        <div className="scanline" aria-hidden="true" />
        <CustomCursor />
        {children}
        <Toaster
          richColors position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--bg-card)",
              border: "1px solid var(--border-accent)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-special)",
            },
          }}
        />
      </body>
    </html>
  );
}