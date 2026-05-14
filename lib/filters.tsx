"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import type { DataRow, FilterState } from "@/types";
import { parseExcel, getMinMaxYears } from "@/lib/data";

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
  filteredData: DataRow[];
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

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeYear, setActiveYear] = useState<number>(2025);
  const [selectedProduct, setSelectedProduct] = useState<string>("pollo");

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
      const res = await fetch("/base produccion-consumo.xlsx");
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
      setError("Error al cargar el archivo Excel");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        filteredData,
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
