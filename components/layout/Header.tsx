"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useDashboard } from "@/lib/filters";
import type { Section } from "@/types";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Factory,
  UtensilsCrossed,
  Globe,
  Users,
  ArrowRightLeft,
  Feather,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "produccion", label: "Producción", icon: Factory },
  { id: "consumo", label: "Consumo", icon: UtensilsCrossed },
  { id: "comercio", label: "Comercio Exterior", icon: Globe },
  { id: "poblacion", label: "Población", icon: Users },
  { id: "balance comercial", label: "Balance Comercial", icon: ArrowRightLeft },
  { id: "aves de postura", label: "Aves de Postura", icon: Feather },
];

export function Header() {
  const { activeSection, setActiveSection, insights } = useDashboard();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        height: 76,
        background: 'var(--white)',
        borderColor: 'var(--hairline-light-strong)',
      }}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger aria-label="Abrir menú" className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--bg-light)] lg:hidden">
              <Menu className="h-5 w-5" style={{ color: 'var(--text-dark)' }} />
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0" style={{ background: 'var(--navy-deep)', borderColor: 'var(--hairline-yellow)' }} showCloseButton={false}>
              <MobileMenuContent onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <div
            className="flex h-9 w-9 items-center justify-center shrink-0"
            style={{
              background: 'var(--bg-light)',
              borderRadius: 2,
              border: '1px solid var(--hairline-light)',
            }}
          >
            <span className="font-bold text-sm font-heading" style={{ color: 'var(--navy-primary)' }}>
              AV
            </span>
          </div>
          <div className="hidden sm:block">
            <h1
              className="text-base sm:text-lg font-semibold tracking-tight truncate"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--navy-deep)',
                fontWeight: 500,
              }}
            >
              Dashboard Avícola México
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)', fontFamily: "'Quicksand', sans-serif" }}>
              Producción y Consumo Avícola (1977–2025)
            </p>
          </div>
        </div>

        {/* Center-right: Section Tabs (hidden on small screens) */}
        <nav className="hidden lg:flex items-center gap-1 mr-4">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className="relative px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: 2,
                  background: isActive ? 'var(--navy-deep)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                }}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Datos Detallados + Notifications + Theme + Avatar */}
        <div className="flex items-center gap-2">
          {/* Datos Detallados link */}
          <Link
            href="/detalle"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{
              borderRadius: 2,
              border: '1px solid var(--hairline-light-ui)',
              color: 'var(--text-dark)',
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            <Table2 className="h-3.5 w-3.5" style={{ color: 'var(--navy-primary)' }} />
            Datos Detallados
          </Link>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cambiar tema"
            className="h-9 w-9"
            style={{ borderRadius: 2, border: '1px solid var(--hairline-light-ui)' }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <Moon className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Insights" className="relative h-9 w-9" style={{ borderRadius: 2, border: '1px solid var(--hairline-light-ui)' }}>
                  <Bell className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-72" style={{ background: 'var(--white)', borderColor: 'var(--hairline-light)', borderRadius: 2 }}>
              <DropdownMenuLabel style={{ color: 'var(--text-dark)', fontFamily: "'Quicksand', sans-serif", fontSize: 12 }}>Insights</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'var(--hairline-light)' }} />
              {insights.length === 0 ? (
                <div className="px-3 py-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Sin insights disponibles
                </div>
              ) : (
                insights.slice(0, 5).map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2 cursor-pointer">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-dark)' }}>{n.title}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{n.description}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0 overflow-hidden" style={{ border: '1px solid var(--hairline-light-ui)', borderRadius: '50%' }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'var(--navy-primary)', color: '#fff', fontFamily: "'Playfair Display', serif" }}>
                    DP
                  </div>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48" style={{ background: 'var(--white)', borderColor: 'var(--hairline-light)', borderRadius: 2 }}>
              <DropdownMenuLabel style={{ color: 'var(--text-dark)' }}>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'var(--hairline-light)' }} />
              <DropdownMenuItem className="text-xs cursor-pointer" style={{ color: 'var(--text-dark)' }}>Perfil</DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" style={{ color: 'var(--text-dark)' }}>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: 'var(--hairline-light)' }} />
              <DropdownMenuItem className="text-xs cursor-pointer" style={{ color: 'var(--warning)' }}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function MobileMenuContent({ onNavigate }: { onNavigate: () => void }) {
  const { activeSection, setActiveSection } = useDashboard();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--hairline-yellow)' }}>
        <span className="text-sm font-semibold" style={{ color: '#fff', fontFamily: "'Playfair Display', serif" }}>Menú</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNavigate}>
          <X className="h-4 w-4" style={{ color: '#fff' }} />
        </Button>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => { setActiveSection(sec.id); onNavigate(); }}
              className="flex w-full items-center gap-3 text-left transition-all"
              style={{
                padding: '12px 28px',
                gap: 14,
                background: isActive ? 'rgba(3,72,141,0.45)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
                borderLeft: isActive ? '2px solid #F8D227' : '2px solid transparent',
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 13.5,
                fontWeight: 500,
              }}
            >
              <Icon className="shrink-0" style={{ width: 18, height: 18, strokeWidth: 1.6, color: isActive ? '#F8D227' : 'rgba(255,255,255,0.72)' }} />
              <span className="truncate">{sec.label}</span>
            </button>
          );
        })}
        <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(248,210,39,0.15)' }}>
          <Link
            href="/detalle"
            onClick={onNavigate}
            className="flex w-full items-center gap-3 text-left transition-all"
            style={{
              padding: '12px 28px',
              gap: 14,
              color: 'rgba(255,255,255,0.72)',
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 13.5,
              fontWeight: 500,
            }}
          >
            <Table2 className="shrink-0" style={{ width: 18, height: 18, strokeWidth: 1.6, color: 'rgba(255,255,255,0.72)' }} />
            <span className="truncate">Datos Detallados</span>
          </Link>
        </div>
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'var(--hairline-yellow)' }}>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ color: 'rgba(255,255,255,0.72)', border: '1px solid rgba(248,210,39,0.30)' }}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
    </div>
  );
}
