"use client";

import { useDashboard } from "@/lib/filters";
import { Factory, UtensilsCrossed, ArrowRightLeft, TrendingUp } from "lucide-react";

export function KpiCards() {
  const { filteredData, activeYear, selectedProduct, setSelectedProduct } = useDashboard();

  const yearData = filteredData.filter((d) => d.año === activeYear);

  const produccion =
    yearData.find(
      (d) =>
        d.concepto === "produccion" &&
        d.producto?.toLowerCase() === selectedProduct
    )?.cantidad ?? 0;

  const consumo =
    yearData.find(
      (d) =>
        d.concepto === "consumo" && d.producto?.toLowerCase() === selectedProduct
    )?.cantidad ?? 0;

  const consumoPerCapita =
    yearData.find(
      (d) =>
        d.concepto === "consumo per capita" &&
        d.producto?.toLowerCase() === selectedProduct
    )?.cantidad ?? 0;

  const exportaciones =
    yearData.find(
      (d) =>
        d.concepto === "exportaciones" &&
        d.producto?.toLowerCase() === selectedProduct
    )?.cantidad ?? 0;

  const importaciones =
    yearData.find(
      (d) =>
        d.concepto === "importaciones" &&
        d.producto?.toLowerCase() === selectedProduct
    )?.cantidad ?? 0;

  const balanceComercial = exportaciones + importaciones;

  const productNames: Record<string, string> = {
    pollo: "Pollo",
    huevo: "Huevo",
    pavo: "Pavo",
  };

  const cards = [
    {
      title: `Producción de ${productNames[selectedProduct]}`,
      value: produccion,
      unit: "ton",
      icon: Factory,
      color: "#03488D",
    },
    {
      title: `Consumo de ${productNames[selectedProduct]}`,
      value: consumo,
      unit: "ton",
      icon: UtensilsCrossed,
      color: "#03488D",
    },
    {
      title: `Consumo per cápita ${productNames[selectedProduct]}`,
      value: consumoPerCapita,
      unit: "kg/hab",
      icon: TrendingUp,
      color: "#03488D",
    },
    {
      title: "Balance comercial",
      value: balanceComercial,
      unit: "ton",
      icon: ArrowRightLeft,
      color: "#03488D",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header de sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            className="text-base font-semibold font-heading"
            style={{ color: "#06254B" }}
          >
            Indicadores del año {activeYear}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
            Métricas principales por producto seleccionado
          </p>
        </div>

        {/* Segmented control */}
        <div
          className="inline-flex p-0.5 shrink-0"
          style={{
            borderRadius: 2,
            border: "1px solid rgba(6,37,75,0.15)",
            background: "white",
          }}
        >
          {["pollo", "huevo", "pavo"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              className="transition-all"
              style={{
                borderRadius: 2,
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "'Quicksand', sans-serif",
                background: selectedProduct === p ? "#06254B" : "transparent",
                color: selectedProduct === p ? "white" : "#5a6478",
              }}
            >
              {productNames[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="una-card"
              style={{ padding: "28px 28px 24px" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm"
                  style={{
                    color: "#5a6478",
                    fontFamily: "'Quicksand', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {card.title}
                </span>
                <div
                  className="flex h-9 w-9 items-center justify-center"
                  style={{
                    backgroundColor: "#F2F8FF",
                    borderRadius: 2,
                    color: card.color,
                  }}
                >
                  <Icon className="h-4 w-4" style={{ strokeWidth: 1.6 }} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span
                  className="text-2xl font-bold font-mono-numbers"
                  style={{ color: "#06254B", fontSize: 32 }}
                >
                  {card.value.toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}
                >
                  {card.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
