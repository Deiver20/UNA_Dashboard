"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import type { DataRow, FilterState, Section, Concepto, KpiDelta, InsightItem, AiInsightVersion } from "@/types";
import { parseExcel, getMinMaxYears } from "@/lib/data";
import { fetchInsights } from "@/lib/ai-client";
import { nanoid } from "nanoid";

const STORAGE_KEY = "una_dashboard_insights_v1";

export const SECTION_CONCEPTS: Record<Section, Concepto[]> = {
  overview: ["produccion", "consumo", "importaciones", "exportaciones"],
  produccion: [],
  consumo: [],
  comercio: ["importaciones", "exportaciones"],
  poblacion: ["produccion", "consumo", "importaciones", "exportaciones", "consumo per capita"],
  "balance comercial": [],
  "aves de postura": [],
};

export const SECTIONS_WITH_PRODUCT_SELECT: Section[] = [
  "produccion", "poblacion", "balance comercial",
];

export const CONCEPT_LABELS: Record<string, string> = {
  produccion: "Producción",
  consumo: "Consumo",
  importaciones: "Importaciones",
  exportaciones: "Exportaciones",
  "consumo per capita": "Consumo Per Cápita",
  poblacion: "Población",
  "aves de postura": "Aves de Postura",
};

export interface SectionFilters {
  productos: string[];
  sectionConcept: string;
  tradeConcept: string;
}

const defaultSectionFilters: Record<Section, SectionFilters> = {
  overview: { productos: ["huevo", "pavo", "pollo"], sectionConcept: "produccion", tradeConcept: "importaciones" },
  produccion: { productos: ["huevo", "pavo", "pollo"], sectionConcept: "produccion", tradeConcept: "importaciones" },
  consumo: { productos: ["huevo", "pavo", "pollo"], sectionConcept: "consumo", tradeConcept: "importaciones" },
  comercio: { productos: ["huevo", "pavo", "pollo"], sectionConcept: "importaciones", tradeConcept: "importaciones" },
  poblacion: { productos: ["huevo", "pavo", "pollo"], sectionConcept: "produccion", tradeConcept: "importaciones" },
  "balance comercial": { productos: ["huevo", "pavo", "pollo"], sectionConcept: "produccion", tradeConcept: "importaciones" },
  "aves de postura": { productos: ["huevo", "pavo", "pollo"], sectionConcept: "produccion", tradeConcept: "importaciones" },
};

interface DashboardContextType {
  data: DataRow[];
  loading: boolean;
  error: string | null;
  loadData: (arrayBuffer: ArrayBuffer) => void;
  reloadFromFile: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  activeYear: number;
  setActiveYear: (year: number) => void;
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sectionFilters: Record<Section, SectionFilters>;
  activeSectionFilters: SectionFilters;
  updateSectionFilters: (section: Section, patch: Partial<SectionFilters>) => void;
  sectionConcept: string;
  setSectionConcept: (concept: string) => void;
  tradeConcept: string;
  setTradeConcept: (concept: string) => void;
  insightsOpen: boolean;
  setInsightsOpen: (open: boolean) => void;
  filteredData: DataRow[];
  searchedData: DataRow[];
  kpiDeltas: Record<string, KpiDelta>;
  insights: InsightItem[];
  insightVersions: AiInsightVersion[];
  activeInsightVersionId: string | null;
  activeInsightVersion: AiInsightVersion | null;
  isGeneratingInsights: boolean;
  rightPanelCollapsed: boolean;
  generateInsightsForSection: () => Promise<void>;
  selectInsightVersion: (id: string) => void;
  deleteInsightVersion: (id: string) => void;
  toggleRightPanel: () => void;
}

const defaultFilters: FilterState = {
  yearRange: [1977, 2025],
  productos: ["huevo", "pavo", "pollo"],
  conceptos: [
    "poblacion",
    "aves de postura",
    "produccion",
    "importaciones",
    "exportaciones",
    "consumo",
    "consumo per capita",
  ],
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

function computeDelta(data: DataRow[], activeYear: number, concepto: string, producto: string | null): KpiDelta {
  const current = data.find((d) => d.año === activeYear && d.concepto === concepto && d.producto === producto)?.cantidad ?? 0;
  const prev = data.find((d) => d.año === activeYear - 1 && d.concepto === concepto && d.producto === producto)?.cantidad ?? 0;
  const delta = current - prev;
  let deltaPercent: number;
  if (prev === 0) {
    deltaPercent = current > 0 ? 100 : 0;
  } else {
    deltaPercent = (delta / prev) * 100;
  }
  const direction = delta > 0.001 ? "up" : delta < -0.001 ? "down" : "flat";
  return { value: current, prevValue: prev, delta, deltaPercent, direction };
}

function buildInsights(data: DataRow[], activeSection: Section, activeYear: number, selectedProduct: string): InsightItem[] {
  const insights: InsightItem[] = [];
  const minYear = Math.min(...data.map((d) => d.año).filter(Boolean));
  const maxYear = Math.max(...data.map((d) => d.año).filter(Boolean));

  const getVal = (year: number, concepto: string, prod: string | null) =>
    data.find((d) => d.año === year && d.concepto === concepto && d.producto === prod)?.cantidad ?? 0;

  if (activeSection === "overview") {
    for (const prod of ["pollo", "huevo", "pavo"]) {
      const latest = getVal(activeYear, "produccion", prod);
      const earliest = getVal(minYear, "produccion", prod);
      if (latest > 0 && earliest > 0) {
        const years = Math.max(activeYear - minYear, 1);
        const cagr = (Math.pow(latest / earliest, 1 / years) - 1) * 100;
        insights.push({
          id: `overview-cagr-${prod}`,
          title: `Crecimiento de producción`,
          description: `La producción de ${prod} tuvo un CAGR de ${cagr.toFixed(1)}% desde ${minYear}.`,
          timestamp: `${minYear}–${activeYear}`,
          badge: cagr > 0 ? "success" : "warning",
        });
      }
    }
    const popLatest = getVal(activeYear, "poblacion", null);
    const popEarliest = getVal(minYear, "poblacion", null);
    if (popLatest > 0 && popEarliest > 0) {
      insights.push({
        id: "overview-pop-growth",
        title: "Expansión demográfica",
        description: `La población creció ${((popLatest / popEarliest - 1) * 100).toFixed(1)}% en el período analizado.`,
        timestamp: `${minYear}–${activeYear}`,
        badge: "info",
      });
    }
  }

  if (activeSection === "produccion") {
    const prodData = ["pollo", "huevo", "pavo"].map((p) => ({
      prod: p,
      latest: getVal(activeYear, "produccion", p),
      prev: getVal(activeYear - 1, "produccion", p),
    }));
    const maxProd = prodData.reduce((a, b) => (a.latest > b.latest ? a : b), prodData[0]);
    if (maxProd?.latest > 0) {
      insights.push({
        id: "prod-leader",
        title: "Producto líder",
        description: `${maxProd.prod.charAt(0).toUpperCase() + maxProd.prod.slice(1)} lidera la producción en ${activeYear} con ${maxProd.latest.toLocaleString("es-ES")} ton.`,
        timestamp: `Año ${activeYear}`,
        badge: "success",
      });
    }
    prodData.forEach((d) => {
      if (d.prev > 0 && d.latest > 0) {
        const change = ((d.latest / d.prev - 1) * 100);
        insights.push({
          id: `prod-yoy-${d.prod}`,
          title: `Producción de ${d.prod}`,
          description: `Variación interanual: ${change > 0 ? "+" : ""}${change.toFixed(1)}% respecto a ${activeYear - 1}.`,
          timestamp: `Año ${activeYear}`,
          badge: change >= 0 ? "success" : "warning",
        });
      }
    });
  }

  if (activeSection === "consumo") {
    const perCapita = getVal(activeYear, "consumo per capita", selectedProduct);
    if (perCapita > 0) {
      insights.push({
        id: "cons-percapita",
        title: "Consumo per cápita",
        description: `El consumo per cápita de ${selectedProduct} es ${perCapita.toFixed(1)} kg/hab en ${activeYear}.`,
        timestamp: `Año ${activeYear}`,
        badge: "info",
      });
    }
    const allPerCapita = data.filter((d) => d.concepto === "consumo per capita" && d.producto === selectedProduct);
    const maxPc = allPerCapita.reduce((a, b) => (a.cantidad > b.cantidad ? a : b), allPerCapita[0]);
    if (maxPc) {
      insights.push({
        id: "cons-max-pc",
        title: "Máximo histórico",
        description: `El pico de consumo per cápita de ${selectedProduct} se registró en ${maxPc.año} (${maxPc.cantidad.toFixed(1)} kg/hab).`,
        timestamp: `Año ${maxPc.año}`,
        badge: maxPc.año === activeYear ? "success" : "info",
      });
    }
  }

  if (activeSection === "comercio") {
    const imp = getVal(activeYear, "importaciones", selectedProduct);
    const exp = getVal(activeYear, "exportaciones", selectedProduct);
    const balance = exp - imp;
    insights.push({
      id: "trade-balance",
      title: "Balance comercial",
      description: balance >= 0
        ? `Superávit de ${balance.toLocaleString("es-ES")} ton en ${activeYear} para ${selectedProduct}.`
        : `Déficit de ${Math.abs(balance).toLocaleString("es-ES")} ton en ${activeYear} para ${selectedProduct}.`,
      timestamp: `Año ${activeYear}`,
      badge: balance >= 0 ? "success" : "warning",
    });
    const last5 = Array.from({ length: 5 }, (_, i) => activeYear - i).filter((y) => y >= minYear);
    const balances = last5.map((y) => {
      const e = getVal(y, "exportaciones", selectedProduct);
      const i2 = getVal(y, "importaciones", selectedProduct);
      return e - i2;
    }).filter((b) => b !== 0);
    if (balances.length >= 3 && balances.every((b) => b < 0)) {
      insights.push({
        id: "trade-deficit-sustained",
        title: "Déficit sostenido",
        description: `${selectedProduct} acumula déficit comercial en los últimos ${balances.length} años.`,
        timestamp: `${last5[last5.length - 1]}–${activeYear}`,
        badge: "warning",
      });
    }
  }

  if (activeSection === "poblacion") {
    const popNow = getVal(activeYear, "poblacion", null);
    const popPrev5 = getVal(activeYear - 5, "poblacion", null);
    const avesNow = getVal(activeYear, "aves de postura", "huevo");
    if (popNow > 0 && popPrev5 > 0) {
      insights.push({
        id: "pop-growth-5y",
        title: "Crecimiento poblacional",
        description: `La población aumentó ${((popNow / popPrev5 - 1) * 100).toFixed(1)}% en los últimos 5 años.`,
        timestamp: `${activeYear - 5}–${activeYear}`,
        badge: "info",
      });
    }
    if (avesNow > 0) {
      insights.push({
        id: "pop-aves",
        title: "Aves de postura",
        description: `Registro actualizado de ${avesNow.toLocaleString("es-ES")} unidades en ${activeYear}.`,
        timestamp: `Año ${activeYear}`,
        badge: "info",
      });
    }
  }

  if (activeSection === "balance comercial") {
    for (const prod of ["pollo", "huevo", "pavo"]) {
      const imp = getVal(activeYear, "importaciones", prod);
      const exp = getVal(activeYear, "exportaciones", prod);
      if (imp > 0 || exp > 0) {
        const bal = exp - imp;
        insights.push({
          id: `bc-${prod}`,
          title: `Balance de ${prod}`,
          description: bal >= 0
            ? `Superávit de ${bal.toLocaleString("es-ES")} ton en ${activeYear}.`
            : `Déficit de ${Math.abs(bal).toLocaleString("es-ES")} ton en ${activeYear}.`,
          timestamp: `Año ${activeYear}`,
          badge: bal >= 0 ? "success" : "warning",
        });
      }
    }
    const totalExp = ["pollo", "huevo", "pavo"].reduce((s, p) => s + getVal(activeYear, "exportaciones", p), 0);
    const totalImp = ["pollo", "huevo", "pavo"].reduce((s, p) => s + getVal(activeYear, "importaciones", p), 0);
    if (totalExp > 0 || totalImp > 0) {
      insights.push({
        id: "bc-total",
        title: "Balance global",
        description: totalExp >= totalImp
          ? `Superávit total de ${(totalExp - totalImp).toLocaleString("es-ES")} ton.`
          : `Déficit total de ${(totalImp - totalExp).toLocaleString("es-ES")} ton.`,
        timestamp: `Año ${activeYear}`,
        badge: totalExp >= totalImp ? "success" : "warning",
      });
    }
  }

  if (activeSection === "aves de postura") {
    const avesNow = getVal(activeYear, "aves de postura", "huevo");
    const avesPrev5 = getVal(activeYear - 5, "aves de postura", "huevo");
    const avesEarliest = getVal(minYear, "aves de postura", "huevo");
    if (avesNow > 0 && avesPrev5 > 0) {
      const change5y = ((avesNow / avesPrev5 - 1) * 100);
      insights.push({
        id: "aves-growth-5y",
        title: "Crecimiento 5 años",
        description: `Las aves de postura ${change5y >= 0 ? "crecieron" : "disminuyeron"} ${Math.abs(change5y).toFixed(1)}% en los últimos 5 años.`,
        timestamp: `${activeYear - 5}–${activeYear}`,
        badge: change5y >= 0 ? "success" : "warning",
      });
    }
    if (avesNow > 0 && avesEarliest > 0) {
      const years = Math.max(activeYear - minYear, 1);
      const cagr = (Math.pow(avesNow / avesEarliest, 1 / years) - 1) * 100;
      insights.push({
        id: "aves-cagr",
        title: "CAGR histórico",
        description: `Tasa de crecimiento anual compuesta de ${cagr.toFixed(1)}% desde ${minYear}.`,
        timestamp: `${minYear}–${activeYear}`,
        badge: cagr > 0 ? "success" : "warning",
      });
    }
    if (avesNow > 0) {
      insights.push({
        id: "aves-current",
        title: "Registro actual",
        description: `${avesNow.toLocaleString("es-ES")} aves de postura registradas en ${activeYear}.`,
        timestamp: `Año ${activeYear}`,
        badge: "info",
      });
    }
    const allAves = data.filter((d) => d.concepto === "aves de postura");
    const maxAves = allAves.reduce((a, b) => (a.cantidad > b.cantidad ? a : b), allAves[0]);
    if (maxAves) {
      insights.push({
        id: "aves-max",
        title: "Máximo histórico",
        description: `El pico de aves de postura fue en ${maxAves.año} con ${maxAves.cantidad.toLocaleString("es-ES")} unidades.`,
        timestamp: `Año ${maxAves.año}`,
        badge: maxAves.año === activeYear ? "success" : "info",
      });
    }
  }

  return insights.slice(0, 6);
}

function prepareDataSnapshot(data: DataRow[], section: Section) {
  const years = [...new Set(data.map((d) => d.año))].sort((a, b) => a - b);

  if (section === "overview") {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const prod of ["pollo", "huevo", "pavo"]) {
        row[`produccion_${prod}`] = data.find((d) => d.año === year && d.concepto === "produccion" && d.producto === prod)?.cantidad ?? 0;
        row[`consumo_${prod}`] = data.find((d) => d.año === year && d.concepto === "consumo" && d.producto === prod)?.cantidad ?? 0;
      }
      row.poblacion = data.find((d) => d.año === year && d.concepto === "poblacion")?.cantidad ?? 0;
      return row;
    });
  }

  if (section === "produccion") {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const prod of ["pollo", "huevo", "pavo"]) {
        row[prod] = data.find((d) => d.año === year && d.concepto === "produccion" && d.producto === prod)?.cantidad ?? 0;
      }
      return row;
    });
  }

  if (section === "consumo") {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const prod of ["pollo", "huevo", "pavo"]) {
        row[`consumo_${prod}`] = data.find((d) => d.año === year && d.concepto === "consumo" && d.producto === prod)?.cantidad ?? 0;
        row[`percapita_${prod}`] = data.find((d) => d.año === year && d.concepto === "consumo per capita" && d.producto === prod)?.cantidad ?? 0;
      }
      return row;
    });
  }

  if (section === "comercio") {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const prod of ["pollo", "huevo", "pavo"]) {
        row[`importaciones_${prod}`] = data.find((d) => d.año === year && d.concepto === "importaciones" && d.producto === prod)?.cantidad ?? 0;
        row[`exportaciones_${prod}`] = data.find((d) => d.año === year && d.concepto === "exportaciones" && d.producto === prod)?.cantidad ?? 0;
      }
      return row;
    });
  }

  if (section === "poblacion") {
    return years.map((year) => {
      const pop = data.find((d) => d.año === year && d.concepto === "poblacion")?.cantidad ?? 0;
      const aves = data.find((d) => d.año === year && d.concepto === "aves de postura")?.cantidad ?? 0;
      return { year, poblacion: pop, aves_de_postura: aves };
    });
  }

  if (section === "balance comercial") {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const prod of ["pollo", "huevo", "pavo"]) {
        const imp = data.find((d) => d.año === year && d.concepto === "importaciones" && d.producto === prod)?.cantidad ?? 0;
        const exp = data.find((d) => d.año === year && d.concepto === "exportaciones" && d.producto === prod)?.cantidad ?? 0;
        row[`balance_${prod}`] = exp - imp;
      }
      return row;
    });
  }

  if (section === "aves de postura") {
    return years.map((year) => {
      const aves = data.find((d) => d.año === year && d.concepto === "aves de postura")?.cantidad ?? 0;
      return { year, aves_de_postura: aves };
    });
  }

  return [];
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeYear, setActiveYear] = useState<number>(2025);
  const [selectedProduct, setSelectedProduct] = useState<string>("pollo");
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sectionFilters, setSectionFilters] = useState<Record<Section, SectionFilters>>(defaultSectionFilters);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const [insightVersions, setInsightVersions] = useState<AiInsightVersion[]>([]);
  const [activeInsightVersionId, setActiveInsightVersionId] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AiInsightVersion[];
        setInsightVersions(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      const toStore = insightVersions.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // ignore storage errors
    }
  }, [insightVersions]);

  const activeSectionFilters = sectionFilters[activeSection];
  const sectionConcept = activeSectionFilters.sectionConcept;
  const tradeConcept = activeSectionFilters.tradeConcept;

  const updateSectionFilters = useCallback((section: Section, patch: Partial<SectionFilters>) => {
    setSectionFilters((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
  }, []);

  const setSectionConcept = useCallback((concept: string) => {
    updateSectionFilters(activeSection, { sectionConcept: concept });
  }, [activeSection, updateSectionFilters]);

  const setTradeConcept = useCallback((concept: string) => {
    updateSectionFilters(activeSection, { tradeConcept: concept });
  }, [activeSection, updateSectionFilters]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const yearMatch =
        row.año >= filters.yearRange[0] && row.año <= filters.yearRange[1];
      const conceptoMatch = filters.conceptos.includes(row.concepto);
      const productoMatch =
        row.producto === null || filters.productos.includes(row.producto);
      return yearMatch && conceptoMatch && productoMatch;
    });
  }, [data, filters]);

  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return filteredData;
    const q = searchQuery.toLowerCase();
    return filteredData.filter((row) => {
      return (
        String(row.año).includes(q) ||
        row.concepto.toLowerCase().includes(q) ||
        (row.producto?.toLowerCase() ?? "").includes(q) ||
        String(row.cantidad).includes(q) ||
        row.unidades.toLowerCase().includes(q)
      );
    });
  }, [filteredData, searchQuery]);

  const kpiDeltas = useMemo(() => {
    const deltas: Record<string, KpiDelta> = {};
    deltas["produccion"] = computeDelta(data, activeYear, "produccion", selectedProduct);
    deltas["consumo"] = computeDelta(data, activeYear, "consumo", selectedProduct);
    deltas["consumo per capita"] = computeDelta(data, activeYear, "consumo per capita", selectedProduct);
    const exp = computeDelta(data, activeYear, "exportaciones", selectedProduct);
    const imp = computeDelta(data, activeYear, "importaciones", selectedProduct);
    const curr = exp.value - imp.value;
    const prev = exp.prevValue - imp.prevValue;
    const delta = curr - prev;
    const deltaPercent = prev !== 0 ? (delta / prev) * 100 : 0;
    const direction = delta > 0.001 ? "up" : delta < -0.001 ? "down" : "flat";
    deltas["balance"] = { value: curr, prevValue: prev, delta, deltaPercent, direction };
    return deltas;
  }, [data, activeYear, selectedProduct]);

  const insights = useMemo(
    () => buildInsights(data, activeSection, activeYear, selectedProduct),
    [data, activeSection, activeYear, selectedProduct]
  );

  const activeInsightVersion = useMemo(() => {
    const version = insightVersions.find((v) => v.id === activeInsightVersionId);
    if (!version || version.section !== activeSection) return null;
    return version;
  }, [insightVersions, activeInsightVersionId, activeSection]);

  const loadData = useCallback((arrayBuffer: ArrayBuffer) => {
    try {
      setLoading(true);
      setError(null);
      const parsed = parseExcel(arrayBuffer);
      setData(parsed);
      const [minYear, maxYear] = getMinMaxYears(parsed);
      setFilters((prev) => ({
        ...prev,
        yearRange: [minYear, maxYear],
      }));
      setActiveYear(maxYear);
    } catch (err) {
      setError("Error al parsear el archivo Excel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadFromFile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/base-produccion-consumo.xlsx");
      if (!res.ok) {
        throw new Error(`No se pudo cargar el archivo de datos (HTTP ${res.status})`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const parsed = parseExcel(arrayBuffer);
      setData(parsed);
      const [minYear, maxYear] = getMinMaxYears(parsed);
      setFilters((prev) => ({
        ...prev,
        yearRange: [minYear, maxYear],
      }));
      setActiveYear(maxYear);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar el archivo Excel";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateInsightsForSection = useCallback(async () => {
    setIsGeneratingInsights(true);
    try {
      const snapshot = prepareDataSnapshot(data, activeSection);
      const res = await fetchInsights(activeSection, snapshot, activeYear);
      const version: AiInsightVersion = {
        id: nanoid(),
        period: String(activeYear),
        section: activeSection,
        insights: res.insights.map((i) => ({ ...i, timestamp: String(activeYear) })),
        generatedAt: new Date().toISOString(),
        promptSnapshot: JSON.stringify(snapshot),
      };
      setInsightVersions((prev) => [...prev, version]);
      setActiveInsightVersionId(version.id);
    } catch (err) {
      console.error("Error generando insights:", err);
      setError(err instanceof Error ? err.message : "Error al generar insights");
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [data, activeSection, activeYear]);

  const selectInsightVersion = useCallback((id: string) => {
    setActiveInsightVersionId(id);
  }, []);

  const deleteInsightVersion = useCallback((id: string) => {
    setInsightVersions((prev) => {
      const next = prev.filter((v) => v.id !== id);
      return next;
    });
    setActiveInsightVersionId((prev) => (prev === id ? null : prev));
  }, []);

  const toggleRightPanel = useCallback(() => {
    setRightPanelCollapsed((prev) => !prev);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        data,
        loading,
        error,
        loadData,
        reloadFromFile,
        filters,
        setFilters,
        activeYear,
        setActiveYear,
        selectedProduct,
        setSelectedProduct,
        activeSection,
        setActiveSection,
        searchQuery,
        setSearchQuery,
        sectionFilters,
        activeSectionFilters,
        updateSectionFilters,
        sectionConcept,
        setSectionConcept,
        tradeConcept,
        setTradeConcept,
        insightsOpen,
        setInsightsOpen,
        filteredData,
        searchedData,
        kpiDeltas,
        insights,
        insightVersions,
        activeInsightVersionId,
        activeInsightVersion,
        isGeneratingInsights,
        rightPanelCollapsed,
        generateInsightsForSection,
        selectInsightVersion,
        deleteInsightVersion,
        toggleRightPanel,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
