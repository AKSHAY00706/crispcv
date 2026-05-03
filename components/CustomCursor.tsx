"use client";
import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const dot  = document.querySelector(".cursor-dot")  as HTMLElement | null;
    const ring = document.querySelector(".cursor-ring") as HTMLElement | null;
    if (!dot || !ring) return;

    // Use direct style mutation — fastest possible, no React re-renders
    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      dot.style.left  = x + "px";
      dot.style.top   = y + "px";
      ring.style.left = x + "px";
      ring.style.top  = y + "px";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </>
  );
}