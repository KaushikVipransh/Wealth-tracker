"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────────────────
   WhatsAppSettings — Dashboard Integration Panel
   Matches the WealthOS terminal inline-style design system.
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

      setStatus({ type: "success", message: "Phone number saved. Complete the WhatsApp handshake below." });
      setIsLinked(true);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
      border: "1px solid #1E293B",
      padding: "28px",
      position: "relative",
      overflow: "hidden",
      maxWidth: "680px",
    }}>
      {/* Corner accent marks */}
      <span style={{ position: "absolute", top: 0, left: 0, width: "12px", height: "12px", borderTop: "1px solid #A78BFA", borderLeft: "1px solid #A78BFA", opacity: 0.7 }} />
      <span style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", borderBottom: "1px solid #A78BFA", borderRight: "1px solid #A78BFA", opacity: 0.7 }} />

      {/* Background glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "200px", height: "200px",
        background: "radial-gradient(ellipse at top right, rgba(167,139,250,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "3px", height: "16px", background: "#A78BFA", boxShadow: "0 0 8px rgba(167,139,250,0.6)" }} />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#E2E8F0",
            }}>
              WhatsApp Integration Node
            </span>
          </div>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: isLinked ? "#10B981" : "#334155",
              boxShadow: isLinked ? "0 0 8px rgba(16,185,129,0.6)" : "none",
              display: "inline-block",
            }} />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
              color: isLinked ? "#10B981" : "#334155",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {isLinked ? "LINKED" : "UNLINKED"}
            </span>
          </div>
        </div>
        <p style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
          color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase",
          paddingLeft: "11px",
        }}>
          Direct-inject transactions via WhatsApp text syntax
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLinkDevice} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{
            display: "block", fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
            textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
          }}>
            Device Phone Number
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="e.g. 919876543210 (with country code)"
              value={phoneNumber}
              disabled={isLinked}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-terminal"
              style={{ flex: 1, opacity: isLinked ? 0.5 : 1 }}
            />
            <button
              type="submit"
              disabled={loading || isLinked}
              className="btn-cyber"
              style={{
                whiteSpace: "nowrap",
                opacity: loading || isLinked ? 0.5 : 1,
                cursor: loading || isLinked ? "not-allowed" : "pointer",
                fontSize: "0.65rem",
                padding: "0 20px",
              }}
            >
              {loading ? "SAVING..." : isLinked ? "✓ LINKED" : "SAVE ROUTE"}
            </button>
          </div>
          <div style={{ height: "1px", background: "linear-gradient(90deg, #A78BFA40, transparent)", marginTop: "1px" }} />
        </div>

        {/* Status banner */}
        {status && (
          <div
            role="alert"
            style={{
              border: `1px solid ${status.type === "success" ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}`,
              background: status.type === "success" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
              padding: "12px 16px",
              display: "flex", alignItems: "flex-start", gap: "10px",
            }}
          >
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              fontWeight: 700, color: status.type === "success" ? "#10B981" : "#F43F5E",
              flexShrink: 0,
            }}>
              {status.type === "success" ? "✓" : "ERR://"}
            </span>
            <div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                color: status.type === "success" ? "#10B981" : "#F43F5E",
                marginBottom: "2px",
              }}>
                {status.type === "success" ? "DEVICE ROUTE SAVED" : "LINK FAILURE"}
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#64748B" }}>
                {status.message}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Handshake guide — revealed after successful link */}
      {isLinked && (
        <div style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid #1E293B",
        }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
            color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase",
            fontWeight: 600, marginBottom: "16px",
          }}>
            Final Handshake — 2 Steps Required
          </div>

          {[
            {
              step: "01",
              label: "Open WhatsApp and message the carrier number",
              value: TWILIO_PHONE_NUMBER,
              valueColor: "#E2E8F0",
            },
            {
              step: "02",
              label: "Send this exact sync token to activate the webhook",
              value: TWILIO_SANDBOX_CODE,
              valueColor: "#A78BFA",
            },
          ].map(({ step, label, value, valueColor }) => (
            <div key={step} style={{
              display: "flex", alignItems: "flex-start", gap: "16px",
              marginBottom: "14px",
            }}>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em",
                flexShrink: 0, marginTop: "1px",
              }}>
                [{step}]
              </span>
              <div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
                  color: "#64748B", marginBottom: "4px",
                }}>
                  {label}
                </div>
                <code style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem",
                  fontWeight: 700, color: valueColor,
                  background: "rgba(30,41,59,0.5)",
                  border: "1px solid #1E293B",
                  padding: "3px 10px",
                  display: "inline-block",
                  letterSpacing: "0.04em",
                }}>
                  {value}
                </code>
              </div>
            </div>
          ))}

          {/* Usage hint */}
          <div style={{
            marginTop: "16px",
            padding: "12px 14px",
            background: "rgba(167,139,250,0.04)",
            border: "1px solid rgba(167,139,250,0.15)",
          }}>
            <div style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
              color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: "6px",
            }}>
              EXAMPLE COMMAND SYNTAX
            </div>
            <div style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              color: "#A78BFA", fontStyle: "italic",
            }}>
              &quot;Spent 350 on fuel from sbi&quot;
            </div>
            <div style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
              color: "#334155", marginTop: "4px",
            }}>
              → Amount: ₹350 · Category: UTILITIES · Account: SBI
            </div>
          </div>
        </div>
      )}

      {/* Bottom status bar */}
      <div style={{
        marginTop: "20px", paddingTop: "14px",
        borderTop: "1px solid #1E293B",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span className="status-live-dot" />
        <span style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
          color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          TWILIO WEBHOOK · GEMINI AI PARSER · ONLINE
        </span>
      </div>
    </div>
  );
}