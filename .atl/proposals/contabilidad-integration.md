# SDD Proposal: Contabilidad Integration

## Intent
Integrate full accounting module into Octavo Fuego admin panel, porting logic from Contabilidad_pipod (Next.js) to Astro with React islands.

## Scope
- **In scope**: Dashboard contable, transacciones CRUD, informes mensuales, exportación Excel/PDF, Órdenes → Transacciones automático
- **Out of scope**: IA Strategy (DeepSeek), Gema import, Plantillas recurrentes

## Approach

### Phase 1: Database + Types (Foundation)
1. Create `002_contabilidad_schema.sql` migration
   - `cont_transacciones` table with moneda, region, orden_id
   - `cont_categorias` table (cosmetics categories)
   - `cont_configuracion` table
   - Indexes, triggers, seed data
2. Create `src/lib/contabilidad/types.ts` — port from Contabilidad_pipod
3. Create `src/lib/contabilidad/constants.ts` — adapt categories for cosmetics
4. Create `src/lib/contabilidad/validations.ts` — port Zod schemas

### Phase 2: Hooks (Business Logic)
Port from Contabilidad_pipod with minimal changes:
1. `src/hooks/useResumen.ts` — balance calculation
2. `src/hooks/useGraficas.ts` — category breakdown
3. `src/hooks/useInformeMensual.ts` — monthly report
4. `src/hooks/useTransacciones.ts` — CRUD operations
5. `src/hooks/useExportarExcel.ts` — CSV export
6. `src/hooks/useExportarPDF.ts` — PDF export

### Phase 3: API Routes (Astro)
Convert Next.js API routes to Astro:
1. `src/api/contabilidad/transacciones/route.ts` — GET, POST
2. `src/api/contabilidad/transacciones/[id]/route.ts` — PUT, DELETE
3. `src/api/contabilidad/dashboard/route.ts` — stats

### Phase 4: Components (React Islands)
Port and adapt:
1. `BalanceCards.astro` — KPI cards (remove framer-motion, use CSS transitions)
2. `TransaccionForm.astro` — form with OF categories
3. `TransaccionList.astro` — table with filters
4. `GraficasContabilidad.astro` — charts

### Phase 5: Pages + Sidebar
1. Create `/admin/contabilidad/index.astro` — dashboard
2. Create `/admin/contabilidad/transacciones.astro` — list + create
3. Create `/admin/contabilidad/informes.astro` — monthly + annual
4. Update AdminLayout sidebar with Contabilidad menu item

### Phase 6: Order → Transaction Bridge
1. Add trigger or service function to convert completed orders to transactions
2. When order status = 'entregado', auto-create cont_transaccion
3. Link via orden_id field

## Dependencies
- shadcn/ui (already installed)
- Supabase client (already configured)
- No new npm packages required (recharts already in Contabilidad_pipod)

## Risks
- Framework mismatch: Next.js SSR → Astro SSG with React islands
- Solution: All interactive components use `client:load` directive
- Supabase queries work the same way in both frameworks

## Success Criteria
- Admin can view financial dashboard at /admin/contabilidad
- Admin can create/edit/delete transactions
- Orders automatically create transactions when delivered
- Export to Excel/PDF works
- All in one admin panel, no separate apps
