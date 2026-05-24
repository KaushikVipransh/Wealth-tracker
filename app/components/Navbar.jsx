"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #1E293B",
        background: "rgba(9, 13, 22, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, #3B82F6 40%, #10B981 60%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        {/* ── Logo / Brand ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "1px solid rgba(59,130,246,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                background: "#3B82F6",
                boxShadow: "0 0 10px #3B82F6, 0 0 20px rgba(59,130,246,0.4)",
              }}
            />
            {/* Corner marks */}
            <span style={{ position:"absolute", top:"-1px", left:"-1px", width:"5px", height:"5px", borderTop:"1px solid #10B981", borderLeft:"1px solid #10B981" }} />
            <span style={{ position:"absolute", bottom:"-1px", right:"-1px", width:"5px", height:"5px", borderBottom:"1px solid #10B981", borderRight:"1px solid #10B981" }} />
          </div>

          <div>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
                color: "#E2E8F0",
                textTransform: "uppercase",
              }}
            >
              WEALTH
              <span style={{ color: "#3B82F6" }}>OS</span>
            </span>
          </div>
        </Link>

        {/* ── Center nav links ── */}
        <nav
          className="hidden md:flex"
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          {[
            { href: "/dashboard", label: "COMMAND", sub: "dashboard" },
            { href: "/account",   label: "ACCOUNTS", sub: "portfolios" },
            { href: "/transaction", label: "LEDGER",   sub: "transactions" },
          ].map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} sub={item.sub} />
          ))}
        </nav>

        {/* ── Right: Auth / User ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {/* Live indicator */}
          <span
            className="status-live hidden md:flex"
            style={{
              fontSize: "0.6rem",
              fontFamily: "JetBrains Mono, monospace",
              color: "#10B981",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span className="status-live-dot" />
            LIVE
          </span>

          {!isLoaded ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid #1E293B",
                background: "#0D1420",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ) : isSignedIn ? (
            <div
              style={{
                border: "1px solid #1E293B",
                padding: "2px",
                background: "rgba(59,130,246,0.06)",
              }}
            >
              <UserButton afterSignOutUrl="/" userProfileUrl="/dashboard" />
            </div>
          ) : (
            <Link href="/sign-in" className="btn-cyber" style={{ textDecoration: "none" }}>
              ACCESS TERMINAL
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Individual nav link component ── */
function NavLink({ href, label, sub }) {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      className="nav-link-terminal"
    >
      <style>{`
        .nav-link-terminal {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 14px;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          position: relative;
        }
        .nav-link-terminal:hover {
          border-color: rgba(59,130,246,0.25);
          background: rgba(59,130,246,0.05);
        }
        .nav-link-terminal:hover .nav-label {
          color: #3B82F6;
        }
        .nav-link-terminal .nav-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #64748B;
          text-transform: uppercase;
          transition: color 0.15s;
        }
        .nav-link-terminal .nav-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem;
          color: #334155;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>
      <span className="nav-label">{label}</span>
      <span className="nav-sub">{sub}</span>
    </Link>
  );
}