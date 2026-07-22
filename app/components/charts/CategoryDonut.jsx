"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { formatINR } from "@/lib/utils";

const CATEGORY_COLORS = {
  FOOD: "#F43F5E",
  SHOPPING: "#F59E0B",
  ENTERTAINMENT: "#A78BFA",
  UTILITIES: "#38BDF8",
  INVESTMENT: "#10B981",
  SALARY: "#34D399",
  OTHERS: "#64748B",
};

/**
 * Category spend distribution donut.
 * @param {{ data: Array<{ name: string, value: number }> }} props — categoryBreakdown shape
 */
export default function CategoryDonut({ data }) {
  // ResponsiveContainer can't measure during SSR — render after client mount only
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "64px 24px",
        border: "1px dashed #1E293B", margin: "8px 0",
      }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
          color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          NO DATA — DISTRIBUTION OFFLINE
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      {/* Sized wrapper — ResponsiveContainer requires an explicit-height parent */}
      <div style={{ position: "relative", width: "100%", height: "260px" }}>
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              stroke="#090D16"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.OTHERS}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        )}

        {/* Absolute-centered total readout */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.5rem",
            color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            TOTAL VOLUME
          </span>
          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem",
            fontWeight: 700, color: "#3B82F6",
            textShadow: "0 0 12px rgba(59,130,246,0.4)",
          }}>
            {formatINR(total)}
          </span>
        </div>
      </div>

      {/* Legend as terminal tags */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px",
        marginTop: "16px", justifyContent: "center",
      }}>
        {data.map((entry) => (
          <span key={entry.name} style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem",
            fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.OTHERS,
            border: "1px solid #1E293B", background: "rgba(30,41,59,0.4)",
            padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "5px",
          }}>
            <span style={{
              width: "6px", height: "6px",
              background: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.OTHERS,
            }} />
            {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
}
