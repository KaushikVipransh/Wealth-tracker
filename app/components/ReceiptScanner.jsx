"use client";

import { useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import { scanReceipt } from "../actions/transaction";

/* ────────────────────────────────────────────────────────────
   WEALTHOS — AI Receipt Scanner
   Drop a receipt photo → Gemini Vision → pre-filled form
──────────────────────────────────────────────────────────── */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_BYTES = 4 * 1024 * 1024;

export default function ReceiptScanner({ onScanComplete }) {
  const inputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  async function processFile(file) {
    setError(null);

    // Client-side pre-checks mirror the server action's validation
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported image format. Use JPEG, PNG, WEBP or HEIC.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Receipt image exceeds the 4MB limit.");
      return;
    }

    setScanning(true);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      const result = await scanReceipt(fd);
      if (result.success) {
        onScanComplete?.(result.data);
      } else {
        setError(result.error || "Receipt analysis failed.");
      }
    } catch (err) {
      console.error("❌ Scanner UI error:", err);
      setError("Unexpected scanner failure. Try again.");
    } finally {
      setScanning(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => processFile(e.target.files?.[0])}
      />

      {/* Drop zone */}
      <div
        onClick={() => !scanning && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!scanning) processFile(e.dataTransfer.files?.[0]);
        }}
        style={{
          border: `1px dashed ${scanning ? "#A78BFA" : dragOver ? "#3B82F6" : "#1E293B"}`,
          background: scanning
            ? "rgba(167,139,250,0.05)"
            : dragOver
              ? "rgba(59,130,246,0.06)"
              : "rgba(30,41,59,0.15)",
          padding: "16px",
          cursor: scanning ? "wait" : "pointer",
          display: "flex", alignItems: "center", gap: "12px",
          transition: "all 0.2s ease",
        }}
      >
        <ScanLine
          size={18}
          color={scanning ? "#A78BFA" : "#3B82F6"}
          style={scanning ? { animation: "pulse 1.2s ease-in-out infinite" } : undefined}
        />
        <div>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: scanning ? "#A78BFA" : "#94A3B8",
            marginBottom: "2px",
            animation: scanning ? "pulse 1.2s ease-in-out infinite" : undefined,
          }}>
            {scanning ? "ANALYZING RECEIPT VIA GEMINI VISION..." : "AI RECEIPT SCANNER"}
          </div>
          <div style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
            color: "#334155", letterSpacing: "0.04em",
          }}>
            {scanning ? "Extracting amount · merchant · category" : "Drop a receipt photo or click to browse · max 4MB"}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" style={{
          border: "1px solid rgba(244,63,94,0.35)",
          background: "rgba(244,63,94,0.06)",
          padding: "10px 14px",
          display: "flex", alignItems: "flex-start", gap: "10px",
          marginTop: "8px",
        }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
            fontWeight: 700, color: "#F43F5E", flexShrink: 0,
          }}>
            ERR://
          </span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#64748B" }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
