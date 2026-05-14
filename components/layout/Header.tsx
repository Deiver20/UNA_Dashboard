"use client";

import { RefreshCw } from "lucide-react";
import { useDashboard } from "@/lib/filters";

export function Header() {
  const { activeYear, reloadFromFile } = useDashboard();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        height: 76,
        background: "white",
        borderBottom: "1px solid rgba(6,37,75,0.10)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:h-16 sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-0 gap-2 sm:gap-0" style={{ height: '100%' }}>
        {/* Título */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center shrink-0"
            style={{
              background: "#F2F8FF",
              borderRadius: 2,
              border: "1px solid rgba(6,37,75,0.06)",
            }}
          >
            <span
              className="font-bold text-sm"
              style={{ color: "#03488D", fontFamily: "'Playfair Display', serif" }}
            >
              AV
            </span>
          </div>
          <div className="min-w-0">
            <h1
              className="text-base sm:text-lg font-semibold tracking-tight truncate"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#06254B",
                fontWeight: 500,
              }}
            >
              Dashboard Avícola México
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>
              Producción y Consumo Avícola (1977–2025)
            </p>
          </div>
        </div>

        {/* Año activo + Recargar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: "#F2F8FF",
              borderRadius: 2,
              border: "1px solid rgba(6,37,75,0.06)",
            }}
          >
            <span className="text-xs" style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}>Año activo</span>
            <span
              className="text-sm font-bold font-mono-numbers"
              style={{ color: "#03488D" }}
            >
              {activeYear}
            </span>
          </div>

          <button
            onClick={reloadFromFile}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
            style={{
              borderRadius: 2,
              border: "1px solid rgba(6,37,75,0.15)",
              background: "white",
              color: "#06254B",
              fontFamily: "'Quicksand', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#06254B";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#06254B";
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Recargar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
