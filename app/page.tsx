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
      <div className="flex min-h-screen items-center justify-center bg-[#0f1628] text-[#e2e8f0]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#4f8ef7] border-t-transparent mx-auto" />
          <p className="text-sm text-[#94a3b8]">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1628] text-[#e2e8f0]">
        <div className="text-center max-w-md px-6">
          <p className="text-lg font-semibold text-[#f7734f] mb-2">Error</p>
          <p className="text-sm text-[#94a3b8] mb-4">{error}</p>
          <button
            onClick={reloadFromFile}
            className="rounded-md bg-[#4f8ef7] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a7de4]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[#0f1628]">
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

            <footer className="text-center text-xs text-[#94a3b8] py-4">
              Dashboard Avícola México — Datos 1977-2025
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
