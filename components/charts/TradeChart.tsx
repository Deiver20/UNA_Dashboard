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
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

export function TradeChart({ concepto = "importaciones" }: { concepto?: string }) {
  const { filteredData, sectionFilters } = useDashboard();
  const productos = sectionFilters.comercio.productos.map((p) => p.toLowerCase());

  const PRODUCT_NAMES: Record<string, string> = {
    pollo: "Pollo",
    huevo: "Huevo",
    pavo: "Pavo",
  };

  const COLORS: Record<string, string> = {
    pollo: "#06254B",
    huevo: "#03488D",
    pavo: "#F8D227",
  };

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
  }, [filteredData, productos, concepto, sectionFilters.comercio.productos]);

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
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
            formatter={(value, name) => [
              Number(value ?? 0).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
              String(name),
            ]}
          />
          <Legend wrapperStyle={{ color: "var(--text-muted)" }} />
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
    </ChartWrapper>
  );
}
