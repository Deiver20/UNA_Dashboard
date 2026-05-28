export interface DataRow {
  año: number;
  cantidad: number;
  unidades: string;
  concepto: Concepto;
  producto: string | null;
}

export type Concepto =
  | "poblacion"
  | "aves de postura"
  | "produccion"
  | "importaciones"
  | "exportaciones"
  | "consumo"
  | "consumo per capita";

export const CONCEPTOS: Concepto[] = [
  "poblacion",
  "aves de postura",
  "produccion",
  "importaciones",
  "exportaciones",
  "consumo",
  "consumo per capita",
];

export const PRODUCTOS = ["huevo", "pavo", "pollo"] as const;
export type Producto = (typeof PRODUCTOS)[number];

export interface FilterState {
  yearRange: [number, number];
  productos: string[];
  conceptos: string[];
}

export type Section =
  | "overview"
  | "produccion"
  | "consumo"
  | "comercio"
  | "poblacion"
  | "balance comercial"
  | "aves de postura";

export interface KpiDelta {
  value: number;
  prevValue: number;
  delta: number;
  deltaPercent: number;
  direction: "up" | "down" | "flat";
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  badge?: "info" | "warning" | "success" | "danger";
}

export interface AiInsightVersion {
  id: string;
  period: string;
  section: Section;
  insights: InsightItem[];
  generatedAt: string;
  promptSnapshot: string;
}
