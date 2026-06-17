# Plan de Migración: /catalogo/ → /tienda/

> **Fecha**: Junio 16, 2026  
> **Estado**: ✅ YA COMPLETADA  
> **Proyecto**: Octavo Fuego — Astro 6.1.3 + TailwindCSS 4

---

## Resumen Ejecutivo

La migración de `/catalogo/` a `/tienda/` está **COMPLETA** a nivel de código. El sistema de archivos ya usa `/tienda/` en todos los componentes, páginas y navegación. Quedan solo 7 redirect rules legacy en `astro.config.mjs` que deben evaluarse.

---

## Qué se migró

### Código fuente (100% completo)

| Área | Archivos | Estado |
|------|----------|--------|
| Navbar.astro | Links de navegación | ✅ `/tienda/` |
| Footer.astro | Link a tienda | ✅ `/tienda/` |
| Homepage [locale]/index.astro | CTAs y producto cards | ✅ `/tienda/` |
| Carrito/index.astro | Link a checkout | ✅ `/es/tienda/` |
| CheckoutForm.tsx | Botón "Ir al catálogo" (display text) | ✅ `/es/tienda/` |
| CategoryPills.astro | Link default | ✅ `/es/tienda/` |
| i18n nav.tienda | Display labels "Tienda"/"Shop"/"Loja" | ✅ Correcto |
| Sitemap | Auto-generado con URLs /tienda/ | ✅ Correcto |

### URLs de producto (mapeo completo)

| Producto | URL nueva (actual) | Redirect legacy en astro.config |
|----------|-------------------|----------------------------------|
| Tisunú | `/es/tienda/rape/tisunu/` | `/catalogo/tisunu` → `/es/tienda/rape/tisunu/` |
| Pixurí | `/es/tienda/rape/pixuri/` | `/catalogo/pixuri` → `/es/tienda/rape/pixuri/` |
| Pariká | `/es/tienda/rape/parika/` | `/catalogo/parika` → `/es/tienda/rape/parika/` |
| Cumarú de Cheiro | `/es/tienda/rape/cumaru-de-cheiro/` | `/catalogo/cumaru-de-cheiro` → `/es/tienda/rape/cumaru-de-cheiro/` |
| Vena de Pajé | `/es/tienda/rape/vena-de-paje/` | `/catalogo/vena-de-paje` → `/es/tienda/rape/vena-de-paje/` |

### Otros redirects activos

| Desde | Hacia |
|-------|-------|
| `/` | `/es/` |
| `/catalogo` | `/es/tienda` |
| `/catalogo/rape` | `/es/tienda/rape` |
| `/profecia` | `/es/profecia` |

---

## Estructura actual de archivos

```
src/pages/[locale]/
├── index.astro              # Homepage
├── profecia.astro            # Profecía
└── tienda/
    ├── index.astro           # Catálogo principal
    └── rape/
        ├── index.astro       # Lista de rapés
        └── [product].astro  # Detalle de producto (5 × 3 locales = 15 paths)
```

**NO existe** `src/pages/[locale]/catalogo/`. El directorio físico fue renombrado a `tienda/`.

---

## Decisión pendiente: ¿Eliminar los redirects legacy?

### Opción A: Mantener redirects permanente
```js
redirects: {
  '/catalogo': '/es/tienda',
  '/catalogo/rape': '/es/tienda/rape',
  // ... los 7 redirects
}
```
- **Ventaja**: Si alguien tiene bookmarks a `/catalogo/tisunu/`, sigue funcionando.
- **Riesgo**: Mínima contaminación de SEO (Google puede indexar ambas URLs).

### Opción B: Eliminar después de reindexación (recomendado)
1. Mantener redirects 6 meses post-migración
2. En Google Search Console, verificar que Google indexa `/es/tienda/` y NO `/catalogo/`
3. Eliminar redirects cuando Search Console confirme 0 requests a `/catalogo/*`
4. Hacer 301 permanente de `/catalogo/*` → `/es/tienda/*` en Vercel Edge

**Recomendación**: Opción B. Mantener 6 meses, monitorear, eliminar.

---

## Tareas relacionadas en PENDIENTES.md

| Tarea | Estado | Notas |
|-------|--------|-------|
| **URLs: decidir `/catalogo/` vs `/tienda/`** | ✅ COMPLETADA | El código ya usa `/tienda/` |
| Agregar redirect `/catalogo/*` → `/es/tienda/*` | ✅ COMPLETADA | 7 redirects en astro.config.mjs |
| Actualizar sitemap | ✅ COMPLETADA | @astrojs/sitemap auto-genera con URLs nuevas |
| Actualizar hreflang | ⏳ PENDIENTE | Activar hreflang CO↔EN (BR no existe) |

---

## Verificación post-migración

- [x] Código fuente no contiene `/catalogo` como URL (solo en redirects legacy)
- [x] Navbar, Footer, homepage usan `/tienda/`
- [x] Sitemap genera URLs `/tienda/`
- [x] 7 redirects 301 funcionales en astro.config.mjs
- [ ] Verificar en Google Search Console que Google indexa `/tienda/` y NO `/catalogo/`

---

*Documentado: Junio 16, 2026*  
*⚠️ NOTA: Este archivo debe copiarse a /octavo-fuego/.atl/plan-migracion-urls.md*