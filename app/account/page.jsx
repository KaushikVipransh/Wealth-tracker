import { getUserAccounts } from "../actions/account";
import CreateAccountForm from "../components/CreateAccountForm";
import CountUp from "../components/CountUp";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Accounts
   Light fintech aesthetic
──────────────────────────────────────────────────────────── */

export default async function AccountPage() {
  // ⚡ Fetch active accounts during server-side rendering
  const accounts = await getUserAccounts();

  // 🇮🇳 Native Indian Rupee (INR) Formatter Engine
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

  // Account type configs — deep colors tuned for white background
  const typeConfig = {
    CHECKING:   { color: "#0284C7", wash: "rgba(2,132,199,0.10)",   label: "Checking" },
    SAVINGS:    { color: "#16A34A", wash: "rgba(22,163,74,0.10)",   label: "Savings" },
    CREDIT:     { color: "#E0402F", wash: "rgba(224,64,47,0.10)",   label: "Credit" },
    INVESTMENT: { color: "#7C3AED", wash: "rgba(124,58,237,0.10)",  label: "Investment" },
  };

  const totalBalance = accounts.reduce((sum, acc) => {
    const bal = parseFloat(acc.balance) || 0;
    return acc.type === "CREDIT" ? sum - bal : sum + bal;
  }, 0);

  return (
    <div className="section" style={{ paddingTop: "40px", paddingBottom: "64px" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: "8px" }}>Accounts</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
          Everything you&apos;ve connected, in one place · {accounts.length} account
          {accounts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="layout-split">

        {/* ── LEFT: CREATE ACCOUNT FORM ── */}
        <div className="card">
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Add an account</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Track a bank account, card, or investment pool.
            </p>
          </div>

          <CreateAccountForm />
        </div>

        {/* ── RIGHT: ACCOUNTS ── */}
        <div>
          {/* Total balance strip */}
          {accounts.length > 0 && (
            <div
              className="card"
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
                background: "var(--brand)",
                border: "none",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)" }}>
                Total balance
              </span>
              <CountUp
                value={totalBalance}
                format="inr"
                className="num"
                style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF" }}
              />
            </div>
          )}

          {accounts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                border: "1px dashed var(--border-strong)",
                borderRadius: "var(--radius-card)",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                No accounts yet
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Add your first account using the form to get started.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              {accounts.map((acc) => {
                const cfg = typeConfig[acc.type] || typeConfig.CHECKING;
                const balance = parseFloat(acc.balance) || 0;
                const negative = balance < 0;
                return (
                  <div key={acc.id} className="card card-hover">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                        gap: "8px",
                      }}
                    >
                      <span className="tag" style={{ background: cfg.wash, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      {acc.isDefault && <span className="tag tag-brand">Default</span>}
                    </div>

                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--text-heading)",
                        marginBottom: "12px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {acc.name}
                    </div>

                    <hr className="divider" style={{ marginBottom: "12px" }} />

                    <div
                      className="num"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: negative ? "var(--expense)" : "var(--text-heading)",
                      }}
                    >
                      {formatINR(balance)}
                    </div>
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
