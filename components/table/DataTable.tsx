"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/lib/filters";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, TrendingUp, TrendingDown, Minus } from "lucide-react";

type SortKey = "año" | "cantidad" | null;
type SortDir = "asc" | "desc";

function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface SortIconProps {
  colKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}

function SortIcon({ colKey, sortKey, sortDir }: SortIconProps) {
  if (sortKey !== colKey) return <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: "var(--text-muted)", opacity: 0.5 }} />;
  return sortDir === "asc" ? (
    <ArrowUp className="h-3 w-3 ml-1 inline" style={{ color: "var(--navy-primary)" }} />
  ) : (
    <ArrowDown className="h-3 w-3 ml-1 inline" style={{ color: "var(--navy-primary)" }} />
  );
}

interface DataTableProps {
  lockedConcept?: string;
}

export function DataTable({ lockedConcept }: DataTableProps = {}) {
  const { data, filters, searchedData } = useDashboard();
  const [page, setPage] = useState(0);
  const [tableProduct, setTableProduct] = useState("");
  const [tableConcept, setTableConcept] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const pageSize = 10;

  const effectiveConcept = lockedConcept ?? tableConcept;

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredData = useMemo(() => {
    let rows = searchedData.filter((row) => {
      const yearMatch = row.año >= filters.yearRange[0] && row.año <= filters.yearRange[1];
      const conceptoMatch = effectiveConcept === "" || row.concepto === effectiveConcept;
      const productoMatch = tableProduct === "" || row.producto === tableProduct;
      return yearMatch && conceptoMatch && productoMatch;
    });

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "año") return (a.año - b.año) * dir;
        if (sortKey === "cantidad") return (a.cantidad - b.cantidad) * dir;
        return 0;
      });
    }
    return rows;
  }, [searchedData, filters.yearRange, tableProduct, tableConcept, sortKey, sortDir]);

  // Compute CAGR for each row: compare current year with 5 years prior (or earliest available)
  const computeCAGR = (row: typeof data[number]) => {
    const prevYear = row.año - 5;
    const prevVal = data.find(
      (d) => d.año === prevYear && d.concepto === row.concepto && d.producto === row.producto
    )?.cantidad;
    if (!prevVal || prevVal === 0 || row.cantidad === 0) return null;
    const years = 5;
    const cagr = (Math.pow(row.cantidad / prevVal, 1 / years) - 1) * 100;
    return cagr;
  };

  // Compute Trend from last 3 years slope
  const computeTrend = (row: typeof data[number]) => {
    const history = data
      .filter((d) => d.concepto === row.concepto && d.producto === row.producto && d.año <= row.año)
      .sort((a, b) => b.año - a.año)
      .slice(0, 3);
    if (history.length < 2) return "estable" as const;
    const slope = history[0].cantidad - history[history.length - 1].cantidad;
    if (slope > 0.001) return "ascendente" as const;
    if (slope < -0.001) return "descendente" as const;
    return "estable" as const;
  };

  const trendConfig = {
    ascendente: { label: "Ascendente", icon: TrendingUp, color: "var(--success)", bg: "rgba(46,139,87,0.10)" },
    descendente: { label: "Descendente", icon: TrendingDown, color: "var(--warning)", bg: "rgba(184,92,0,0.10)" },
    estable: { label: "Estable", icon: Minus, color: "var(--text-muted)", bg: "rgba(0,0,0,0.04)" },
  };

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const selectStyle: React.CSSProperties = {
    borderRadius: 2,
    border: "1px solid var(--hairline-light-ui)",
    background: "var(--white)",
    padding: "6px 12px",
    fontSize: 13,
    fontFamily: "'Quicksand', sans-serif",
    color: "var(--navy-deep)",
    outline: "none",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <h3
          className="text-sm font-semibold font-heading"
          style={{ color: "var(--navy-deep)" }}
        >
          Datos Detallados
        </h3>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Filtrar por producto" value={tableProduct} onChange={(e) => handleProductChange(e.target.value)} style={selectStyle}>
            {availableProducts.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {!lockedConcept && (
            <select aria-label="Filtrar por concepto" value={tableConcept} onChange={(e) => handleConceptChange(e.target.value)} style={selectStyle}>
              {availableConcepts.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          )}
          {lockedConcept && (
            <span className="text-[11px] font-medium" style={{ color: "var(--navy-primary)", fontFamily: "'Quicksand', sans-serif" }}>
              {toTitleCase(lockedConcept)}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--hairline-light-strong)" }}>
              <th
                className="text-left pb-2 pr-3 cursor-pointer select-none"
                onClick={() => handleSort("año")}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Año <SortIcon colKey="año" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th
                className="text-left pb-2 pr-3"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Concepto
              </th>
              <th
                className="text-left pb-2 pr-3"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Producto
              </th>
              <th
                className="text-left pb-2 pr-3 text-right cursor-pointer select-none"
                onClick={() => handleSort("cantidad")}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Cantidad <SortIcon colKey="cantidad" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th
                className="text-left pb-2 pr-3"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                CAGR
              </th>
              <th
                className="text-left pb-2"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Tendencia
              </th>
              <th className="text-left pb-2" style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, idx) => {
                const cagr = computeCAGR(row);
                const trend = computeTrend(row);
                const trendCfg = trendConfig[trend];
                const TrendIcon = trendCfg.icon;
                return (
                  <tr
                    key={`${row.año}-${row.concepto}-${row.producto}-${idx}`}
                    className="una-table-row transition-colors"
                    style={{ borderBottom: "1px solid var(--hairline-light)", height: 36 }}
                  >
                    <td className="py-1 pr-3 font-mono-numbers" style={{ color: "var(--navy-deep)", fontSize: 12 }}>
                      {row.año}
                    </td>
                    <td className="py-1 pr-3" style={{ color: "var(--text-dark)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}>
                      {toTitleCase(row.concepto)}
                    </td>
                    <td className="py-1 pr-3" style={{ color: "var(--text-dark)", fontSize: 12, fontFamily: "'Quicksand', sans-serif" }}>
                      {row.producto ?? "—"}
                    </td>
                    <td className="py-1 pr-3 text-right font-mono-numbers" style={{ color: "var(--navy-deep)", fontSize: 12 }}>
                      {row.cantidad.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-1 pr-3">
                      {cagr !== null ? (
                        <span className="text-[10px] font-semibold font-mono-numbers" style={{ color: cagr >= 0 ? "var(--success)" : "var(--warning)" }}>
                          {cagr >= 0 ? "▲" : "▼"} {Math.abs(cagr).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td className="py-1">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold"
                        style={{ background: trendCfg.bg, color: trendCfg.color }}
                      >
                        <TrendIcon className="h-2.5 w-2.5" />
                        {trendCfg.label}
                      </span>
                    </td>
                    <td className="py-1">
                      <button className="inline-flex items-center justify-center h-5 w-5 rounded-md transition-colors hover:bg-black/5" style={{ color: "var(--text-muted)" }}>
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-sm"
                  style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-between shrink-0">
        <span
          className="text-[10px]"
          style={{
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          Página {page + 1} de {pageCount || 1} — {filteredData.length} registros
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{
              borderRadius: 2,
              border: "1px solid var(--hairline-light-ui)",
              background: "var(--white)",
              color: "var(--navy-deep)",
            }}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex items-center px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{
              borderRadius: 2,
              border: "1px solid var(--hairline-light-ui)",
              background: "var(--white)",
              color: "var(--navy-deep)",
            }}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
