"use client";

import { useState, useMemo } from "react";
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
} from "recharts";

const PRODUCTOS_DISPONIBLES = ["pollo", "huevo", "pavo"];

const COLORS: Record<string, string> = {
  produccion: "#4f8ef7",
  consumo: "#34d399",
};

export function BarChartSection() {
  const { data } = useDashboard();
  const [producto, setProducto] = useState<string>("pollo");

  const chartData = useMemo(() => {
    const allYears = Array.from(new Set(data.map((d) => d.año))).sort(
      (a, b) => a - b
    );
    const last10 = allYears.slice(-10);

    return last10.map((año) => {
      const prod =
        data.find(
          (d) =>
            d.año === año &&
            d.concepto === "produccion" &&
            d.producto?.toLowerCase() === producto
        )?.cantidad ?? 0;

      const cons =
        data.find(
          (d) =>
            d.año === año &&
            d.concepto === "consumo" &&
            d.producto?.toLowerCase() === producto
        )?.cantidad ?? 0;

      return {
        año,
        Producción: prod,
        Consumo: cons,
      };
    });
  }, [data, producto]);

  return (
    <div
      id="produccion"
      className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-white font-heading">
          Producción vs Consumo — Últimos 10 años
        </h3>
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
      </div>

      <div className="h-80 w-full">
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
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: any) =>
                Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 })
              }
            />
            <Legend
              wrapperStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="Producción" fill={COLORS.produccion} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Consumo" fill={COLORS.consumo} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
