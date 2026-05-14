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
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <h3 className="text-base font-semibold text-white font-heading mb-1">
        Población
      </h3>
      <p className="text-sm text-[#94a3b8] mb-4">
        Evolución demográfica (miles de habitantes)
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="año"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
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
                backgroundColor: "#1a2240",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.5rem",
                color: "#e2e8f0",
              }}
              formatter={(value: any) => [
                `${Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 })} mil hab.`,
                "Población",
              ]}
            />
            <Line
              type="monotone"
              dataKey="Población"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
