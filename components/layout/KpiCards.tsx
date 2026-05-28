"use client";

import { useDashboard } from "@/lib/filters";
import { Factory, UtensilsCrossed, ArrowRightLeft, TrendingUp } from "lucide-react";

export function KpiCards() {
  const { activeYear, selectedProduct, setSelectedProduct, kpiDeltas } = useDashboard();

  const productNames: Record<string, string> = {
    pollo: "Pollo",
    huevo: "Huevo",
    pavo: "Pavo",
  };

  const cards = [
    {
      key: "produccion",
      title: `Producción de ${productNames[selectedProduct]}`,
      unit: "ton",
      icon: Factory,
    },
    {
      key: "consumo",
      title: `Consumo de ${productNames[selectedProduct]}`,
      unit: "ton",
      icon: UtensilsCrossed,
    },
    {
      key: "consumo per capita",
      title: `Consumo per cápita ${productNames[selectedProduct]}`,
      unit: "kg/hab",
      icon: TrendingUp,
    },
    {
      key: "balance",
      title: "Balance comercial",
      unit: "ton",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className="flex-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <h2
          className="text-sm font-heading"
          style={{ color: "var(--navy-deep)", fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          Indicadores <em className="acc">{activeYear}</em>
        </h2>

        <div
          className="inline-flex p-0.5"
          style={{
            borderRadius: 2,
            border: "1px solid var(--hairline-light-ui)",
            background: "var(--white)",
          }}
        >
          {["pollo", "huevo", "pavo"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              aria-pressed={selectedProduct === p}
              className="transition-all"
              style={{
                borderRadius: 2,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "'Quicksand', sans-serif",
                background: selectedProduct === p ? "#06254B" : "transparent",
                color: selectedProduct === p ? "white" : "var(--text-muted)",
              }}
            >
              {productNames[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const delta = kpiDeltas[card.key];
          const isPositive = delta?.direction === "up";
          const isNegative = delta?.direction === "down";
          const deltaColor = isPositive ? "var(--success)" : isNegative ? "var(--warning)" : "var(--text-muted)";
          const arrow = isPositive ? "▲" : isNegative ? "▼" : "—";

          return (
            <div
              key={card.key}
              className="una-card"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-semibold uppercase"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "'Quicksand', sans-serif",
                    letterSpacing: "0.28em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      background: "var(--accent-yellow)",
                      display: "inline-block",
                      transform: "rotate(45deg)",
                      flexShrink: 0,
                    }}
                  />
                  {card.title}
                </span>
                <div
                  className="flex h-6 w-6 items-center justify-center"
                  style={{
                    backgroundColor: "var(--bg-light)",
                    borderRadius: 2,
                    color: "var(--navy-primary)",
                  }}
                >
                  <Icon className="h-3 w-3" style={{ strokeWidth: 1.6 }} />
                </div>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  className="font-heading text-lg sm:text-xl md:text-2xl"
                  style={{ color: "var(--navy-deep)", fontWeight: 500, letterSpacing: "-0.02em" }}
                >
                  {(delta?.value ?? 0).toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}
                >
                  {card.unit}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[10px] font-semibold" style={{ color: deltaColor, fontFamily: "'Quicksand', sans-serif" }}>
                  {arrow} {Math.abs(delta?.deltaPercent ?? 0).toFixed(1)}%
                </span>
                <span className="text-[9px]" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
                  vs anterior
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
