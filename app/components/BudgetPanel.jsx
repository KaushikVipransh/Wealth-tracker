"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateBudget } from "../actions/budget";
import { formatINR } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Monthly Budget Allocation Panel
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
  const meterColor = pct > 90 ? "#F43F5E" : pct >= 75 ? "#F59E0B" : "#10B981";

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateBudget(inputValue);
    if (result.success) {
      setBudget({ amount: result.budget.amount });
      setEditing(false);
    } else {
      setError(result.error || "Budget update failed.");
    }
    setSaving(false);
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #1E293B",
      marginBottom: "1px",
    }}>
      {/* Corner marks */}
      <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #F59E0B", borderLeft:"1px solid #F59E0B", opacity:0.6 }} />
      <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #F59E0B", borderRight:"1px solid #F59E0B", opacity:0.6 }} />

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: "16px", marginBottom: "18px", flexWrap: "wrap",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div style={{ width: "3px", height: "16px", background: "#F59E0B", boxShadow: "0 0 8px rgba(245,158,11,0.6)" }} />
            <h3 style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#E2E8F0",
            }}>
              Monthly Budget Allocation
            </h3>
            {pct >= 80 && budgetAmount > 0 && (
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#F59E0B", border: "1px solid rgba(245,158,11,0.35)",
                background: "rgba(245,158,11,0.08)", padding: "1px 7px",
              }}>
                ⚠ ALERT THRESHOLD
              </span>
            )}
          </div>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Current month expense ceiling · email sentinel at 80%
          </p>
        </div>

        {budget && !editing && (
          <button
            onClick={() => { setInputValue(budget.amount); setEditing(true); setError(null); }}
            className="btn-ghost"
            style={{ fontSize: "0.6rem", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          >
            <Pencil size={11} />
            ADJUST
          </button>
        )}
      </div>

      {/* Edit mode */}
      {editing || !budget ? (
        <div>
          {!budget && !editing ? (
            <div style={{
              border: "1px dashed #1E293B",
              padding: "24px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: "14px",
              }}>
                NO BUDGET CEILING CONFIGURED
              </div>
              <button
                onClick={() => { setEditing(true); setError(null); }}
                className="btn-cyber"
                style={{ fontSize: "0.65rem", padding: "8px 20px", cursor: "pointer" }}
              >
                SET BUDGET
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="e.g., 50000"
                className="input-terminal"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ maxWidth: "220px" }}
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-cyber"
                style={{ fontSize: "0.65rem", padding: "9px 18px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "SAVING..." : "COMMIT"}
              </button>
              <button
                onClick={() => { setEditing(false); setError(null); }}
                className="btn-ghost"
                style={{ fontSize: "0.65rem", padding: "9px 18px", cursor: "pointer" }}
              >
                CANCEL
              </button>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: "10px",
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
              color: "#F43F5E",
            }}>
              ERR:// {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Spent vs budget readout */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: "10px", flexWrap: "wrap", gap: "8px",
          }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "1.05rem",
              fontWeight: 700, color: meterColor,
              textShadow: `0 0 12px ${meterColor}40`,
            }}>
              {formatINR(spent)}
              <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 400 }}> / {formatINR(budgetAmount)}</span>
            </span>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
              fontWeight: 700, color: meterColor, letterSpacing: "0.06em",
            }}>
              {pct.toFixed(1)}% CONSUMED
            </span>
          </div>

          {/* Meter track */}
          <div style={{
            width: "100%", height: "6px",
            background: "rgba(30,41,59,0.8)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min(pct, 100)}%`,
              background: `linear-gradient(90deg, ${meterColor}, ${meterColor}CC)`,
              boxShadow: pct > 90 ? `0 0 10px ${meterColor}90` : `0 0 6px ${meterColor}60`,
              transition: "width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }} />
          </div>

          <div style={{
            marginTop: "8px",
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
            color: "#334155", letterSpacing: "0.04em",
          }}>
            {formatINR(Math.max(budgetAmount - spent, 0))} REMAINING THIS MONTH
          </div>
        </div>
      )}
    </div>
  );
}
