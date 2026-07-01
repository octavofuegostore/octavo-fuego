# Proposal: Admin Pages Core (F14)

## Intent

Deliver product CRUD admin pages for OF's 24-product catalog. Current `admin/inventario/` uses mock data and a static `ProductForm.astro` that does nothing on submit — blocking real multi-currency pricing, per-location inventory, and product lifecycle management.

## Scope

### In Scope
- Product list (search, category/status filters, pagination) — enhance existing
- Product detail + edit page with full form
- Pricing Editor (React island) — multi-currency per presentación (10g/20g/30g)
- Stock Display (React island) — per-location stock levels
- SEO fields inline in product form (title, meta desc, slug)
- Wire CRUD to real Supabase services
- Single admin user — no roles infrastructure

### Out of Scope
- Order audit trail (F27) — blocked until F5 DB migrations
- Bulk import/export, image upload, role-based permissions
- Separate SEO tab — 24 products don't justify tabs

## Capabilities

### New Capabilities
- `product-crud`: Product admin pages — list, detail, create, edit, multi-currency pricing, stock display, inline SEO

### Modified Capabilities
- None

## Approach

1. Migrate from `admin/inventario/` → `admin/productos/`
2. Convert `ProductForm.astro` → React island with validation + API submission
3. Build `PricingEditor.tsx` — 3×3 grid (presentación × moneda), inline editing
4. Build `StockDisplay.tsx` — per-location stock with low-stock badges
5. Add SEO section to product form
6. Wire CRUD ops to Supabase service layer
7. Keep `prerender = false` on all admin pages

## Affected Areas

| Area | Impact |
|------|--------|
| `pages/admin/inventario/` | Modified (migrate to `productos/`) |
| `pages/admin/productos/` | New (list + detail/edit) |
| `components/admin/inventory/` | Modified (ProductForm → React, new PricingEditor + StockDisplay) |
| `lib/admin/service.ts` | Modified (wire product CRUD to Supabase) |
| `lib/admin/schemas/` | New (Zod form validation) |

## Risks & Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Route break from inventario→productos | Low | Redirect old paths |
| Form complexity per React island | Med | Split into sub-islands |
| Supabase schema mismatch | Med | Coordinate with F5, keep mock fallback |

## Rollback

Revert the change directory. Restore `inventario/` routes. Mock `service.ts` fallback active if Supabase wiring fails.

## Dependencies

- F1–F3 (Zod schemas, typed errors, service layer)
- F5 (DB schema migrations) — blocks F27, not F14
- F6 (Supabase Client Config)

## Success Criteria

- [ ] Product list renders real Supabase data, not mocks
- [ ] Create product: form → validation → API → table refresh
- [ ] Edit product: load → modify → save → confirmation
- [ ] Pricing Editor: all 9 cells save independently
- [ ] SEO fields persist and render in detail view
- [ ] `npm run build` passes with zero errors
