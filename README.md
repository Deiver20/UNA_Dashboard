# Dashboard Avícola México

Un dashboard interactivo construido con **Next.js** para visualizar la producción y el consumo avícola en México durante el periodo **1977–2025**.

![Dashboard Preview](public/window.svg)

## Características

- **Filtros globales**: rango de años, productos (pollo, pavo, huevo) y conceptos.
- **KPIs**: métricas clave resumidas para el año activo.
- **Visualizaciones**:
  - Gráficos de líneas (tendencias generales)
  - Gráficos de área y barras (producción y consumo)
  - Gráficos de dona (distribución)
  - Gráficos de comercio exterior (importaciones / exportaciones / balance)
  - Gráficos de población y aves de postura
- **Tabla de datos**: exploración detallada con `@tanstack/react-table`.
- **Tema oscuro**: diseño profesional con paleta de colores personalizada.

## Stack tecnológico

- [Next.js](https://nextjs.org/) 16 — framework React con App Router
- [React](https://react.dev/) 19 — biblioteca de UI
- [Tailwind CSS](https://tailwindcss.com/) v4 — utilidades de estilo
- [shadcn/ui](https://ui.shadcn.com/) — componentes base accesibles
- [Recharts](https://recharts.org/) + [ECharts](https://echarts.apache.org/) — motores de gráficos
- [xlsx](https://www.npmjs.com/package/xlsx) — parsing de Excel en el cliente

## Requisitos previos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Compilación (export estático)

```bash
npm run build
```

El resultado se genera en la carpeta `/dist` como archivos estáticos HTML/CSS/JS. Puedes desplegar esos archivos en cualquier servicio de hosting estático (Vercel, GitHub Pages, Netlify, AWS S3, etc.).

> **Nota**: Este proyecto usa `output: 'export'` en `next.config.ts`, por lo que no admite rutas de API ni renderizado del lado del servidor.

## Datos

La fuente de datos es el archivo Excel ubicado en:

```
public/base produccion-consumo.xlsx
```

El dashboard lo descarga y parsea en tiempo de ejecución mediante la librería `xlsx`. Asegúrate de que este archivo esté presente antes de compilar.

## Estructura del proyecto

```
dashboard-next/
├── app/                    # Páginas y estilos (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── charts/             # Componentes de gráficos
│   ├── layout/             # Header, Sidebar, Filtros, KPIs
│   ├── table/              # Tabla de datos
│   └── ui/                 # Componentes shadcn/ui
├── lib/
│   ├── data.ts             # Parser de Excel y helpers
│   ├── filters.tsx         # Contexto global (DashboardProvider)
│   └── utils.ts            # Utilidades de clases CSS
├── types/
│   └── index.ts            # Tipos de TypeScript
├── public/                 # Archivos estáticos (incluye el Excel)
└── next.config.ts
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Compilación estática en `/dist` |
| `npm run start` | Servidor de producción (requiere build previo) |
| `npm run lint` | Linter con ESLint |

## Licencia

Uso interno / privado.
