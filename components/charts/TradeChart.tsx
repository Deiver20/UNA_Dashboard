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
  pollo: "#03488D",
  huevo: "#F8D227",
  pavo: "#06254B",
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

  const filtered = payload.filter((p) => (p.value ?? 0) > 0);
  if (filtered.length === 0) return null;

  return (
    <div
      className="px-3 py-2 text-xs"
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(6,37,75,0.15)",
        borderRadius: 2,
        boxShadow: "0 14px 36px rgba(6, 37, 75, 0.10)",
        color: "#1C1C1C",
      }}
    >
      <strong className="block mb-1" style={{ color: "#5a6478" }}>{label}</strong>
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold font-heading mb-1" style={{ color: "#06254B" }}>
            {conceptoLabel} por Producto
          </h3>
          <p className="text-sm" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
            Evolución anual del comercio exterior
          </p>
        </div>
        <select
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          style={selectStyle}
          className="shrink-0"
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
              stroke="rgba(6,37,75,0.08)"
            />
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
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#5a6478" }} />
            {productos.map((prod) => (
              <Bar
                key={prod}
                dataKey={PRODUCT_NAMES[prod]}
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
