"use client";

import { TrendingUp, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import type { InsightItem } from "@/types";
import type { LucideIcon } from "lucide-react";

const badgeStyles: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  success: { bg: "rgba(46,139,87,0.10)", text: "#2e8b57", icon: CheckCircle2 },
  warning: { bg: "rgba(184,92,0,0.10)", text: "#b85c00", icon: AlertTriangle },
  danger: { bg: "rgba(239,68,68,0.10)", text: "#ef4444", icon: AlertTriangle },
  info: { bg: "rgba(3,72,141,0.10)", text: "#03488D", icon: Info },
};

interface InsightsPanelProps {
  insights: InsightItem[];
  title?: string;
  subtitle?: string;
}

export function InsightsPanel({ insights, title = "Insights del período.", subtitle = "ANÁLISIS" }: InsightsPanelProps) {
  return (
    <div className="una-card flex flex-col h-full">
      <div className="mb-2">
        <div className="section-eyebrow">{subtitle}</div>
        <h3 className="text-sm font-semibold font-heading" style={{ color: "var(--navy-deep)" }}>
          {title}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {insights.length === 0 ? (
          <div className="text-xs text-center py-4" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
            Sin insights disponibles
          </div>
        ) : (
          insights.map((item) => {
            const style = badgeStyles[item.badge ?? "info"];
            const Icon = style.icon;
            return (
              <div key={item.id} className="flex items-start gap-2 pb-2" style={{ borderBottom: "1px solid var(--hairline-light)" }}>
                <div className="h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: style.bg }}>
                  <Icon className="h-3 w-3" style={{ color: style.text }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium" style={{ color: "var(--text-dark)", fontFamily: "'Quicksand', sans-serif" }}>
                    {item.title}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
                    {item.description}
                  </p>
                </div>
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-semibold shrink-0"
                  style={{ background: style.bg, color: style.text }}
                >
                  {item.badge}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
