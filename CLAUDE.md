# CLAUDE.md — Executive Summary for Claude

## What this is
A static-export Next.js dashboard that visualizes **poultry production and consumption statistics in Mexico** from 1977 to 2025. It is a single-page app with a dark UI, global filters, KPI cards, multiple chart sections, and a data table.

## How it works (30-second version)
- **Data source**: An Excel file (`base produccion-consumo.xlsx`) placed in `public/`.
- **Load**: `page.tsx` triggers `reloadFromFile()` on mount via React Context.
- **Parse**: The `xlsx` library converts the Excel into typed `DataRow[]` objects in the browser.
- **State**: `DashboardProvider` (in `lib/filters.tsx`) holds all data, filter state, and the active year / selected product.
- **Render**: Every chart and the table consume `filteredData` from `useDashboard()`.

## Key files to know
| File | Purpose |
|---|---|
| `app/page.tsx` | Main page. Orchestrates data loading and lays out all dashboard sections. |
| `lib/filters.tsx` | React Context provider. Contains `useDashboard()` hook and all filter logic. |
| `lib/data.ts` | Excel parser and year-helper functions. |
| `types/index.ts` | `DataRow`, `Concepto`, `FilterState` TypeScript definitions. |
| `next.config.ts` | Static export config (`output: 'export'`, `distDir: 'dist'`). |

## Design & styling
- Dark theme only (`bg-[#0f1628]`, text `[#e2e8f0]`).
- Uses Tailwind CSS v4 arbitrary values heavily.
- Fonts: Syne (headings/ UI) and Space Mono (data/mono text).
- shadcn/ui components in `components/ui/` are used for selects, buttons, cards, tables, etc.

## Adding or changing charts
- Add a new component in `components/charts/`.
- Import it in `app/page.tsx` and place it inside the appropriate `scroll-mt-20` section (or create a new section).
- Use `const { filteredData, activeYear, selectedProduct } = useDashboard();` to access data.
- Prefer **Recharts** for standard charts; use **ECharts** (via `echarts-for-react`) only for complex or highly customized visualizations.

## Build & deploy
```bash
npm install
npm run build     # outputs to /dist (static files)
```
- No server required. Deploy the contents of `/dist` to any static host (Vercel, GitHub Pages, Netlify, S3, etc.).
- Make sure `public/base produccion-consumo.xlsx` exists before building.

## Dependencies worth noting
- `xlsx` — client-side Excel parsing.
- `recharts` — primary charting library.
- `echarts` + `echarts-for-react` — secondary for specialized charts.
- `@tanstack/react-table` — table engine.
- `framer-motion` — available for animations (used sparingly currently).

## What NOT to do
- Do not add server-side API routes (`output: 'export'` forbids them).
- Do not rely on `next/image` optimization (disabled via `images.unoptimized: true`).
- Do not commit `node_modules`, `.next/`, or `/dist`.
