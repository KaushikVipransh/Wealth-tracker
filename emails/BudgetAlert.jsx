import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from "@react-email/components";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — Budget Threshold Alert Email
   Email-safe cyber terminal: solid colors, no gradients,
   monospace fallback stack (webfonts are unreliable in email)
──────────────────────────────────────────────────────────── */

const mono = '"Courier New", Courier, monospace';

export default function BudgetAlert({
  userName = "Operator",
  percentUsed = "0.0",
  budgetAmount = "₹0.00",
  spentAmount = "₹0.00",
  remainingAmount = "₹0.00",
}) {
  const pct = Math.min(parseFloat(percentUsed) || 0, 100);
  const barColor = pct > 90 ? "#F43F5E" : "#F59E0B";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#090D16", margin: 0, padding: "32px 12px" }}>
        <Container style={{
          backgroundColor: "#0D1420",
          border: "1px solid #1E293B",
          maxWidth: "520px",
          padding: "32px",
        }}>
          {/* Brand strip */}
          <Text style={{
            fontFamily: mono, fontSize: "11px", letterSpacing: "2px",
            color: "#3B82F6", textTransform: "uppercase", margin: "0 0 4px",
          }}>
            WEALTHOS // BUDGET SENTINEL
          </Text>

          <Heading style={{
            fontFamily: mono, fontSize: "20px", fontWeight: 700,
            color: barColor, margin: "12px 0 4px", lineHeight: "1.3",
          }}>
            ⚠ BUDGET THRESHOLD BREACHED — {percentUsed}%
          </Heading>

          <Text style={{ fontFamily: mono, fontSize: "13px", color: "#94A3B8", margin: "8px 0 24px" }}>
            {userName}, your monthly spending has crossed the alert threshold.
          </Text>

          {/* Meter (nested divs — table-safe, no box-shadow reliance) */}
          <Section style={{ margin: "0 0 24px" }}>
            <div style={{
              width: "100%", height: "8px",
              backgroundColor: "#1E293B",
            }}>
              <div style={{
                width: `${pct}%`, height: "8px",
                backgroundColor: barColor,
              }} />
            </div>
            <Text style={{
              fontFamily: mono, fontSize: "11px", color: "#64748B",
              textAlign: "right", margin: "6px 0 0",
            }}>
              {percentUsed}% CONSUMED
            </Text>
          </Section>

          <Hr style={{ borderColor: "#1E293B", margin: "0 0 16px" }} />

          {/* Stat rows */}
          {[
            { label: "MONTHLY BUDGET", value: budgetAmount, color: "#E2E8F0" },
            { label: "TOTAL SPENT", value: spentAmount, color: "#F43F5E" },
            { label: "REMAINING", value: remainingAmount, color: "#10B981" },
          ].map((row) => (
            <Section key={row.label} style={{ margin: "0 0 12px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{
                      fontFamily: mono, fontSize: "11px", color: "#64748B",
                      letterSpacing: "1px", textTransform: "uppercase",
                    }}>
                      {row.label}
                    </td>
                    <td align="right" style={{
                      fontFamily: mono, fontSize: "15px", fontWeight: 700, color: row.color,
                    }}>
                      {row.value}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          ))}

          <Hr style={{ borderColor: "#1E293B", margin: "16px 0" }} />

          <Text style={{ fontFamily: mono, fontSize: "11px", color: "#334155", margin: 0 }}>
            One alert per calendar month · adjust your budget from the WealthOS dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
