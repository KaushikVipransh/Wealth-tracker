"use client";

import { useState } from "react";
import { createBankAccount } from "../actions/account";

/* ────────────────────────────────────────────────────────────
   CreateAccountForm — Client Component
   Wraps the account creation Server Action with proper
   error / success feedback state in the terminal aesthetic.
──────────────────────────────────────────────────────────── */

export default function CreateAccountForm() {
  const [status, setStatus] = useState(null); // null | { type: "success"|"error", message: string }
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const result = await createBankAccount(formData);

    if (result.success) {
      setStatus({ type: "success", message: "Account node initialized successfully." });
      event.target.reset();
    } else {
      setStatus({
        type: "error",
        message: result.error || "Unknown error. Check server logs.",
      });
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Inline feedback banner ── */}
      {status && (
        <div
          role="alert"
          style={{
            border: `1px solid ${status.type === "success" ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}`,
            background: status.type === "success" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <span style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: status.type === "success" ? "#10B981" : "#F43F5E",
            flexShrink: 0,
          }}>
            {status.type === "success" ? "✓" : "ERR://"}
          </span>
          <div>
            <div style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: status.type === "success" ? "#10B981" : "#F43F5E",
              marginBottom: "2px",
            }}>
              {status.type === "success" ? "ACCOUNT NODE INITIALIZED" : "ACCOUNT CREATION FAILED"}
            </div>
            <div style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.58rem",
              color: "#64748B",
            }}>
              {status.message}
            </div>
          </div>
        </div>
      )}

      {/* Account Name */}
      <div>
        <label style={{
          display: "block", fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
          textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
        }}>
          Account Label
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g., SBI Savings, HDFC Salary"
          required
          className="input-terminal"
          id="account-name"
        />
        <div style={{ height: "1px", background: "linear-gradient(90deg, #3B82F640, transparent)", marginTop: "1px" }} />
      </div>

      {/* Account Type */}
      <div>
        <label style={{
          display: "block", fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
          textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
        }}>
          Account Type Vector
        </label>
        <div style={{ position: "relative" }}>
          <select
            name="type"
            required
            className="select-terminal"
            id="account-type"
          >
            <option value="CHECKING">CHECKING</option>
            <option value="SAVINGS">SAVINGS</option>
            <option value="CREDIT">CREDIT CARD</option>
            <option value="INVESTMENT">INVESTMENT</option>
          </select>
          {/* Custom arrow */}
          <div style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)",
            borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
            borderTop: "4px solid #3B82F6",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Initial Balance */}
      <div>
        <label style={{
          display: "block", fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
          textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
        }}>
          Initial Balance (₹)
        </label>
        <input
          type="number"
          name="balance"
          step="0.01"
          placeholder="0.00"
          required
          className="input-terminal"
          id="account-balance"
        />
        <div style={{ height: "1px", background: "linear-gradient(90deg, #10B98140, transparent)", marginTop: "1px" }} />
      </div>

      <button
        type="submit"
        id="create-account-submit"
        className="btn-cyber"
        disabled={submitting}
        style={{
          width: "100%",
          marginTop: "8px",
          opacity: submitting ? 0.6 : 1,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "INITIALIZING..." : "INITIALIZE ACCOUNT NODE"}
      </button>
    </form>
  );
}
