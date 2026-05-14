import * as XLSX from "xlsx";
import type { DataRow, Concepto } from "@/types";

export function parseExcel(arrayBuffer: ArrayBuffer): DataRow[] {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: null,
  });

  const rows: DataRow[] = json
    .map((row) => {
      const año = Number(row["año"] ?? row["Año"] ?? row["year"] ?? row["Year"]);
      const cantidad = Number(row["cantidad"] ?? row["Cantidad"] ?? row["quantity"] ?? 0);
      const unidades = String(row["unidades"] ?? row["Unidades"] ?? row["units"] ?? "");
      const conceptoRaw = String(
        row["concepto"] ?? row["Concepto"] ?? row["concept"] ?? ""
      ).toLowerCase().trim();
      const productoRaw = row["producto"] ?? row["Producto"] ?? row["product"] ?? null;

      const concepto = conceptoRaw as Concepto;
      const producto = productoRaw === null || productoRaw === undefined
        ? null
        : String(productoRaw).trim().toLowerCase() || null;

      if (Number.isNaN(año) || Number.isNaN(cantidad)) return null;

      return {
        año,
        cantidad,
        unidades,
        concepto,
        producto,
      };
    })
    .filter((r): r is DataRow => {
      if (r === null) return false;
      // For production, consumption, and trade, keep only "toneladas" to avoid duplicates with "aves" counts
      const volumeConcepts = ["produccion", "consumo", "importaciones", "exportaciones"];
      if (volumeConcepts.includes(r.concepto) && r.producto !== null) {
        return r.unidades.toLowerCase().includes("tonelada");
      }
      return true;
    });

  return rows;
}

export function getUniqueYears(data: DataRow[]): number[] {
  const years = new Set(data.map((d) => d.año));
  return Array.from(years).sort((a, b) => a - b);
}

export function getMinMaxYears(data: DataRow[]): [number, number] {
  const years = getUniqueYears(data);
  return [years[0] ?? 1977, years[years.length - 1] ?? 2025];
}

export function getLatestYear(data: DataRow[]): number {
  const years = getUniqueYears(data);
  return years[years.length - 1] ?? 2025;
}
