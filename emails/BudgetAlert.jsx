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
   WEALTHOS — Budget Alert Email
   Light brand styling · email-safe (solid colors, table-safe)
──────────────────────────────────────────────────────────── */

const fontStack = "'Inter', -apple-system, 'Segoe UI', sans-serif";

export default function BudgetAlert({
  userName = "there",
  percentUsed = "0.0",
  budgetAmount = "₹0.00",
  spentAmount = "₹0.00",
  remainingAmount = "₹0.00",
}) {
  const pct = Math.min(parseFloat(percentUsed) || 0, 100);
  const barColor = pct > 90 ? "#DC2626" : "#D97706";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#F2F2F2", margin: 0, padding: "32px 12px" }}>
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6E6E6",
            borderRadius: "24px",
            maxWidth: "560px",
            padding: "32px",
          }}
        >
          {/* Brand header */}
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tbody>
              <tr>
                <td width="36" style={{ verticalAlign: "middle" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      backgroundColor: "#F0492A",
                      color: "#FFFFFF",
                      fontFamily: fontStack,
                      fontWeight: 800,
                      fontSize: "14px",
                      textAlign: "center",
                      lineHeight: "28px",
                    }}
                  >
                    W
                  </div>
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <Text
                    style={{
                      fontFamily: fontStack,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0D0D0D",
                      margin: 0,
                    }}
                  >
                    WealthOS
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Alert banner */}
          <Section
            style={{
              backgroundColor: "rgba(240,73,42,0.06)",
              borderRadius: "12px",
              padding: "14px 18px",
              margin: "24px 0 20px",
            }}
          >
            <Heading
              style={{
                fontFamily: fontStack,
                fontSize: "18px",
                fontWeight: 700,
                color: "#F0492A",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              You&apos;ve used {percentUsed}% of your monthly budget
            </Heading>
          </Section>

          <Text
            style={{
              fontFamily: fontStack,
              fontSize: "14px",
              color: "#4D4D4D",
              margin: "0 0 24px",
              lineHeight: "1.6",
            }}
          >
            Hi {userName}, your spending this month has crossed the alert
            threshold. Here&apos;s where things stand:
          </Text>

          {/* Meter (nested divs — table-safe) */}
          <Section style={{ margin: "0 0 24px" }}>
            <div style={{ width: "100%", height: "10px", backgroundColor: "#E6E6E6", borderRadius: "999px" }}>
              <div style={{ width: `${pct}%`, height: "10px", backgroundColor: barColor, borderRadius: "999px" }} />
            </div>
            <Text
              style={{
                fontFamily: fontStack,
                fontSize: "12px",
                color: "#B3B3B3",
                textAlign: "right",
                margin: "6px 0 0",
              }}
            >
              {percentUsed}% used
            </Text>
          </Section>

          <Hr style={{ borderColor: "#E6E6E6", margin: "0 0 16px" }} />

          {/* Stat rows */}
          {[
            { label: "Monthly budget", value: budgetAmount, color: "#0D0D0D" },
            { label: "Spent so far", value: spentAmount, color: "#DC2626" },
            { label: "Remaining", value: remainingAmount, color: "#16A34A" },
          ].map((row) => (
            <Section key={row.label} style={{ margin: "0 0 12px" }}>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: fontStack,
                        fontSize: "13px",
                        color: "#4D4D4D",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      align="right"
                      style={{
                        fontFamily: fontStack,
                        fontSize: "15px",
                        fontWeight: 700,
                        color: row.color,
                      }}
                    >
                      {row.value}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          ))}

          <Hr style={{ borderColor: "#E6E6E6", margin: "16px 0 20px" }} />

          {/* CTA */}
          <Section style={{ textAlign: "center", margin: "0 0 20px" }}>
            <a
              href="https://wealth-tracker-blush.vercel.app/dashboard"
              style={{
                fontFamily: fontStack,
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#F0492A",
                borderRadius: "999px",
                padding: "12px 28px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Open your dashboard
            </a>
          </Section>

          <Text style={{ fontFamily: fontStack, fontSize: "12px", color: "#B3B3B3", margin: 0, textAlign: "center" }}>
            One alert per calendar month · adjust your budget any time from the dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
