"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateBudget } from "../actions/budget";
import { formatINR } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Monthly Budget Panel
   Meter: green <75% · amber 75–90% · red >90%
──────────────────────────────────────────────────────────── */

export default function BudgetPanel({ initialBudget, currentExpenses }) {
  const [budget, setBudget] = useState(initialBudget); // { amount } | null
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialBudget?.amount || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const spent = parseFloat(currentExpenses) || 0;
  const budgetAmount = budget ? parseFloat(budget.amount) : 0;
  const pct = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
  const meterColor = pct > 90 ? "var(--expense)" : pct >= 75 ? "var(--warning)" : "var(--income)";
  const remaining = Math.max(budgetAmount - spent, 0);
  const over = spent - budgetAmount;

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateBudget(inputValue);
    if (result.success) {
      setBudget({ amount: result.budget.amount });
      setEditing(false);
    } else {
      setError(result.error || "Couldn't save the budget.");
    }
    setSaving(false);
  }

  return (
    <div className="card">
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "1.05rem" }}>Monthly budget</h3>
            {pct >= 80 && budgetAmount > 0 && (
              <span className="tag tag-amber">⚠ Almost there</span>
            )}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            We&apos;ll email you when you cross 80%.
          </p>
        </div>

        {budget && !editing && (
          <button
            onClick={() => { setInputValue(budget.amount); setEditing(true); setError(null); }}
            className="btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Pencil size={12} />
            Adjust
          </button>
        )}
      </div>

      {/* Edit / empty / display states */}
      {editing || !budget ? (
        <div>
          {!budget && !editing ? (
            <div
              style={{
                border: "1px dashed var(--border-strong)",
                borderRadius: "16px",
                padding: "28px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
                No monthly limit set yet
              </div>
              <button
                onClick={() => { setEditing(true); setError(null); }}
                className="btn-primary btn-sm"
              >
                Set a budget
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="e.g., 50000"
                className="input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ maxWidth: "220px" }}
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary btn-sm"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => { setEditing(false); setError(null); }}
                className="btn-ghost btn-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--expense)" }}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Spent vs budget readout */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "10px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span className="num" style={{ fontSize: "1.15rem", fontWeight: 700, color: meterColor }}>
              {formatINR(spent)}
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>
                {" "}/ {formatINR(budgetAmount)}
              </span>
            </span>
            <span className="num" style={{ fontSize: "0.85rem", fontWeight: 600, color: meterColor }}>
              {pct.toFixed(1)}% used
            </span>
          </div>

          {/* Meter */}
          <div className="meter-track">
            <div
              style={{
                height: "100%",
                width: `${Math.min(pct, 100)}%`,
                background: meterColor,
                borderRadius: "999px",
                transition: "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />
          </div>

          <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {over > 0
              ? `You're ${formatINR(over)} over budget this month.`
              : `${formatINR(remaining)} left this month.`}
          </div>
        </div>
      )}
    </div>
  );
}
