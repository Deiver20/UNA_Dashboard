"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/filters";
import { InsightsPanel } from "@/components/activity/InsightsPanel";
import { AiGenerateButton } from "@/components/activity/AiGenerateButton";
import { InsightHistoryTabs } from "@/components/activity/InsightHistoryTabs";
import { Sparkles, ChevronRight, ChevronLeft, BrainCircuit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function PanelContent() {
  const { activeInsightVersion, activeSection } = useDashboard();

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 pb-3 border-b" style={{ borderColor: "var(--hairline-light)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" style={{ color: "var(--accent-yellow)" }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--navy-deep)", fontFamily: "'Quicksand', sans-serif" }}
            >
              Análisis con IA
            </span>
          </div>
        </div>
        <AiGenerateButton />
      </div>

      <div className="shrink-0 py-2">
        <InsightHistoryTabs />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeInsightVersion ? (
          <InsightsPanel
            insights={activeInsightVersion.insights}
            title={`Insights ${activeInsightVersion.period}`}
            subtitle={activeSection.toUpperCase()}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Sparkles className="h-8 w-8 mb-2 opacity-40" style={{ color: "var(--accent-yellow)" }} />
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
              Aún no hay análisis para este período.
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
              Haz clic en &quot;Generar Análisis con IA&quot; para comenzar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function RightInsightPanel() {
  const { rightPanelCollapsed, toggleRightPanel } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop panel */}
      <aside
        className="hidden lg:flex flex-col fixed right-0 z-30 transition-all duration-300 ease-in-out"
        style={{
          top: 76,
          height: "calc(100vh - 76px)",
          width: rightPanelCollapsed ? 48 : 400,
          background: "var(--white)",
          borderLeft: "1px solid var(--hairline-light-strong)",
        }}
      >
        {rightPanelCollapsed ? (
          <div className="flex flex-col items-center pt-4 gap-4">
            <button
              onClick={toggleRightPanel}
              className="inline-flex items-center justify-center h-9 w-9 transition-colors hover:bg-[var(--bg-light)]"
              style={{ borderRadius: 2, border: "1px solid var(--hairline-light)" }}
              aria-label="Expandir panel de insights"
            >
              <ChevronLeft className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
            </button>
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="h-5 w-5" style={{ color: "var(--accent-yellow)" }} />
              <div
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  color: "var(--text-muted)",
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                IA
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}
              >
                Panel de IA
              </span>
              <button
                onClick={toggleRightPanel}
                className="inline-flex items-center justify-center h-7 w-7 transition-colors hover:bg-[var(--bg-light)]"
                style={{ borderRadius: 2, border: "1px solid var(--hairline-light)" }}
                aria-label="Colapsar panel de insights"
              >
                <ChevronRight className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <PanelContent />
            </div>
          </div>
        )}
      </aside>

      {/* Mobile floating button + Sheet */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="fixed bottom-6 right-6 z-40 h-12 w-12 flex items-center justify-center shadow-lg"
            style={{
              background: "var(--navy-deep)",
              color: "#fff",
              borderRadius: "50%",
            }}
            aria-label="Abrir panel de insights"
          >
            <Sparkles className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85vw] max-w-[400px] p-0 flex flex-col"
            style={{ background: "var(--white)" }}
          >
            <div className="p-4 flex-1 min-h-0">
              <PanelContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
