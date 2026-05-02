"use client";
import { useState, useEffect } from "react";

export type Theme = "hellfire" | "parchment";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("hellfire");

  useEffect(() => {
    const saved = localStorage.getItem("crispCV-theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-hellfire", "theme-parchment", "dark");
    root.classList.add(`theme-${theme}`);
    if (theme === "hellfire") root.classList.add("dark");
    localStorage.setItem("crispCV-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === "hellfire" ? "parchment" : "hellfire");
  return { theme, toggle };
}
