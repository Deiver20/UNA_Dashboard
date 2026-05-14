"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function PopulationChart() {
  const { filteredData } = useDashboard();

  const chartData = useMemo(() => {
    const data = filteredData
      .filter((d) => d.concepto === "poblacion")
      .sort((a, b) => a.año - b.año);

    return data.map((d) => ({
      año: d.año,
      Población: d.cantidad,
    }));
  }, [filteredData]);

  return (
    <div className="una-card" style={{ padding: "28px 28px 24px" }}>
      <h3 className="text-base font-semibold font-heading mb-1" style={{ color: "#06254B" }}>
        Población
      </h3>
      <p className="text-sm mb-4" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
        Evolución demográfica (miles de habitantes)
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,37,75,0.08)" />
            <XAxis
              dataKey="año"
              stroke="#5a6478"
              tick={{ fill: "#5a6478", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(6,37,75,0.10)" }}
            />
            <YAxis
              stroke="#5a6478"
              tick={{ fill: "#5a6478", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(6,37,75,0.10)" }}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}k`
                  : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(6,37,75,0.15)",
                borderRadius: 2,
                color: "#1C1C1C",
                boxShadow: "0 14px 36px rgba(6, 37, 75, 0.10)",
              }}
              formatter={(value: any) => [
                `${Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 })} mil hab.`,
                "Población",
              ]}
            />
            <Line
              type="monotone"
              dataKey="Población"
              stroke="#2e8b57"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#2e8b57", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
