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
  pollo: "#03488D",
  huevo: "#F8D227",
  pavo: "#06254B",
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
    <div className="una-card" style={{ padding: "28px 28px 24px" }}>
      <h3 className="text-base font-semibold font-heading mb-1" style={{ color: "#06254B" }}>
        Balance Comercial
      </h3>
      <p className="text-sm mb-4" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
        Importaciones menos Exportaciones (toneladas)
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
            />
            <Legend wrapperStyle={{ color: "#5a6478" }} />
            <ReferenceLine y={0} stroke="#5a6478" strokeDasharray="3 3" />
            {productos.map((prod) => (
              <Bar
                key={prod}
                dataKey={prod}
                name={prod.charAt(0).toUpperCase() + prod.slice(1)}
                fill={COLORS[prod]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
