"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/filters";
import { getMinMaxYears } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { RefreshCw } from "lucide-react";

export function GlobalFilters() {
  const { data, filters, setFilters } = useDashboard();
  const [minYear, maxYear] = getMinMaxYears(data);

  const [yearStartInput, setYearStartInput] = useState(String(filters.yearRange[0]));
  const [yearEndInput, setYearEndInput] = useState(String(filters.yearRange[1]));

  const toggleProducto = (prod: string) => {
    const newProductos = filters.productos.includes(prod)
      ? filters.productos.filter((p) => p !== prod)
      : [...filters.productos, prod];
    setFilters({ ...filters, productos: newProductos });
  };

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
    <div
      className="sticky z-40 px-6 py-4"
      style={{
        top: 76,
        background: "white",
        borderBottom: "1px solid rgba(6,37,75,0.10)",
      }}
    >
      <div
        className="p-4"
        style={{
          borderRadius: 2,
          border: "1px solid rgba(6,37,75,0.06)",
          background: "white",
          boxShadow: "0 2px 12px rgba(6, 37, 75, 0.04)",
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Productos */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs shrink-0"
              style={{
                color: "#5a6478",
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Productos
            </span>
            <div className="flex gap-2">
              {["pollo", "huevo", "pavo"].map((prod) => (
                <button
                  key={prod}
                  onClick={() => toggleProducto(prod)}
                  className="transition-all"
                  style={{
                    borderRadius: 2,
                    padding: "6px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: "'Quicksand', sans-serif",
                    background: filters.productos.includes(prod) ? "#03488D" : "white",
                    color: filters.productos.includes(prod) ? "white" : "#5a6478",
                    border: filters.productos.includes(prod)
                      ? "1px solid #03488D"
                      : "1px solid rgba(6,37,75,0.15)",
                  }}
                >
                  {prod.charAt(0).toUpperCase() + prod.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Años */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <span
              className="text-xs shrink-0"
              style={{
                color: "#5a6478",
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Años
            </span>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={yearStartInput}
              onChange={(e) => setYearStartInput(e.target.value)}
              onBlur={handleStartBlur}
              className="w-16 px-2 py-1 text-xs text-center font-mono-numbers outline-none"
              style={{
                borderRadius: 2,
                border: "1px solid rgba(6,37,75,0.15)",
                background: "white",
                color: "#06254B",
              }}
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
              className="w-16 px-2 py-1 text-xs text-center font-mono-numbers outline-none"
              style={{
                borderRadius: 2,
                border: "1px solid rgba(6,37,75,0.15)",
                background: "white",
                color: "#06254B",
              }}
            />
          </div>

          {/* Recargar */}
          <button
            onClick={() => window.location.reload()}
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
