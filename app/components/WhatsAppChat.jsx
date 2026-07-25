"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   WhatsAppChat — pixel-faithful WhatsApp conversation mockup
   Sequenced reveal: user texts a spend → typing → WealthOS logs it.
   Loops. Respects prefers-reduced-motion (shows full chat static).
──────────────────────────────────────────────────────────── */

const SCRIPT = [
  { side: "out", time: "18:41", node: "Spent 350 on lunch from SBI" },
  {
    side: "in", time: "18:41", typing: 1100,
    node: (
      <div>
        <div style={{ fontWeight: 700, color: "#111B21", marginBottom: "6px" }}>✅ Logged to your ledger</div>
        <Row k="Amount" v={<span style={{ color: "#E0402F", fontWeight: 700 }}>−₹350.00</span>} />
        <Row k="Category" v={<span style={{ color: "#E11D48", fontWeight: 600 }}>Food</span>} />
        <Row k="Account" v={<span style={{ color: "#111B21", fontWeight: 600 }}>SBI</span>} />
      </div>
    ),
  },
  { side: "out", time: "18:42", node: "Received salary 50000 in HDFC" },
  {
    side: "in", time: "18:42", typing: 1000,
    node: <div style={{ fontWeight: 700, color: "#111B21" }}>✅ +₹50,000 income logged</div>,
  },
  { side: "out", time: "18:43", node: "Amazon 1500 pnb" },
  {
    side: "in", time: "18:43", typing: 1000,
    node: (
      <div>
        <div style={{ fontWeight: 700, color: "#111B21", marginBottom: "6px" }}>✅ Logged to your ledger</div>
        <Row k="Amount" v={<span style={{ color: "#E0402F", fontWeight: 700 }}>−₹1,500.00</span>} />
        <Row k="Category" v={<span style={{ color: "#D97706", fontWeight: 600 }}>Shopping</span>} />
        <Row k="Account" v={<span style={{ color: "#111B21", fontWeight: 600 }}>PNB</span>} />
      </div>
    ),
  },
];

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", fontSize: "0.76rem", marginTop: "3px" }}>
      <span style={{ color: "#667781" }}>{k}</span>
      {v}
    </div>
  );
}

function Ticks() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" style={{ marginLeft: "3px", flexShrink: 0 }}>
      <path d="M1 5.5L4 8.5L9.5 2" stroke="#53BDEB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5.5L9 8.5L14.5 2" stroke="#53BDEB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhatsAppChat() {
  const [count, setCount] = useState(0);   // messages shown
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(SCRIPT.length);
      return;
    }

    let cancelled = false;
    const push = (fn, ms) => {
      const id = setTimeout(() => { if (!cancelled) fn(); }, ms);
      timers.current.push(id);
    };

    function run() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setCount(0);
      setTyping(false);
      let t = 700;
      SCRIPT.forEach((msg, i) => {
        if (msg.side === "in") {
          push(() => setTyping(true), t);
          t += msg.typing || 1000;
          push(() => { setTyping(false); setCount(i + 1); }, t);
          t += 700;
        } else {
          push(() => setCount(i + 1), t);
          t += 1100;
        }
      });
      // loop
      push(run, t + 2600);
    }

    run();
    return () => { cancelled = true; timers.current.forEach(clearTimeout); };
  }, []);

  const shown = SCRIPT.slice(0, count);
  // typing bubble appears just before the next incoming message
  const showTypingBubble = typing && SCRIPT[count]?.side === "in";

  return (
    <div
      style={{
        borderRadius: "26px",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(20,15,10,0.28)",
        border: "8px solid #111B21",
        background: "#111B21",
        maxWidth: "360px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ background: "#075E54", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        <div style={{ width: "38px", height: "38px", borderRadius: "999px", background: "#F0492A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>W</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.2 }}>WealthOS</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>online</div>
        </div>
        <div style={{ display: "flex", gap: "16px", color: "#fff" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          <svg width="5" height="17" viewBox="0 0 5 17" fill="#fff"><circle cx="2.5" cy="2.5" r="1.6" /><circle cx="2.5" cy="8.5" r="1.6" /><circle cx="2.5" cy="14.5" r="1.6" /></svg>
        </div>
      </div>

      {/* Chat body — WhatsApp beige wallpaper */}
      <div
        style={{
          background: "#ECE5DD",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.015) 0 2px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.015) 0 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          padding: "14px 12px 10px",
          minHeight: "380px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TODAY pill */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <span style={{ background: "#D7E8ED", color: "#54656F", fontSize: "0.66rem", fontWeight: 600, padding: "4px 12px", borderRadius: "8px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.06)" }}>TODAY</span>
        </div>

        {/* Encryption notice */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <span style={{ background: "#FEF6D0", color: "#7A6C43", fontSize: "0.64rem", lineHeight: 1.4, padding: "6px 12px", borderRadius: "8px", display: "inline-block", maxWidth: "88%", boxShadow: "0 1px 0.5px rgba(0,0,0,0.06)" }}>
            🔒 Messages are end-to-end encrypted. Only you and WealthOS can read them.
          </span>
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {shown.map((msg, i) => {
            const out = msg.side === "out";
            return (
              <div key={i} className="wa-pop" style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "82%",
                    background: out ? "#D9FDD3" : "#FFFFFF",
                    borderRadius: out ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
                    padding: "6px 9px 5px",
                    fontSize: "0.82rem",
                    color: "#111B21",
                    lineHeight: 1.4,
                    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                    position: "relative",
                  }}
                >
                  {msg.node}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2px", marginTop: "2px" }}>
                    <span style={{ fontSize: "0.6rem", color: "#667781" }}>{msg.time}</span>
                    {out && <Ticks />}
                  </div>
                </div>
              </div>
            );
          })}

          {showTypingBubble && (
            <div className="wa-pop" style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#FFFFFF", borderRadius: "8px 8px 8px 2px", padding: "10px 12px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)" }}>
                <span className="wa-typing"><span /><span /><span /></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ background: "#F0F2F5", padding: "8px 10px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: "999px", padding: "9px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#54656F" strokeWidth="1.6"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeLinecap="round" /></svg>
          <span style={{ color: "#8696A0", fontSize: "0.82rem" }}>Type a message</span>
        </div>
        <div style={{ width: "40px", height: "40px", borderRadius: "999px", background: "#00A884", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" /></svg>
        </div>
      </div>
    </div>
  );
}
