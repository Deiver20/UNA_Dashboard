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
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0f1628] sticky top-16 self-start h-[calc(100vh-4rem)]">
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1a2240] text-[#4f8ef7] border border-[#4f8ef7]/20"
                    : "text-[#94a3b8] hover:bg-[#1a2240]/60 hover:text-[#e2e8f0]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-lg border border-white/[0.06] bg-[#1a2240] p-3">
          <p className="text-xs text-[#94a3b8]">Fuente de datos</p>
          <p className="mt-1 text-xs font-medium text-[#e2e8f0]">
            Base Producción-Consumo
          </p>
          <p className="text-[10px] text-[#94a3b8]">1977 – 2025</p>
        </div>
      </div>
    </aside>
  );
}
