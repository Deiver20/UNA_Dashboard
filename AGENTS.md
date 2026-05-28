# Agent Rules — Dashboard Avícola México (ACD Layout v2 — UNA Design)

## Project Overview
This is a **Next.js 16 server-mode** dashboard for visualizing poultry production and consumption data in Mexico (1977–2025). It parses an Excel file at runtime and renders KPIs, line/area/bar/donut charts, and a data table via React Context. The UI follows the **Analytical Command Dashboard (ACD)** layout pattern combined with the **UNA institutional design system**: editorial Playfair Display headings, Quicksand UI, navy/yellow palette, and data-driven content only. An **AI-powered insights panel** (OpenAI GPT-4o-mini) generates automatic analytics for each section, persisted in `localStorage` with historical versioning.

## Stack
- **Framework**: Next.js 16.2.6 (server mode, no static export)
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS v4 + `tw-animate-css`
- **UI Components**: shadcn/ui (customized, see `components/ui/`)
- **Charts**: Recharts + custom SVG (donut)
- **Fonts**: Playfair Display (headings) + Quicksand (UI/body) + JetBrains Mono (numbers)
- **Data Parsing**: `xlsx` library for client-side Excel parsing
- **AI Integration**: OpenAI GPT-4o-mini via API Route (`app/api/insights`)
- **Build Output**: Next.js server build (requires `npm run start` or `next dev`)
- **Theming**: CSS custom properties with `next-themes` (attribute `data-theme`)

## Architecture

```
dashboard-next/
├── app/
│   ├── layout.tsx          # Root layout: Playfair + Quicksand + JetBrains fonts, ThemeProvider, DashboardProvider
│   ├── page.tsx              # Main dashboard page: loads data, renders all ACD zones + RightInsightPanel
│   ├── detalle/page.tsx      # Standalone full-width data table page ("Datos Detallados")
│   ├── api/insights/route.ts # API Route: OpenAI GPT-4o-mini integration for AI insights
│   └── globals.css           # Tailwind directives + UNA theme tokens (light/dark)
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Zone 1 — 76px sticky topbar, search, section tabs, notifications, avatar, dark toggle
│   │   ├── RightInsightPanel.tsx # Zone 2 (right) — 400px colapsable fixed panel: AI insights + history + generate button
│   │   ├── KpiCards.tsx          # Zone 3 — 4 stat cards, UNA style (yellow square bullet, Playfair numbers, deltas)
│   │   ├── GlobalFilters.tsx     # Sticky filter bar: product toggles + year range slider
│   │   ├── MainContentRow.tsx    # Zone 4 — 60/40 split on Overview (PrimaryChart + Donut), full-width on other sections
│   │   ├── PrimaryChart.tsx      # Section-aware chart wrapper (line/area/bar/composed)
│   │   └── SecondaryWidget.tsx   # Donut chart with concept dropdown + year slider (Overview only)
│   ├── charts/
│   │   ├── LineChartSection.tsx    # Overview: temporal line chart with product/concept selectors
│   │   ├── CombinedChart.tsx       # Producción: bar + line combo
│   │   ├── ProductionChart.tsx     # Producción multi-product line
│   │   ├── ConsumptionAreaChart.tsx # Consumo: area chart
│   │   ├── TradeChart.tsx          # Comercio: grouped bars
│   │   ├── PopulationVsConceptChart.tsx # Población: bars (concept) + line (population) dual axis
│   │   ├── BalanceComercialChart.tsx    # Balance Comercial: import/export grouped bars with surplus/deficit tooltip
│   │   └── ChartWrapper.tsx        # Hydration-safe wrapper
│   ├── table/
│   │   └── DataTable.tsx           # Sortable table with CAGR column + Trend badges (Ascendente/Estable/Descendente)
│   ├── activity/
│   │   ├── InsightsPanel.tsx       # Renders a list of InsightItem with badges
│   │   ├── AiGenerateButton.tsx    # "Generar Análisis con IA" button with loading state
│   │   └── InsightHistoryTabs.tsx  # Year selector + version tabs for generated insights
│   ├── ui/                         # shadcn/ui primitives
│   └── theme-provider.tsx          # next-themes provider (attribute data-theme)
├── lib/
│   ├── data.ts                     # Excel parser + year helpers
│   ├── ai-client.ts                # Client-side fetcher for /api/insights
│   ├── filters.tsx                 # DashboardProvider: state, filters, data loading, section switching, search, deltas, insights, AI history
│   └── utils.ts                    # `cn()` utility
├── types/
│   └── index.ts                    # DataRow, Concepto, FilterState, Section, KpiDelta, InsightItem, AiInsightVersion
├── public/
│   └── base produccion-consumo.xlsx
└── next.config.ts
```

## ACD Zone Structure

### Zone 1 — Top Navigation Bar (`components/layout/Header.tsx`)
- **76px height**, sticky top, white background, border-bottom hairline
- Left: Logo mark (AV) + app name in Playfair Display
- Center: Global search input (filters table data via `searchQuery`)
- Center-right: Section tabs (Overview, Producción, Consumo, Comercio Exterior, Población, Balance Comercial)
- Right: "Datos Detallados" link, theme toggle, notification bell with real badge count, user avatar dropdown
- Mobile: hamburger menu opens Sheet with navigation + Datos Detallados + theme toggle

### Zone 2 — Right Insight Panel (`components/layout/RightInsightPanel.tsx`)
- **Fixed right, 400px wide (48px collapsed)**, full height, sticky top-[76px]
- Background: white (`var(--white)`), border-left hairline
- Desktop: collapsible via chevron button; collapsed state shows Sparkles icon + "IA" vertical label
- Mobile: hidden on desktop; floating FAB button (bottom-right) opens Sheet (slide-out from right)
- Content: AI Generate Button → History Tabs (year selector + version chips) → InsightsPanel
- Each generated analysis creates a new version tab (e.g., "2025", "2025-v2") per section/year
- Versions persisted in `localStorage`; limit 50 versions total

### Zone 3 — KPI Strip (`components/layout/KpiCards.tsx`)
- 4 stat cards in `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- Each card: Playfair number (32px) + Quicksand label (10px uppercase tracked) + yellow square rotated 45° bullet
- YoY delta indicator (↑↓) with UNA semantic colors (`#2e8b57` / `#b85c00`)
- Segmented control for product switching (pollo/huevo/pavo) — square buttons, uppercase tracked

### Zone 4 — Main Content Row
#### Overview (60/40 split)
- **4A — Primary Chart (60%)**: `LineChartSection` with product + concept dropdowns + year range
- **4B — Secondary Widget (40%)**: Donut SVG chart with concept dropdown, data from `activeYear`, emoji icons inside slices, legend below

#### Other Sections (100% width)
- **Producción**: `CombinedChart` (bar + line)
- **Consumo**: `ConsumptionAreaChart`
- **Comercio Exterior**: `TradeChart`
- **Población**: `PopulationVsConceptChart` — bars for selected product/concept + red line for population, dual Y axis
- **Balance Comercial**: `BalanceComercialChart` — grouped bars (imports/exports) with surplus/deficit tooltip

## Data Flow
1. On mount, `page.tsx` calls `reloadFromFile()` from context.
2. `lib/data.ts` parses the Excel into `DataRow[]` objects.
3. Filtering logic in `DashboardProvider` applies year range, concepto, and producto filters.
4. Chart and table components consume `filteredData` from `useDashboard()`.
5. Real-time search filters the table via `searchedData`.
6. Section switching (`activeSection`) drives which charts AND which insights are displayed.
7. KPI deltas are computed YoY (`activeYear` vs `activeYear - 1`).
8. AI insights are generated on demand via the "Generar Análisis con IA" button in `RightInsightPanel`.
9. The client prepares an aggregated `dataSnapshot` per section and sends it to `POST /api/insights`.
10. The server calls OpenAI GPT-4o-mini and returns structured `InsightItem[]`.
11. Each generation is stored as an `AiInsightVersion` in React Context and persisted to `localStorage` (max 50 versions).
12. Users can navigate between versions via `InsightHistoryTabs` (grouped by year/period).

## Color System (UNA)
```css
:root {
  --navy-deep: #06254B;
  --navy-primary: #03488D;
  --bg-light: #F2F8FF;
  --accent-yellow: #F8D227;
  --text-dark: #1C1C1C;
  --text-muted: #5a6478;
  --success: #2e8b57;
  --warning: #b85c00;
}
[data-theme="dark"] {
  --bg-light: #0a1628;
  --text-dark: #e2e8f0;
  --navy-primary: #4f8ef7;
}
```

### Product Colors (all charts)
- **Pollo**: `#06254B`
- **Huevo**: `#03488D`
- **Pavo**: `#F8D227`

## Typography
- **Headings**: Playfair Display 500, italic accent with `<em class="acc">`, end in period
- **UI/Body**: Quicksand 400–700, uppercase tracked for labels
- **Mono**: JetBrains Mono for numbers, pagination, KPI values
- **Eyebrow**: 11px Quicksand 600, uppercase, tracking 0.3em, yellow hairline prefix

## Important Build Notes
- **Server Mode**: `next.config.ts` no longer uses `output: 'export'`. Run locally with `pnpm dev` or build with `pnpm build && pnpm start`.
- **Images**: `images.unoptimized: true` is required.
- **Runtime Data**: The Excel is fetched client-side; ensure `public/base-produccion-consumo.xlsx` is present.
- **Environment Variables**: Create `.env.local` and set `OPENAI_API_KEY=sk-...` to enable AI insights generation.

## Conventions
- Layout components live in `components/layout/`. Chart components in `components/charts/`.
- shadcn/ui components in `components/ui/` should not be heavily modified; wrap them if needed.
- Theme colors use CSS custom properties (`var(--navy-deep)`, etc.) defined in `globals.css`.
- All new layout components use `una-card` class for consistent UNA card styling.
- All data-driven UI (badges, insights, deltas) must derive from real `DataRow[]`, never mock/hardcoded values.
- When editing this project, read the relevant guide in `node_modules/next/dist/docs/` if unsure about Next.js 16 APIs.
