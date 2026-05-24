import { createBankAccount, getUserAccounts } from "../actions/account";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Account Portfolio Management
   Dark-Cyber Terminal Aesthetic
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

  // Account type configs
  const typeConfig = {
    CHECKING:   { color: "#3B82F6", label: "CHECKING",   glow: "rgba(59,130,246,0.3)"  },
    SAVINGS:    { color: "#10B981", label: "SAVINGS",    glow: "rgba(16,185,129,0.3)"  },
    CREDIT:     { color: "#F43F5E", label: "CREDIT",     glow: "rgba(244,63,94,0.3)"   },
    INVESTMENT: { color: "#A78BFA", label: "INVESTMENT", glow: "rgba(167,139,250,0.3)" },
  };

  return (
    <div style={{
      padding: "40px 24px 60px",
      maxWidth: "1280px",
      margin: "0 auto",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "48px" }}>
        {/* Breadcrumb */}
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
          color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ color: "#3B82F6" }}>WEALTHOS</span>
          <span>/</span>
          <span style={{ color: "#64748B" }}>ACCOUNT PORTFOLIOS</span>
        </div>
        <h1 style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800,
          letterSpacing: "-0.03em", color: "#E2E8F0", lineHeight: 1.1, marginBottom: "8px",
        }}>
          Account Portfolio Manager
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#64748B", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.02em" }}>
          {accounts.length} active account{accounts.length !== 1 ? "s" : ""} · multi-bank pool tracking
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        gap: "1px",
        background: "#1E293B",
        alignItems: "start",
      }}>

        {/* ── LEFT: CREATE ACCOUNT FORM ── */}
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
                Initialize Account Pool
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase", paddingLeft: "11px" }}>
              Configure new bank account node
            </p>
          </div>

          {/* Form */}
          <form action={createBankAccount} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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
              style={{ width: "100%", marginTop: "8px" }}
            >
              INITIALIZE ACCOUNT NODE
            </button>
          </form>

          {/* Bottom status */}
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
              PRISMA · POSTGRESQL CONNECTED
            </span>
          </div>
        </div>

        {/* ── RIGHT: ACCOUNTS GRID ── */}
        <div style={{
          background: "linear-gradient(135deg, #0D1420 0%, #0F1825 100%)",
          padding: "28px",
          position: "relative",
          minHeight: "400px",
        }}>
          {/* Corner marks */}
          <span style={{ position:"absolute", top:"0", left:"0", width:"12px", height:"12px", borderTop:"1px solid #10B981", borderLeft:"1px solid #10B981", opacity:0.6 }} />
          <span style={{ position:"absolute", bottom:"0", right:"0", width:"12px", height:"12px", borderBottom:"1px solid #10B981", borderRight:"1px solid #10B981", opacity:0.6 }} />

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "3px", height: "16px", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#E2E8F0",
              }}>
                Active Account Pools
              </span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#334155", letterSpacing: "0.06em", textTransform: "uppercase", paddingLeft: "11px" }}>
              {accounts.length} node{accounts.length !== 1 ? "s" : ""} registered · all accounts live
            </p>
          </div>

          {accounts.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              border: "1px dashed #1E293B",
            }}>
              <div style={{ marginBottom: "12px", opacity: 0.3 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                  <rect x="2" y="7" width="20" height="14" rx="0" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <div style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
                color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: "6px",
              }}>
                NO ACCOUNT NODES REGISTERED
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#1E293B" }}>
                Initialize your first account pool using the form on the left
              </div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1px",
              background: "#1E293B",
            }}>
              {accounts.map((account) => {
                const cfg = typeConfig[account.type] || typeConfig.CHECKING;
                const balance = typeof account.balance === "string" ? parseFloat(account.balance) : account.balance;
                const isNeg = balance < 0;

                return (
                  <div
                    key={account.id}
                    style={{
                      background: "linear-gradient(135deg, #0F1825 0%, #111927 100%)",
                      padding: "20px",
                      position: "relative",
                      overflow: "hidden",
                      transition: "background 0.2s ease",
                    }}
                    className="account-card"
                  >
                    <style>{`
                      .account-card:hover {
                        background: linear-gradient(135deg, #111D2E 0%, #131E2C 100%) !important;
                      }
                    `}</style>

                    {/* Corner accent */}
                    <span style={{
                      position: "absolute", top: "0", left: "0", width: "10px", height: "10px",
                      borderTop: `1px solid ${cfg.color}`, borderLeft: `1px solid ${cfg.color}`,
                      opacity: 0.8,
                    }} />

                    {/* Background glow */}
                    <div style={{
                      position: "absolute", top: 0, right: 0, width: "100px", height: "100px",
                      background: `radial-gradient(ellipse at top right, ${cfg.color}06 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }} />

                    {/* Type tag */}
                    <div style={{
                      display: "inline-flex", alignItems: "center",
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                      fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: cfg.color, border: `1px solid ${cfg.glow}`,
                      background: `${cfg.color}08`,
                      padding: "2px 8px", marginBottom: "14px",
                    }}>
                      {cfg.label}
                    </div>

                    {/* Account name */}
                    <h3 style={{
                      fontSize: "0.95rem", fontWeight: 700, color: "#E2E8F0",
                      letterSpacing: "-0.01em", marginBottom: "4px",
                    }}>
                      {account.name}
                    </h3>

                    {/* Account ID */}
                    <div style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
                      color: "#334155", letterSpacing: "0.04em", marginBottom: "16px",
                    }}>
                      ID_{account.id.slice(0, 10).toUpperCase()}
                    </div>

                    {/* Divider with meter */}
                    <div style={{ height: "1px", background: "#1E293B", marginBottom: "14px" }} />

                    {/* Balance */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
                        color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em",
                      }}>
                        CURRENT BALANCE
                      </span>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "1.1rem", fontWeight: 700,
                        color: isNeg ? "#F43F5E" : cfg.color,
                        textShadow: `0 0 12px ${isNeg ? "rgba(244,63,94,0.4)" : cfg.color + "40"}`,
                        letterSpacing: "-0.02em",
                      }}>
                        {formatINR(balance)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total balance summary */}
          {accounts.length > 0 && (
            <div style={{
              marginTop: "1px",
              background: "rgba(30,41,59,0.3)",
              border: "1px solid #1E293B",
              borderTop: "none",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
                color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                AGGREGATE PORTFOLIO BALANCE
              </span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "1rem", fontWeight: 700, color: "#3B82F6",
                textShadow: "0 0 12px rgba(59,130,246,0.4)",
              }}>
                {formatINR(accounts.reduce((sum, a) => {
                  const b = typeof a.balance === "string" ? parseFloat(a.balance) : a.balance;
                  return sum + (isNaN(b) ? 0 : b);
                }, 0))}
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}