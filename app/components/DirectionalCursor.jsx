"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────
   DirectionalCursor — trailing ring + arrow that rotates toward
   the current movement direction. Desktop fine-pointer only,
   disabled for touch and prefers-reduced-motion. Text inputs
   keep their native I-beam (caret usability).
──────────────────────────────────────────────────────────── */

const INTERACTIVE = 'a, button, [role="button"], select, label, summary, [data-cursor]';
const TEXTUAL = 'input, textarea, [contenteditable="true"]';

export default function DirectionalCursor() {
  const ringRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return; // touch / reduced-motion: inert

    const ring = ringRef.current;
    const arrow = arrowRef.current;
    if (!ring || !arrow) return;

    document.documentElement.classList.add("custom-cursor");

    let tx = -100, ty = -100;   // raw target
    let x = tx, y = ty;         // lerped position
    let vx = 0, vy = 0;         // smoothed velocity
    let angle = 0, scale = 1, targetScale = 1;
    let visible = false, raf = 0;

    const onMove = (e) => {
      vx = vx * 0.8 + (e.clientX - tx) * 0.2;
      vy = vy * 0.8 + (e.clientY - ty) * 0.2;
      tx = e.clientX; ty = e.clientY;
      if (!visible) { visible = true; x = tx; y = ty; ring.classList.add("dc-visible"); }
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest?.(TEXTUAL)) {
        targetScale = 0.4; ring.classList.add("dc-text"); ring.classList.remove("dc-hover");
      } else if (t.closest?.(INTERACTIVE)) {
        targetScale = 1.6; ring.classList.add("dc-hover"); ring.classList.remove("dc-text");
      } else {
        targetScale = 1; ring.classList.remove("dc-hover", "dc-text");
      }
    };

    const onOut = (e) => {
      if (!e.relatedTarget) { visible = false; ring.classList.remove("dc-visible"); }
    };

    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      scale += (targetScale - scale) * 0.15;
      vx *= 0.92; vy *= 0.92;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.4) angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      ring.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0) scale(${scale})`;
      arrow.style.transform = `rotate(${angle}deg)`;
      arrow.style.opacity = speed > 0.4 ? "1" : "0.5";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div ref={ringRef} className="dc-ring" aria-hidden="true">
      <svg ref={arrowRef} className="dc-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6h7M6 2.5 9.5 6 6 9.5"
          stroke="#F0492A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
