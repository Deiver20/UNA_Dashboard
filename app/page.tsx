"use client";

import { useEffect } from "react";
import { useDashboard } from "@/lib/filters";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { KpiCards } from "@/components/layout/KpiCards";
import { GlobalFilters } from "@/components/layout/GlobalFilters";
import { LineChartSection } from "@/components/charts/LineChartSection";
import { CombinedChart } from "@/components/charts/CombinedChart";
import { ProductionChart } from "@/components/charts/ProductionChart";
import { ConsumptionAreaChart } from "@/components/charts/ConsumptionAreaChart";
import { PerCapitaChart } from "@/components/charts/PerCapitaChart";
import { TradeChart } from "@/components/charts/TradeChart";
import { BalanceChart } from "@/components/charts/BalanceChart";
import { PopulationChart } from "@/components/charts/PopulationChart";
import { LayingHensChart } from "@/components/charts/LayingHensChart";
import { ProductionDistributionChart } from "@/components/charts/ProductionDistributionChart";
import { DataTable } from "@/components/table/DataTable";

export default function DashboardPage() {
  const { data, loading, error, reloadFromFile } = useDashboard();

  useEffect(() => {
    if (data.length === 0 && !loading && !error) {
      reloadFromFile();
    }
  }, [data.length, loading, error, reloadFromFile]);

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F2F8FF', color: '#1C1C1C' }}>
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#03488D] border-t-transparent mx-auto" />
          <p className="text-sm" style={{ color: '#5a6478' }}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F2F8FF', color: '#1C1C1C' }}>
        <div className="text-center max-w-md px-6">
          <p className="text-lg font-semibold mb-2" style={{ color: '#b85c00' }}>Error</p>
          <p className="text-sm mb-4" style={{ color: '#5a6478' }}>{error}</p>
          <button
            onClick={reloadFromFile}
            className="btn-filled"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col" style={{ background: '#F2F8FF' }}>
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 min-w-0">
          <GlobalFilters />
          
          <div className="p-6 space-y-6">
            <KpiCards />

            <div id="overview" className="scroll-mt-20">
              <LineChartSection />
            </div>

            <div id="produccion" className="scroll-mt-20">
              <CombinedChart />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ProductionChart />
              <ProductionDistributionChart />
            </div>

            <div id="consumo" className="scroll-mt-20">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ConsumptionAreaChart />
                <PerCapitaChart />
              </div>
            </div>

            <div id="comercio" className="scroll-mt-20">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <TradeChart />
                <BalanceChart />
              </div>
            </div>

            <div id="poblacion" className="scroll-mt-20">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <PopulationChart />
                <LayingHensChart />
              </div>
            </div>

            <DataTable />

            <footer className="text-center py-4" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', color: '#5a6478' }}>
              Dashboard Avícola México — Datos 1977-2025
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
