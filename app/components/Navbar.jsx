"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account", label: "Accounts" },
  { href: "/transaction", label: "Transactions" },
];

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* ── Logo / Brand ── */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1 }}>
              W
            </span>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "-0.02em",
              color: "var(--text-heading)",
            }}
          >
            WealthOS
          </span>
        </Link>

        {/* ── Center nav links (desktop) ── */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "4px" }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="btn-ghost btn-sm"
              style={{ textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Right: Auth / User + hamburger ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {!isLoaded ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "999px",
                background: "var(--bg-card-muted)",
              }}
            />
          ) : isSignedIn ? (
            <UserButton afterSignOutUrl="/" userProfileUrl="/dashboard" />
          ) : (
            <Link
              href="/sign-in"
              className="btn-primary btn-sm"
              style={{ textDecoration: "none" }}
            >
              Sign in
            </Link>
          )}

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden"
            style={{
              width: "40px",
              height: "40px",
              border: "none",
              background: "transparent",
              borderRadius: "999px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "18px",
                height: "2px",
                borderRadius: "2px",
                background: "var(--text-heading)",
                transition: "transform 0.2s ease",
                transform: mobileOpen ? "translateY(3.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                width: "18px",
                height: "2px",
                borderRadius: "2px",
                background: "var(--text-heading)",
                transition: "transform 0.2s ease",
                transform: mobileOpen ? "translateY(-3.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile menu panel ── */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--bg-page)",
            borderBottom: "1px solid var(--border)",
            boxShadow: "var(--shadow-hover)",
            padding: "8px 20px 16px",
          }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontWeight: 600,
                fontSize: "1rem",
                color: "var(--text-heading)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {item.label}
            </Link>
          ))}
          {isLoaded && !isSignedIn && (
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{ textDecoration: "none", width: "100%", marginTop: "16px" }}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
