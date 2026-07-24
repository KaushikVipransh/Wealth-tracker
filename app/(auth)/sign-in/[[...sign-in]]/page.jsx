import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        background: "var(--bg-sky)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="eyebrow">Welcome back</span>
          <h1 style={{ fontSize: "1.6rem", margin: "12px 0 6px" }}>Sign in to WealthOS</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Pick up right where you left off.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
