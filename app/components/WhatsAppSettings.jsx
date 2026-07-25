"use client";

import { useEffect, useState } from "react";
import { getWhatsAppStatus } from "../actions/user";

/* ────────────────────────────────────────────────────────────
   WhatsAppSettings — Dashboard Integration Panel
   Light fintech aesthetic
──────────────────────────────────────────────────────────── */

const TWILIO_SANDBOX_CODE = "join none-screen";
const TWILIO_PHONE_NUMBER = "+14155238886";

// Common country codes (dial code = the digits prefixed to the national number)
const COUNTRY_CODES = [
  { code: "91", label: "🇮🇳 India +91" },
  { code: "1", label: "🇺🇸 USA / Canada +1" },
  { code: "44", label: "🇬🇧 UK +44" },
  { code: "971", label: "🇦🇪 UAE +971" },
  { code: "61", label: "🇦🇺 Australia +61" },
  { code: "65", label: "🇸🇬 Singapore +65" },
  { code: "49", label: "🇩🇪 Germany +49" },
  { code: "33", label: "🇫🇷 France +33" },
  { code: "81", label: "🇯🇵 Japan +81" },
  { code: "880", label: "🇧🇩 Bangladesh +880" },
  { code: "92", label: "🇵🇰 Pakistan +92" },
  { code: "94", label: "🇱🇰 Sri Lanka +94" },
];

function maskPhone(digits) {
  if (!digits) return "";
  const tail = digits.slice(-4);
  return `+${digits.slice(0, digits.length - 4).replace(/\d/g, "•")}${tail}`;
}

export default function WhatsAppSettings() {
  const [dialCode, setDialCode] = useState("91");
  const [nationalNumber, setNationalNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | { type, message }
  const [linkedPhone, setLinkedPhone] = useState(null); // saved digits, if any
  const [editing, setEditing] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showSteps, setShowSteps] = useState(false);

  // Load existing link status on mount
  useEffect(() => {
    let active = true;
    getWhatsAppStatus()
      .then((s) => {
        if (!active) return;
        setLinkedPhone(s.linked ? s.phone : null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, []);

  async function handleLinkDevice(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setShowSteps(false);

    const fullNumber = `${dialCode}${nationalNumber.replace(/\D/g, "")}`;

    try {
      const response = await fetch("/api/user/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to link number.");

      setLinkedPhone(fullNumber);
      setEditing(false);
      setNationalNumber("");

      if (data.welcomeSent) {
        setStatus({ type: "success", message: "Number linked — we've sent a welcome message to your WhatsApp. 🎉" });
      } else {
        setStatus({ type: "success", message: "Number linked! One quick step left to activate." });
        setShowSteps(true);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  const showForm = !checking && (!linkedPhone || editing);

  return (
    <div className="card" style={{ maxWidth: "680px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: "var(--brand-wash)", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <WhatsAppIcon />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Log expenses from WhatsApp</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Text your spending, we&apos;ll file it.
            </p>
          </div>
        </div>

        <span className={`tag ${linkedPhone ? "tag-green" : "tag-gray"}`}>
          {checking ? "Checking…" : linkedPhone ? "Linked" : "Not linked"}
        </span>
      </div>

      {/* ── Already-linked view ── */}
      {!checking && linkedPhone && !editing && (
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", flexWrap: "wrap",
            background: "var(--bg-inset)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "14px 16px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "2px" }}>
              Registered number
            </div>
            <div className="num" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)" }}>
              {maskPhone(linkedPhone)}
            </div>
          </div>
          <button
            className="btn-secondary btn-sm"
            onClick={() => {
              setEditing(true);
              setStatus(null);
              setShowSteps(false);
              setNationalNumber("");
            }}
          >
            Change number
          </button>
        </div>
      )}

      {/* ── Link / change form ── */}
      {showForm && (
        <form onSubmit={handleLinkDevice} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "6px" }}>
              WhatsApp number
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="select-field"
                style={{ maxWidth: "175px" }}
                aria-label="Country code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={nationalNumber}
                onChange={(e) => setNationalNumber(e.target.value.replace(/[^\d\s]/g, ""))}
                className="input-field"
                style={{ flex: 1, minWidth: "160px" }}
                required
              />
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px" }}>
              Pick your country, then enter your number without the country code.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="submit" disabled={loading} className="btn-primary btn-sm">
              {loading ? "Linking…" : linkedPhone ? "Update number" : "Link number"}
            </button>
            {linkedPhone && (
              <button type="button" className="btn-ghost btn-sm" onClick={() => { setEditing(false); setStatus(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Status banner */}
      {status && (
        <div
          role="alert"
          style={{
            marginTop: "14px",
            background: status.type === "success" ? "var(--income-wash)" : "var(--expense-wash)",
            color: status.type === "success" ? "var(--income)" : "var(--expense)",
            borderRadius: "12px", padding: "10px 14px",
            fontSize: "0.85rem", fontWeight: 500,
          }}
        >
          {status.message}
        </div>
      )}

      {/* Activation steps — only when the welcome couldn't be delivered yet */}
      {showSteps && (
        <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "14px" }}>
            One quick step to activate
          </div>
          {[
            { step: "1", label: "Open WhatsApp and message this number", value: TWILIO_PHONE_NUMBER },
            { step: "2", label: "Send this exact message to connect", value: TWILIO_SANDBOX_CODE },
          ].map(({ step, label, value }) => (
            <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "999px", background: "var(--brand-wash)", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {step}
              </span>
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px" }}>{label}</div>
                <code style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", background: "var(--bg-inset)", border: "1px solid var(--border)", borderRadius: "8px", padding: "4px 12px", display: "inline-block" }}>
                  {value}
                </code>
              </div>
            </div>
          ))}
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Once connected, you&apos;ll get a welcome message and can start logging expenses right away.
          </p>
        </div>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
