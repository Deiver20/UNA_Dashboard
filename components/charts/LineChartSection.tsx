"use client";

import { useState, useMemo } from "react";
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

const PRODUCTOS_DISPONIBLES = ["pollo", "huevo", "pavo"];
const CONCEPTOS_DISPONIBLES = [
  "produccion",
  "consumo",
  "importaciones",
  "exportaciones",
];

const COLORS: Record<string, string> = {
  pollo: "#03488D",
  huevo: "#F8D227",
  pavo: "#06254B",
};

export function LineChartSection() {
  const { data } = useDashboard();
  const [producto, setProducto] = useState<string>("pollo");
  const [concepto, setConcepto] = useState<string>("produccion");

  const chartData = useMemo(() => {
    const filtered = data.filter(
      (d) =>
        d.concepto === concepto &&
        d.producto?.toLowerCase() === producto
    );
    const grouped = new Map<number, number>();
    for (const d of filtered) {
      grouped.set(d.año, (grouped.get(d.año) ?? 0) + d.cantidad);
    }
    return Array.from(grouped.entries())
      .map(([año, cantidad]) => ({ año, cantidad }))
      .sort((a, b) => a.año - b.año);
  }, [data, producto, concepto]);

  const selectStyle: React.CSSProperties = {
    borderRadius: 2,
    border: "1px solid rgba(6,37,75,0.15)",
    background: "white",
    padding: "6px 12px",
    fontSize: 13,
    fontFamily: "'Quicksand', sans-serif",
    color: "#06254B",
    outline: "none",
  };

  return (
    <div className="una-card" style={{ padding: "28px 28px 24px" }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3
          className="text-base font-semibold font-heading"
          style={{ color: "#06254B" }}
        >
          Evolución Temporal (1977–2025)
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            style={selectStyle}
          >
            {PRODUCTOS_DISPONIBLES.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            style={selectStyle}
          >
            {CONCEPTOS_DISPONIBLES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-80 w-full">
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
              labelStyle={{ color: "#5a6478" }}
              formatter={(value: any) => [
                Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
                concepto.charAt(0).toUpperCase() + concepto.slice(1),
              ]}
            />
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke={COLORS[producto]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COLORS[producto], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
