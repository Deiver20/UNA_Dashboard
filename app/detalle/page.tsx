"use client";

import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/table/DataTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DetallePage() {
  return (
    <div className="min-h-full" style={{ background: 'var(--bg-light)' }}>
      <Header />
      <main className="min-h-full flex flex-col px-6 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: "var(--navy-primary)", fontFamily: "'Quicksand', sans-serif" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al dashboard
          </Link>
        </div>

        <div>
          <div className="section-eyebrow">DATOS COMPLETOS</div>
          <h1
            className="text-xl font-heading"
            style={{ color: "var(--navy-deep)", fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            Datos Detallados.
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
            Tabla completa de producción, consumo, comercio y demografía (1977–2025).
          </p>
        </div>

        <div className="una-card h-[calc(100vh-260px)] min-h-[400px]">
          <DataTable />
        </div>
      </main>
    </div>
  );
}
