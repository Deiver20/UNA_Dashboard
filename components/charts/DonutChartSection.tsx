"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS: Record<string, string> = {
  pollo: "#4f8ef7",
  huevo: "#f7c94f",
  pavo: "#f7734f",
};

export function DonutChartSection() {
  const { data, activeYear, setActiveYear } = useDashboard();

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(data.filter((d) => d.concepto === "consumo").map((d) => d.año))
    ).sort((a, b) => a - b);
    return years;
  }, [data]);

  const chartData = useMemo(() => {
    const yearData = data.filter(
      (d) => d.año === activeYear && d.concepto === "consumo"
    );

    const result = ["pollo", "huevo", "pavo"].map((prod) => {
      const value =
        yearData.find((d) => d.producto?.toLowerCase() === prod)?.cantidad ?? 0;
      return {
        name: prod.charAt(0).toUpperCase() + prod.slice(1),
        value,
        key: prod,
      };
    }).filter((d) => d.value > 0);

    return result;
  }, [data, activeYear]);

  return (
    <div
      id="consumo"
      className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white font-heading">
          Distribución del Consumo Total
        </h3>
        <p className="text-sm text-[#94a3b8]">
          Pollo, Huevo y Pavo — Año seleccionable
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-72 w-full lg:w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a2240",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0.5rem",
                  color: "#e2e8f0",
                }}
                formatter={(value: any) =>
                  Number(value).toLocaleString("es-ES", { maximumFractionDigits: 0 })
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-1/3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Año</span>
            <span className="text-lg font-bold text-[#4f8ef7] font-mono-numbers">
              {activeYear}
            </span>
          </div>

          <input
            type="range"
            min={availableYears[0] ?? 1977}
            max={availableYears[availableYears.length - 1] ?? 2025}
            step={1}
            value={activeYear}
            onChange={(e) => setActiveYear(Number(e.target.value))}
            className="w-full accent-[#4f8ef7]"
          />

          <div className="flex justify-between text-xs text-[#94a3b8]">
            <span>{availableYears[0] ?? 1977}</span>
            <span>{availableYears[availableYears.length - 1] ?? 2025}</span>
          </div>

          <div className="mt-2 space-y-2">
            {chartData.map((entry) => (
              <div key={entry.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[entry.key] }}
                  />
                  <span className="text-sm text-[#e2e8f0]">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-[#e2e8f0] font-mono-numbers">
                  {entry.value.toLocaleString("es-ES", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
