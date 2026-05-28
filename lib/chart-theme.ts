export const chartGridStroke = "var(--hairline-light-strong)";

export const chartTooltipStyle: React.CSSProperties = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--hairline-light-ui)",
  borderRadius: 2,
  boxShadow: "var(--shadow-hover)",
  color: "var(--text-dark)",
  fontSize: 12,
  fontFamily: "'Quicksand', sans-serif",
  padding: "8px 12px",
};

export const chartAxisTickStyle = {
  fill: "var(--text-muted)",
  fontSize: 11,
  fontFamily: "'Quicksand', sans-serif",
};

export const chartAxisLineColor = "var(--hairline-light-ui)";

export const productColors: Record<string, string> = {
  pollo: "#06254B",
  huevo: "#03488D",
  pavo: "#F8D227",
};

export function formatNumberLocale(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

export function formatIntegerLocale(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 });
}

export function tooltipValueFormatter(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return formatNumberLocale(num);
}

