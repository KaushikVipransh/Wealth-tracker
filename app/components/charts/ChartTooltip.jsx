"use client";

import { formatINR } from "@/lib/utils";

/**
 * Shared Recharts custom tooltip — light card styling.
 * Works for both Pie (single entry) and Bar/Line (multi-series) charts.
 */
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E9E5DE",
      borderRadius: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(20,15,10,0.12)",
    }}>
      {label && (
        <div style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#6E6A63",
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
            fontSize: "0.75rem",
            color: "#6E6A63",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "999px", display: "inline-block",
              background: entry.payload?.fill || entry.color || entry.fill || "#F0492A",
            }} />
            {entry.name}
          </span>
          <span style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "#17130F",
          }}>
            {formatINR(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
