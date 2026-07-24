import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import DirectionalCursor from "./components/DirectionalCursor";
import "./globals.css";

// ── Load Inter via next/font (self-hosted, zero external @import) ──
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "WealthOS — Money tracking without the chaos",
  description:
    "Track accounts, spending, and budgets in one clean place. Built for everyday money, in INR.",
  keywords: "wealth tracker, financial dashboard, portfolio management, expense tracking, INR",
  openGraph: {
    title: "WealthOS — Money tracking without the chaos",
    description: "Track accounts, spending, and budgets in one clean place.",
    type: "website",
  },
};

// ── Clerk widgets themed to the light "Safe Harbor" system ──
const clerkAppearance = {
  variables: {
    colorPrimary: "#F0492A",
    colorText: "#17130F",
    colorTextSecondary: "#6E6A63",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#17130F",
    colorDanger: "#E0402F",
    colorSuccess: "#16A34A",
    borderRadius: "12px",
    fontFamily: "var(--font-inter), Inter, sans-serif",
  },
  elements: {
    card: {
      borderRadius: "24px",
      border: "1px solid #E9E5DE",
      boxShadow: "0 18px 40px rgba(20, 15, 10, 0.10)",
    },
    formButtonPrimary: {
      borderRadius: "999px",
      textTransform: "none",
      fontWeight: "600",
      backgroundColor: "#F0492A",
    },
    socialButtonsBlockButton: { borderRadius: "999px" },
    footerActionLink: { color: "#F0492A" },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen flex flex-col">
          <DirectionalCursor />

          <Navbar />

          <main className="flex-grow relative z-10">{children}</main>

          {/* Footer */}
          <footer
            style={{
              borderTop: "1px solid var(--border)",
              background: "var(--bg-page)",
              padding: "24px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              position: "relative",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-heading)",
                  letterSpacing: "-0.02em",
                }}
              >
                WealthOS
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Money tracking without the chaos
              </span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} WealthOS
            </span>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
