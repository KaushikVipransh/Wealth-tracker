"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────
   ParticleFunnel — decorative canvas background
   Particles spawn wide at the top, weave downward, converge
   into a funnel throat, accelerate through it and fade out.
   Zero dependencies · DPR-aware · pauses when tab is hidden ·
   respects prefers-reduced-motion (renders one static frame).
──────────────────────────────────────────────────────────── */

const COLORS = [
  // weight-ordered: soft indigo (45%), electric (25%), royal (18%), tint sparkle (12%)
  { color: "#6E6EFF", weight: 0.45 },
  { color: "#2F2FE4", weight: 0.25 },
  { color: "#162E93", weight: 0.18 },
  { color: "#A5A5FF", weight: 0.12 },
];

function pickColor() {
  const r = Math.random();
  let acc = 0;
  for (const c of COLORS) {
    acc += c.weight;
    if (r <= acc) return c.color;
  }
  return COLORS[0].color;
}

export default function ParticleFunnel({ density = 1, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId = null;
    let running = true;
    let w = 0;
    let h = 0;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function spawn(p = {}) {
      return {
        x: (0.05 + Math.random() * 0.9) * w,
        y: -20 + Math.random() * (h * 0.15 + 20),
        vx: 0,
        vy: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 2,
        alpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        color: pickColor(),
        ...p,
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(40, Math.min(220, Math.round(((w * h) / 12000) * density)));
      particles = Array.from({ length: count }, () =>
        // scatter initial y across the viewport so the field starts full
        spawn({ y: Math.random() * h })
      );
    }

    function step(p) {
      const throatX = w / 2;
      const throatY = h * 0.55;

      // steer toward the funnel throat + constant downward pull
      p.vx += (throatX - p.x) * 0.0006;
      p.vy += 0.015;

      // curl weave so streams don't fall straight
      p.x += p.vx + Math.sin(p.y * 0.02 + p.phase) * 0.6;
      p.y += p.vy;

      const dx = p.x - throatX;
      const dy = p.y - throatY;
      const dist = Math.hypot(dx, dy);

      // rush + fade through the throat
      if (dist < 120) {
        p.vx *= 1.04;
        p.vy *= 1.04;
        p.alpha -= 0.03;
      }

      // below the throat: clamp into a narrow cone while fading
      if (p.y > throatY) {
        p.x += (throatX - p.x) * 0.08;
        p.alpha -= 0.015;
      }

      // recycle
      if (p.alpha <= 0 || p.y > h + 10) {
        Object.assign(p, spawn());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; // additive bloom on the dark void
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 0.9));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    function loop() {
      if (!running) return;
      for (const p of particles) step(p);
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function renderStatic() {
      // advance the simulation off-screen so dots land in a funnel shape,
      // then paint one faint, motionless frame
      for (let i = 0; i < 200; i++) for (const p of particles) step(p);
      for (const p of particles) p.alpha *= 0.4;
      draw();
    }

    function start() {
      if (reducedMotionQuery.matches) {
        renderStatic();
        return;
      }
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    function onMotionChange() {
      stop();
      resize();
      start();
    }

    let resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        stop();
        resize();
        start();
      }, 150);
    }

    resize();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
