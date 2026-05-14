# Website Design System & Prompt Guide — UNA Admin Panel

> **For:** Lovable, Bolt, v0, Framer AI and similar AI website generators.
> **How to use:** Paste this entire Markdown file into the AI tool's system prompt, project knowledge, or context window. Then prompt it with the new page you want — e.g. *"Create a `/admin/asociados` page following the design system."* The tool will produce a page that matches the existing UNA admin panel (sidebar shell, navy/yellow editorial style).

---

## 0. TL;DR — Identity in One Sentence

A **Mexican institutional admin panel**: editorial Playfair Display headings paired with humanist Quicksand UI, rendered as a **fixed navy-deep sidebar** + **light blue (#F2F8FF) workspace**, where data cards are flat with hairline borders, the only accent color is **warm yellow (#F8D227)** used like gold leaf, and every section opens with an **eyebrow + italic-accented H1/H2 ending in a period**.

The product is the back-office for the *Unión Nacional de Avicultores* (UNA) — a 65-year-old Mexican poultry industry association. The panel must read as **serious, institutional, slightly editorial — never as a SaaS startup dashboard**.

---

## 1. Architecture & Layout Skeleton

Every admin page is built on a **two-column shell**:

```
┌──────────┬───────────────────────────────────────┐
│          │  TOPBAR  (76px, white, sticky)        │
│ SIDEBAR  ├───────────────────────────────────────┤
│ 268px    │                                       │
│ navy     │  CONTENT (#F2F8FF, padding 44px 48px) │
│ #06254B  │                                       │
│ fixed    │   ┌─ Page head (eyebrow + H1 + lead) │
│          │   ├─ KPI grid                         │
│          │   ├─ Chart cards                      │
│          │   └─ Data tables / detail cards       │
│          │                                       │
└──────────┴───────────────────────────────────────┘
```

### Required CSS variables (paste into `:root`)
```css
:root {
  --navy-deep: #06254B;
  --navy-primary: #03488D;
  --bg-light: #F2F8FF;
  --white: #FFFFFF;
  --footer-charcoal: #1C1C1C;
  --accent-yellow: #F8D227;
  --text-dark: #1C1C1C;
  --text-editorial: #3a4256;
  --text-muted: #5a6478;
  --hairline-light: rgba(6, 37, 75, 0.06);
  --hairline-light-strong: rgba(6, 37, 75, 0.10);
  --hairline-light-ui: rgba(6, 37, 75, 0.15);
  --hairline-yellow: rgba(248, 210, 39, 0.25);
  --shadow-rest: 0 2px 12px rgba(6, 37, 75, 0.04);
  --shadow-hover: 0 14px 36px rgba(6, 37, 75, 0.10);
  --shadow-modal: 0 40px 80px rgba(6, 37, 75, 0.30);
  --success: #2e8b57;
  --warning: #b85c00;
  --sidebar-w: 268px;
  --topbar-h: 76px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Quicksand', sans-serif; background: var(--bg-light); color: var(--text-dark); }
h1, h2, h3, h4 { font-family: 'Playfair Display', serif; font-weight: 500; letter-spacing: -0.01em; color: var(--navy-deep); }
em.acc        { font-style: italic; color: var(--navy-primary); font-weight: 400; }
em.acc-yellow { font-style: italic; color: var(--accent-yellow); font-weight: 400; }
```

### Required font import
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Quicksand:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 2. Color Palette — Roles & Usage

### Brand
| Token | Value | Use |
|-------|-------|-----|
| `--navy-deep` | `#06254B` | Sidebar background, all H1/H2/H3 text, page-header dark sections, primary buttons on dark |
| `--navy-primary` | `#03488D` | Italic emphasis on light, secondary headers, primary action buttons, chart series, links |
| `--accent-yellow` | `#F8D227` | **Gold leaf only** — eyebrow hairlines, KPI dot markers (8px rotated 45°), active sidebar item indicator, status pulses, pending badges, italic accents on dark, never as a fill |

### Surfaces
| Token | Value | Use |
|-------|-------|-----|
| `--white` | `#FFFFFF` | Cards, topbar, modals |
| `--bg-light` | `#F2F8FF` | Main workspace background, KPI tile interiors, search field, modal foot |
| `--footer-charcoal` | `#1C1C1C` | Reserved for marketing-site footer (not used in admin) |

### Text
| Token | Value | Use |
|-------|-------|-----|
| `--text-dark` | `#1C1C1C` | Default body on light |
| `--text-editorial` | `#3a4256` | Long-form paragraph text in cards/modals |
| `--text-muted` | `#5a6478` | Helper, eyebrow body, table secondary, KPI sublabels |
| `rgba(255,255,255,0.72)` | — | Sidebar nav links resting |
| `rgba(255,255,255,0.40)` | — | Sidebar section labels, version stamp |

### Hairlines
- `rgba(6, 37, 75, 0.06)` — card borders, table rows
- `rgba(6, 37, 75, 0.10)` — section dividers
- `rgba(6, 37, 75, 0.15)` — input/button outlines
- `rgba(248, 210, 39, 0.25)` — yellow accent dividers, dark-side borders

### Semantic
- `--success: #2e8b57` — positive deltas (▲)
- `--warning: #b85c00` — negative deltas (▼) and "confirmation required" eyebrow

### Shadows (use sparingly — design is essentially flat at rest)
- `--shadow-rest: 0 2px 12px rgba(6, 37, 75, 0.04)` — card resting
- `--shadow-hover: 0 14px 36px rgba(6, 37, 75, 0.10)` — card hover
- `--shadow-modal: 0 40px 80px rgba(6, 37, 75, 0.30)` — dialog elevation

---

## 3. Typography Rules

**Two families. Never mix.**
- `Playfair Display` — ALL headings, large numbers, italic accent fragments. Never below 24px.
- `Quicksand` — body, UI, eyebrows, buttons, labels, table data, captions.
- `JetBrains Mono` — sidebar version stamp, kbd hints, mono captions only.

### Hierarchy

| Role | Font | Size | Weight | Line H. | Tracking | Notes |
|------|------|------|--------|---------|----------|-------|
| Page H1 | Playfair Display | 52px | 500 | 1.0 | -0.01em | Italic emphasis with `<em class="acc">` |
| Card / Section H2 | Playfair Display | 30px | 500 | 1.1 | -0.01em | Italic accent + period |
| Card H3 | Playfair Display | 22px | 500 | 1.1 | -0.01em | Italic accent + period |
| KPI Big Number | Playfair Display | 46px | 500 | 1.0 | -0.02em | `<small>` 18px italic navy-primary unit |
| Body | Quicksand | 14–15px | 400 | 1.6–1.75 | normal | Default paragraphs |
| Body Small / Helper | Quicksand | 12–13px | 400–500 | 1.5 | normal | Card sub, table cells |
| Eyebrow Label | Quicksand | 10–11px | 600 | 1 | 0.3em | UPPERCASE; preceded by 24–32px × 1px yellow hairline |
| Sidebar Section Label | Quicksand | 10px | 600 | 1 | 0.3em | UPPERCASE; muted white, yellow hairline prefix |
| Nav Link | Quicksand | 13.5px | 500 | 1 | normal | white-72%; active = white + yellow border-left |
| Button (CTA) | Quicksand | 11px | 700 | 1 | 0.18em | UPPERCASE |
| KPI Label | Quicksand | 10px | 600 | 1 | 0.28em | UPPERCASE; `::before` 7px yellow square rotated 45° |
| Breadcrumbs | Quicksand | 10px | 600 | 1 | 0.28em | UPPERCASE; current page in navy-primary |
| Mono Stamp | JetBrains Mono | 9–10px | 400 | 1.4 | 0.18em | UPPERCASE |

### Italic Emphasis Pattern (signature)
Every page H1 and card H2/H3 contains a 1–3 word italic Playfair fragment. The heading **ends in a period.**

```html
<!-- on light -->
<h1>Resumen de <em class="acc">Tráfico</em>.</h1>
<h3>Sesiones por <em class="acc">dispositivo</em>.</h3>
<!-- on dark sidebar / modal eyebrow -->
<h2>Cerrar <em class="acc">Sesión</em>.</h2>
```

### Eyebrow Pattern (signature)
Universal section-marker. Always above an H1/H2/H3, never standalone.

```html
<div class="section-eyebrow">COMPORTAMIENTO DE USUARIOS</div>
```
```css
.section-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: 'Quicksand', sans-serif;
  font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--navy-primary); font-weight: 600; margin-bottom: 16px;
}
.section-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--accent-yellow); }
```

---

## 4. Component Library

### 4.1 Sidebar (fixed, navy)
- `position: fixed; width: 268px; top:0; bottom:0; left:0;`
- `background: #06254B; color: white; border-right: 1px solid rgba(248,210,39,0.10);`
- Brand block: 40px yellow circle + 2-line text ("Unión Nacional" Playfair 700 + "PANEL ADMIN" Quicksand 9px tracked yellow)
- Section labels: 10px Quicksand 600 white-40, with 22px × 1px yellow hairline prefix
- Nav items: `padding: 12px 28px; gap: 14px;` — 18px stroke-1.6 SVG icon + label + optional yellow `nav-badge` (count)
- **Active state**: `background: rgba(3,72,141,0.45); color: white; border-left: 2px solid #F8D227;` icon turns yellow
- Sidebar foot: `Desconectar` outline button (yellow border, fills yellow on hover) + version stamp in JetBrains Mono

### 4.2 Topbar (76px, white, sticky)
- White background, `border-bottom: 1px solid rgba(6,37,75,0.10)`
- Layout: breadcrumbs (left) → search field (flex, max 460px) → icon buttons → user chip (right)
- **Search**: `background: var(--bg-light); padding: 10px 16px;` magnifier SVG + input + `<kbd>⌘K</kbd>` mono badge. On focus → white bg, navy-primary border.
- **Icon buttons**: 40×40, 1px hairline, hover fills navy-deep. Optional 7px yellow notification dot top-right.
- **User chip**: 38px navy-primary circle avatar (Playfair italic initial) with green status dot + name (13px 600) + role (10px tracked muted) + 10px caret. Left-bordered with hairline.

### 4.3 Page Head
```html
<div class="page-head">
  <div class="page-head-left">
    <div class="eyebrow">EYEBROW LABEL</div>
    <h1>Title with <em class="acc">italic</em>.</h1>
    <p class="lead">Optional 15px muted lead, max 540px wide.</p>
  </div>
  <div class="page-head-right">
    <!-- date picker + filled/outline buttons -->
  </div>
</div>
```
- `display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 36px;`

### 4.4 Buttons
| Variant | Style |
|---------|-------|
| **Filled (primary)** | `background: #03488D; color: white; padding: 14px 22px; border-radius: 2px; font: 700 11px Quicksand; letter-spacing: 0.18em; text-transform: uppercase; hover bg #06254B` |
| **Outline (secondary)** | `background: transparent; color: #06254B; border: 1px solid #06254B; same padding/font; hover fills #06254B + white text` |
| **Ghost (modal cancel)** | `transparent; 1px hairline-light-ui border; navy-deep text; hover gains navy border + white bg` |
| **Yellow CTA (top-right of dark headers)** | `background: #F8D227; color: #06254B; border-radius: 2px;` hover lifts -1px + 0 8px 24px rgba(248,210,39,0.25) glow |
| **Sidebar logout** | full-width outline yellow-30%, hover fills yellow + navy text |
| **Icon button** | 40×40, 1px hairline, no fill, hover fills navy-deep + white icon |

### 4.5 Cards
**Base card**
```css
background: white;
border: 1px solid rgba(6, 37, 75, 0.06);
border-radius: 2px;
box-shadow: 0 2px 12px rgba(6, 37, 75, 0.04);
```
- Padding scale: KPI `28px 28px 24px` · chart card `36px 36px 32px` · two-up cards `32px 36px 28px`
- Hover: `transform: translateY(-2px); box-shadow: var(--shadow-hover);`
- **Yellow scale-x top accent**: `::before { position:absolute; top:0; left:0; right:0; height: 2px; background: #F8D227; transform: scaleX(0); transform-origin: left; transition: transform 0.4s; }` → `:hover::before { transform: scaleX(1); }`

### 4.6 KPI Card
Four-column grid (`repeat(4, 1fr); gap: 20px`).
```html
<div class="kpi-card">
  <div class="kpi-top">
    <div class="kpi-label">Usuarios Activos</div>      <!-- 7px yellow square ::before, rotated 45° -->
    <div class="kpi-icon"><svg/></div>                 <!-- 36px square, bg #F2F8FF, navy-primary stroke -->
  </div>
  <div class="kpi-value">48,219</div>                  <!-- Playfair 46px navy-deep -->
  <svg class="kpi-spark"/>                             <!-- 32px-tall area sparkline, navy-primary line + 8% fill -->
  <div class="kpi-foot">
    <span class="kpi-delta">▲ +12.4%</span>            <!-- success green up / warning amber down -->
    <span class="kpi-sub">vs. 30 días previos</span>
  </div>
</div>
```

### 4.7 Chart Card (line)
- Header row: left = eyebrow + H2 with italic accent. Right = legend (10px×2px swatch + uppercase label, dashed = previous period) + range-toggle segmented control (`7D / 30D / 90D / 1A`, active = navy-deep + white).
- Chart: hand-rolled SVG, viewBox `0 0 1100 320`, dashed gridlines `rgba(6,37,75,0.08)`, navy-primary 2.4px stroke + linearGradient area fill (18% → 0%).
- Annotation callout: vertical dashed line + 6px yellow circle on the data point, plus a small navy-deep tooltip block (`width:180; height:50;`) with 3px yellow left bar, 9px tracked muted-white date, and Playfair italic yellow value.
- Footer strip: `border-top: 1px hairline; padding-top: 18px;` left = pulsing 7px yellow "Actualizado hace X min", right = data source line.

### 4.8 Donut Card
- 180×180 SVG, `viewBox="0 0 42 42"`, `r=15.915` (so circumference = 100). Track stroke `#F2F8FF` width 6. Slices use `stroke-dasharray="X 100-X"` with cumulative `stroke-dashoffset` rotation.
- Slice palette (in order): `#03488D` → `#06254B` → `#F8D227`.
- Center label: `<text font-size="7">54%</text>` (SVG units, NOT CSS px) + `<text font-size="2.2">DESKTOP</text>` muted, tracked 0.22em.
- Legend: vertical list, each row = 12px swatch + name (13px navy-deep 600) + sub (10px muted tracked uppercase) + Playfair 22px navy-primary percentage.

### 4.9 Bar List Card (ranked)
Each row:
```
01  Section Name                     82,140    26.3%
████████████████████████░░░░░░░░░░    (yellow 2px right cap)
```
- Number `01` etc. in Playfair italic navy-primary, 500.
- Bar track 6px tall, `background: #F2F8FF`. Fill `background: #03488D`. The fill has `::after` 2px wide right-edge yellow cap.

### 4.10 Modal (logout pattern, generalizable to any confirmation)
- Overlay: `rgba(6, 37, 75, 0.72) + backdrop-filter: blur(10px)`, fade 0.3s
- Dialog: `width: min(540px, calc(100vw - 48px)); border-radius: 4px;` slide up + scale 0.98→1 with `cubic-bezier(0.2, 0.8, 0.2, 1)` 0.4s
- Head: 36px 44px padding. Eyebrow color uses `--warning` (#b85c00) for destructive confirmations. H2 38px Playfair with italic accent + period. Body 15px editorial.
- Session/meta row: 2-col grid above the dashed divider — small 9px tracked label + 18px Playfair italic value.
- Foot: `padding: 24px 44px 36px; background: var(--bg-light); border-top: 1px hairline; display: flex; justify-content: flex-end; gap: 12px;` — Cancel (ghost) + primary action (filled navy).
- Close: 36px square top-right, bg-light fill, rotates 90° on hover, fills navy-deep.

### 4.11 Forms & Inputs
- Default input: `padding: 12px 16px; background: white; border: 1px solid var(--hairline-light-ui); border-radius: 2px; font: 14px Quicksand; color: var(--text-dark);`
- Focus: `border-color: var(--navy-primary); outline: none;`
- Label above input: 10px Quicksand 600 uppercase tracked 0.22em muted, with optional 24px yellow hairline prefix.
- Disabled / placeholder text in `--text-muted`.

### 4.12 Tables (use this pattern for any list view)
```css
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left; padding: 14px 20px;
  font: 600 10px Quicksand; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--text-muted); border-bottom: 1px solid var(--hairline-light-strong);
}
td {
  padding: 18px 20px; font: 400 14px Quicksand; color: var(--text-dark);
  border-bottom: 1px solid var(--hairline-light);
}
tr:hover td { background: var(--bg-light); }
```
- Row leading column = Playfair italic navy-primary numerator (`01`, `02`, …) when ranked.
- Status pill: 10px Quicksand 700 tracked 0.2em, padding `4px 10px`, radius 2px. Variants: yellow-on-navy = pending; navy-on-bg-light = neutral; success/warning use semantic tokens at 10–15% bg + full text color.

### 4.13 Tags / Badges
- Pill-less: square corners or 2px max.
- Yellow badge (sidebar count, "new"): `background: #F8D227; color: #06254B; padding: 2px 7px; font: 700 10px Quicksand; letter-spacing: 0.05em;`
- Pale-navy variant: `background: #F2F8FF; color: var(--navy-primary); border: 1px solid var(--hairline-light);`

### 4.14 Empty States & Image Placeholders
For unavailable imagery use the dashed-mono placeholder convention — never invent SVG illustrations:
```html
<div class="img-placeholder">
  <div class="img-placeholder-label">[ infografía 1:1 · 1200×1200 ]</div>
</div>
```
Background: `repeating-linear-gradient(135deg, #e6eef9 0 14px, #d4e0f0 14px 28px);`
Label: dashed border, JetBrains Mono 10px tracked uppercase, low-opacity navy.

---

## 5. Layout & Spacing

### Spacing system (4px base)
`4 · 8 · 12 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56 · 60 · 80 · 100 · 120 · 140`

### Page-level spacing
- Sidebar width: **268px** (collapses to 72px icons-only below 980px)
- Topbar height: **76px**, sticky
- Content padding: **44px 48px 64px** desktop · **28px 24px 48px** mobile
- Page-head bottom margin: **36px**
- KPI grid gap: **20px**
- Two-up grid gap: **28px**

### Grid responsive rules
- KPI grid: `repeat(4, 1fr)` ≥ 1280px → `repeat(2, 1fr)` 980–1280 → 1-col mobile
- Two-up `1fr 1.4fr` ≥ 1280px → stacks 1-col below
- Tables horizontal-scroll inside their card below 980px

### Border radius scale
- 0px: tables, KPI tiles, image placeholders, tags
- 2px: default — buttons, cards, inputs, search field, sidebar logout button, icon buttons
- 4px: modals only
- 50%: avatar, status dots, brand mark only

---

## 6. Motion

Keep animations subtle. Two valid speeds:

| Speed | Duration | Easing | Use |
|-------|----------|--------|-----|
| Quick | 0.2–0.25s | `ease` | Hover color, button fill, icon-button bg swap, focus ring |
| Editorial | 0.3–0.4s | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Card lift on hover, modal enter/exit, range-toggle, scale-x yellow accent |

Other patterns:
- **Yellow scale-x reveal** on card hover (top edge 2px line).
- **Pulse**: 1.6s infinite ease-in-out — opacity 1→0.4 + scale 1→0.85. Used only on the live-status 7px yellow dot.
- **90° rotate** on modal-close hover (0.25s ease).
- Never use spring/bounce; never use parallax.

---

## 7. Voice, Copy & Microcopy

- **Language: Spanish (Mexico)**, neutral institutional register.
- **Headings end in a period.** `Resumen de Tráfico.` — editorial voice over UI voice.
- Eyebrows are noun-phrase categories, ALL CAPS, 2–4 words: `COMPORTAMIENTO DE USUARIOS`, `MARCO REGULATORIO`, `ASOCIADOS REGISTRADOS`.
- KPI labels are 1–3 words, sentence case: `Usuarios Activos`, `Páginas Vistas`, `Tiempo Promedio`.
- Buttons UPPERCASE 0.18em tracked: `EXPORTAR REPORTE`, `GUARDAR CAMBIOS`, `DESCONECTAR`.
- Date strings: Playfair italic — `Hoy · 09:14 hrs`, `Últimos 30 días`, `02 MAY · DOM`.
- Modal eyebrow for destructive actions: `CONFIRMACIÓN REQUERIDA` in `--warning` amber.
- Pluralize sections like a magazine table-of-contents: `Asociados`, `Solicitudes`, `Normas`, `Recetas`, `Indicadores`.

---

## 8. Do's and Don'ts

### Do
- Open every page with `eyebrow + H1 (italic accent + period)` directly under the topbar.
- Use the navy sidebar / light workspace duality on every admin page.
- Reach for hairlines (`rgba(6,37,75,0.06–0.15)`) before reaching for shadows.
- Apply yellow `#F8D227` only at hairline / dot / italic-emphasis / badge / CTA scale.
- End H1/H2/H3 in a period.
- Pair Playfair Display headings with Quicksand body — never substitute one for the other.
- Use the dashed mono `[ infografía · WxH ]` placeholder for any missing imagery.
- Keep border radius at 0–2px; use 4px only on modals.
- Use the 7px yellow square rotated 45° as the KPI label bullet.
- Show pulsing yellow dot for live/real-time data only.

### Don't
- ❌ Don't use `#F8D227` as a section background or large fill — it's gold leaf, not paint.
- ❌ Don't use Playfair below 24px or for body / labels / buttons.
- ❌ Don't use Quicksand for any heading.
- ❌ Don't use pill (`border-radius > 8px`) buttons or fully circular buttons (avatars excepted).
- ❌ Don't introduce a third accent color. Yellow is the only accent. Use semantic colors (`#2e8b57` / `#b85c00`) only inside KPI deltas and status pills.
- ❌ Don't draw illustrative SVG icons inside content slots — use the dashed mono placeholder.
- ❌ Don't use centered hero text — page heads are flex left-aligned with right-side controls.
- ❌ Don't use heavy multi-color gradients. The only gradients allowed are subtle navy-primary area fills under chart lines (18% → 0%) and the dark hero radial gradients on marketing-side pages.
- ❌ Don't use emoji as icons — use 18px stroke-1.6 line SVGs only.
- ❌ Don't use the dark-on-light eyebrow color on dark backgrounds (or vice versa). Switch with `.section-eyebrow.on-dark` (color becomes yellow).

---

## 9. Page Recipes

### 9.1 Generic admin list page (e.g. `/admin/asociados`)
1. Sidebar (mark this nav item active with yellow border-left).
2. Topbar with breadcrumbs `Panel / Institucional / Asociados`.
3. Page head: eyebrow `REGISTROS ACTIVOS` + H1 `Directorio de <em>Asociados</em>.` + lead paragraph + right-side: search-by-state filter chip + outline `Exportar` button + filled `Nuevo Asociado` button.
4. Stat strip: 4 KPI cards (Total / Nuevos este mes / Pendientes / Bajas).
5. Filter bar inside white card: 4–6 filter chips left, "Mostrando X de Y" muted right.
6. Table card: `Asociado / Estado / Tipo / Fecha de alta / Estatus pill / ⋯ actions`.
7. Pagination row: hairline-bordered, mono "Página 1 de N" left, square arrow buttons right.

### 9.2 Detail page (e.g. `/admin/normas/[id]`)
1. Page head with breadcrumbs deeper (`Panel / Contenido / Normas / NOM-009-ZOO-2024`).
2. Two-column layout `2fr 1fr`:
   - Left: white card with eyebrow `MARCO REGULATORIO` + Playfair 22px italic norm code + H2 + body paragraphs (Quicksand 15px 1.75) + attached-file list (each = 1px hairline row, mono filename + 11px tracked size).
   - Right: meta sidecar card with vertically stacked label/value pairs (10px tracked label + 18px Playfair value), status pill, edit button.

### 9.3 Form page (e.g. `/admin/noticias/nueva`)
1. Page head with `Cancelar` ghost button + `Guardar borrador` outline + `Publicar` filled-navy in head-right.
2. Two-column form layout. Left = main fields (title, slug, body Markdown editor — fake the toolbar with 9–10 icon buttons on a 1px hairline strip, content area `min-height: 480px`). Right = card with metadata: section dropdown, tags input (yellow-on-navy chips removable), publish date (Playfair italic), featured image dropzone (dashed mono placeholder pattern).
3. Sticky bottom action bar inside content area: 1px hairline-top, white, padding 20px 0, with right-aligned actions echoing the head buttons.

### 9.4 Confirmation modal
Use the modal pattern in §4.10. The eyebrow color signals severity: `--warning` for destructive, `--navy-primary` for neutral. Always include a session/meta 2-col block above the dashed divider when the action affects user state (logout, transfer ownership, delete account).

---

## 10. Prompt-Tuning Hints for AI Generators

When prompting an AI tool to extend this system, include some of these phrases verbatim — they map cleanly to the rules above:

- *"Use the UNA admin shell: 268px navy-deep `#06254B` fixed sidebar with yellow `#F8D227` active border-left, 76px sticky white topbar, `#F2F8FF` content area."*
- *"Page head pattern: 11px tracked uppercase eyebrow with 32px yellow hairline prefix, then 52px Playfair Display 500 H1 with a 1–3 word `<em class='acc'>` italic navy-primary fragment, then optional 15px muted Quicksand lead. Title ends in a period."*
- *"All cards: white, 1px hairline `rgba(6,37,75,0.06)` border, 2px radius, `0 2px 12px rgba(6,37,75,0.04)` resting shadow. Hover lifts -2px + adds a 2px yellow scale-x line at the top edge."*
- *"All buttons square-cornered (2px radius). Filled = navy-primary `#03488D`. Outline = navy-deep border, transparent. Both 11px Quicksand 700 uppercase 0.18em tracked."*
- *"Headings ALWAYS Playfair Display 500. Body / UI / labels ALWAYS Quicksand. Never mix. Never use Playfair under 24px."*
- *"Yellow `#F8D227` is gold leaf — eyebrow hairlines, 7px rotated-45° KPI square markers, scale-x card top accent on hover, sidebar active border-left, badge fills, italic emphasis on dark only. Never as a section background."*
- *"Use the dashed mono `[ infografía · 1200×1200 ]` placeholder for missing imagery. Do not invent SVG illustrations."*
- *"Spanish (MX). Headings end in a period. Eyebrows are 2–4 word ALL CAPS noun phrases."*

---

## 11. Quick Visual Sanity Check

A page is **on-brand** when:
1. ✅ Sidebar is navy-deep with one yellow-bordered active item.
2. ✅ Workspace background is `#F2F8FF`, not pure white.
3. ✅ Every section opens with the yellow-hairline eyebrow above an italic-accented Playfair heading ending in a period.
4. ✅ Cards are flat with hairline borders — no drop shadows visible at rest.
5. ✅ The only chromatic accent on screen is yellow at hairline/dot/badge scale; rest of the palette is navy + neutrals.
6. ✅ All buttons square (2px radius), uppercase tracked Quicksand 700.
7. ✅ Big numbers and dates are Playfair Display, body and labels are Quicksand.
8. ✅ No emoji, no rounded pill chips, no pure black, no third accent color.

If any of these fail, the page is off-brand — adjust before shipping.
