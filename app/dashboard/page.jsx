import Link from "next/link";
import { getDashboardAnalytics } from "../actions/dashboard";
import { getCurrentBudget } from "../actions/budget";
import { syncUserToDatabase } from "../actions/user";
import WhatsAppSettings from "../components/WhatsAppSettings";
import BudgetPanel from "../components/BudgetPanel";
import CategoryDonut from "../components/charts/CategoryDonut";
import CashflowBars from "../components/charts/CashflowBars";
import CountUp from "../components/CountUp";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Dashboard
   Light fintech aesthetic
──────────────────────────────────────────────────────────── */

const CATEGORY_META = [
  { id: "FOOD",          name: "Food & dining",     color: "#E11D48" },
  { id: "SHOPPING",      name: "Shopping",          color: "#D97706" },
  { id: "ENTERTAINMENT", name: "Entertainment",     color: "#7C3AED" },
  { id: "UTILITIES",     name: "Bills & utilities", color: "#0284C7" },
  { id: "INVESTMENT",    name: "Investments",       color: "#059669" },
  { id: "SALARY",        name: "Salary / income",   color: "#16A34A" },
  { id: "OTHERS",        name: "Others",            color: "#475569" },
];

export default async function DashboardPage() {
  // 🔄 Upsert: creates the DB user row on first-ever login, no-op for returning users
  await syncUserToDatabase();

  const result = await getDashboardAnalytics();
  const budgetData = await getCurrentBudget();

  // 🇮🇳 Inline Indian Rupee (INR) Formatter Engine for Server Components
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!result.success) {
    return (
      <div className="section" style={{ paddingTop: "48px" }}>
        <div
          role="alert"
          style={{
            background: "var(--expense-wash)",
            color: "var(--expense)",
            borderRadius: "16px",
            padding: "20px 24px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
            Couldn&apos;t load your dashboard
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>{result.error}</div>
        </div>
      </div>
    );
  }

  const { totalAssetBalance, totalIncome, totalExpense, categoryBreakdown, monthlySeries, recentTransactions } = result;

  // 🧮 Calculate absolute combined transaction volume
  const totalTransactionVolume = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0);

  // 📈 High-level savings health ratios
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const burnRate = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const isPositive = totalAssetBalance >= 0;

  return (
    <div className="section" style={{ paddingTop: "40px", paddingBottom: "64px" }}>

      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: "8px" }}>Dashboard</h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Here&apos;s where your money stands.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/account" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Manage accounts
          </Link>
          <Link href="/transaction" className="btn-primary btn-sm" style={{ textDecoration: "none" }}>
            + Add transaction
          </Link>
        </div>
      </div>

      {/* ── METRICS ROW ── */}
      <div className="stat-row-featured" style={{ marginBottom: "24px" }}>
        <MetricCard
          featured
          label="Total balance"
          amount={totalAssetBalance}
          valueColor="#FFFFFF"
          footer="Cash + savings − card balances"
          tag={isPositive ? { text: "Positive", cls: "tag-green" } : { text: "In deficit", cls: "tag-red" }}
        />
        <MetricCard
          label="Total income"
          amount={totalIncome}
          prefix="+"
          valueColor="var(--income)"
          footer={`Savings rate: ${savingsRate.toFixed(1)}%`}
          tag={{ text: "Money in", cls: "tag-green" }}
        />
        <MetricCard
          label="Total spent"
          amount={totalExpense}
          prefix="−"
          valueColor="var(--expense)"
          footer={`${burnRate.toFixed(0)}% of income spent`}
          tag={{ text: "Money out", cls: "tag-red" }}
        />
      </div>

      {/* ── MONTHLY BUDGET ── */}
      <div style={{ marginBottom: "24px" }}>
        <BudgetPanel
          initialBudget={budgetData.budget}
          currentExpenses={budgetData.currentExpenses}
        />
      </div>

      {/* ── ANALYTICS GRID ── */}
      <div className="layout-half" style={{ marginBottom: "24px" }}>

        {/* Spending by category */}
        <div className="card">
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Spending by category</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Share of your total activity
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {CATEGORY_META.map((cat) => {
              const matched = categoryBreakdown.find((c) => c.name === cat.id);
              const categoryTotal = matched ? matched.value : 0;
              const pct = totalTransactionVolume > 0 ? (categoryTotal / totalTransactionVolume) * 100 : 0;

              return (
                <div key={cat.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                      gap: "8px",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-body)" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: cat.color, flexShrink: 0 }} />
                      {cat.name}
                    </span>
                    <span className="num" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)" }}>
                      {formatINR(categoryTotal)}
                    </span>
                  </div>
                  <div className="meter-track">
                    <div
                      className="bar-grow"
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: cat.color,
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {totalTransactionVolume > 0 && (
            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total volume</span>
              <span className="num" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {formatINR(totalTransactionVolume)}
              </span>
            </div>
          )}
        </div>

        {/* Recent transactions */}
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
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Recent transactions</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Latest 5 entries</p>
            </div>
            <Link
              href="/transaction"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--brand)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View all →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "56px 24px",
                border: "1px dashed var(--border-strong)",
                borderRadius: "16px",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                No transactions yet
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Log your first one to see it here.
              </div>
            </div>
          ) : (
            <div>
              {recentTransactions.map((tx) => {
                const meta = CATEGORY_META.find((c) => c.id === tx.category) || CATEGORY_META[6];
                return (
                  <div key={tx.id} className="ledger-row">
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "var(--text-heading)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tx.description || "Untitled"}
                    </span>
                    <span className="lr-meta">
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <span className="tag" style={{ background: `${meta.color}14`, color: meta.color }}>
                        {meta.name}
                      </span>
                    </span>
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

      {/* ── CHARTS ── */}
      <div className="layout-half" style={{ marginBottom: "40px" }}>
        <div className="card">
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Where it went</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Category share of volume</p>
          </div>
          <CategoryDonut data={categoryBreakdown} />
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "16px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>Cash flow</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Last 6 months</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--income)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "var(--income)" }} />
                Income
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--expense)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "var(--expense)" }} />
                Expense
              </span>
            </div>
          </div>
          <CashflowBars data={monthlySeries} />
        </div>
      </div>

      {/* ── WHATSAPP INTEGRATION ── */}
      <div style={{ marginBottom: "40px" }}>
        <WhatsAppSettings />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div
        className="card-muted"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span className="status-live" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          <span className="dot-live" />
          Everything synced · {recentTransactions.length} recent entries
        </span>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/transaction" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Add transaction
          </Link>
          <Link href="/account" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Add account
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   METRIC CARD
──────────────────────────────────────────────────────────── */
function MetricCard({ label, amount, prefix = "", value, valueColor, footer, tag, featured }) {
  return (
    <div
      className="card"
      style={featured ? { background: "var(--brand)", border: "none" } : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: featured ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
          }}
        >
          {label}
        </span>
        {tag && <span className={`tag ${tag.cls}`}>{tag.text}</span>}
      </div>

      <div
        className="num"
        style={{
          fontSize: featured ? "clamp(1.9rem, 3.5vw, 2.4rem)" : "clamp(1.4rem, 2.5vw, 1.75rem)",
          fontWeight: 800,
          color: valueColor,
          lineHeight: 1.15,
          marginBottom: "12px",
          overflowWrap: "anywhere",
        }}
      >
        {amount != null ? <CountUp value={amount} format="inr" prefix={prefix} /> : value}
      </div>

      <div
        style={{
          borderTop: featured ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--border)",
          paddingTop: "10px",
          fontSize: "0.8rem",
          color: featured ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
        }}
      >
        {footer}
      </div>
    </div>
  );
}
