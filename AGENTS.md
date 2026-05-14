# Agent Rules — Dashboard Avícola México

## Project Overview
This is a **static-export Next.js 16** dashboard for visualizing poultry production and consumption data in Mexico (1977–2025). It parses an Excel file at runtime and renders KPIs, line/area/bar/donut charts, and a data table via React Context.

## Stack
- **Framework**: Next.js 16.2.6 (`output: 'export'`, `distDir: 'dist'`)
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS v4 + `tw-animate-css`
- **UI Components**: shadcn/ui (customized, see `components/ui/`)
- **Charts**: Recharts + ECharts (`echarts-for-react`)
- **Fonts**: Syne + Space Mono (Google Fonts)
- **Data Parsing**: `xlsx` library for client-side Excel parsing
- **Build Output**: Fully static HTML/JS/CSS in `/dist` (no SSR at deploy time)

## Architecture

```
dashboard-next/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout, fonts, DashboardProvider wrapper, dark mode
│   ├── page.tsx              # Main dashboard page: loads data, renders all sections
│   └── globals.css           # Tailwind directives + custom dark theme tokens
├── components/
│   ├── layout/               # Header, Sidebar, KpiCards, GlobalFilters
│   ├── charts/               # All chart components (Recharts / ECharts)
│   ├── table/                # DataTable (Tanstack Table)
│   ├── ui/                   # shadcn/ui primitives (Button, Card, Select, etc.)
│   └── theme-provider.tsx    # next-themes provider
├── lib/
│   ├── data.ts               # Excel parser (`parseExcel`) + year helpers
│   ├── filters.tsx           # DashboardProvider (React Context): state, filters, data loading
│   └── utils.ts              # `cn()` utility (Tailwind class merging)
├── types/
│   └── index.ts              # TypeScript types: DataRow, Concepto, FilterState
├── data/
│   └── data.json             # Pre-exported JSON copy of the dataset (fallback / reference)
├── public/
│   └── base produccion-consumo.xlsx   # Source Excel file fetched at runtime
└── next.config.ts            # `output: 'export'` and `images.unoptimized`
```

## Data Flow
1. On mount, `page.tsx` calls `reloadFromFile()` from context.
2. `reloadFromFile()` fetches `/base produccion-consumo.xlsx` from `public/`.
3. `lib/data.ts` parses the Excel into `DataRow[]` objects:
   - `año: number`
   - `cantidad: number`
   - `unidades: string`
   - `concepto: 'poblacion' | 'aves de postura' | 'produccion' | 'importaciones' | 'exportaciones' | 'consumo' | 'consumo per capita'`
   - `producto: 'huevo' | 'pavo' | 'pollo' | null`
4. Filtering logic in `DashboardProvider` applies year range, concepto, and producto filters.
5. Chart and table components consume `filteredData` from `useDashboard()`.

## Important Build Notes
- **Static Export**: `next.config.ts` sets `output: 'export'`. The app does not use API routes or server-side rendering.
- **Images**: `images.unoptimized: true` is required because static export cannot use Next.js Image Optimization.
- **Runtime Data**: The Excel is fetched client-side; ensure `public/base produccion-consumo.xlsx` is present before building/deploying.
- **No `.env` required**: This project has no secrets or environment-specific config.

## Conventions
- Use kebab-case for file names (`line-chart-section.tsx` is preferred, though existing files use PascalCase).
- Chart components live in `components/charts/` and are named after the chart type + `Chart` (e.g., `TradeChart.tsx`).
- Layout components live in `components/layout/`.
- shadcn/ui components live in `components/ui/` and should not be heavily modified; wrap them if customization is needed.
- Theme colors are hardcoded in Tailwind arbitrary values (e.g., `bg-[#0f1628]`); avoid changing them unless doing a full rebrand.

## When editing this project
1. Read the relevant guide in `node_modules/next/dist/docs/` if unsure about Next.js 16 APIs — this version has breaking changes from earlier Next.js versions.
2. If adding a new chart, follow the existing pattern: accept no props (or minimal props), read data from `useDashboard()`, and use Recharts or ECharts as appropriate.
3. If modifying data parsing, update `lib/data.ts` and ensure `types/index.ts` stays in sync.
