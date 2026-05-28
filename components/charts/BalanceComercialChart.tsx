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

export function BalanceComercialChart() {
  const { data, filters, selectedProduct } = useDashboard();

  const chartData = useMemo(() => {
    const years = Array.from(new Set(data.map((d) => d.año))).sort((a, b) => a - b);
    const filteredYears = years.filter((y) => y >= filters.yearRange[0] && y <= filters.yearRange[1]);

    return filteredYears.map((año) => {
      const imp =
        data.find(
          (d) =>
            d.año === año &&
            d.concepto === "importaciones" &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      const exp =
        data.find(
          (d) =>
            d.año === año &&
            d.concepto === "exportaciones" &&
            d.producto?.toLowerCase() === selectedProduct
        )?.cantidad ?? 0;

      return {
        año,
        importaciones: imp,
        exportaciones: exp,
        balance: exp - imp,
      };
    }).filter((d) => d.importaciones > 0 || d.exportaciones > 0);
  }, [data, filters.yearRange, selectedProduct]);

  return (
    <ChartWrapper className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,37,75,0.08)" />
          <XAxis
            dataKey="año"
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
          />
          <YAxis
            stroke="var(--hairline-light-strong)"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline-light-strong)" }}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--white)",
              border: "1px solid var(--hairline-light-strong)",
              borderRadius: 2,
              color: "var(--text-dark)",
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 12,
              boxShadow: "var(--shadow-hover)",
            }}
            labelFormatter={(label) => `Año ${label}`}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const payloadData = payload[0].payload as { balance: number };
              const balance = payloadData.balance;
              const balanceText = balance >= 0 ? "Superávit" : "Déficit";
              return (
                <div
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--hairline-light-strong)",
                    borderRadius: 2,
                    padding: "8px 12px",
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 12,
                    boxShadow: "var(--shadow-hover)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, borderBottom: "1px solid var(--hairline-light)", paddingBottom: 4 }}>
                    {label}
                  </div>
                  {payload.map((entry) => (
                    <div key={String(entry.dataKey)} className="flex items-center gap-2 mb-1">
                      <span className="inline-block h-2 w-2 rounded-sm" style={{ background: entry.color }} />
                      <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
                      <span style={{ fontWeight: 600, color: "var(--navy-deep)" }}>
                        {Number(entry.value).toLocaleString("es-ES", { maximumFractionDigits: 0 })} t
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, paddingTop: 4, borderTop: "1px solid var(--hairline-light)", color: "var(--text-muted)" }}>
                    {balanceText}: <span style={{ fontWeight: 700, color: "var(--navy-deep)" }}>{Math.abs(balance).toLocaleString("es-ES", { maximumFractionDigits: 0 })} t</span>
                  </div>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, color: "var(--text-muted)" }}
            formatter={(value: string) => `${value} (T)`}
          />
          <Bar dataKey="importaciones" fill="#03488D" radius={[2, 2, 0, 0]} name="Importaciones" />
          <Bar dataKey="exportaciones" fill="#F8D227" radius={[2, 2, 0, 0]} name="Exportaciones" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
