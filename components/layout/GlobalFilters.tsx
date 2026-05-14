"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/filters";
import { getMinMaxYears } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { RefreshCw } from "lucide-react";

export function GlobalFilters() {
  const { data, filters, setFilters } = useDashboard();
  const [minYear, maxYear] = getMinMaxYears(data);

  // Estado local para inputs de año (strings para permitir edición libre)
  const [yearStartInput, setYearStartInput] = useState(String(filters.yearRange[0]));
  const [yearEndInput, setYearEndInput] = useState(String(filters.yearRange[1]));

  const toggleProducto = (prod: string) => {
    const newProductos = filters.productos.includes(prod)
      ? filters.productos.filter((p) => p !== prod)
      : [...filters.productos, prod];
    setFilters({ ...filters, productos: newProductos });
  };

  // Solo actualiza el contexto global al soltar el thumb (no durante el arrastre)
  const handleSliderCommit = (value: number | readonly number[]) => {
    const arr = Array.isArray(value) ? value : [value];
    if (arr.length >= 2) {
      setFilters({ ...filters, yearRange: [arr[0], arr[1]] as [number, number] });
      setYearStartInput(String(arr[0]));
      setYearEndInput(String(arr[1]));
    }
  };

  const handleStartBlur = () => {
    const parsed = parseInt(yearStartInput, 10);
    if (!isNaN(parsed)) {
      const v = Math.max(minYear, Math.min(parsed, filters.yearRange[1]));
      setFilters({ ...filters, yearRange: [v, filters.yearRange[1]] });
      setYearStartInput(String(v));
    } else {
      setYearStartInput(String(filters.yearRange[0]));
    }
  };

  const handleEndBlur = () => {
    const parsed = parseInt(yearEndInput, 10);
    if (!isNaN(parsed)) {
      const v = Math.max(filters.yearRange[0], Math.min(parsed, maxYear));
      setFilters({ ...filters, yearRange: [filters.yearRange[0], v] });
      setYearEndInput(String(v));
    } else {
      setYearEndInput(String(filters.yearRange[1]));
    }
  };

  return (
    <div className="sticky top-16 z-40 px-6 py-4 border-b border-white/[0.06] bg-[#0f1628]/95 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Productos */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94a3b8] shrink-0">Productos</span>
            <div className="flex gap-2">
              {["pollo", "huevo", "pavo"].map((prod) => (
                <button
                  key={prod}
                  onClick={() => toggleProducto(prod)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.productos.includes(prod)
                      ? "bg-[#4f8ef7] text-white"
                      : "bg-[#0f1628] text-[#94a3b8] border border-white/[0.06] hover:text-white"
                  }`}
                >
                  {prod.charAt(0).toUpperCase() + prod.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Años */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <span className="text-xs text-[#94a3b8] shrink-0">Años</span>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={yearStartInput}
              onChange={(e) => setYearStartInput(e.target.value)}
              onBlur={handleStartBlur}
              className="w-16 rounded-md border border-white/[0.06] bg-[#0f1628] px-2 py-1 text-xs text-[#e2e8f0] text-center font-mono-numbers outline-none focus:border-[#4f8ef7]"
            />
            <div className="flex-1 px-2">
              <Slider
                value={filters.yearRange}
                min={minYear}
                max={maxYear}
                step={1}
                onValueCommitted={handleSliderCommit}
                className="w-full"
              />
            </div>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={yearEndInput}
              onChange={(e) => setYearEndInput(e.target.value)}
              onBlur={handleEndBlur}
              className="w-16 rounded-md border border-white/[0.06] bg-[#0f1628] px-2 py-1 text-xs text-[#e2e8f0] text-center font-mono-numbers outline-none focus:border-[#4f8ef7]"
            />
          </div>

          {/* Recargar */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.06] bg-[#1a2240] px-3 py-2 text-sm font-medium text-[#e2e8f0] hover:bg-[#253055] transition-colors"
            title="Recargar página"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Recargar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
