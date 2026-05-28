"use client";

import { useDashboard } from "@/lib/filters";
import { Sparkles, Loader2 } from "lucide-react";

export function AiGenerateButton() {
  const { generateInsightsForSection, isGeneratingInsights } = useDashboard();

  return (
    <button
      onClick={generateInsightsForSection}
      disabled={isGeneratingInsights}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: "var(--navy-deep)",
        color: "#fff",
        borderRadius: 2,
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      {isGeneratingInsights ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Analizando datos...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generar Análisis con IA
        </>
      )}
    </button>
  );
}
