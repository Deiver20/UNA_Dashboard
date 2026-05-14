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
