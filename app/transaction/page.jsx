"use client";

import { useState, useEffect, startTransition } from "react";
import { createTransaction, getUserTransactions } from "../actions/transaction";
import { getUserAccounts } from "../actions/account";
import ReceiptScanner from "../components/ReceiptScanner";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Transactions
   Light fintech aesthetic
──────────────────────────────────────────────────────────── */

const CATEGORY_CONFIG = {
  FOOD:          { label: "Food",          color: "#E11D48" },
  SHOPPING:      { label: "Shopping",      color: "#D97706" },
  ENTERTAINMENT: { label: "Entertainment", color: "#7C3AED" },
  UTILITIES:     { label: "Utilities",     color: "#0284C7" },
  INVESTMENT:    { label: "Investment",    color: "#059669" },
  SALARY:        { label: "Salary",        color: "#16A34A" },
  OTHERS:        { label: "Others",        color: "#475569" },
};

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

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "6px",
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
    setTxStatus({ type: "success", title: "Receipt scanned", message: "Fields pre-filled from your receipt — review and save." });
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
      setTxStatus({ type: "success", message: "Transaction saved." });
      form.reset();
      setFormValues({ ...INITIAL_FORM, date: todayISO() });
      startTransition(() => {
        loadData();
      });
    } else {
      setTxStatus({ type: "error", message: result.error || "Something went wrong — try again." });
    }
    setSubmitting(false);
  }

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div className="section" style={{ paddingTop: "40px", paddingBottom: "64px" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: "8px" }}>Transactions</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
          Log it once, see it forever · {transactions.length} entr{transactions.length === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* ── QUICK STATS ── */}
      {!loading && transactions.length > 0 && (
        <div className="stat-row" style={{ marginBottom: "24px" }}>
          {[
            { label: "Total entries", value: transactions.length.toString(), color: "var(--text-heading)" },
            { label: "Money in", value: `+${formatINR(totalIncome)}`, color: "var(--income)" },
            { label: "Money out", value: `−${formatINR(totalExpense)}`, color: "var(--expense)" },
          ].map((stat) => (
            <div key={stat.label} className="card-muted" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {stat.label}
              </div>
              <div className="num" style={{ fontSize: "1.2rem", fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="layout-split">

        {/* ── LEFT: LOG TRANSACTION FORM ── */}
        <div className="card">
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Add a transaction</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Balances update automatically.
            </p>
          </div>

          {/* ── Inline status banner ── */}
          {txStatus && (
            <div
              role="alert"
              style={{
                background: txStatus.type === "success" ? "var(--income-wash)" : "var(--expense-wash)",
                color: txStatus.type === "success" ? "var(--income)" : "var(--expense)",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {txStatus.title || (txStatus.type === "success" ? "Saved" : "Couldn't save")}
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>{txStatus.message}</div>
            </div>
          )}

          {accounts.length === 0 ? (
            <div
              style={{
                background: "var(--warning-wash)",
                color: "var(--warning)",
                borderRadius: "12px",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "4px" }}>
                No accounts yet
              </div>
              <div style={{ fontSize: "0.8rem" }}>
                Create an account first on the Accounts page.
              </div>
            </div>
          ) : (
            <>
            {/* 📸 AI Receipt Scanner — pre-fills the form below */}
            <ReceiptScanner onScanComplete={handleScanComplete} />

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Description */}
              <div>
                <label style={labelStyle} htmlFor="tx-description">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g., Kirana store, salary bonus"
                  required
                  className="input-field"
                  id="tx-description"
                  value={formValues.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              {/* Type + Amount row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle} htmlFor="tx-type">Type</label>
                  <select
                    name="type" required className="select-field" id="tx-type"
                    value={formValues.type}
                    onChange={(e) => setField("type", e.target.value)}
                  >
                    <option value="EXPENSE">Expense (−)</option>
                    <option value="INCOME">Income (+)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle} htmlFor="tx-amount">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="input-field"
                    id="tx-amount"
                    value={formValues.amount}
                    onChange={(e) => setField("amount", e.target.value)}
                  />
                </div>
              </div>

              {/* Entry Date */}
              <div>
                <label style={labelStyle} htmlFor="tx-date">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="input-field"
                  id="tx-date"
                  value={formValues.date}
                  onChange={(e) => setField("date", e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle} htmlFor="tx-category">Category</label>
                <select
                  name="category" required className="select-field" id="tx-category"
                  value={formValues.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  <option value="FOOD">Food &amp; dining</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="UTILITIES">Bills &amp; utilities</option>
                  <option value="INVESTMENT">Investments</option>
                  <option value="SALARY">Salary / income</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              {/* 🔁 Recurring toggle */}
              <div
                style={{
                  border: `1px solid ${formValues.isRecurring ? "var(--brand)" : "var(--border)"}`,
                  background: formValues.isRecurring ? "var(--brand-wash)" : "var(--bg-inset)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  transition: "all 0.2s ease",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: formValues.isRecurring ? "var(--brand)" : "var(--text-secondary)" }}>
                    ↻ Repeats on a schedule
                  </span>

                  {/* Hidden real checkbox keeps FormData behavior identical */}
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formValues.isRecurring}
                    onChange={(e) => setField("isRecurring", e.target.checked)}
                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  />
                  {/* Pill switch visual */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "999px",
                      background: formValues.isRecurring ? "var(--brand)" : "var(--border-strong)",
                      position: "relative",
                      flexShrink: 0,
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: formValues.isRecurring ? "23px" : "3px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </span>
                </label>

                {formValues.isRecurring && (
                  <div style={{ marginTop: "12px" }}>
                    <select
                      name="recurringInterval"
                      required
                      className="select-field"
                      id="tx-recurring-interval"
                      value={formValues.recurringInterval}
                      onChange={(e) => setField("recurringInterval", e.target.value)}
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                      We&apos;ll add this automatically at each interval.
                    </p>
                  </div>
                )}
              </div>

              {/* Target Account */}
              <div>
                <label style={labelStyle} htmlFor="tx-account">Account</label>
                <select name="accountId" required className="select-field" id="tx-account">
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} · {formatINR(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                id="submit-transaction"
                className="btn-primary"
                disabled={submitting}
                style={{ width: "100%" }}
              >
                {submitting ? "Saving…" : "Add transaction"}
              </button>
            </form>
            </>
          )}
        </div>

        {/* ── RIGHT: TRANSACTION HISTORY ── */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              gap: "12px",
            }}
          >
            <h3 style={{ fontSize: "1.05rem" }}>History</h3>
            <span className="tag tag-gray">{transactions.length} total</span>
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "52px",
                    background: "var(--bg-card-muted)",
                    borderRadius: "12px",
                    animation: "pulse-soft 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "72px 24px",
                border: "1px dashed var(--border-strong)",
                borderRadius: "16px",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                No transactions yet
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Add your first one using the form.
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: "560px", overflowY: "auto" }}>
              {transactions.map((tx) => {
                const catCfg = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG.OTHERS;
                return (
                  <div key={tx.id} className="ledger-row">
                    {/* Description */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          color: "var(--text-heading)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tx.description || "Untitled"}
                        </span>
                        {tx.isRecurring && (
                          <span className="tag tag-brand">↻ {tx.recurringInterval ? tx.recurringInterval.charAt(0) + tx.recurringInterval.slice(1).toLowerCase() : "Recurring"}</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {tx.accountName}
                      </div>
                    </div>

                    {/* Meta: date + category (wraps to its own line on mobile) */}
                    <span className="lr-meta">
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </span>
                      <span
                        className="tag"
                        style={{ background: `${catCfg.color}14`, color: catCfg.color }}
                      >
                        {catCfg.label}
                      </span>
                    </span>

                    {/* Amount */}
                    <span
                      className={`num ${tx.type === "INCOME" ? "value-green" : "value-red"}`}
                      style={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap" }}
                    >
                      {tx.type === "INCOME" ? "+" : "−"}
                      {formatINR(tx.amount).replace("INR", "").trim()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
