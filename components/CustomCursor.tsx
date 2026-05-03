"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = document.querySelector(".cursor-dot") as HTMLElement | null;
    const ring = document.querySelector(".cursor-ring") as HTMLElement | null;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      ring.style.left = x + "px";
      ring.style.top = y + "px";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </>
  );
}