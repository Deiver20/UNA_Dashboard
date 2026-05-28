"use client";

import { useEffect } from "react";
import { useDashboard } from "@/lib/filters";
import { Header } from "@/components/layout/Header";
import { KpiCards } from "@/components/layout/KpiCards";
import { GlobalFilters } from "@/components/layout/GlobalFilters";
import { MainContentRow } from "@/components/layout/MainContentRow";
import { RightInsightPanel } from "@/components/layout/RightInsightPanel";

export default function DashboardPage() {
  const { data, loading, error, reloadFromFile, rightPanelCollapsed } = useDashboard();

  useEffect(() => {
    if (data.length === 0 && !loading && !error) {
      reloadFromFile();
    }
  }, [data.length, loading, error, reloadFromFile]);

  if (loading && data.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--navy-primary)] border-t-transparent mx-auto" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
        <div className="text-center max-w-md px-6">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--warning)' }}>Error</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
          <button
            onClick={reloadFromFile}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: 'var(--navy-primary)', color: '#fff', borderRadius: 2 }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-light)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <main
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            rightPanelCollapsed ? 'lg:mr-[48px]' : 'lg:mr-[400px]'
          }`}
        >
          <div className="flex-none">
            <GlobalFilters />
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 gap-4">
            <div className="flex-none">
              <KpiCards />
            </div>
            <div className="flex-1 min-h-auto">
              <MainContentRow />
            </div>
          </div>
        </main>
        <RightInsightPanel />
      </div>
    </div>
  );
}
