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
  Legend,
} from "recharts";

const COLORS: Record<string, string> = {
  pollo: "#4f8ef7",
  huevo: "#f7c94f",
  pavo: "#f7734f",
};

export function PerCapitaChart() {
  const { filteredData, filters } = useDashboard();
  const productos = filters.productos.map((p) => p.toLowerCase());

  const chartData = useMemo(() => {
    const years = Array.from(new Set(filteredData.map((d) => d.año))).sort(
      (a, b) => a - b
    );

    return years.map((año) => {
      const row: Record<string, number | string> = { año };
      for (const prod of productos) {
        const val =
          filteredData.find(
            (d) =>
              d.año === año &&
              d.concepto === "consumo per capita" &&
              d.producto === prod
          )?.cantidad ?? 0;
        row[prod] = val;
      }
      return row;
    });
  }, [filteredData, productos]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <h3 className="text-base font-semibold text-white font-heading mb-1">
        Consumo Per Cápita
      </h3>
      <p className="text-sm text-[#94a3b8] mb-4">
        Evolución por producto (kg/habitante)
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a2240",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.5rem",
                color: "#e2e8f0",
              }}
              formatter={(value: any, name: any) => [
                `${Number(value).toLocaleString("es-ES", { maximumFractionDigits: 2 })} kg`,
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            {productos.map((prod) => (
              <Line
                key={prod}
                type="monotone"
                dataKey={prod}
                name={prod.charAt(0).toUpperCase() + prod.slice(1)}
                stroke={COLORS[prod]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLORS[prod], strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
