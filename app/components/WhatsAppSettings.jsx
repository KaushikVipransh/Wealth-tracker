"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────
   WhatsAppSettings — Dashboard Integration Panel
   Light fintech aesthetic
──────────────────────────────────────────────────────────── */

const TWILIO_SANDBOX_CODE = "join none-screen";
const TWILIO_PHONE_NUMBER = "+14155238886";

export default function WhatsAppSettings() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | { type: "success"|"error", message: string }
  const [isLinked, setIsLinked] = useState(false);

  async function handleLinkDevice(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/user/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link device.");
      }

      setStatus({ type: "success", message: "Phone number saved. Finish the two WhatsApp steps below." });
      setIsLinked(true);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

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
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--brand-wash)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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

        <span className={`tag ${isLinked ? "tag-green" : "tag-gray"}`}>
          {isLinked ? "Linked" : "Not linked"}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleLinkDevice} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: "6px",
            }}
          >
            WhatsApp phone number
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="e.g. 919876543210 (with country code)"
              value={phoneNumber}
              disabled={isLinked}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
              style={{ flex: 1, minWidth: "200px", opacity: isLinked ? 0.5 : 1 }}
            />
            <button
              type="submit"
              disabled={loading || isLinked}
              className="btn-primary btn-sm"
              style={{ whiteSpace: "nowrap" }}
            >
              {loading ? "Saving…" : isLinked ? "✓ Linked" : "Save number"}
            </button>
          </div>
        </div>

        {/* Status banner */}
        {status && (
          <div
            role="alert"
            style={{
              background: status.type === "success" ? "var(--income-wash)" : "var(--expense-wash)",
              color: status.type === "success" ? "var(--income)" : "var(--expense)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {status.message}
          </div>
        )}
      </form>

      {/* Setup guide — revealed after successful link */}
      {isLinked && (
        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "16px" }}>
            Two quick steps to finish
          </div>

          {[
            {
              step: "1",
              label: "Open WhatsApp and message this number",
              value: TWILIO_PHONE_NUMBER,
            },
            {
              step: "2",
              label: "Send this exact message to activate",
              value: TWILIO_SANDBOX_CODE,
            },
          ].map(({ step, label, value }) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "999px",
                  background: "var(--brand-wash)",
                  color: "var(--brand)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {step}
              </span>
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {label}
                </div>
                <code
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    display: "inline-block",
                  }}
                >
                  {value}
                </code>
              </div>
            </div>
          ))}

          {/* Usage hint */}
          <div
            style={{
              marginTop: "16px",
              padding: "14px 16px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Try sending
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-heading)", fontStyle: "italic" }}>
              &quot;Spent 350 on fuel from sbi&quot;
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              → ₹350 · Utilities · SBI account
            </div>
          </div>
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
