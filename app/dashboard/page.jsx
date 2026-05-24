import Link from "next/link";
import { getDashboardAnalytics } from "../actions/dashboard";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Financial Command Dashboard
   Dark-Cyber Terminal Aesthetic
──────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const result = await getDashboardAnalytics();

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
      <div style={{ padding: "48px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          border: "1px solid rgba(244,63,94,0.3)",
          background: "rgba(244,63,94,0.05)",
          padding: "20px 24px",
          display: "flex", alignItems: "flex-start", gap: "12px",
        }}>
          <span style={{ color: "#F43F5E", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>ERR://</span>
          <div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#F43F5E", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              ANALYTICS ENGINE FAULT
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#64748B" }}>
              {result.error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totalAssetBalance, totalIncome, totalExpense, categoryBreakdown, recentTransactions } = result;

  // 🧮 Calculate absolute combined transaction volume
  const totalTransactionVolume = categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0);

  // 📈 Calculate high-level liquid savings health ratios
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const burnRate = totalIncome > 0 ? ((totalExpense / totalIncome) * 100) : 0;

  const isPositive = totalAssetBalance >= 0;

  return (
    <div style={{
      padding: "40px 24px 60px",
      maxWidth: "1280px",
      margin: "0 auto",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>

      {/* ── HEADER ROW ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: "24px", marginBottom: "48px", flexWrap: "wrap",
      }}>
        <div>
          {/* Breadcrumb */}
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
            color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ color: "#3B82F6" }}>WEALTHOS</span>
            <span>/</span>
            <span>COMMAND CENTER</span>
            <span>/</span>
            <span style={{ color: "#64748B" }}>ANALYTICS</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800,
            letterSpacing: "-0.03em", color: "#E2E8F0", lineHeight: 1.1,
            marginBottom: "8px",
          }}>
            Financial Command Center
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#64748B", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.02em" }}>
            Real-time liquidity · wealth pools · budget allocation vectors
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/account" className="btn-ghost" style={{ textDecoration: "none" }}>
            MANAGE ACCOUNTS
          </Link>
          <Link href="/transaction" className="btn-cyber" style={{ textDecoration: "none" }}>
            + LOG TRANSACTION
          </Link>
        </div>
      </div>

      {/* ── METRICS ROW ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1px",
        background: "#1E293B",
        marginBottom: "1px",
      }}>

        {/* Net Worth Card */}
        <MetricCard
          label="NET WORTH ALLOCATION"
          subLabel="combined asset pools"
          value={formatINR(totalAssetBalance)}
          valueColor={isPositive ? "#10B981" : "#F43F5E"}
          accent={isPositive ? "#10B981" : "#F43F5E"}
          footer="Combined cash + checking − card liabilities"
          indicator={isPositive ? "POSITIVE" : "DEFICIT"}
          indicatorColor={isPositive ? "green" : "red"}
        />

        {/* Income Card */}
        <MetricCard
          label="TOTAL INFLOW STREAM"
          subLabel="income channels"
          value={`+${formatINR(totalIncome)}`}
          valueColor="#10B981"
          accent="#10B981"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>SAVINGS RATE</span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontWeight: 700,
                color: savingsRate >= 20 ? "#10B981" : "#F59E0B",
                textShadow: savingsRate >= 20 ? "0 0 10px rgba(16,185,129,0.4)" : "0 0 10px rgba(245,158,11,0.4)",
              }}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
          }
          indicator="LIVE"
          indicatorColor="green"
        />

        {/* Expense Card */}
        <MetricCard
          label="TOTAL OUTFLOW VECTOR"
          subLabel="expense channels"
          value={`-${formatINR(totalExpense)}`}
          valueColor="#F43F5E"
          accent="#F43F5E"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>BURN VELOCITY</span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontWeight: 700,
                color: burnRate > 80 ? "#F43F5E" : "#F59E0B",
              }}>
                {burnRate.toFixed(0)}% of income
              </span>
            </div>
          }
          indicator="TRACKED"
          indicatorColor="red"
        />
      </div>

      {/* ── MAIN ANALYTICS GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(300px, 1fr) minmax(0, 2fr)",
        gap: "1px",
        background: "#1E293B",
        marginBottom: "1px",
      }}>

        {/* ── CASH FLOW ALLOCATION PANEL ── */}
        <div style={{
          background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
          padding: "28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Corner marks */}
          <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #3B82F6", borderLeft:"1px solid #3B82F6", opacity:0.6 }} />
          <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #3B82F6", borderRight:"1px solid #3B82F6", opacity:0.6 }} />

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px",
            }}>
              <div style={{ width: "3px", height: "16px", background: "#3B82F6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />
              <h3 style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#E2E8F0",
              }}>
                Cash Flow Allocation
              </h3>
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Telemetry gauges · spending vector analysis
            </p>
          </div>

          {/* Category Meters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { id: "FOOD",          name: "Food & Dining",      icon: "◈", color: "#F43F5E" },
              { id: "SHOPPING",      name: "Shopping",           icon: "◈", color: "#F59E0B" },
              { id: "ENTERTAINMENT", name: "Entertainment",      icon: "◈", color: "#A78BFA" },
              { id: "UTILITIES",     name: "Bills & Utilities",  icon: "◈", color: "#38BDF8" },
              { id: "INVESTMENT",    name: "Investments",        icon: "◈", color: "#10B981" },
              { id: "OTHERS",        name: "Others / Misc",      icon: "◈", color: "#64748B" },
            ].map((masterCategory) => {
              const matchedData = categoryBreakdown.find((c) => c.name === masterCategory.id);
              const categoryTotal = matchedData ? matchedData.value : 0;

              // 🛡️ Scales perfectly against the dynamic baseline volume sum
              const allocationPercentage = totalTransactionVolume > 0
                ? (categoryTotal / totalTransactionVolume) * 100
                : 0;

              return (
                <div key={masterCategory.id}>
                  {/* Label row */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: "6px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: masterCategory.color, fontSize: "0.7rem" }}>{masterCategory.icon}</span>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                        color: "#94A3B8", letterSpacing: "0.04em", textTransform: "uppercase",
                        fontWeight: 500,
                      }}>
                        {masterCategory.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                      fontWeight: 700, color: "#E2E8F0",
                    }}>
                      {formatINR(categoryTotal)}
                    </span>
                  </div>

                  {/* Thin meter track */}
                  <div style={{
                    width: "100%", height: "2px",
                    background: "rgba(30,41,59,0.8)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${allocationPercentage}%`,
                      background: `linear-gradient(90deg, ${masterCategory.color}, ${masterCategory.color}CC)`,
                      boxShadow: `0 0 6px ${masterCategory.color}80`,
                      transition: "width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }} />
                  </div>

                  {/* Percentage label */}
                  <div style={{ textAlign: "right", marginTop: "3px" }}>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                      color: "#334155", letterSpacing: "0.04em",
                    }}>
                      {allocationPercentage.toFixed(1)}% of total volume
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom total */}
          {totalTransactionVolume > 0 && (
            <div style={{
              marginTop: "28px",
              paddingTop: "16px",
              borderTop: "1px solid #1E293B",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                TOTAL VOLUME
              </span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem",
                fontWeight: 700, color: "#3B82F6",
                textShadow: "0 0 12px rgba(59,130,246,0.4)",
              }}>
                {formatINR(totalTransactionVolume)}
              </span>
            </div>
          )}
        </div>

        {/* ── RECENT TRANSACTIONS LEDGER ── */}
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
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            marginBottom: "28px", gap: "16px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "3px", height: "16px", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
                <h3 style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                  fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#E2E8F0",
                }}>
                  Recent Account Activity
                </h3>
              </div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Live stream · latest 5 transactions
              </p>
            </div>
            <Link
              href="/transaction"
              style={{
                textDecoration: "none",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem", color: "#3B82F6",
                letterSpacing: "0.08em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: "6px",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Ledger table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: "16px",
            padding: "6px 12px",
            background: "rgba(30,41,59,0.3)",
            borderTop: "1px solid #1E293B",
            borderBottom: "1px solid #1E293B",
            marginBottom: "4px",
          }}>
            {["DESCRIPTION", "CATEGORY", "DATE", "AMOUNT"].map((h) => (
              <span key={h} style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Ledger rows */}
          {recentTransactions.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "64px 24px",
              border: "1px dashed #1E293B",
              margin: "8px 0",
            }}>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: "8px",
              }}>
                NO TRANSACTION RECORDS FOUND
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#1E293B" }}>
                Initialize ledger by logging your first transaction entry
              </div>
            </div>
          ) : (
            <div>
              {recentTransactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto",
                    gap: "16px",
                    padding: "14px 12px",
                    borderBottom: "1px solid rgba(30,41,59,0.5)",
                    alignItems: "center",
                    transition: "background 0.15s ease",
                    cursor: "default",
                  }}
                  className="ledger-row"
                >
                  <style>{`
                    .ledger-row:hover {
                      background: rgba(59,130,246,0.04) !important;
                    }
                  `}</style>

                  {/* Description */}
                  <div>
                    <div style={{
                      fontWeight: 600, fontSize: "0.82rem", color: "#E2E8F0",
                      marginBottom: "2px", letterSpacing: "-0.01em",
                    }}>
                      {tx.description || "Uncategorized Transaction"}
                    </div>
                    <div style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                      color: "#334155", letterSpacing: "0.04em",
                    }}>
                      ID_{tx.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>

                  {/* Category tag */}
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                    fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#64748B", border: "1px solid #1E293B",
                    background: "rgba(30,41,59,0.4)", padding: "2px 8px",
                    whiteSpace: "nowrap",
                  }}>
                    {tx.category}
                  </span>

                  {/* Date */}
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                    color: "#64748B", whiteSpace: "nowrap",
                  }}>
                    {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>

                  {/* Amount */}
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.88rem", fontWeight: 700,
                    color: tx.type === "INCOME" ? "#10B981" : "#F43F5E",
                    textShadow: tx.type === "INCOME"
                      ? "0 0 10px rgba(16,185,129,0.4)"
                      : "0 0 10px rgba(244,63,94,0.4)",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}>
                    {tx.type === "INCOME" ? "+" : "−"}
                    {formatINR(tx.amount).replace("INR", "").trim()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK ACTION STRIP ── */}
      <div style={{
        background: "linear-gradient(90deg, rgba(13,20,32,0.9), rgba(15,24,37,0.9))",
        border: "1px solid #1E293B",
        borderTop: "none",
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span className="status-live" style={{ fontSize: "0.6rem", fontFamily: "JetBrains Mono, monospace", color: "#10B981", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <span className="status-live-dot" />
            DATABASE SYNC: LIVE
          </span>
          <span style={{ width: "1px", height: "16px", background: "#1E293B" }} />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {recentTransactions.length} RECENT ENTRIES LOADED
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/transaction" className="btn-cyber" style={{ textDecoration: "none", fontSize: "0.7rem", padding: "8px 16px" }}>
            + ADD ENTRY
          </Link>
        </div>
      </div>

    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   METRIC CARD COMPONENT
──────────────────────────────────────────────────────────── */
function MetricCard({ label, subLabel, value, valueColor, accent, footer, indicator, indicatorColor }) {
  const indicatorColors = {
    green: { color: "#10B981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.3)" },
    red: { color: "#F43F5E", bg: "rgba(244,63,94,0.06)", border: "rgba(244,63,94,0.3)" },
    blue: { color: "#3B82F6", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.3)" },
  };
  const ic = indicatorColors[indicatorColor] || indicatorColors.blue;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Corner marks */}
      <span style={{ position:"absolute", top:"0", left:"0", width:"10px", height:"10px", borderTop:`1px solid ${accent}`, borderLeft:`1px solid ${accent}`, opacity:0.6 }} />

      {/* Background accent glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "120px", height: "120px",
        background: `radial-gradient(ellipse at top right, ${accent}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Status indicator */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
        fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        color: ic.color, border: `1px solid ${ic.border}`, background: ic.bg,
        padding: "2px 7px", marginBottom: "16px",
      }}>
        {indicatorColor === "green" && <span className="status-live-dot" style={{ width: "5px", height: "5px" }} />}
        {indicator}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#64748B", fontWeight: 600, marginBottom: "4px",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "JetBrains Mono, monospace", fontSize: "0.52rem",
        color: "#334155", letterSpacing: "0.06em", marginBottom: "12px",
      }}>
        {subLabel}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
        fontWeight: 700,
        color: valueColor,
        textShadow: `0 0 20px ${valueColor}40`,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: "16px",
      }}>
        {value}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1E293B",
        paddingTop: "12px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.6rem", color: "#64748B", letterSpacing: "0.04em",
      }}>
        {footer}
      </div>
    </div>
  );
}