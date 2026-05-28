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
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

const COLORS: Record<string, string> = {
  pollo: "#06254B",
  huevo: "#03488D",
  pavo: "#F8D227",
};

interface LineChartSectionProps {
  concepto?: string;
}

export function LineChartSection({ concepto = "produccion" }: LineChartSectionProps) {
  const { data, filters, sectionFilters } = useDashboard();
  const productos = sectionFilters.overview.productos.map((p) => p.toLowerCase());

  const chartData = useMemo(() => {
    const filtered = data.filter(
      (d) =>
        d.año >= filters.yearRange[0] &&
        d.año <= filters.yearRange[1] &&
        d.concepto === concepto
    );
    const grouped = new Map<number, Record<string, number>>();
    for (const d of filtered) {
      if (!d.producto) continue;
      const prod = d.producto.toLowerCase();
      if (!productos.includes(prod)) continue;
      if (!grouped.has(d.año)) grouped.set(d.año, {});
      const row = grouped.get(d.año)!;
      row[prod] = (row[prod] ?? 0) + d.cantidad;
    }
    return Array.from(grouped.entries())
      .map(([año, prods]) => ({ año, ...prods }))
      .sort((a, b) => a.año - b.año);
  }, [data, concepto, filters.yearRange, productos, sectionFilters.overview.productos]);

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline-light)" />
          <XAxis
            dataKey="año"
            stroke="var(--hairline-light-ui)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-ui)" }}
          />
          <YAxis
            stroke="var(--hairline-light-ui)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-ui)" }}
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
              backgroundColor: "var(--card)",
              border: "1px solid var(--hairline-light-ui)",
              borderRadius: 2,
              color: "var(--text-dark)",
              boxShadow: "var(--shadow-hover)",
            }}
            labelStyle={{ color: "var(--text-muted)" }}
            formatter={(value, name) => [
              Number(value ?? 0).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
              String(name).charAt(0).toUpperCase() + String(name).slice(1),
            ]}
          />
          <Legend
            wrapperStyle={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: "var(--text-muted)" }}
            formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          {productos.map((prod) => (
            <Line
              key={prod}
              type="monotone"
              dataKey={prod}
              stroke={COLORS[prod]}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COLORS[prod], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
