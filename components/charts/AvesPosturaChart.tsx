"use client";

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
import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import { ChartWrapper } from "./ChartWrapper";

export function AvesPosturaChart() {
  const { data, filters } = useDashboard();

  const chartData = useMemo(() => {
    const years = Array.from(new Set(data.map((d) => d.año))).sort((a, b) => a - b);
    const filteredYears = years.filter((y) => y >= filters.yearRange[0] && y <= filters.yearRange[1]);

    return filteredYears.map((año) => {
      const val = data.find(
        (d) => d.año === año && d.concepto === "aves de postura"
      )?.cantidad ?? 0;
      return { año, cantidad: val };
    }).filter((d) => d.cantidad > 0);
  }, [data, filters.yearRange]);

  const totalYears = chartData.length;
  const labelSkip = totalYears <= 10 ? 1 : totalYears <= 20 ? 2 : totalYears <= 30 ? 5 : 10;

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(6,37,75,0.08)" />
          <XAxis
            dataKey="año"
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
            interval={labelSkip - 1}
          />
          <YAxis
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
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
              backgroundColor: "var(--white)",
              border: "1px solid var(--hairline-light-strong)",
              borderRadius: 6,
              color: "var(--text-dark)",
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12,
              boxShadow: "var(--shadow-hover)",
            }}
            labelFormatter={(label) => `Año ${label}`}
            formatter={(value) => [
              Number(value ?? 0).toLocaleString("es-MX"),
              "Aves de postura",
            ]}
          />
          <Legend
            wrapperStyle={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: "var(--text-muted)" }}
          />
          <Bar
            dataKey="cantidad"
            fill="#03488D"
            radius={[2, 2, 0, 0]}
            name="Huevo (número de aves)"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
