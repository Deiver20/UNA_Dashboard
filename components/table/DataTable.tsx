"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataTable() {
  const { data, filters } = useDashboard();
  const [page, setPage] = useState(0);
  const [tableProduct, setTableProduct] = useState("");
  const [tableConcept, setTableConcept] = useState("");
  const pageSize = 10;

  const validCombinations = useMemo(() => {
    const combos = new Set<string>();
    data.forEach((row) => {
      const prod = row.producto ?? "null";
      combos.add(`${prod}|${row.concepto}`);
    });
    return combos;
  }, [data]);

  const availableConcepts = useMemo(() => {
    const allConcepts = [
      { value: "", label: "Todos" },
      { value: "produccion", label: "Producción" },
      { value: "consumo", label: "Consumo" },
      { value: "importaciones", label: "Importaciones" },
      { value: "exportaciones", label: "Exportaciones" },
      { value: "poblacion", label: "Población" },
      { value: "consumo per capita", label: "Consumo per cápita" },
      { value: "aves de postura", label: "Aves de postura" },
    ];

    if (tableProduct === "") return allConcepts;

    return allConcepts.filter((c) => {
      if (c.value === "") return true;
      return validCombinations.has(`${tableProduct}|${c.value}`);
    });
  }, [validCombinations, tableProduct]);

  const availableProducts = useMemo(() => {
    const allProducts = [
      { value: "", label: "Todos" },
      { value: "pollo", label: "Pollo" },
      { value: "huevo", label: "Huevo" },
      { value: "pavo", label: "Pavo" },
    ];

    if (tableConcept === "") return allProducts;

    return allProducts.filter((p) => {
      if (p.value === "") return true;
      return validCombinations.has(`${p.value}|${tableConcept}`);
    });
  }, [validCombinations, tableConcept]);

  const handleProductChange = (value: string) => {
    setTableProduct(value);
    if (value && tableConcept && !validCombinations.has(`${value}|${tableConcept}`)) {
      setTableConcept("");
    }
    setPage(0);
  };

  const handleConceptChange = (value: string) => {
    setTableConcept(value);
    if (value && tableProduct && !validCombinations.has(`${tableProduct}|${value}`)) {
      setTableProduct("");
    }
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const yearMatch =
        row.año >= filters.yearRange[0] && row.año <= filters.yearRange[1];
      const conceptoMatch = tableConcept === "" || row.concepto === tableConcept;
      const productoMatch =
        tableProduct === "" || row.producto === tableProduct || row.producto === null;
      return yearMatch && conceptoMatch && productoMatch;
    });
  }, [data, filters.yearRange, tableProduct, tableConcept]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const selectStyle: React.CSSProperties = {
    borderRadius: 2,
    border: "1px solid rgba(6,37,75,0.15)",
    background: "white",
    padding: "6px 12px",
    fontSize: 13,
    fontFamily: "'Quicksand', sans-serif",
    color: "#06254B",
    outline: "none",
  };

  return (
    <div className="una-card" style={{ padding: "28px 28px 24px" }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3
          className="text-base font-semibold font-heading"
          style={{ color: "#06254B" }}
        >
          Datos Detallados
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={tableProduct}
            onChange={(e) => handleProductChange(e.target.value)}
            style={selectStyle}
          >
            {availableProducts.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            value={tableConcept}
            onChange={(e) => handleConceptChange(e.target.value)}
            style={selectStyle}
          >
            {availableConcepts.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(6,37,75,0.10)" }}>
              <th
                className="text-left pb-3 pr-4"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5a6478",
                }}
              >
                Año
              </th>
              <th
                className="text-left pb-3 pr-4"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5a6478",
                }}
              >
                Concepto
              </th>
              <th
                className="text-left pb-3 pr-4"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5a6478",
                }}
              >
                Producto
              </th>
              <th
                className="text-left pb-3 pr-4 text-right"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5a6478",
                }}
              >
                Cantidad
              </th>
              <th
                className="text-left pb-3"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5a6478",
                }}
              >
                Unidades
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, idx) => (
                <tr
                  key={`${row.año}-${row.concepto}-${row.producto}-${idx}`}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(6,37,75,0.06)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F2F8FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td
                    className="py-3 pr-4 font-mono-numbers"
                    style={{ color: "#06254B", fontSize: 14 }}
                  >
                    {row.año}
                  </td>
                  <td
                    className="py-3 pr-4 capitalize"
                    style={{ color: "#1C1C1C", fontSize: 14, fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {row.concepto}
                  </td>
                  <td
                    className="py-3 pr-4"
                    style={{ color: "#1C1C1C", fontSize: 14, fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {row.producto ?? "—"}
                  </td>
                  <td
                    className="py-3 pr-4 text-right font-mono-numbers"
                    style={{ color: "#06254B", fontSize: 14 }}
                  >
                    {row.cantidad.toLocaleString("es-ES", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className="py-3"
                    style={{ color: "#5a6478", fontSize: 14, fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {row.unidades}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm"
                  style={{ color: "#5a6478", fontFamily: "'Quicksand', sans-serif" }}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className="text-xs"
          style={{
            color: "#5a6478",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          Página {page + 1} de {pageCount || 1} — {filteredData.length} registros
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center px-2.5 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{
              borderRadius: 2,
              border: "1px solid rgba(6,37,75,0.15)",
              background: "white",
              color: "#06254B",
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex items-center px-2.5 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{
              borderRadius: 2,
              border: "1px solid rgba(6,37,75,0.15)",
              background: "white",
              color: "#06254B",
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
