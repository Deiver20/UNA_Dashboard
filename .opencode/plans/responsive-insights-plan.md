# Plan: Responsive + Insights Section Isolation

## Problema 1: Responsive Design

### Diagnóstico actual

| Componente | Breakpoint actual | Problema |
|---|---|---|
| Header section tabs | `hidden lg:flex` (1024px) | OK - usa hamburger en mobile |
| KPI Cards | `grid-cols-2 xl:grid-cols-4` | 2 cols en mobile funciona, pero toggle de producto se amontona |
| GlobalFilters | `flex-col md:flex-row` | Slider de años + inputs se desbordan en pantallas < 400px |
| MainContentRow | `xl:grid-cols-5` | Charts apilan verticalmente pero **altura fija** en mobile los corta |
| SecondaryWidget (donut) | `xl:col-span-2` | En mobile ocupa 100% pero el SVG tiene `viewBox="0 0 200 200"` fijo |
| RightInsightPanel | `hidden lg:flex` | OK - usa FAB + Sheet en mobile |
| Charts (Recharts) | `ResponsiveContainer` | Se adaptan al width pero **la altura del contenedor padre puede ser 0** en mobile |

### Cambios propuestos

#### 1.1 `app/page.tsx` — Altura del contenedor principal
**Problema:** En mobile, el `flex-1 min-h-0` no garantiza altura mínima para los charts cuando se apilan verticalmente.
**Fix:** Agregar `min-h-[calc(100vh-200px)]` al contenedor de contenido para asegurar espacio mínimo en pantallas pequeñas.

#### 1.2 `components/layout/KpiCards.tsx` — Toggle de producto en mobile
**Problema:** El toggle de producto (`pollo/huevo/pavo`) se amontona con el título en pantallas < 640px.
**Fix:** 
- Cambiar `flex items-center justify-between` a `flex-col sm:flex-row` en el header
- Reducir `fontSize` de 22px a 18px en mobile para los números
- Agregar `gap-2 sm:gap-3` entre cards

#### 1.3 `components/layout/GlobalFilters.tsx` — Filtros en mobile
**Problema:** El slider de años + dos inputs numéricos se desbordan en pantallas < 400px.
**Fix:**
- Cambiar el contenedor de años a `flex-col sm:flex-row` 
- Reducir ancho de inputs en mobile (`w-14 sm:w-16`)
- Slider container: `max-w-full sm:max-w-[200px]`
- Agregar `flex-wrap` al contenedor principal para que los filtros fluyan naturalmente

#### 1.4 `components/layout/MainContentRow.tsx` — Layout de charts en mobile
**Problema:** En mobile los charts se apilan pero no tienen altura definida.
**Fix:**
- Overview en mobile: `grid-cols-1 md:grid-cols-2 xl:grid-cols-5` (split a 50/50 en tablets)
- Agregar `min-h-[400px] sm:min-h-[500px]` al contenedor de charts
- SecondaryWidget: visible en mobile con `min-h-[300px]`

#### 1.5 `components/layout/SecondaryWidget.tsx` — Donut responsive
**Problema:** El SVG tiene `viewBox="0 0 200 200"` y `className="h-full w-auto max-w-full"` pero el contenedor puede no tener altura.
**Fix:**
- Agregar `min-h-[250px] sm:min-h-[300px]` al contenedor del SVG
- Ajustar `cx`, `cy`, `radius` proporcionalmente si es necesario (opcional, el viewBox ya escala)

#### 1.6 `components/charts/AvesPosturaChart.tsx` — Chart responsive
**Problema:** Usa `ResponsiveContainer` pero el padre puede no tener altura en mobile.
**Fix:** El `ChartWrapper` ya tiene `className="h-full w-full"`, pero necesitamos asegurar que el padre tenga `min-h-[300px] sm:min-h-[400px]`.

#### 1.7 `components/layout/PrimaryChart.tsx` — Título responsive
**Problema:** El título del chart (`text-lg`) puede ser muy grande en mobile y el subtítulo ocupa espacio.
**Fix:**
- Cambiar título a `text-base sm:text-lg`
- Reducir `mb-3` a `mb-2` en mobile
- Agregar `leading-tight` al título para evitar wrapping excesivo

#### 1.8 `components/layout/Header.tsx` — Navegación mobile
**Problema:** El menú mobile funciona pero las secciones son muchas (7) y el scroll puede ser largo.
**Fix:** (Opcional) Agrupar secciones con headers en el mobile menu para mejor navegación.

---

## Problema 2: Insights Panel — Mezcla de secciones

### Diagnóstico

**Causa raíz:** `activeInsightVersionId` es un estado global que no se resetea al cambiar de sección.

Flujo actual:
1. Usuario genera insights para "overview" → `activeInsightVersionId` apunta a esa versión
2. Usuario cambia a "producción" → `activeInsightVersionId` **sigue apuntando** a la versión de "overview"
3. `RightInsightPanel` muestra los insights de "overview" pero el subtitle dice "PRODUCCIÓN"

`InsightHistoryTabs` ya filtra correctamente por sección (línea 23):
```ts
const versionsForSection = insightVersions.filter((v) => v.section === activeSection);
```

Pero `activeInsightVersion` se computa solo por ID (línea 538-540):
```ts
const activeInsightVersion = useMemo(() => {
  return insightVersions.find((v) => v.id === activeInsightVersionId) ?? null;
}, [insightVersions, activeInsightVersionId]);
```

### Fix propuesto

#### Opción A (Recomendada): Validar sección en `activeInsightVersion`
Cambiar el cálculo en `lib/filters.tsx` para que solo retorne la versión si coincide con la sección activa:

```ts
const activeInsightVersion = useMemo(() => {
  const version = insightVersions.find((v) => v.id === activeInsightVersionId);
  if (!version || version.section !== activeSection) return null;
  return version;
}, [insightVersions, activeInsightVersionId, activeSection]);
```

**Ventaja:** Simple, no cambia el comportamiento de selección manual, solo valida que la versión activa pertenezca a la sección actual.

#### Opción B: Auto-seleccion última versión de la sección
Cuando cambia `activeSection`, buscar automáticamente la última versión generada para esa sección y seleccionarla.

**Desventaja:** Más complejo, puede ser confuso si el usuario quiere empezar de cero.

**Decisión:** Opción A es más limpia y predecible.

---

## Archivos a modificar

| Archivo | Cambios |
|---|---|
| `app/page.tsx` | Altura mínima responsive del contenedor principal |
| `components/layout/KpiCards.tsx` | Header responsive, font sizes, spacing |
| `components/layout/GlobalFilters.tsx` | Layout responsive de filtros, slider, inputs |
| `components/layout/MainContentRow.tsx` | Breakpoints de grid, alturas mínimas |
| `components/layout/SecondaryWidget.tsx` | Altura mínima del contenedor del donut |
| `components/layout/PrimaryChart.tsx` | Títulos responsive |
| `components/layout/Header.tsx` | (Opcional) Agrupar secciones en mobile menu |
| `lib/filters.tsx` | Fix de `activeInsightVersion` para validar sección |

---

## Orden de ejecución

1. **Fix insights isolation** (`lib/filters.tsx`) — 1 línea, impacto alto
2. **MainContentRow responsive** — Base para todo el layout
3. **KpiCards responsive** — Header y cards
4. **GlobalFilters responsive** — Filtros y slider
5. **PrimaryChart responsive** — Títulos
6. **SecondaryWidget responsive** — Donut
7. **page.tsx container** — Altura general
8. **Build + verificación**
