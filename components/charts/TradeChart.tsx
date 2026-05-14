"use client";

import { useMemo, useState } from "react";
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

const COLORS: Record<string, string> = {
  pollo: "#4f8ef7",
  huevo: "#f7c94f",
  pavo: "#f7734f",
};

const PRODUCT_NAMES: Record<string, string> = {
  pollo: "Pollo",
  huevo: "Huevo",
  pavo: "Pavo",
};

const CONCEPTOS = [
  { value: "importaciones", label: "Importaciones" },
  { value: "exportaciones", label: "Exportaciones" },
];

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
  name: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  // Filter out zero values
  const filtered = payload.filter((p) => (p.value ?? 0) > 0);
  if (filtered.length === 0) return null;

  return (
    <div
      className="rounded-md px-3 py-2 text-xs"
      style={{
        backgroundColor: "#1a2240",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        color: "#e2e8f0",
      }}
    >
      <strong className="block mb-1 text-[#94a3b8]">{label}</strong>
      {filtered.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 py-0.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="flex-1">{item.name}</span>
          <span className="font-mono-numbers font-medium">
            {Number(item.value).toLocaleString("es-ES", {
              maximumFractionDigits: 0,
            })}{" "}
            t
          </span>
        </div>
      ))}
    </div>
  );
}

export function TradeChart() {
  const { filteredData, filters } = useDashboard();
  const [concepto, setConcepto] = useState<string>("importaciones");
  const productos = filters.productos.map((p) => p.toLowerCase());
  const conceptoLabel =
    CONCEPTOS.find((c) => c.value === concepto)?.label ?? concepto;

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
              d.concepto === concepto &&
              d.producto === prod
          )?.cantidad ?? 0;
        row[PRODUCT_NAMES[prod]] = val;
      }
      return row;
    });
  }, [filteredData, productos, concepto]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white font-heading mb-1">
            {conceptoLabel} por Producto
          </h3>
          <p className="text-sm text-[#94a3b8]">
            Evolución anual del comercio exterior
          </p>
        </div>
        <select
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          className="rounded-md border border-white/[0.06] bg-[#0f1628] px-3 py-1.5 text-sm text-[#e2e8f0] outline-none focus:border-[#4f8ef7] shrink-0"
        >
          {CONCEPTOS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
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
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            {productos.map((prod) => (
              <Bar
                key={prod}
                dataKey={PRODUCT_NAMES[prod]}
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
