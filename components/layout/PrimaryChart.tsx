"use client";

import { useDashboard } from "@/lib/filters";
import { CONCEPT_LABELS } from "@/lib/filters";
import { LineChartSection } from "@/components/charts/LineChartSection";
import { CombinedChart } from "@/components/charts/CombinedChart";
import { ConsumptionAreaChart } from "@/components/charts/ConsumptionAreaChart";
import { TradeChart } from "@/components/charts/TradeChart";
import { PopulationVsConceptChart } from "@/components/charts/PopulationVsConceptChart";
import { BalanceComercialChart } from "@/components/charts/BalanceComercialChart";
import { AvesPosturaChart } from "@/components/charts/AvesPosturaChart";

export function PrimaryChart() {
  const { activeSection, selectedProduct, sectionConcept, tradeConcept, filters } = useDashboard();

  const prodLabel = selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1);
  const conceptLabel = CONCEPT_LABELS[sectionConcept] ?? sectionConcept;
  const tradeLabel = CONCEPT_LABELS[tradeConcept] ?? tradeConcept;

  const titles: Record<string, { eyebrow: string; title: React.ReactNode; subtitle: string }> = {
    overview: {
      eyebrow: "EVOLUCIÓN TEMPORAL",
      title: <>Evolución Temporal de <em className="acc">{conceptLabel}</em> ({filters.yearRange[0]} – {filters.yearRange[1]}) (T).</>,
      subtitle: "Tendencias principales por producto y concepto",
    },
    produccion: {
      eyebrow: "PRODUCCIÓN",
      title: <>Producción y Consumo de <em className="acc">{prodLabel}</em>.</>,
      subtitle: "Comparativa anual del producto seleccionado",
    },
    consumo: {
      eyebrow: "CONSUMO",
      title: <>Consumo por <em className="acc">Producto</em> (T).</>,
      subtitle: "Evolución anual del consumo avícola",
    },
    comercio: {
      eyebrow: "COMERCIO EXTERIOR",
      title: <>{tradeLabel} de <em className="acc">{prodLabel}</em> (T).</>,
      subtitle: "Flujo comercial del producto seleccionado",
    },
    poblacion: {
      eyebrow: "DEMOGRAFÍA",
      title: <>{conceptLabel} de <em className="acc">{prodLabel}</em> vs Población.</>,
      subtitle: "Correlación entre indicador seleccionado y población",
    },
    "balance comercial": {
      eyebrow: "BALANCE COMERCIAL",
      title: <>Importaciones y Exportaciones de <em className="acc">{prodLabel}</em> (T).</>,
      subtitle: "Balance comercial anual por producto",
    },
    "aves de postura": {
      eyebrow: "AVES DE POSTURA",
      title: <>Aves de postura <em className="acc">(número de aves)</em>.</>,
      subtitle: "Evolución histórica del inventario de aves de postura",
    },
  };

  const meta = titles[activeSection] ?? titles.overview;

  const renderChart = () => {
    switch (activeSection) {
      case "overview":
        return <LineChartSection concepto={sectionConcept} />;
      case "produccion":
        return <CombinedChart />;
      case "consumo":
        return <ConsumptionAreaChart />;
      case "comercio":
        return <TradeChart concepto={tradeConcept} />;
      case "poblacion":
        return <PopulationVsConceptChart />;
      case "balance comercial":
        return <BalanceComercialChart />;
      case "aves de postura":
        return <AvesPosturaChart />;
      default:
        return <LineChartSection concepto={sectionConcept} />;
    }
  };

  return (
    <div className="una-card h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-2 sm:mb-3 shrink-0">
        <div className="min-w-0">
          <div className="section-eyebrow">{meta.eyebrow}</div>
          <h3
            className="text-base sm:text-lg font-heading leading-tight"
            style={{ color: "var(--navy-deep)", fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            {meta.title}
          </h3>
          <p className="text-xs mt-1 hidden sm:block" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
            {meta.subtitle}
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {renderChart()}
      </div>
    </div>
  );
}
