"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { formatINR } from "@/lib/utils";

const CATEGORY_COLORS = {
  FOOD: "#E11D48",
  SHOPPING: "#D97706",
  ENTERTAINMENT: "#7C3AED",
  UTILITIES: "#0284C7",
  INVESTMENT: "#059669",
  SALARY: "#16A34A",
  OTHERS: "#475569",
};

// "FOOD" → "Food"
const label = (name) => name.charAt(0) + name.slice(1).toLowerCase();

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
        border: "1px dashed #D9D4CB", borderRadius: "16px",
      }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#6E6A63" }}>
          No spending yet
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
              stroke="#FFFFFF"
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
          <span style={{ fontSize: "0.7rem", color: "#A29C92", marginBottom: "4px" }}>
            Total spent
          </span>
          <span style={{
            fontSize: "1rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "#17130F",
          }}>
            {formatINR(total)}
          </span>
        </div>
      </div>

      {/* Legend as pills */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "6px",
        marginTop: "16px", justifyContent: "center",
      }}>
        {data.map((entry) => {
          const color = CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.OTHERS;
          return (
            <span key={entry.name} style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color,
              background: `${color}14`,
              borderRadius: "999px",
              padding: "3px 10px",
              display: "inline-flex", alignItems: "center", gap: "5px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: color }} />
              {label(entry.name)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
