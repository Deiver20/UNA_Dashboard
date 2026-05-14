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

const PRODUCTOS_DISPONIBLES = ["pollo", "huevo", "pavo"];
const PRODUCT_NAMES: Record<string, string> = {
  pollo: "Pollo",
  huevo: "Huevo",
  pavo: "Pavo",
};

export function CombinedChart() {
  const { filteredData, selectedProduct, setSelectedProduct } = useDashboard();

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

  const latestYear = chartData[chartData.length - 1];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white font-heading">
            Producción y Consumo
          </h3>
          <p className="text-sm text-[#94a3b8]">
            Producción, importaciones y consumo per cápita
          </p>
        </div>
        {/* Segmented control: estilo "vista/tabs", NO filtro */}
        <div className="inline-flex rounded-lg border border-white/[0.06] bg-[#0f1628] p-0.5 shrink-0">
          {PRODUCTOS_DISPONIBLES.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                selectedProduct === p
                  ? "bg-[#1a2240] text-[#4f8ef7] border border-[#4f8ef7]/25 shadow-sm"
                  : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              {PRODUCT_NAMES[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
              yAxisId="left"
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
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              domain={[0, Math.ceil(maxPerCapita * 1.2)]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a2240",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.5rem",
                color: "#e2e8f0",
              }}
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString("es-ES", {
                  maximumFractionDigits: name === "Consumo Per Cápita" ? 2 : 0,
                }),
                name,
              ]}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Bar
              yAxisId="left"
              dataKey="Producción"
              fill="#4f8ef7"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="Importaciones"
              fill="#f7c94f"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Consumo Per Cápita"
              stroke="#f7734f"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#f7734f", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {latestYear && (
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-[#0f1628] p-3">
          <div className="text-center">
            <p className="text-xs text-[#94a3b8]">Producción {latestYear.año}</p>
            <p className="text-sm font-bold text-[#4f8ef7] font-mono-numbers">
              {latestYear.Producción.toLocaleString("es-ES", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#94a3b8]">Importaciones {latestYear.año}</p>
            <p className="text-sm font-bold text-[#f7c94f] font-mono-numbers">
              {latestYear.Importaciones.toLocaleString("es-ES", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#94a3b8]">Per Cápita {latestYear.año}</p>
            <p className="text-sm font-bold text-[#f7734f] font-mono-numbers">
              {latestYear["Consumo Per Cápita"].toLocaleString("es-ES", {
                maximumFractionDigits: 2,
              })}{" "}
              kg
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
