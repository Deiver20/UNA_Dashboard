export interface GenerateInsightsRequest {
  section: string;
  dataSnapshot: unknown[];
  year: number;
}

export interface GenerateInsightsResponse {
  insights: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    badge?: "info" | "warning" | "success" | "danger";
  }[];
}

export async function fetchInsights(
  section: string,
  dataSnapshot: unknown[],
  year: number
): Promise<GenerateInsightsResponse> {
  const res = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, dataSnapshot, year } satisfies GenerateInsightsRequest),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido");
    throw new Error(errorText);
  }

  return res.json();
}
