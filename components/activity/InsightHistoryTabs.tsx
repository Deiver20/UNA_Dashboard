"use client";

import { useDashboard } from "@/lib/filters";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InsightHistoryTabs() {
  const {
    insightVersions,
    activeInsightVersionId,
    selectInsightVersion,
    deleteInsightVersion,
    activeSection,
    activeYear,
  } = useDashboard();

  const versionsForSection = insightVersions.filter((v) => v.section === activeSection);
  const availablePeriods = [...new Set(versionsForSection.map((v) => v.period))].sort();

  const selectedPeriod = availablePeriods.find((p) => p === String(activeYear)) ?? availablePeriods[0] ?? "";
  const versionsForPeriod = versionsForSection.filter((v) => v.period === selectedPeriod);

  return (
    <div className="space-y-2">
      {availablePeriods.length > 0 && (
        <Select
          value={selectedPeriod}
          onValueChange={(val) => {
            const first = versionsForSection.find((v) => v.period === val);
            if (first) selectInsightVersion(first.id);
          }}
        >
          <SelectTrigger
            className="h-8 text-xs"
            style={{ fontFamily: "'Quicksand', sans-serif", borderRadius: 2 }}
          >
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
            {availablePeriods.map((p) => (
              <SelectItem key={p} value={p} className="text-xs">
                Año {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {versionsForPeriod.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {versionsForPeriod.map((v, idx) => {
            const isActive = v.id === activeInsightVersionId;
            const label = idx === 0 ? v.period : `${v.period}-v${idx + 1}`;
            return (
              <button
                key={v.id}
                onClick={() => selectInsightVersion(v.id)}
                className="group relative inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all"
                style={{
                  background: isActive ? "var(--accent-yellow)" : "var(--bg-light)",
                  color: isActive ? "var(--navy-deep)" : "var(--text-muted)",
                  border: isActive ? "1px solid var(--accent-yellow)" : "1px solid var(--hairline-light)",
                  borderRadius: 2,
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                {label}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteInsightVersion(v.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center h-3.5 w-3.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.08)", marginLeft: 2 }}
                >
                  <X className="h-2.5 w-2.5" style={{ color: "var(--text-muted)" }} />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
