"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

const TICK_STYLE = {
  fill: "#64748B",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 10,
};

/**
 * Monthly income vs expense bars — last 6 calendar months.
 * @param {{ data: Array<{ month: string, income: number, expense: number }> }} props
 */
export default function CashflowBars({ data }) {
  // ResponsiveContainer can't measure during SSR — render after client mount only
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const hasAnyVolume = data && data.some((d) => d.income > 0 || d.expense > 0);

  if (!hasAnyVolume) {
    return (
      <div style={{
        textAlign: "center", padding: "64px 24px",
        border: "1px dashed #1E293B", margin: "8px 0",
      }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
          color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          NO DATA — TIMELINE OFFLINE
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "260px" }}>
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={TICK_STYLE}
            axisLine={{ stroke: "#1E293B" }}
            tickLine={false}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v) =>
              v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.04)" }}
            content={<ChartTooltip />}
          />
          <Bar dataKey="income" name="INCOME" fill="#10B981" radius={[2, 2, 0, 0]} barSize={14} />
          <Bar dataKey="expense" name="EXPENSE" fill="#F43F5E" radius={[2, 2, 0, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
