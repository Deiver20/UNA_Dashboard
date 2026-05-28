"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartWrapper } from "./ChartWrapper";

export function CombinedChart() {
  const { filteredData, selectedProduct } = useDashboard();

  const chartData = useMemo(() => {
    const years = Array.from(new Set(filteredData.map((d) => d.año))).sort(
      (a, b) => a - b
    );

    return years.map((año) => {
      const prod =
        filteredData.find(
          (d) =>
            d.año === año &&
            d.concepto === "produccion" &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      const imp =
        filteredData.find(
          (d) =>
            d.año === año &&
            d.concepto === "importaciones" &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      const perCapita =
        filteredData.find(
          (d) =>
            d.año === año &&
            d.concepto === "consumo per capita" &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      return {
        año,
        Producción: prod,
        Importaciones: imp,
        "Consumo Per Cápita": perCapita,
      };
    });
  }, [filteredData, selectedProduct]);

  const maxPerCapita = useMemo(() => {
    return Math.max(...chartData.map((d) => d["Consumo Per Cápita"]), 1);
  }, [chartData]);

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%" >
        <ComposedChart
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
            yAxisId="left"
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
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--hairline-light-ui)"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-ui)" }}
            domain={[0, Math.ceil(maxPerCapita * 1.2)]}
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
              Number(value ?? 0).toLocaleString("es-ES", {
                maximumFractionDigits: name === "Consumo Per Cápita" ? 2 : 0,
              }),
              String(name),
            ]}
          />
          <Legend wrapperStyle={{ color: "var(--text-muted)" }} />
          <Bar
            yAxisId="left"
            dataKey="Producción"
            fill="#03488D"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="Importaciones"
            fill="#F8D227"
            radius={[2, 2, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Consumo Per Cápita"
            stroke="#06254B"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#06254B", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
