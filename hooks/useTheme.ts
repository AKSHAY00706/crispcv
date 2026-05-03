"use client";
import { useState, useEffect } from "react";

export type Theme = "hellfire" | "parchment";

export function useTheme() {
  // Start with hellfire — will be corrected on mount from localStorage
  const [theme, setTheme] = useState<Theme>("hellfire");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved theme on every mount (every page navigation)
    const saved = (localStorage.getItem("crispCV-theme") as Theme) ?? "hellfire";
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem("crispCV-theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme(t => (t === "hellfire" ? "parchment" : "hellfire"));

  return { theme, toggle };
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  // Remove all theme classes first
  root.classList.remove("theme-hellfire", "theme-parchment", "dark");
  // Apply new theme
  root.classList.add(`theme-${t}`);
  if (t === "hellfire") root.classList.add("dark");
}