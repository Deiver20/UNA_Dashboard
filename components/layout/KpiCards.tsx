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
      color: "#4f8ef7",
    },
    {
      title: `Consumo de ${productNames[selectedProduct]}`,
      value: consumo,
      unit: "ton",
      icon: UtensilsCrossed,
      color: "#4f8ef7",
    },
    {
      title: `Consumo per cápita ${productNames[selectedProduct]}`,
      value: consumoPerCapita,
      unit: "kg/hab",
      icon: TrendingUp,
      color: "#4f8ef7",
    },
    {
      title: "Balance comercial",
      value: balanceComercial,
      unit: "ton",
      icon: ArrowRightLeft,
      color: "#4f8ef7",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header de sección: título + selector de vista (no filtro) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white font-heading">
            Indicadores del año {activeYear}
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Métricas principales por producto seleccionado
          </p>
        </div>

        {/* Segmented control: estilo "vista/tabs", NO filtro */}
        <div className="inline-flex rounded-lg border border-white/[0.06] bg-[#0f1628] p-0.5 shrink-0">
          {["pollo", "huevo", "pavo"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                selectedProduct === p
                  ? "bg-[#1a2240] text-[#4f8ef7] border border-[#4f8ef7]/25 shadow-sm"
                  : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              {productNames[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5 transition-all hover:border-[#4f8ef7]/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#94a3b8]">{card.title}</span>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white font-mono-numbers">
                  {card.value.toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}
                </span>
                <span className="text-xs text-[#94a3b8]">{card.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
