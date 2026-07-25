"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated number that counts up from 0 to `value` when scrolled into view.
 * @param {{ value: number, format?: "inr"|"plain", prefix?: string, suffix?: string, className?: string, style?: object }} props
 */
export default function CountUp({ value, format = "plain", prefix = "", suffix = "", className, style }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  const fmt = (n) =>
    format === "inr"
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
      : Math.round(n).toLocaleString("en-IN");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            const dur = 1200;
            const tick = (now) => {
              const t = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{fmt(display)}{suffix}
    </span>
  );
}
