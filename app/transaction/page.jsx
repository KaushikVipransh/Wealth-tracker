"use client";

import { useState, useEffect, startTransition } from "react";
import { createTransaction, getUserTransactions } from "../actions/transaction";
import { getUserAccounts } from "../actions/account";
import ReceiptScanner from "../components/ReceiptScanner";

// Local YYYY-MM-DD for the date input default
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const INITIAL_FORM = {
  description: "",
  amount: "",
  type: "EXPENSE",
  category: "FOOD",
  date: "",
  isRecurring: false,
  recurringInterval: "MONTHLY",
};

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Transaction Ledger
   Dark-Cyber Terminal Aesthetic
──────────────────────────────────────────────────────────── */

const CATEGORY_CONFIG = {
  FOOD:          { label: "Food & Dining",     color: "#F43F5E" },
  SHOPPING:      { label: "Shopping",           color: "#F59E0B" },
  ENTERTAINMENT: { label: "Entertainment",      color: "#A78BFA" },
  UTILITIES:     { label: "Bills & Utilities",  color: "#38BDF8" },
  INVESTMENT:    { label: "Investments",         color: "#10B981" },
  SALARY:        { label: "Salary / Income",    color: "#10B981" },
  OTHERS:        { label: "Others / Misc",      color: "#64748B" },
};

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // null | { type: "success"|"error", title?: string, message: string }
  const [formValues, setFormValues] = useState({ ...INITIAL_FORM, date: todayISO() });

  const setField = (name, value) => setFormValues((v) => ({ ...v, [name]: value }));

  // 📸 Receipt scanner → pre-fill the form for review (never auto-submits)
  function handleScanComplete(data) {
    setFormValues((v) => ({
      ...v,
      description: data.merchant ? `${data.merchant} — ${data.description}`.slice(0, 120) : data.description,
      amount: String(data.amount),
      type: "EXPENSE",
      category: data.category,
      date: data.date || v.date,
    }));
    setTxStatus({ type: "success", title: "RECEIPT PARSED", message: "Fields pre-filled from receipt — review & commit." });
  }

  // 🇮🇳 Inline Indian Rupee (INR) Formatter Engine
  const formatINR = (amount) => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount) || numericAmount == null) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  async function loadData() {
    try {
      const [txData, accData] = await Promise.all([
        getUserTransactions(),
        getUserAccounts(),
      ]);
      setTransactions(txData);
      setAccounts(accData);
    } catch (error) {
      console.error("❌ UI Load error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // loadData only sets state after its awaits resolve (async), not synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setTxStatus(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await createTransaction(formData);
    if (result.success) {
      setTxStatus({ type: "success", message: "Transaction committed to ledger." });
      form.reset();
      setFormValues({ ...INITIAL_FORM, date: todayISO() });
      startTransition(() => {
        loadData();
      });
    } else {
      // 🚨 Inline error — no more blocking alert()
      setTxStatus({ type: "error", message: result.error || "Unknown write failure." });
    }
    setSubmitting(false);
  }

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div style={{
      padding: "40px 24px 60px",
      maxWidth: "1280px",
      margin: "0 auto",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
          color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ color: "#3B82F6" }}>WEALTHOS</span>
          <span>/</span>
          <span style={{ color: "#64748B" }}>TRANSACTION LEDGER</span>
        </div>
        <h1 style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800,
          letterSpacing: "-0.03em", color: "#E2E8F0", lineHeight: 1.1, marginBottom: "8px",
        }}>
          Transaction History Ledger
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#64748B", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.02em" }}>
          {transactions.length} entries logged · atomic database transaction engine
        </p>
      </div>

      {/* ── QUICK STATS STRIP ── */}
      {!loading && transactions.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", background: "#1E293B", marginBottom: "1px",
        }}>
          {[
            { label: "TOTAL ENTRIES", value: transactions.length.toString(), color: "#3B82F6" },
            { label: "TOTAL INFLOW",  value: `+${formatINR(totalIncome)}`,   color: "#10B981" },
            { label: "TOTAL OUTFLOW", value: `-${formatINR(totalExpense)}`,   color: "#F43F5E" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "linear-gradient(135deg, #0D1420, #0F1825)",
              padding: "16px 20px",
            }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", fontWeight: 700,
                color: stat.color, textShadow: `0 0 12px ${stat.color}40`,
                letterSpacing: "-0.01em",
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        gap: "1px",
        background: "#1E293B",
        alignItems: "start",
      }}>

        {/* ── LEFT: LOG TRANSACTION FORM ── */}
        <div style={{
          background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
          padding: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Corner marks */}
          <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #3B82F6", borderLeft:"1px solid #3B82F6", opacity:0.7 }} />
          <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #3B82F6", borderRight:"1px solid #3B82F6", opacity:0.7 }} />

          {/* Background glow */}
          <div style={{
            position: "absolute", top: 0, right: 0, width: "150px", height: "150px",
            background: "radial-gradient(ellipse at top right, rgba(59,130,246,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Panel header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "3px", height: "16px", background: "#3B82F6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#E2E8F0",
              }}>
                Log Transaction Entry
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase", paddingLeft: "11px" }}>
              Atomic write · auto-adjusts account balance
            </p>
          </div>

          {/* ── Inline Tx Status Banner ── */}
          {txStatus && (
            <div
              role="alert"
              style={{
                border: `1px solid ${txStatus.type === "success" ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}`,
                background: txStatus.type === "success" ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "4px",
              }}
            >
              <span style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: txStatus.type === "success" ? "#10B981" : "#F43F5E",
                flexShrink: 0,
              }}>
                {txStatus.type === "success" ? "✓" : "ERR://"}
              </span>
              <div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: txStatus.type === "success" ? "#10B981" : "#F43F5E",
                  marginBottom: "2px",
                }}>
                  {txStatus.title || (txStatus.type === "success" ? "TRANSACTION COMMITTED" : "WRITE FAILURE")}
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.58rem",
                  color: "#64748B",
                }}>
                  {txStatus.message}
                </div>
              </div>
            </div>
          )}

          {accounts.length === 0 ? (
            <div style={{
              border: "1px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.05)",
              padding: "16px",
            }}>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                color: "#F59E0B", letterSpacing: "0.06em", textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                ⚠ NO ACCOUNT NODES FOUND
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#64748B" }}>
                Initialize a bank account pool under the Accounts module first.
              </div>
            </div>
          ) : (
            <>
            {/* 📸 AI Receipt Scanner — pre-fills the form below */}
            <ReceiptScanner onScanComplete={handleScanComplete} />

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Description */}
              <div>
                <label style={{
                  display: "block", fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                }}>
                  Transaction Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g., Kirana Store, Salary Bonus"
                  required
                  className="input-terminal"
                  id="tx-description"
                  value={formValues.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              {/* Type + Amount row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{
                    display: "block", fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                    textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                  }}>
                    Type Vector
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="type" required className="select-terminal" id="tx-type"
                      value={formValues.type}
                      onChange={(e) => setField("type", e.target.value)}
                    >
                      <option value="EXPENSE">EXPENSE (−)</option>
                      <option value="INCOME">INCOME (+)</option>
                    </select>
                    <div style={{
                      position: "absolute", right: "8px", top: "50%",
                      transform: "translateY(-50%)",
                      borderLeft: "3px solid transparent", borderRight: "3px solid transparent",
                      borderTop: "4px solid #3B82F6",
                      pointerEvents: "none",
                    }} />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block", fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                    textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                  }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="input-terminal"
                    id="tx-amount"
                    value={formValues.amount}
                    onChange={(e) => setField("amount", e.target.value)}
                  />
                </div>
              </div>

              {/* Entry Date */}
              <div>
                <label style={{
                  display: "block", fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                }}>
                  Entry Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="input-terminal"
                  id="tx-date"
                  value={formValues.date}
                  onChange={(e) => setField("date", e.target.value)}
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{
                  display: "block", fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                }}>
                  Category Tag
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="category" required className="select-terminal" id="tx-category"
                    value={formValues.category}
                    onChange={(e) => setField("category", e.target.value)}
                  >
                    <option value="FOOD">FOOD &amp; DINING</option>
                    <option value="SHOPPING">SHOPPING</option>
                    <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                    <option value="UTILITIES">BILLS &amp; UTILITIES</option>
                    <option value="INVESTMENT">INVESTMENTS</option>
                    <option value="SALARY">SALARY / INCOME</option>
                    <option value="OTHERS">OTHERS / MISC</option>
                  </select>
                  <div style={{
                    position: "absolute", right: "8px", top: "50%",
                    transform: "translateY(-50%)",
                    borderLeft: "3px solid transparent", borderRight: "3px solid transparent",
                    borderTop: "4px solid #3B82F6",
                    pointerEvents: "none",
                  }} />
                </div>
              </div>

              {/* 🔁 Recurring Schedule */}
              <div style={{
                border: `1px solid ${formValues.isRecurring ? "rgba(167,139,250,0.35)" : "#1E293B"}`,
                background: formValues.isRecurring ? "rgba(167,139,250,0.05)" : "rgba(30,41,59,0.15)",
                padding: "14px 16px",
                transition: "all 0.2s ease",
              }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  cursor: "pointer", userSelect: "none",
                }}>
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formValues.isRecurring}
                    onChange={(e) => setField("isRecurring", e.target.checked)}
                    style={{ accentColor: "#A78BFA", width: "14px", height: "14px", cursor: "pointer" }}
                  />
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: formValues.isRecurring ? "#A78BFA" : "#64748B",
                  }}>
                    ↻ RECURRING SCHEDULE
                  </span>
                </label>

                {formValues.isRecurring && (
                  <div style={{ marginTop: "12px", position: "relative" }}>
                    <select
                      name="recurringInterval"
                      required
                      className="select-terminal"
                      id="tx-recurring-interval"
                      value={formValues.recurringInterval}
                      onChange={(e) => setField("recurringInterval", e.target.value)}
                    >
                      <option value="DAILY">DAILY</option>
                      <option value="WEEKLY">WEEKLY</option>
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="YEARLY">YEARLY</option>
                    </select>
                    <div style={{
                      position: "absolute", right: "8px", top: "50%",
                      transform: "translateY(-50%)",
                      borderLeft: "3px solid transparent", borderRight: "3px solid transparent",
                      borderTop: "4px solid #A78BFA",
                      pointerEvents: "none",
                    }} />
                    <p style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
                      color: "#334155", letterSpacing: "0.04em", marginTop: "6px",
                    }}>
                      Auto-replays via scheduler engine at each interval
                    </p>
                  </div>
                )}
              </div>

              {/* Target Account */}
              <div>
                <label style={{
                  display: "block", fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.58rem", color: "#64748B", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontWeight: 600, marginBottom: "8px",
                }}>
                  Target Account Node
                </label>
                <div style={{ position: "relative" }}>
                  <select name="accountId" required className="select-terminal" id="tx-account">
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} · {formatINR(acc.balance)}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute", right: "8px", top: "50%",
                    transform: "translateY(-50%)",
                    borderLeft: "3px solid transparent", borderRight: "3px solid transparent",
                    borderTop: "4px solid #3B82F6",
                    pointerEvents: "none",
                  }} />
                </div>
              </div>

              <button
                type="submit"
                id="submit-transaction"
                className="btn-cyber"
                disabled={submitting}
                style={{
                  width: "100%",
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "PROCESSING..." : "COMMIT TRANSACTION"}
              </button>
            </form>
            </>
          )}

          {/* Status */}
          <div style={{
            marginTop: "20px", paddingTop: "16px",
            borderTop: "1px solid #1E293B",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span className="status-live-dot" />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
              color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              ATOMIC WRITE ENGINE · ONLINE
            </span>
          </div>
        </div>

        {/* ── RIGHT: TRANSACTION HISTORY ── */}
        <div style={{
          background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
          padding: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Corner marks */}
          <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #10B981", borderLeft:"1px solid #10B981", opacity:0.6 }} />
          <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #10B981", borderRight:"1px solid #10B981", opacity:0.6 }} />

          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "3px", height: "16px", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#E2E8F0",
              }}>
                Full History Ledger
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase", paddingLeft: "11px" }}>
              All committed transactions · immutable audit log
            </p>
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  height: "56px",
                  background: "rgba(30,41,59,0.3)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }} />
              ))}
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#334155", textAlign: "center", marginTop: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                FETCHING LEDGER DATA...
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              border: "1px dashed #1E293B",
            }}>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                LEDGER EMPTY — NO ENTRIES LOGGED
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#1E293B" }}>
                Add your first income or expense entry using the form on the left
              </div>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: "12px",
                padding: "6px 12px",
                background: "rgba(30,41,59,0.3)",
                borderTop: "1px solid #1E293B",
                borderBottom: "1px solid #1E293B",
                marginBottom: "0",
              }}>
                {["DESCRIPTION / ID", "CATEGORY", "DATE", "AMOUNT"].map((h) => (
                  <span key={h} style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
                    color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                  }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Transaction rows */}
              <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                {transactions.map((tx, idx) => {
                  const catCfg = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG.OTHERS;
                  return (
                    <div
                      key={tx.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto auto",
                        gap: "12px",
                        padding: "12px 12px",
                        borderBottom: "1px solid rgba(30,41,59,0.5)",
                        alignItems: "center",
                        transition: "background 0.15s ease",
                      }}
                      className="tx-row"
                    >
                      <style>{`
                        .tx-row:hover {
                          background: rgba(59,130,246,0.03) !important;
                        }
                      `}</style>

                      {/* Description */}
                      <div>
                        <div style={{
                          fontWeight: 600, fontSize: "0.82rem", color: "#E2E8F0",
                          letterSpacing: "-0.01em", marginBottom: "2px",
                          display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
                        }}>
                          {tx.description || "Uncategorized"}
                          {tx.isRecurring && (
                            <span style={{
                              fontFamily: "JetBrains Mono, monospace", fontSize: "0.5rem",
                              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                              color: "#A78BFA", border: "1px solid rgba(167,139,250,0.35)",
                              background: "rgba(167,139,250,0.08)", padding: "1px 6px",
                              whiteSpace: "nowrap",
                            }}>
                              ↻ {tx.recurringInterval || "RECURRING"}
                            </span>
                          )}
                        </div>
                        <div style={{
                          fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
                          color: "#334155", letterSpacing: "0.04em",
                        }}>
                          TX_{tx.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>

                      {/* Category */}
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
                        fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                        color: catCfg.color,
                        border: `1px solid ${catCfg.color}30`,
                        background: `${catCfg.color}08`,
                        padding: "2px 7px",
                        whiteSpace: "nowrap",
                      }}>
                        {tx.category}
                      </span>

                      {/* Date */}
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
                        color: "#64748B", whiteSpace: "nowrap",
                      }}>
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </span>

                      {/* Amount */}
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.88rem", fontWeight: 700,
                        color: tx.type === "INCOME" ? "#10B981" : "#F43F5E",
                        textShadow: tx.type === "INCOME"
                          ? "0 0 8px rgba(16,185,129,0.35)"
                          : "0 0 8px rgba(244,63,94,0.35)",
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                      }}>
                        {tx.type === "INCOME" ? "+" : "−"}
                        {formatINR(tx.amount).replace("INR", "").trim()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}