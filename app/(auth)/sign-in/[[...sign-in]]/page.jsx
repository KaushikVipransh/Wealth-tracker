import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        background: "#090D16",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Terminal header above Clerk box */}
        <div style={{
          textAlign: "center", marginBottom: "32px",
        }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
            color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            WEALTHOS · SECURE AUTHENTICATION GATEWAY
          </div>
          <h1 style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem",
            fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}>
            Operator Sign-In
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span className="status-live-dot" />
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
              color: "#10B981", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              AUTH SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* 🔐 Clerk's native drop-in security form component */}
        <SignIn />
      </div>
    </div>
  );
}