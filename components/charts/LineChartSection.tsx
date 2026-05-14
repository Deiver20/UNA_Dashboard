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
  pollo: "#4f8ef7",
  huevo: "#f7c94f",
  pavo: "#f7734f",
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

  return (
    <div
      id="overview"
      className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-white font-heading">
          Evolución Temporal (1977–2025)
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="rounded-md border border-white/[0.06] bg-[#0f1628] px-3 py-1.5 text-sm text-[#e2e8f0] outline-none focus:border-[#4f8ef7]"
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
            className="rounded-md border border-white/[0.06] bg-[#0f1628] px-3 py-1.5 text-sm text-[#e2e8f0] outline-none focus:border-[#4f8ef7]"
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
              labelStyle={{ color: "#94a3b8" }}
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
