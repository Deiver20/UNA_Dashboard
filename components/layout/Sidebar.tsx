"use client";

import {
  LayoutDashboard,
  Factory,
  UtensilsCrossed,
  Globe,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "produccion", label: "Producción", icon: Factory },
  { id: "consumo", label: "Consumo", icon: UtensilsCrossed },
  { id: "comercio", label: "Comercio Exterior", icon: Globe },
  { id: "poblacion", label: "Población", icon: Users },
];

export function Sidebar() {
  const [active, setActive] = useState("overview");

  const scrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      className="hidden lg:flex shrink-0 flex-col sticky self-start"
      style={{
        width: 268,
        background: "#06254B",
        color: "white",
        borderRight: "1px solid rgba(248,210,39,0.10)",
        top: 76,
        height: "calc(100vh - 76px)",
      }}
    >
      <div className="p-4">
        {/* Section label */}
        <div
          className="mb-3 flex items-center gap-2 px-3"
          style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.40)",
          }}
        >
          <span style={{ width: 22, height: 1, background: "#F8D227", display: "inline-block" }} />
          Navegación
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex w-full items-center gap-3.5 text-left transition-all"
                style={{
                  padding: "12px 28px",
                  gap: 14,
                  background: isActive ? "rgba(3,72,141,0.45)" : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.72)",
                  borderLeft: isActive ? "2px solid #F8D227" : "2px solid transparent",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                <Icon
                  className="shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    strokeWidth: 1.6,
                    color: isActive ? "#F8D227" : "rgba(255,255,255,0.72)",
                  }}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div
          className="p-3"
          style={{
            borderRadius: 2,
            border: "1px solid rgba(248,210,39,0.10)",
            background: "rgba(3,72,141,0.25)",
          }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'Quicksand', sans-serif" }}>Fuente de datos</p>
          <p className="mt-1 text-xs font-medium" style={{ color: "white", fontFamily: "'Quicksand', sans-serif" }}>
            Base Producción-Consumo
          </p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>1977 – 2025</p>
        </div>
      </div>
    </aside>
  );
}
