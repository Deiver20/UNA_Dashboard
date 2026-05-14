"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

const COLORS: Record<string, string> = {
  pollo: "#4f8ef7",
  huevo: "#f7c94f",
  pavo: "#f7734f",
};

export function BalanceChart() {
  const { filteredData, filters } = useDashboard();
  const productos = filters.productos.map((p) => p.toLowerCase());

  const chartData = useMemo(() => {
    const years = Array.from(new Set(filteredData.map((d) => d.año))).sort(
      (a, b) => a - b
    );

    return years.map((año) => {
      const row: Record<string, number | string> = { año };
      for (const prod of productos) {
        const imp =
          filteredData.find(
            (d) =>
              d.año === año &&
              d.concepto === "importaciones" &&
              d.producto === prod
          )?.cantidad ?? 0;
        const exp =
          filteredData.find(
            (d) =>
              d.año === año &&
              d.concepto === "exportaciones" &&
              d.producto === prod
          )?.cantidad ?? 0;
        row[prod] = imp - exp;
      }
      return row;
    });
  }, [filteredData, productos]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <h3 className="text-base font-semibold text-white font-heading mb-1">
        Balance Comercial
      </h3>
      <p className="text-sm text-[#94a3b8] mb-4">
        Importaciones menos Exportaciones (toneladas)
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            {productos.map((prod) => (
              <Bar
                key={prod}
                dataKey={prod}
                name={prod.charAt(0).toUpperCase() + prod.slice(1)}
                fill={COLORS[prod]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
