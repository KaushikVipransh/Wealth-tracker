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
      setError("That file type isn't supported — use a JPEG, PNG, WEBP or HEIC image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over the 4MB limit — try a smaller photo.");
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
        setError(result.error || "We couldn't read that receipt — try another photo.");
      }
    } catch (err) {
      console.error("❌ Scanner UI error:", err);
      setError("Something went wrong — please try again.");
    } finally {
      setScanning(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ marginBottom: "18px" }}>
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
          border: `2px dashed ${scanning || dragOver ? "var(--brand)" : "var(--border-strong)"}`,
          background: scanning || dragOver ? "var(--brand-wash)" : "var(--bg-inset)",
          borderRadius: "16px",
          padding: "16px",
          cursor: scanning ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.2s ease",
        }}
      >
        <ScanLine
          size={20}
          color="var(--brand)"
          style={scanning ? { animation: "pulse-soft 1.2s ease-in-out infinite" } : undefined}
        />
        <div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: scanning ? "var(--brand)" : "var(--text-heading)",
              marginBottom: "2px",
            }}
          >
            {scanning ? "Reading your receipt…" : "Scan a receipt"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {scanning
              ? "Pulling out the amount, store and category"
              : "Drop a photo here or tap to upload · max 4MB"}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{
            background: "var(--expense-wash)",
            color: "var(--expense)",
            borderRadius: "12px",
            padding: "10px 14px",
            marginTop: "8px",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
