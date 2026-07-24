"use client";

import { useState } from "react";
import { createBankAccount } from "../actions/account";

/* ────────────────────────────────────────────────────────────
   CreateAccountForm — Client Component
   Wraps the account creation Server Action with inline
   success / error feedback.
──────────────────────────────────────────────────────────── */

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

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
      setStatus({ type: "success", message: "Account added." });
      event.target.reset();
    } else {
      setStatus({
        type: "error",
        message: `Couldn't create the account — ${result.error || "unknown error."}`,
      });
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* ── Inline feedback banner ── */}
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

      {/* Account Name */}
      <div>
        <label style={labelStyle} htmlFor="account-name">Account name</label>
        <input
          type="text"
          name="name"
          placeholder="e.g., SBI Savings, HDFC Salary"
          required
          className="input-field"
          id="account-name"
        />
      </div>

      {/* Account Type */}
      <div>
        <label style={labelStyle} htmlFor="account-type">Type</label>
        <select name="type" required className="select-field" id="account-type">
          <option value="CHECKING">Checking</option>
          <option value="SAVINGS">Savings</option>
          <option value="CREDIT">Credit card</option>
          <option value="INVESTMENT">Investment</option>
        </select>
      </div>

      {/* Initial Balance */}
      <div>
        <label style={labelStyle} htmlFor="account-balance">Starting balance (₹)</label>
        <input
          type="number"
          name="balance"
          step="0.01"
          placeholder="0.00"
          required
          className="input-field"
          id="account-balance"
        />
      </div>

      <button
        type="submit"
        id="create-account-submit"
        className="btn-primary"
        disabled={submitting}
        style={{ width: "100%", marginTop: "4px" }}
      >
        {submitting ? "Adding…" : "Add account"}
      </button>
    </form>
  );
}
