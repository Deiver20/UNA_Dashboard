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

  // Extraer combinaciones únicas producto+concepto de los datos
  const validCombinations = useMemo(() => {
    const combos = new Set<string>();
    data.forEach((row) => {
      const prod = row.producto ?? "null";
      combos.add(`${prod}|${row.concepto}`);
    });
    return combos;
  }, [data]);

  // Conceptos disponibles según producto seleccionado
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

  // Productos disponibles según concepto seleccionado
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
    // Si el concepto actual no es compatible con el nuevo producto, resetear concepto
    if (value && tableConcept && !validCombinations.has(`${value}|${tableConcept}`)) {
      setTableConcept("");
    }
    setPage(0);
  };

  const handleConceptChange = (value: string) => {
    setTableConcept(value);
    // Si el producto actual no es compatible con el nuevo concepto, resetear producto
    if (value && tableProduct && !validCombinations.has(`${tableProduct}|${value}`)) {
      setTableProduct("");
    }
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const yearMatch =
        row.año >= filters.yearRange[0] && row.año <= filters.yearRange[1];
      const conceptoMatch =
        tableConcept === "" || row.concepto === tableConcept;
      const productoMatch =
        tableProduct === "" ||
        row.producto === tableProduct ||
        row.producto === null;
      return yearMatch && conceptoMatch && productoMatch;
    });
  }, [data, filters.yearRange, tableProduct, tableConcept]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#1a2240] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-white font-heading">
          Datos Detallados
        </h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={tableProduct}
            onChange={(e) => handleProductChange(e.target.value)}
            className="rounded-md border border-white/[0.06] bg-[#0f1628] px-3 py-1.5 text-sm text-[#e2e8f0] outline-none focus:border-[#4f8ef7]"
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
            className="rounded-md border border-white/[0.06] bg-[#0f1628] px-3 py-1.5 text-sm text-[#e2e8f0] outline-none focus:border-[#4f8ef7]"
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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-[#94a3b8]">
              <th className="pb-3 pr-4 font-medium">Año</th>
              <th className="pb-3 pr-4 font-medium">Concepto</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium text-right">Cantidad</th>
              <th className="pb-3 font-medium">Unidades</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, idx) => (
                <tr
                  key={`${row.año}-${row.concepto}-${row.producto}-${idx}`}
                  className="border-b border-white/[0.04] transition-colors hover:bg-[#0f1628]/50"
                >
                  <td className="py-2.5 pr-4 text-[#e2e8f0] font-mono-numbers">
                    {row.año}
                  </td>
                  <td className="py-2.5 pr-4 capitalize text-[#e2e8f0]">
                    {row.concepto}
                  </td>
                  <td className="py-2.5 pr-4 text-[#e2e8f0]">
                    {row.producto ?? "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-[#e2e8f0] font-mono-numbers">
                    {row.cantidad.toLocaleString("es-ES", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2.5 text-[#94a3b8]">{row.unidades}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-[#94a3b8]"
                >
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#94a3b8]">
          Página {page + 1} de {pageCount || 1} — {filteredData.length} registros
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center rounded-md border border-white/[0.06] bg-[#0f1628] px-2.5 py-1.5 text-sm text-[#e2e8f0] hover:bg-[#1a2240] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex items-center rounded-md border border-white/[0.06] bg-[#0f1628] px-2.5 py-1.5 text-sm text-[#e2e8f0] hover:bg-[#1a2240] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
