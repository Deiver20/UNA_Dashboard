"use client";

import { RefreshCw } from "lucide-react";
import { useDashboard } from "@/lib/filters";

export function Header() {
  const { activeYear, reloadFromFile } = useDashboard();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0f1628]/90 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:h-16 sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-0 gap-2 sm:gap-0">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4f8ef7]/10 shrink-0">
            <span className="text-[#4f8ef7] font-bold text-sm">AV</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight font-heading text-white truncate">
              Dashboard Avícola México
            </h1>
            <p className="text-xs text-[#94a3b8] hidden sm:block">
              Producción y Consumo Avícola (1977–2025)
            </p>
          </div>
        </div>

        {/* Año activo + Recargar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1a2240] border border-white/[0.06]">
            <span className="text-xs text-[#94a3b8]">Año activo</span>
            <span className="text-sm font-bold text-[#4f8ef7] font-mono-numbers">
              {activeYear}
            </span>
          </div>

          <button
            onClick={reloadFromFile}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.06] bg-[#1a2240] px-3 py-2 text-sm font-medium text-[#e2e8f0] hover:bg-[#253055] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Recargar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
