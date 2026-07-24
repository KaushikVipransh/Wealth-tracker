import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Landing Page
   "Safe Harbor" — Arist-inspired editorial fintech.
   Hero focus: log transactions straight from WhatsApp.
──────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div style={{ background: "var(--bg-page)", overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════════════════
          HERO — sky panel, WhatsApp focus
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-sky)" }}>
        <div className="section split-2 split-hero">
          {/* Left — copy */}
          <div className="animate-fade-up">
            <span className="eyebrow" style={{ marginBottom: "20px" }}>WhatsApp-first finance</span>
            <h1
              style={{
                fontSize: "clamp(2.3rem, 4vw + 1rem, 3.9rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: "16px 0 20px",
              }}
            >
              Track your money
              <br />
              where you already are:
              <br />
              <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                on <WhatsAppMark />
              </span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "480px", lineHeight: 1.6, marginBottom: "28px" }}>
              Just text what you spent — “Spent 350 on lunch from SBI” — and WealthOS
              parses, categorizes, and files it to your ledger instantly. No app to open, no forms.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
                Get started free
              </Link>
              <Link href="#how" className="btn-secondary" style={{ textDecoration: "none" }}>
                See how it works
              </Link>
            </div>
            {/* Trust row */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
              <TrustPill icon={<LockIcon />} label="Bank-grade encryption" />
              <TrustPill icon={<ShieldIcon />} label="Your data stays private" />
            </div>
          </div>

          {/* Right — WhatsApp chat mockup on coral panel */}
          <div className="animate-fade-up delay-200" style={{ position: "relative" }}>
            <div
              style={{
                background: "var(--brand)",
                borderRadius: "var(--radius-card-lg)",
                padding: "28px",
                boxShadow: "var(--shadow-hover)",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "18px",
                  boxShadow: "0 10px 30px rgba(20,15,10,0.18)",
                }}
              >
                {/* chat header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "14px", borderBottom: "1px solid var(--border)", marginBottom: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "999px", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>W</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-heading)" }}>WealthOS</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--income)", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span className="dot-live" style={{ width: "6px", height: "6px" }} /> online
                    </div>
                  </div>
                </div>

                {/* chat bubbles */}
                <ChatBubble side="out">Spent 350 on lunch from SBI</ChatBubble>
                <ChatBubble side="in">
                  <div style={{ fontWeight: 700, marginBottom: "6px", color: "var(--text-heading)" }}>✅ Logged to your ledger</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Amount</span>
                    <span className="num value-red" style={{ fontWeight: 700 }}>−₹350.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginTop: "3px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Category</span>
                    <span className="tag" style={{ background: "rgba(225,29,72,0.1)", color: "#E11D48" }}>Food</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginTop: "3px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Account</span>
                    <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>SBI</span>
                  </div>
                </ChatBubble>
                <ChatBubble side="out">Received salary 50000 in HDFC</ChatBubble>
                <ChatBubble side="in">
                  <div style={{ fontWeight: 700, color: "var(--text-heading)" }}>✅ +₹50,000 income logged</div>
                </ChatBubble>
              </div>
            </div>

            {/* floating stat chip */}
            <div
              className="float-soft hero-chip"
              style={{
                position: "absolute", top: "-16px", left: "-14px",
                background: "#FFFFFF", borderRadius: "14px", padding: "10px 14px",
                boxShadow: "var(--shadow-pop)", border: "1px solid var(--border)",
                alignItems: "center", gap: "8px",
              }}
            >
              <span className="dot-live" style={{ width: "7px", height: "7px" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-heading)" }}>Parsed in ~1 second</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-page)", borderBottom: "1px solid var(--border)" }}>
        <div className="section-tight" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "20px" }}>
            Built with the security standards your money deserves
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            {[
              { icon: <LockIcon />, label: "AES-256 encryption" },
              { icon: <ShieldIcon />, label: "Private by default" },
              { icon: <KeyIcon />, label: "Zero-trust auth" },
              { icon: <DbIcon />, label: "Atomic ledger" },
            ].map((b) => (
              <div key={b.label} className="card" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px" }}>
                <span style={{ color: "var(--brand)", display: "flex" }}>{b.icon}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)" }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — cream, 3 steps
      ══════════════════════════════════════════════════════ */}
      <section id="how" style={{ background: "var(--bg-cream)" }}>
        <div className="section">
          <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 48px" }}>
            <span className="eyebrow">How it works</span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: "14px 0 12px" }}>
              From a text to a tracked transaction in seconds
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
              No spreadsheets, no data entry. Message it, and it&apos;s done.
            </p>
          </div>

          <div className="stat-row">
            {[
              { n: "1", t: "Link your number", d: "Connect WhatsApp once from your dashboard — takes under a minute." },
              { n: "2", t: "Text what you spent", d: "“Paid 800 electricity from Axis.” Plain English is all it needs." },
              { n: "3", t: "It files itself", d: "AI parses the amount, category and account, then writes it atomically." },
            ].map((s) => (
              <div key={s.n} className="card card-lg">
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--brand-wash)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "16px" }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{s.t}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — bento
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="section">
        <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 48px" }}>
          <span className="eyebrow">Everything included</span>
          <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: "14px 0 12px" }}>
            More than a chat — a full money command center
          </h2>
        </div>

        <div className="bento-grid">
          {/* Wide coral feature */}
          <Link href="/dashboard" className="bento-wide" style={{ textDecoration: "none" }}>
            <div className="card-lg card-hover" style={{ background: "var(--brand)", height: "100%", color: "#fff" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "16px" }}>
                <ChatIcon light /> Star feature
              </span>
              <h3 style={{ color: "#fff", fontSize: "1.4rem", marginBottom: "10px" }}>Log expenses from WhatsApp</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "420px" }}>
                The fastest way to stay on top of your spending. Text it in any bank&apos;s
                name and category — WealthOS understands and records it, then keeps every
                balance perfectly in sync.
              </p>
            </div>
          </Link>

          <FeatureTile href="/transaction" icon={<ScanIcon />} title="Scan receipts" desc="Snap a photo, AI fills in the amount, merchant and category." />
          <FeatureTile href="/dashboard" icon={<ChartIcon />} title="Clear analytics" desc="Category and cash-flow charts that actually make sense." />
          <FeatureTile href="/transaction" icon={<RepeatIcon />} title="Recurring engine" desc="Rent, EMIs, subscriptions — logged automatically on schedule." />
          <FeatureTile href="/account" icon={<BankIcon />} title="All accounts" desc="Checking, savings, credit and investments, side by side." />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SAFETY — sky panel
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-sky)" }}>
        <div className="section split-2 split-even">
          <div>
            <span className="eyebrow">Safety first</span>
            <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", margin: "14px 0 16px" }}>
              Your money data, guarded like it&apos;s ours
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "24px" }}>
              WealthOS is built on zero-trust auth and an atomic ledger engine, so every
              rupee is accounted for and every balance stays consistent — no partial writes, ever.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Every write is wrapped in a database transaction",
                "Encrypted connections end to end",
                "Only you can see your accounts and history",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-body)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: <LockIcon big />, t: "AES-256", d: "Encryption at rest & in transit" },
              { icon: <ShieldIcon big />, t: "Zero-trust", d: "Every route guarded by auth" },
              { icon: <DbIcon big />, t: "Atomic", d: "Ledger never left inconsistent" },
              { icon: <KeyIcon big />, t: "Private", d: "Your data is never shared" },
            ].map((c) => (
              <div key={c.t} className="card" style={{ textAlign: "left" }}>
                <span style={{ color: "var(--brand)", display: "flex", marginBottom: "12px" }}>{c.icon}</span>
                <div style={{ fontWeight: 700, color: "var(--text-heading)", marginBottom: "2px" }}>{c.t}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS — cream
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-cream)" }}>
        <div className="section-tight">
          <div className="stat-row-4">
            {[
              { value: "~1 sec", label: "To log a transaction" },
              { value: "7", label: "Smart categories" },
              { value: "24/7", label: "Automatic recurring entries" },
              { value: "100%", label: "Atomic, consistent ledger" },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: "center" }}>
                <div className="num text-gradient" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA — coral
      ══════════════════════════════════════════════════════ */}
      <section className="section">
        <div style={{ background: "var(--brand)", borderRadius: "var(--radius-card-lg)", padding: "72px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", marginBottom: "12px", color: "#fff" }}>
            Start tracking in under a minute
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "32px", fontSize: "1.05rem" }}>
            Free to use. Your data stays yours.
          </p>
          <Link href="/sign-up" className="btn-invert" style={{ textDecoration: "none" }}>
            Create your free account
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ── */

function FeatureTile({ href, icon, title, desc }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="card card-hover" style={{ height: "100%" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--brand-wash)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
          {icon}
        </div>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>{title}</h3>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{desc}</p>
      </div>
    </Link>
  );
}

function ChatBubble({ side, children }) {
  const out = side === "out";
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", marginBottom: "10px" }}>
      <div
        style={{
          maxWidth: "82%",
          background: out ? "var(--brand)" : "var(--bg-cream)",
          color: out ? "#fff" : "var(--text-body)",
          borderRadius: out ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          padding: "10px 14px",
          fontSize: "0.85rem",
          lineHeight: 1.45,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TrustPill({ icon, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>
      <span style={{ color: "var(--brand)", display: "flex" }}>{icon}</span>
      {label}
    </span>
  );
}

/* ── Icons ── */
function WhatsAppMark() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--brand)", color: "#fff", borderRadius: "14px", padding: "4px 14px" }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span style={{ fontWeight: 800, fontSize: "1.3rem" }}>WhatsApp</span>
    </span>
  );
}
function iconProps(big) { return { width: big ? 26 : 22, height: big ? 26 : 22, viewBox: "0 0 24 24", fill: "none", stroke: "var(--brand)", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }; }
function LockIcon({ big }) { return (<svg {...iconProps(big)}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>); }
function ShieldIcon({ big }) { return (<svg {...iconProps(big)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>); }
function KeyIcon({ big }) { return (<svg {...iconProps(big)}><path d="M21 2l-2 2m-7.6 7.6a5 5 0 1 0-1.4 1.4L13 15l2-2 2 2 3-3-2-2 3-3-2-2" /></svg>); }
function DbIcon({ big }) { return (<svg {...iconProps(big)}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>); }
function ScanIcon() { return (<svg {...iconProps()}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" /></svg>); }
function ChartIcon() { return (<svg {...iconProps()}><path d="M3 3v18h18M7 16v-5M12 16V8M17 16v-8" /></svg>); }
function BankIcon() { return (<svg {...iconProps()}><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>); }
function RepeatIcon() { return (<svg {...iconProps()}><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></svg>); }
function CheckIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--income)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>); }
function ChatIcon({ light }) {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={light ? "#fff" : "var(--brand)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
}
