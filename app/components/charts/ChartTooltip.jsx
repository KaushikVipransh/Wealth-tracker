"use client";

import { formatINR } from "@/lib/utils";

/**
 * Shared Recharts custom tooltip — styled like a terminal card.
 * Works for both Pie (single entry) and Bar/Line (multi-series) charts.
 */
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      background: "#0D1420",
      border: "1px solid #1E293B",
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      {label && (
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
          color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase",
          marginBottom: "6px",
        }}>
          {label}
        </div>
      )}
      {payload.map((entry, idx) => (
        <div key={idx} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "16px", marginTop: idx === 0 ? 0 : "4px",
        }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem",
            color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{
              width: "7px", height: "7px", display: "inline-block",
              background: entry.payload?.fill || entry.color || entry.fill || "#3B82F6",
            }} />
            {entry.name}
          </span>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem",
            fontWeight: 700, color: "#E2E8F0",
          }}>
            {formatINR(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
