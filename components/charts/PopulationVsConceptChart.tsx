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
import { CONCEPT_LABELS } from "@/lib/filters";

const PRODUCT_COLORS: Record<string, string> = {
  pollo: "#06254B",
  huevo: "#03488D",
  pavo: "#F8D227",
};

export function PopulationVsConceptChart() {
  const { data, filters, selectedProduct, sectionFilters } = useDashboard();
  const sectionConcept = sectionFilters.poblacion.sectionConcept;
  const conceptLabel = CONCEPT_LABELS[sectionConcept] ?? sectionConcept;
  const prodLabel = selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1);

  const chartData = useMemo(() => {
    const years = Array.from(new Set(data.map((d) => d.año))).sort((a, b) => a - b);
    const filteredYears = years.filter((y) => y >= filters.yearRange[0] && y <= filters.yearRange[1]);

    return filteredYears.map((año) => {
      const conceptVal =
        data.find(
          (d) =>
            d.año === año &&
            d.concepto === sectionConcept &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      const popVal =
        data.find((d) => d.año === año && d.concepto === "poblacion" && d.producto === null)?.cantidad ?? 0;

      return {
        año,
        concepto: conceptVal,
        poblacion: popVal,
      };
    });
  }, [data, filters.yearRange, selectedProduct, sectionFilters.poblacion.sectionConcept]);

  const barColor = PRODUCT_COLORS[selectedProduct] ?? "#03488D";

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%" >
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(6,37,75,0.08)" />
          <XAxis
            dataKey="año"
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k` : String(v)
            }
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
            tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`}
            label={{
              value: "Población (M hab)",
              angle: 90,
              position: "insideRight",
              style: { fill: "var(--navy-primary)", fontSize: 10, fontFamily: "'Quicksand', sans-serif" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--white)",
              border: "1px solid var(--hairline-light-strong)",
              borderRadius: 6,
              color: "var(--text-dark)",
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              Number(value ?? 0).toLocaleString("es-ES", { maximumFractionDigits: 0 }),
              String(name) === "concepto" ? `${conceptLabel} de ${prodLabel}` : "Población (M de hab)",
            ]}
            labelFormatter={(label) => `Año ${label}`}
          />
          <Legend
            wrapperStyle={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: "var(--text-muted)" }}
            formatter={(value) =>
              value === "concepto" ? `${conceptLabel} de ${prodLabel}` : "Población (M de hab)"
            }
          />
          <Bar
            yAxisId="left"
            dataKey="concepto"
            fill={barColor}
            radius={[2, 2, 0, 0]}
            name="concepto"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="poblacion"
            stroke="#E8593C"
            strokeWidth={3}
            dot={{ r: 4, fill: "#E8593C", stroke: "#fff", strokeWidth: 2.5 }}
            activeDot={{ r: 6 }}
            name="poblacion"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
