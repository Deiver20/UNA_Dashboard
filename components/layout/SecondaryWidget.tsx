"use client";

import { useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import { CONCEPT_LABELS } from "@/lib/filters";

const COLORS: Record<string, string> = {
  pollo: "#06254B",
  huevo: "#03488D",
  pavo: "#F8D227",
};

const ICON_PATHS: Record<string, string> = {
  pollo: "/gallina.png",
  huevo: "/huevo.png",
  pavo: "/pavo.png",
};
const ICON_SIZE = 36;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function SecondaryWidget() {
  const { data, activeYear, sectionFilters } = useDashboard();
  const overviewProductos = sectionFilters.overview.productos.map((p) => p.toLowerCase());
  const overviewConcept = sectionFilters.overview.sectionConcept;

  const chartData = useMemo(() => {
    const yearData = data.filter((d) => d.año === activeYear && d.concepto === overviewConcept && overviewProductos.includes(d.producto?.toLowerCase() ?? ""));
    const total = overviewProductos.reduce((sum, prod) => {
      return sum + (yearData.find((d) => d.producto === prod)?.cantidad ?? 0);
    }, 0);

    return overviewProductos.map((prod) => {
      const val = yearData.find((d) => d.producto === prod)?.cantidad ?? 0;
      return {
        name: prod.charAt(0).toUpperCase() + prod.slice(1),
        value: val,
        percent: total > 0 ? (val / total) * 100 : 0,
        key: prod,
      };
    });
  }, [data, activeYear, overviewProductos, overviewConcept]);

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const conceptLabel = CONCEPT_LABELS[overviewConcept] ?? overviewConcept;

  const cx = 100;
  const cy = 100;
  const radius = 80;
  const gap = 2;

  const slices = useMemo(() => {
    let currentAngle = 0;
    return chartData.map((item) => {
      const angle = (item.value / Math.max(total, 1)) * 360;
      const start = currentAngle + gap / 2;
      const end = currentAngle + angle - gap / 2;
      const mid = currentAngle + angle / 2;
      const midPoint = polarToCartesian(cx, cy, radius * 0.55, mid);
      const d = arcPath(cx, cy, radius, start, end);
      currentAngle += angle;
      return { ...item, d, midPoint };
    });
  }, [chartData, total]);

  return (
    <div className="una-card h-full flex flex-col">
      <div className="mb-2 shrink-0">
        <div className="section-eyebrow">DISTRIBUCIÓN</div>
        <h3
          className="text-base font-heading"
          style={{ color: "var(--navy-deep)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em" }}
        >
          Distribución del <em className="acc">{conceptLabel}</em>.
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {chartData.length > 0 && total > 0 ? (
          <>
            <div className="relative flex-1 min-h-[200px] sm:min-h-[250px] w-full flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-full w-auto max-w-full max-h-[320px]">
                {slices.map((slice) => (
                  <g key={slice.key}>
                    <path
                      d={slice.d}
                      fill={COLORS[slice.key]}
                      stroke="#ffffff"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      className="hover:brightness-110 cursor-pointer"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                    {slice.percent >= 8 && (
                      <>
                        <image
                          href={ICON_PATHS[slice.key]}
                          x={slice.midPoint.x - ICON_SIZE / 2}
                          y={slice.midPoint.y - ICON_SIZE / 2 - 6}
                          width={ICON_SIZE}
                          height={ICON_SIZE}
                          preserveAspectRatio="xMidYMid meet"
                        />
                        <text
                          x={slice.midPoint.x}
                          y={slice.midPoint.y + 18}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#fff"
                          pointerEvents="none"
                          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)", fontFamily: "'Quicksand', sans-serif" }}
                        >
                          {Math.round(slice.percent)}%
                        </text>
                      </>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            <div className="w-full shrink-0 space-y-1">
              {chartData.map((entry) => (
                <div key={entry.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[entry.key] }} />
                    <span className="text-[11px]" style={{ color: "var(--text-dark)", fontFamily: "'Quicksand', sans-serif" }}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium font-mono-numbers" style={{ color: "var(--navy-deep)" }}>
                    {entry.value.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
            Sin datos para el período seleccionado
          </div>
        )}
      </div>
    </div>
  );
}
