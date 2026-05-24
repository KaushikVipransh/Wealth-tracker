import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Landing Page
   Dark-Cyber / Industrial Financial Terminal aesthetic
──────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div
      style={{
        background: "#090D16",
        color: "#E2E8F0",
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "100px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* Background glow orbs */}
        <div aria-hidden="true">
          <div style={{
            position: "absolute", top: "-100px", left: "50%",
            transform: "translateX(-50%)", width: "900px", height: "500px",
            background: "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "20%", right: "-200px",
            width: "600px", height: "600px",
            background: "radial-gradient(ellipse at center, rgba(16,185,129,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "0", left: "-100px",
            width: "400px", height: "400px",
            background: "radial-gradient(ellipse at center, rgba(244,63,94,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Horizontal divider lines */}
        <div style={{
          position: "absolute", top: "60px", left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.15) 30%, rgba(59,130,246,0.15) 70%, transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>

          {/* Status pill */}
          <div
            className="animate-fade-up"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.05)",
              padding: "6px 16px",
              marginBottom: "40px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="status-live-dot" />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#60A5FA",
              fontWeight: 600,
            }}>
              NEXT-GEN FIDUCIARY INTELLIGENCE ENGINE — ONLINE
            </span>
          </div>

          {/* H1 */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#E2E8F0",
              marginBottom: "24px",
            }}
          >
            Take{" "}
            <span style={{
              position: "relative", display: "inline-block",
            }}>
              <span style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Absolute Control
              </span>
              {/* Underline glow */}
              <span style={{
                position: "absolute", bottom: "-4px", left: 0, right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #3B82F6, #10B981)",
                boxShadow: "0 0 12px rgba(59,130,246,0.6)",
              }} />
            </span>
            {" "}of Your{" "}
            <span style={{ color: "#E2E8F0" }}>Wealth</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1.05rem", color: "#64748B", maxWidth: "560px",
              margin: "0 auto 48px", lineHeight: 1.7, fontWeight: 400,
            }}
          >
            Track multi-bank budgets, monitor real-time cash balances, and manage
            your transactional ledger within a{" "}
            <span style={{ color: "#94A3B8", fontWeight: 500 }}>cryptographically secured workspace</span>.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/dashboard"
              className="btn-cyber"
              style={{ textDecoration: "none", display: "inline-block", fontSize: "0.8rem", padding: "14px 32px" }}
            >
              ⟶ LAUNCH COMMAND CENTER
            </Link>
            <a
              href="#features"
              className="btn-ghost"
              style={{ textDecoration: "none", display: "inline-block", fontSize: "0.8rem", padding: "13px 28px" }}
            >
              EXPLORE SYSTEMS
            </a>
          </div>

          {/* Hero terminal preview block */}
          <div
            className="animate-fade-up delay-400"
            style={{
              marginTop: "72px",
              border: "1px solid #1E293B",
              background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
              position: "relative",
              overflow: "hidden",
              maxWidth: "860px",
              margin: "72px auto 0",
              textAlign: "left",
            }}
          >
            {/* Corner markers */}
            <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #3B82F6", borderLeft:"1px solid #3B82F6", opacity:0.8 }} />
            <span style={{ position:"absolute", top:"0", right:"0", width:"12px", height:"12px", borderTop:"1px solid #10B981", borderRight:"1px solid #10B981", opacity:0.8 }} />
            <span style={{ position:"absolute", bottom:"0", left:"0", width:"12px", height:"12px", borderBottom:"1px solid #10B981", borderLeft:"1px solid #10B981", opacity:0.8 }} />
            <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #3B82F6", borderRight:"1px solid #3B82F6", opacity:0.8 }} />

            {/* Terminal header bar */}
            <div style={{
              borderBottom: "1px solid #1E293B",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(30,41,59,0.3)",
            }}>
              <div style={{ display:"flex", gap:"6px" }}>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#F43F5E", opacity:0.8 }} />
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#F59E0B", opacity:0.8 }} />
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#10B981", opacity:0.8 }} />
              </div>
              <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.6rem", color:"#334155", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                WEALTHOS — FINANCIAL INTELLIGENCE TERMINAL v2.1
              </span>
              <span className="status-live" style={{ marginLeft:"auto" }}>
                <span className="status-live-dot" style={{ width:"5px", height:"5px" }} />
                <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"0.55rem", color:"#10B981", letterSpacing:"0.1em", textTransform:"uppercase" }}>SYNC</span>
              </span>
            </div>

            {/* Terminal body */}
            <div style={{ padding: "24px 20px", fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", lineHeight: 2 }}>
              <TerminalLine prefix="$" cmd="wealth-cli connect --db postgresql --encrypt aes256" color="#64748B" />
              <TerminalLine prefix="✓" cmd="Secure connection established · Latency 0.8ms" color="#10B981" />
              <TerminalLine prefix="$" cmd="wealth-cli account list" color="#64748B" />
              <div style={{ color: "#94A3B8", paddingLeft: "16px", borderLeft: "2px solid #1E293B" }}>
                <div>
                  <span style={{ color: "#3B82F6" }}>ID_0xA4F2</span>
                  <span style={{ color: "#334155" }}> · </span>
                  <span style={{ color: "#E2E8F0" }}>SBI SAVINGS</span>
                  <span style={{ color: "#334155" }}> · BAL: </span>
                  <span style={{ color: "#10B981" }}>₹2,45,000.00</span>
                  <span className="tag-green" style={{ marginLeft: "8px" }}>ACTIVE</span>
                </div>
                <div>
                  <span style={{ color: "#3B82F6" }}>ID_0xB7C1</span>
                  <span style={{ color: "#334155" }}> · </span>
                  <span style={{ color: "#E2E8F0" }}>HDFC SALARY</span>
                  <span style={{ color: "#334155" }}> · BAL: </span>
                  <span style={{ color: "#10B981" }}>₹88,500.00</span>
                  <span className="tag-blue" style={{ marginLeft: "8px" }}>CHECKING</span>
                </div>
                <div>
                  <span style={{ color: "#3B82F6" }}>ID_0xD3E8</span>
                  <span style={{ color: "#334155" }}> · </span>
                  <span style={{ color: "#E2E8F0" }}>ZERODHA INVEST</span>
                  <span style={{ color: "#334155" }}> · BAL: </span>
                  <span style={{ color: "#10B981" }}>₹5,12,000.00</span>
                  <span className="tag-amber" style={{ marginLeft: "8px" }}>INVEST</span>
                </div>
              </div>
              <TerminalLine prefix="$" cmd="wealth-cli analytics --period 30d" color="#64748B" />
              <TerminalLine prefix="✓" cmd="Net Position: ₹8,45,500.00 · Savings Rate: 34.2% · Burn Velocity: 18.4%" color="#10B981" />
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"4px" }}>
                <span style={{ color: "#3B82F6" }}>wealth@terminal</span>
                <span style={{ color: "#334155" }}>~</span>
                <span style={{ color: "#E2E8F0" }}>$</span>
                <span style={{
                  display:"inline-block", width:"8px", height:"14px",
                  background:"#3B82F6",
                  animation:"pulse-cursor 1s step-end infinite",
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          METRICS STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{
        borderTop: "1px solid #1E293B",
        borderBottom: "1px solid #1E293B",
        background: "rgba(13,20,32,0.8)",
        padding: "40px 24px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.02) 50%, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0", position: "relative", zIndex: 2,
          }}>
            {[
              { value: "< 1ms",     label: "TRANSACTION LATENCY",          sub: "database write velocity",    color: "#10B981" },
              { value: "AES-256",   label: "ENCRYPTION STANDARD",          sub: "end-to-end cipher",          color: "#3B82F6" },
              { value: "100%",      label: "TYPE-SAFE DATA BOUNDARY",       sub: "prisma + server actions",    color: "#10B981" },
              { value: "∞ LEDGER",  label: "TRANSACTION HISTORY",          sub: "no data expiry",             color: "#3B82F6" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: "24px 32px",
                borderRight: i < 3 ? "1px solid #1E293B" : "none",
                position: "relative",
              }}>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}40`,
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#64748B",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: "#334155",
                  letterSpacing: "0.06em",
                }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES BENTO GRID
      ══════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "96px 24px", scrollMarginTop: "56px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ marginBottom: "64px" }}>
            <div style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
              color: "#3B82F6", letterSpacing: "0.15em", textTransform: "uppercase",
              marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <div style={{ width: "24px", height: "1px", background: "#3B82F6" }} />
              SYSTEM MODULES
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #3B82F6, transparent)" }} />
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
              letterSpacing: "-0.03em", color: "#E2E8F0",
              maxWidth: "600px",
            }}>
              Engineered for{" "}
              <span style={{
                background: "linear-gradient(135deg, #3B82F6, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Complete Precision
              </span>
            </h2>
            <p style={{ color: "#64748B", marginTop: "12px", fontSize: "0.95rem", maxWidth: "480px", lineHeight: 1.65 }}>
              Every subsystem is purpose-built to map your liquid net worth with zero-tolerance precision.
            </p>
          </div>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1px", background: "#1E293B" }}>

            {/* Card 1 — wide */}
            <BentoCard
              span={7}
              accent="#3B82F6"
              tag="MODULE_01"
              tagColor="blue"
              title="Multi-Account Portfolio Engine"
              body="Isolate and track Checking, Savings, Credit, and Investment pools. All mapped to hardened database structures via Prisma typed objects with sub-millisecond write commit."
              href="/account"
              cta="OPEN ACCOUNTS MODULE"
              icon={<PortfolioIcon />}
            />

            {/* Card 2 — narrow */}
            <BentoCard
              span={5}
              accent="#10B981"
              tag="MODULE_02"
              tagColor="green"
              title="Concurrent Transaction Ledger"
              body="Log income streams and expense allocations securely. Backend auto-adjusts balances inside centralized atomic database transactions."
              href="/transaction"
              cta="ACCESS LEDGER"
              icon={<LedgerIcon />}
            />

            {/* Card 3 — narrow */}
            <BentoCard
              span={4}
              accent="#F43F5E"
              tag="MODULE_03"
              tagColor="red"
              title="Cash Flow Allocation"
              body="High-density telemetry gauges visualize spending allocation across all category vectors in real time."
              href="/dashboard"
              cta="VIEW ANALYTICS"
              icon={<FlowIcon />}
            />

            {/* Card 4 — wide */}
            <BentoCard
              span={8}
              accent="#3B82F6"
              tag="SECURITY_LAYER"
              tagColor="blue"
              title="Zero-Leak Serialization Boundary"
              body="Built on strict, isolated Next.js network primitive serialization boundaries ensuring zero browser client pipeline memory leakage. AES-256 encryption at the Supabase layer with Clerk JWT authentication guards every route."
              href="/dashboard"
              cta="ENTER COMMAND CENTER"
              icon={<SecurityIcon />}
            />

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CALL TO ACTION
      ══════════════════════════════════════════════════════ */}
      <section style={{
        borderTop: "1px solid #1E293B",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid ambiance */}
        <div aria-hidden="true">
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px", height: "400px",
            background: "radial-gradient(ellipse at center, rgba(59,130,246,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
            color: "#10B981", letterSpacing: "0.15em", textTransform: "uppercase",
            marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <span className="status-live-dot" />
            SYSTEM READY — AWAITING OPERATOR
          </div>

          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
            letterSpacing: "-0.03em", color: "#E2E8F0", marginBottom: "20px",
          }}>
            Ready to{" "}
            <span style={{
              background: "linear-gradient(135deg, #10B981, #3B82F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Track Flawlessly?
            </span>
          </h2>
          <p style={{ color: "#64748B", fontSize: "1rem", marginBottom: "48px", lineHeight: 1.65 }}>
            Authenticate with your secured credentials and launch your personal financial
            intelligence workspace right now.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              className="btn-cyber"
              style={{ textDecoration: "none", fontSize: "0.85rem", padding: "16px 40px" }}
            >
              INITIALIZE TERMINAL
            </Link>
            <Link
              href="/sign-in"
              className="btn-ghost"
              style={{ textDecoration: "none", fontSize: "0.8rem", padding: "15px 32px" }}
            >
              SIGN IN TO WORKSPACE
            </Link>
          </div>
        </div>
      </section>

      {/* Cursor blink animation */}
      <style>{`
        @keyframes pulse-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   BENTO CARD
──────────────────────────────────────────────────────────── */
function BentoCard({ span, accent, tag, tagColor, title, body, href, cta, icon }) {
  const tagColors = {
    blue: { color: "#3B82F6", border: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.06)" },
    green: { color: "#10B981", border: "rgba(16,185,129,0.3)", bg: "rgba(16,185,129,0.06)" },
    red: { color: "#F43F5E", border: "rgba(244,63,94,0.3)", bg: "rgba(244,63,94,0.06)" },
  };
  const tc = tagColors[tagColor];

  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s ease",
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      className="bento-hover-card"
    >
      <style>{`
        .bento-hover-card:hover {
          background: linear-gradient(135deg, #0F1825 0%, #111D2E 100%) !important;
        }
        .bento-hover-card:hover .bento-cta {
          color: #60A5FA !important;
          letter-spacing: 0.14em !important;
        }
      `}</style>

      {/* Corner accent marks */}
      <span style={{ position:"absolute", top:"0", left:"0", width:"14px", height:"14px", borderTop:`1px solid ${accent}`, borderLeft:`1px solid ${accent}`, opacity:0.7 }} />
      <span style={{ position:"absolute", bottom:"0", right:"0", width:"14px", height:"14px", borderBottom:`1px solid ${accent}`, borderRight:`1px solid ${accent}`, opacity:0.7 }} />

      {/* Background glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "200px", height: "200px",
        background: `radial-gradient(ellipse at top right, ${accent}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div>
        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          color: tc.color, border: `1px solid ${tc.border}`, background: tc.bg,
          padding: "2px 8px", marginBottom: "20px",
        }}>
          {tag}
        </div>

        {/* Icon */}
        <div style={{ marginBottom: "16px", opacity: 0.7 }}>
          {icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "1.1rem", fontWeight: 700, color: "#E2E8F0",
          letterSpacing: "-0.02em", marginBottom: "10px", lineHeight: 1.3,
        }}>
          {title}
        </h3>

        {/* Body */}
        <p style={{
          fontSize: "0.82rem", color: "#64748B", lineHeight: 1.65,
        }}>
          {body}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={href}
        className="bento-cta"
        style={{
          textDecoration: "none",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: accent,
          display: "flex", alignItems: "center", gap: "6px",
          marginTop: "24px",
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ display:"inline-block", width:"12px", height:"1px", background: accent }} />
        {cta}
      </Link>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TERMINAL LINE COMPONENT
──────────────────────────────────────────────────────────── */
function TerminalLine({ prefix, cmd, color }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
      <span style={{ color: color, opacity: 0.7, flexShrink: 0, minWidth: "14px" }}>{prefix}</span>
      <span style={{ color: "#94A3B8" }}>{cmd}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   SVG ICONS
──────────────────────────────────────────────────────────── */
function PortfolioIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="0" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}