# Exploration: Admin Remaining Features

## Executive Summary

Four features remain incomplete in the Octavo Fuego admin panel. This exploration covers:

1. **Crear Orden** — A schema and service method exist but no UI or API endpoint
2. **Export PDF (Informes)** — CSV works, PDF is a fake toast, no PDF library in dependencies
3. **Real Trends (Dashboard)** — StatsCard has hardcoded change%/trend; real data available from services
4. **Generate Payment Link** — API endpoint exists but frontend page is 404; button navigates nowhere

All four features use the existing service layer and Supabase-backed data. No architectural blockers exist. The next step is to propose implementation with prioritized tasks.

---

## Feature 1: Crear Orden desde Admin

### Current State

- "Nueva Orden" button in `/admin/ordenes/index.astro:66-68` shows `toast.info('Función de crear orden coming soon')`
- Quick-create dropdown in `AdminLayout.astro:423-428` links to `/admin/ordenes` (no create page)
- **Schema exists**: `src/lib/admin/schemas/orden.ts:14-24` defines `CrearOrdenSchema` with Zod validation for `cliente_id`, `items[]` (variante_id, gramos, precio_unit), `canal`, `notas`, `bodega_id`
- **Service method exists**: `SupabaseService.crear()` in `base.ts:87-101` does `supabase.from(tableName).insert(data).select().single()`
- **No API endpoint** for creating orders (only `POST /api/admin/ordenes/status` for status changes)
- **Data available**: `svc.clientes.listar()`, `svc.productos.listar()` (with variantes → gramos + precios)
- **Modal pattern exists**: `ClienteForm.astro` uses an overlay modal with form, submit handler, and toast feedback

### Affected Areas

- `src/pages/admin/ordenes/index.astro` — Change "coming soon" button to open modal or navigate
- `src/components/admin/orders/OrdenForm.astro` — NEW: Create order modal component
- `src/pages/api/admin/ordenes/create.ts` — NEW: API endpoint for order creation
- `src/lib/admin/services/ordenes.ts` — May need explicit `crear()` override for items insertion
- `src/layouts/AdminLayout.astro` — Quick-create "Nueva Orden" link may need update

### Approaches

#### Approach A: Modal (like ClienteForm)
Follow existing modal pattern. Overlay with customer selector, product selector, price auto-calculation.

**Pros:**
- Consistent with existing pattern (ClienteForm uses same modal approach)
- No page navigation — stays on orders list
- Faster UX — can see table result immediately after creation
- Reuses existing modal CSS (fixed inset, backdrop, max-w-lg, etc.)

**Cons:**
- Modal gets complex with product selector + price calculator
- Need JS for inline search/filter of customers and products
- Harder to handle error states inline

**Effort: Medium**

#### Approach B: Dedicated Page (e.g., `/admin/ordenes/crear`)
Full-page form with Astro SSR rendering for initial data fetch.

**Pros:**
- More space for complex form (product selector with grid, variante picks, etc.)
- Cleaner URL = shareable/bookmarkable
- Can use Astro SSR for initial data fetch (avoids client API call for dropdown data)

**Cons:**
- Page navigation required — breaks flow
- More boilerplate (new page, new layout, back button)
- Inconsistent with existing pattern (ClienteForm uses modal)

**Effort: Medium**

#### Approach C: Hybrid — SSR page with async items
Render a page with customer/product data pre-fetched, but submit via API.

**Pros:**
- Combines SSR performance with API reliability
- Clean separation: data fetch on server, mutation via POST

**Cons:**
- Most complex to implement
- Over-engineering for the current needs

**Effort: High**

### Recommendation

**Approach A (Modal)** is the best fit for Phase 1. It follows the existing `ClienteForm` pattern, keeps the user on the orders list, and is consistent with the admin panel's current UX conventions.

The modal needs:
1. Customer selector (searchable dropdown from `svc.clientes.listar()`)
2. Product selector with variante pick (from `svc.productos.listar()`, each with gramos + precio_cop/brl)
3. Auto-calculated total based on selected variante × gramos
4. Canal selector (whatsapp, web, manual)
5. Bodega selector (CO-BOGOTA, BR-ACRE) defaulting to selected bodega
6. POST to new API endpoint `/api/admin/ordenes/create`

### Risks

- OrdenService.crear() is inherited from base and does simple insert — orden_items insertion needs separate handling in a service override
- Need to validate total calculation matches variante pricing

---

## Feature 2: Exportar PDF en Contabilidad Informes

### Current State

- `exportPDF()` at `informes.astro:357-359` is a fake toast: `toast.info` → `setTimeout → toast.success`
- CSV export works correctly — generates data URI with UTF-8 CSV content and triggers download
- **All data is available client-side**: `monthlyKpis[]`, `monthlyTransactions[][]`, `anualKpis` are serialized in `<script define:vars={{...}}>`
- **No PDF libraries** in `package.json` — zero PDF capability
- The informes page pre-fetches all current-year transactions in SSR (single Supabase query)
- Dashboard already uses inline SVG charts (GraficaLíneas, GraficaTorta, GraficaBarrasH)

### Affected Areas

- `src/pages/admin/contabilidad/informes.astro` — Implement real PDF generation
- `package.json` — Add PDF library dependency
- `src/components/admin/contabilidad/PDFReport.astro` — NEW (optional): shared PDF component

### Approaches

#### Approach A: jsPDF client-side (lightest option)
Use `jspdf` + `jspdf-autotable` to generate PDF directly in the browser. No server needed.

**Pros:**
- Zero server cost — runs entirely in browser
- No Vercel function cold starts
- jspdf is mature and well-documented (28KB gzipped)
- `jspdf-autotable` handles table generation with minimal code
- Can include inline SVG charts (like dashboard)

**Cons:**
- Client-side only — no server-generated PDF for emailing
- Complex layouts require manual positioning
- Doesn't support CSS — everything is programmatic
- Cannot include existing Astro components

**Effort: Low**

#### Approach B: window.print() with print CSS
Add a print stylesheet and trigger `window.print()`.

**Pros:**
- Zero dependencies — uses browser's built-in PDF
- Renders pixel-perfect HTML with CSS
- Very quick to implement

**Cons:**
- Opens print dialog — not a smooth UX
- User can cancel or change settings
- Output quality depends on browser/OS
- Looks different across browsers
- Can't auto-download — user must click Save

**Effort: Very Low**

#### Approach C: Server-side PDF via API endpoint (Playwright/Puppeteer)
Create `GET /api/admin/contabilidad/informes/pdf` that generates PDF server-side.

**Pros:**
- Professional output — pixel-perfect, consistent
- Can render HTML/CSS with Tailwind
- Enables email attachments
- Full control over output

**Cons:**
- Requires Playwright/Puppeteer — 300MB+ on Vercel (cold starts)
- Vercel Serverless Functions have 50MB max — Playwright doesn't fit
- Would need Vercel Pro (Edges Functions or dedicated)
- Costly in terms of execution time
- Over-engineering for current needs

**Effort: Very High**

#### Approach D: pdf-lib (lightweight server-side)
Use `pdf-lib` for server-side PDF generation without a browser engine.

**Pros:**
- Can run on Vercel (no Chrome needed, ~100KB)
- Server-side generation = consistent output
- Can create via API endpoint

**Cons:**
- No HTML/CSS rendering — everything is manual positioning
- No table support — need to draw cells manually
- More code than jsPDF for same result
- Still needs API endpoint

**Effort: Medium-High**

### Recommendation

**Approach A (jsPDF + jspdf-autotable)** is the right balance for Phase 1. It's browser-native, requires no server infrastructure, and the chart data is already available client-side.

Implementation: Add `jspdf` and `jspdf-autotable` to package.json, replace the `exportPDF()` function with real PDF generation that:
- Creates a title page with month/year
- Outputs KPI summary (ingresos, egresos, balance)
- Outputs full transactions table using autoTable
- Triggers download

### Risks

- Inline SVG charts from dashboard won't render in jsPDF without conversion to canvas (can use `html2canvas` as optional enhancement)
- For Phase 1, charts in PDF can be skipped — just tables and KPIs

---

## Feature 3: Tendencias Reales del Dashboard

### Current State

- `StatsCard` at `StatsCard.astro:1-45` accepts `change` (number) and `trend` ('up' | 'down' | 'neutral')
- Dashboard at `admin/index.astro:159-189` has 4 cards with **hardcoded values**:
  - Ventas Hoy: `change={12.5}`, `trend="up"`
  - Órdenes Activas: `change={8.3}`, `trend="up"`
  - Productos: `change={4}`, `trend="up"`
  - Clientes: `change={15}`, `trend="up"`
- **Real data IS computed** from services: `ventasHoy` (line 41-43), `ordenesActivas` (line 45-47), `totalProductos` (line 49), `totalClientesActivos` (line 50)
- `chart-data.ts` has `filterByPeriod()` pattern that can be reused for trends
- Previous period data is available in the same data arrays

### Affected Areas

- `src/pages/admin/index.astro` — Compute real period-over-period trends from service data
- `src/lib/admin/dashboard/chart-data.ts` — NEW: computeTrends() helper function
- `src/components/admin/dashboard/StatsCard.astro` — Already accepts dynamic props, no changes needed

### Approaches

#### Approach A: Compute from existing service data (server-side)
In the Astro frontmatter, compute previous-period values alongside current values and pass real change% and trend to StatsCard.

**Pros:**
- Zero additional API calls — data already fetched (`ordenes`, `clientes`, `productos`)
- SSR computation — no client-side data loading
- Same architecture as existing chart-data.ts
- StatsCard component already supports dynamic props

**Cons:**
- Trend granularity limited to available data (needs date-based filtering)
- "Ventas Hoy" vs "Ventas Ayer" requires filtering by day/hour
- Period comparison logic needs careful implementation

**Effort: Low**

#### Approach B: Client-side trend API endpoint
Create an API endpoint that computes trends and fetches on client mount.

**Pros:**
- Can be called on-demand (e.g., when switching periods)
- Avoids bloating the SSR page

**Cons:**
- Extra API call
- Client-side loading state
- More moving parts

**Effort: Medium**

### Recommendation

**Approach A (server-side computation)** is the clear winner. The data is already fetched for the dashboard. We just need to:

1. Extract previous-period filtering logic (could reuse or extend `filterByPeriod` from `chart-data.ts`)
2. For **Ventas Hoy**: filter orders created today vs yesterday, compute percentage change
3. For **Órdenes Activas**: filter orders with status pendiente/confirmada this month vs last month
4. For **Productos**: filter active products this month vs last month
5. For **Clientes**: filter active clients this month vs last month

A helper function `computeTrends(currentItems, previousItems)` that returns `{ change: number, trend: 'up' | 'down' | 'neutral' }` can be added to `chart-data.ts`.

### Risks

- Early in the month, period-over-period comparisons may show extreme percentages (e.g., 3 orders last month vs 1 this month = -66%). Consider showing "vs período anterior" generally rather than "vs mes anterior"
- First month of data will have no previous period — display "—" or "Nuevo" instead of a misleading 0%

---

## Feature 4: Generar Link de Pago Funcional

### Current State

- Button at `pagos/index.astro:47-55` labeled "Generar Link de Pago"
- Click handler at `pagos/index.astro:287-289` does `window.location.href = '/admin/pagos/generate-link'`
- **Page at that path DOES NOT EXIST** — causes a 404
- API endpoint `POST /api/admin/pagos/generate-link` **does exist** and:
  - Authenticates via `of_admin_token`
  - Validates `orden_id` (required) and `metodo` (womli_link | pix_qr | pix_copia_cola)
  - Returns mock payment links (e.g., `https://checkout.wompi.co/p/{mockId}`)
  - Has 30-minute expiry on links
- `CrearPagoSchema` exists in `src/lib/admin/schemas/pago.ts`
- `PagoService` extends `SupabaseService` with `listar()`, `obtenerPorId()`, `confirmarPago()`, `marcarFallido()`
- Payment methods supported: `wompi_link`, `pix_qr`, `pix_copia_cola`
- The brand has Wompi as their payment gateway (per project docs)

### Affected Areas

- `src/pages/admin/pagos/generate-link.astro` — NEW: Form page for generating payment links
- `src/pages/api/admin/pagos/generate-link.ts` — Update to optionally persist the payment record
- `src/pages/admin/pagos/index.astro` — The button navigation is correct; no change needed

### Approaches

#### Approach A: Simple form page (SSR + form POST)
Create `/admin/pagos/generate-link.astro` that SSR-renders order and method selectors, then POSTs to the existing API endpoint. Display the generated link with a copy button.

**Pros:**
- Follows Astro SSR pattern — pre-fetch orders list on server
- Reuses existing API endpoint — no backend changes
- Simple, minimal code
- Quick to implement

**Cons:**
- User leaves pagos list — must navigate back
- No persistence of generated links (API returns mock, doesn't save to DB)

**Effort: Low**

#### Approach B: Inline modal + API call
Stay on the pagos list page. Add an "Order Selector" modal that POSTs to the API via fetch and shows the result.

**Pros:**
- No page navigation
- Better UX — stays in context
- Can immediately refresh the pagos list if link is persisted

**Cons:**
- Modal needs order search functionality
- Need to handle API response inline
- More JS complexity

**Effort: Medium**

#### Approach C: Full payment link page with persistence
Create the form page AND update the API to persist the generated link as a Pago record in Supabase (using CrearPagoSchema + PagoService.crear()).

**Pros:**
- Links are persisted in DB — visible in pagos list
- Full end-to-end flow
- Ready for Phase 2 Wompi integration

**Cons:**
- More work upfront
- The API comment says "mock for Phase 2" — real Wompi integration is separate

**Effort: Medium-High**

### Recommendation

**Approach A (simple form page)** for Phase 1, with a note to upgrade to Approach C in a follow-up.

The page needs:
1. Fetch orders list on SSR (`svc.ordenes.listar({ limit: 50 })`)
2. Render order dropdown (display: order ID + customer name)
3. Payment method selector (womli_link, pix_qr, pix_copia_cola)
4. POST to `/api/admin/pagos/generate-link`
5. Display generated link with copy-to-clipboard button

### Risks

- The button already navigates to `/admin/pagos/generate-link` — a 404 today means no user is blocked, but it's a dead end
- The API returns mock links. For Phase 1 that's fine — the product team needs to confirm Wompi credentials for Phase 2
- No persistence: the link is generated and displayed, but not saved as a Pago record. The user must manually track it

---

## Dependencies Between Features

| Feature | Depends On | Impact |
|---------|-----------|--------|
| Crear Orden | API endpoint `/api/admin/ordenes/create` | Must create endpoint AND modal |
| Export PDF | jsPDF package install | No build issues, just npm install |
| Real Trends | Nothing | Standalone — only modifies existing computed data |
| Payment Links | Nothing (API exists) | Standalone — just needs the missing page |

No blocking dependencies. All four features can be developed in parallel or independently.

## Ready for Proposal

Yes. Each feature has a clear recommended approach, known affected files, and estimatable effort. The orchestrator should proceed to SDD proposal phase.

### Suggested Priority Order

1. **Payment Link page** (Low effort, API ready, current 404 is a bug)
2. **Real Dashboard Trends** (Low effort, data already available)
3. **Export PDF** (Low-Medium effort, needs npm install)
4. **Crear Orden** (Medium effort, most complex of the four)
