import { ClerkProvider } from "@clerk/nextjs";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

// ── Load fonts via next/font (self-hosted, zero external @import) ──
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "WealthOS — Financial Command Terminal",
  description: "Precision financial intelligence for multi-bank portfolio management and real-time ledger tracking.",
  keywords: "wealth tracker, financial dashboard, portfolio management, expense tracking, INR",
  openGraph: {
    title: "WealthOS — Financial Command Terminal",
    description: "Precision financial intelligence platform",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
        <body
          className="grid-bg min-h-screen flex flex-col"
          style={{ background: "#090D16", color: "#E2E8F0" }}
        >
          {/* Ambient glow layer */}
          <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            aria-hidden="true"
          >
            <div
              style={{
                position: "absolute",
                top: "-200px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "800px",
                height: "400px",
                background:
                  "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-100px",
                right: "-100px",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </div>

          <Navbar />

          <main className="flex-grow relative z-10">{children}</main>

          {/* Footer — Terminal status bar */}
          <footer
            style={{
              borderTop: "1px solid #1E293B",
              background: "rgba(9,13,22,0.95)",
              backdropFilter: "blur(12px)",
              padding: "12px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span
                className="status-live"
                style={{
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-jetbrains), monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#10B981",
                }}
              >
                <span className="status-live-dot" />
                SYSTEM NOMINAL
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: "#334155",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                DB_SYNC: LIVE · ENCRYPTION: AES-256 · LATENCY: &lt;1ms
              </span>
            </div>
            <span
              style={{
                fontSize: "0.6rem",
                fontFamily: "var(--font-jetbrains), monospace",
                color: "#334155",
                letterSpacing: "0.04em",
              }}
            >
              © {new Date().getFullYear()} WEALTHOS TERMINAL v2.1.0
            </span>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}