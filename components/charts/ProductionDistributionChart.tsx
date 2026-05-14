"use client";

import { useMemo, useState, useCallback } from "react";
import { useDashboard } from "@/lib/filters";

const COLORS: Record<string, string> = {
  pollo: "#03488D",
  huevo: "#F8D227",
  pavo: "#06254B",
};

const EMOJIS: Record<string, string> = {
  pollo: "🐔",
  huevo: "🥚",
  pavo: "🦃",
};

const CONCEPTOS_DISPONIBLES = [
  { value: "produccion", label: "Producción" },
  { value: "consumo", label: "Consumo" },
  { value: "importaciones", label: "Importaciones" },
  { value: "exportaciones", label: "Exportaciones" },
];

interface SliceData {
  name: string;
  value: number;
  key: string;
  color: string;
  emoji: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", cx, cy, "L", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y, "Z",
  ].join(" ");
}

export function ProductionDistributionChart() {
  const { filteredData, filters } = useDashboard();
  const productos = filters.productos.map((p) => p.toLowerCase());
  const [concepto, setConcepto] = useState<string>("produccion");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    pct: string;
  }>({ visible: false, x: 0, y: 0, name: "", pct: "" });

  const lastYear = filters.yearRange[1];

  const chartData = useMemo(() => {
    const result: SliceData[] = productos
      .map((prod) => {
        const value = filteredData
          .filter(
            (d) =>
              d.concepto === concepto &&
              d.producto === prod &&
              d.año === lastYear
          )
          .reduce((sum, d) => sum + d.cantidad, 0);
        return {
          name: prod.charAt(0).toUpperCase() + prod.slice(1),
          value,
          key: prod,
          color: COLORS[prod],
          emoji: EMOJIS[prod],
        };
      })
      .filter((d) => d.value > 0);
    return result;
  }, [filteredData, productos, concepto, lastYear]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const slices = useMemo(() => {
    const CX = 200;
    const CY = 200;
    const RADIUS = 150;
    const GAP = 2;

    let currentAngle = 0;
    return chartData.map((item) => {
      const sliceAngle = (item.value / total) * 360;
      const startAngle = currentAngle + GAP / 2;
      const endAngle = currentAngle + sliceAngle - GAP / 2;
      const midAngle = currentAngle + sliceAngle / 2;
      const centerRadius = RADIUS * 0.55;
      const centerPoint = polarToCartesian(CX, CY, centerRadius, midAngle);

      const d = describeArc(CX, CY, RADIUS, startAngle, endAngle);

      currentAngle += sliceAngle;

      return {
        ...item,
        d,
        cx: centerPoint.x,
        cy: centerPoint.y,
        showEmoji: sliceAngle >= 30,
        showPercent: sliceAngle >= 15,
      };
    });
  }, [chartData, total]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, item: SliceData) => {
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
      setTooltip({
        visible: true,
        x: e.clientX + 15,
        y: e.clientY + 15,
        name: item.name,
        pct,
      });
    },
    [total]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    setHoveredKey(null);
  }, []);

  const conceptoLabel =
    CONCEPTOS_DISPONIBLES.find((c) => c.value === concepto)?.label ?? concepto;

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
            Distribución de {conceptoLabel} en {lastYear}
          </h3>
          <p className="text-sm" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
            Participación por producto (toneladas del año)
          </p>
        </div>
        <select
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          style={selectStyle}
          className="shrink-0"
        >
          {CONCEPTOS_DISPONIBLES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico + Leyenda */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Gráfico SVG */}
        <div className="relative w-full max-w-[320px] mx-auto lg:mx-0 shrink-0">
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto block"
            style={{ filter: "drop-shadow(0 2px 4px rgba(6,37,75,0.08))" }}
          >
            {slices.map((slice) => (
              <g
                key={slice.key}
                className="cursor-pointer transition-all duration-200"
                style={{
                  opacity: hoveredKey && hoveredKey !== slice.key ? 0.6 : 1,
                  filter: hoveredKey === slice.key ? "brightness(1.1)" : "none",
                }}
                onMouseEnter={() => setHoveredKey(slice.key)}
                onMouseMove={(e) => handleMouseMove(e, slice)}
                onMouseLeave={handleMouseLeave}
              >
                <path
                  d={slice.d}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {slice.showEmoji && (
                  <text
                    x={slice.cx}
                    y={slice.cy - 6}
                    textAnchor="middle"
                    fontSize="48"
                    pointerEvents="none"
                  >
                    {slice.emoji}
                  </text>
                )}
                {slice.showPercent && (
                  <text
                    x={slice.cx}
                    y={slice.showEmoji ? slice.cy + 26 : slice.cy + 6}
                    textAnchor="middle"
                    className="font-mono-numbers"
                    fontSize="14"
                    fontWeight="700"
                    fill="#ffffff"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                    pointerEvents="none"
                  >
                    {((slice.value / total) * 100).toFixed(1)}%
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Resumen valores */}
        <div className="flex-1 space-y-3">
          {chartData.map((item) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 px-3 cursor-pointer transition-all"
                style={{
                  borderRadius: 2,
                  border: "1px solid rgba(6,37,75,0.06)",
                  background: "#F2F8FF",
                }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-4 w-4 shrink-0"
                    style={{
                      backgroundColor: item.color,
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-sm font-medium" style={{ color: "#06254B", fontFamily: "'Quicksand', sans-serif" }}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono-numbers block" style={{ color: "#06254B" }}>
                    {item.value.toLocaleString("es-ES", { maximumFractionDigits: 0 })} t
                  </span>
                  <span className="text-xs" style={{ color: "#5a6478" }}>{pct}%</span>
                </div>
              </div>
            );
          })}
          <div className="pt-3" style={{ borderTop: "1px solid rgba(6,37,75,0.10)" }}>
            <div className="flex justify-between px-3">
              <span className="text-sm" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>Total</span>
              <span className="text-sm font-bold font-mono-numbers" style={{ color: "#06254B" }}>
                {total.toLocaleString("es-ES", { maximumFractionDigits: 0 })} t
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 text-xs pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "white",
            border: "1px solid rgba(6,37,75,0.15)",
            borderRadius: 2,
            boxShadow: "0 14px 36px rgba(6, 37, 75, 0.10)",
            color: "#1C1C1C",
          }}
        >
          <strong className="block mb-0.5" style={{ color: "#06254B" }}>{tooltip.name}</strong>
          <span style={{ color: "#5a6478" }}>{tooltip.pct}% del total</span>
        </div>
      )}
    </div>
  );
}
