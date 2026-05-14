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

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    borderRadius: 2,
    padding: "6px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontFamily: "'Quicksand', sans-serif",
    background: isActive ? "#06254B" : "transparent",
    color: isActive ? "white" : "#5a6478",
  });

  return (
    <div className="una-card" style={{ padding: "28px 28px 24px" }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold font-heading" style={{ color: "#06254B" }}>
            Producción y Consumo
          </h3>
          <p className="text-sm" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
            Producción, importaciones y consumo per cápita
          </p>
        </div>
        <div
          className="inline-flex p-0.5 shrink-0"
          style={{
            borderRadius: 2,
            border: "1px solid rgba(6,37,75,0.15)",
            background: "white",
          }}
        >
          {PRODUCTOS_DISPONIBLES.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              className="transition-all"
              style={tabStyle(selectedProduct === p)}
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
              yAxisId="left"
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
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#5a6478"
              tick={{ fill: "#5a6478", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(6,37,75,0.10)" }}
              domain={[0, Math.ceil(maxPerCapita * 1.2)]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(6,37,75,0.15)",
                borderRadius: 2,
                color: "#1C1C1C",
                boxShadow: "0 14px 36px rgba(6, 37, 75, 0.10)",
              }}
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString("es-ES", {
                  maximumFractionDigits: name === "Consumo Per Cápita" ? 2 : 0,
                }),
                name,
              ]}
            />
            <Legend wrapperStyle={{ color: "#5a6478" }} />
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
      </div>

      {latestYear && (
        <div
          className="mt-4 grid grid-cols-3 gap-3 p-3"
          style={{
            borderRadius: 2,
            background: "#F2F8FF",
            border: "1px solid rgba(6,37,75,0.06)",
          }}
        >
          <div className="text-center">
            <p className="text-xs" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>Producción {latestYear.año}</p>
            <p className="text-sm font-bold font-mono-numbers" style={{ color: "#03488D" }}>
              {latestYear.Producción.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>Importaciones {latestYear.año}</p>
            <p className="text-sm font-bold font-mono-numbers" style={{ color: "#b85c00" }}>
              {latestYear.Importaciones.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>Per Cápita {latestYear.año}</p>
            <p className="text-sm font-bold font-mono-numbers" style={{ color: "#06254B" }}>
              {latestYear["Consumo Per Cápita"].toLocaleString("es-ES", { maximumFractionDigits: 2 })} kg
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
