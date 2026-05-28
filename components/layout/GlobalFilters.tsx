"use client";

import { useState } from "react";
import { useDashboard, SectionFilters } from "@/lib/filters";
import { getMinMaxYears } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { SECTION_CONCEPTS, SECTIONS_WITH_PRODUCT_SELECT, CONCEPT_LABELS } from "@/lib/filters";

export function GlobalFilters() {
  const { data, filters, setFilters, activeSection, selectedProduct, setSelectedProduct, activeSectionFilters, updateSectionFilters } = useDashboard();
  const [minYear, maxYear] = getMinMaxYears(data);

  const [yearStartInput, setYearStartInput] = useState(String(filters.yearRange[0]));
  const [yearEndInput, setYearEndInput] = useState(String(filters.yearRange[1]));

  const showProductToggles = ["overview", "consumo", "comercio"].includes(activeSection);
  const showProductSelect = SECTIONS_WITH_PRODUCT_SELECT.includes(activeSection);
  const showConceptFilter = ["overview", "comercio", "poblacion"].includes(activeSection);

  const conceptOptions = SECTION_CONCEPTS[activeSection] ?? [];

  const toggleProducto = (prod: string) => {
    const current = activeSectionFilters.productos;
    const newProductos = current.includes(prod)
      ? current.filter((p) => p !== prod)
      : [...current, prod];
    updateSectionFilters(activeSection, { productos: newProductos });
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

  const selectStyle: React.CSSProperties = {
    borderRadius: 2,
    border: "1px solid var(--hairline-light-ui)",
    background: "var(--white)",
    padding: "4px 10px",
    fontSize: 12,
    fontFamily: "'Quicksand', sans-serif",
    color: "var(--navy-deep)",
    outline: "none",
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    borderRadius: 2,
    padding: "6px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontFamily: "'Quicksand', sans-serif",
    background: isActive ? "#03488D" : "var(--white)",
    color: isActive ? "white" : "var(--text-muted)",
    border: isActive ? "1px solid #03488D" : "1px solid var(--hairline-light-ui)",
  });

  const labelStyle: React.CSSProperties = {
    color: "var(--text-muted)",
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: 12,
  };

  return (
    <div
      className="px-5 py-2"
      style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--hairline-light-strong)",
      }}
    >
      <div
        className="p-3"
        style={{
          borderRadius: 2,
          border: "1px solid var(--hairline-light)",
          background: "var(--white)",
          boxShadow: "var(--shadow-rest)",
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Izquierda: Productos toggles + Producto select */}
          <div className="flex flex-wrap items-center gap-3">
            {showProductToggles && (
              <div className="flex items-center gap-3">
                <span className="text-xs shrink-0" style={labelStyle}>Productos</span>
                <div className="flex flex-wrap gap-2">
                  {["pollo", "huevo", "pavo"].map((prod) => (
                    <button
                      key={prod}
                      onClick={() => toggleProducto(prod)}
                      className="transition-all"
                      style={tabStyle(activeSectionFilters.productos.includes(prod))}
                    >
                      {prod.charAt(0).toUpperCase() + prod.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showProductSelect && (
              <div className="flex items-center gap-3">
                <span className="text-xs shrink-0" style={labelStyle}>Producto</span>
                <div className="flex flex-wrap gap-2">
                  {["pollo", "huevo", "pavo"].map((prod) => (
                    <button
                      key={prod}
                      onClick={() => setSelectedProduct(prod)}
                      className="transition-all"
                      style={tabStyle(selectedProduct === prod)}
                    >
                      {prod.charAt(0).toUpperCase() + prod.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Centro: Concepto filter (Overview, Comercio, Población) */}
          {showConceptFilter && conceptOptions.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs shrink-0" style={labelStyle}>Concepto</span>
              {activeSection === "comercio" ? (
                <select value={activeSectionFilters.tradeConcept} onChange={(e) => updateSectionFilters(activeSection, { tradeConcept: e.target.value })} style={selectStyle}>
                  {conceptOptions.map((c) => (
                    <option key={c} value={c}>{CONCEPT_LABELS[c] ?? c}</option>
                  ))}
                </select>
              ) : (
                <select value={activeSectionFilters.sectionConcept} onChange={(e) => updateSectionFilters(activeSection, { sectionConcept: e.target.value })} style={selectStyle}>
                  {conceptOptions.map((c) => (
                    <option key={c} value={c}>{CONCEPT_LABELS[c] ?? c}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Derecha: Años */}
          <div className="flex items-center gap-3 flex-1 min-w-0 md:max-w-[500px]">
            <span className="text-xs shrink-0" style={labelStyle}>Años</span>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={yearStartInput}
              onChange={(e) => setYearStartInput(e.target.value)}
              onBlur={handleStartBlur}
              className="w-14 sm:w-16 px-2 py-1 text-xs text-center font-mono-numbers outline-none shrink-0"
              style={{
                borderRadius: 2,
                border: "1.5px solid var(--navy-primary)",
                background: "var(--white)",
                color: "var(--navy-deep)",
              }}
            />
            <div className="flex-1 px-1 min-w-[120px]">
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
              className="w-14 sm:w-16 px-2 py-1 text-xs text-center font-mono-numbers outline-none shrink-0"
              style={{
                borderRadius: 2,
                border: "1.5px solid var(--navy-primary)",
                background: "var(--white)",
                color: "var(--navy-deep)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
