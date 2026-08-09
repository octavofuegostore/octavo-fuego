# Explore: Admin Routing Bug (CR-01 + CR-02)

## Current State

El admin de Octavo Fuego usa Astro file-based routing con estructura de carpetas anidadas:

```
pages/admin/clientes/
├── index.astro              → /admin/clientes (lista)
└── [id]/
    └── page.astro           → /admin/clientes/:id/page (detalle)

pages/admin/ordenes/
├── index.astro              → /admin/ordenes (lista)
└── [id]/
    └── page.astro           → /admin/ordenes/:id/page (detalle)
```

Ambos componentes de tabla (`CustomerTableClient.tsx` y `OrderTableClient.tsx`) navegan mediante `window.location.href` apuntando a `/admin/clientes/{id}` y `/admin/ordenes/{id}` respectivamente, omitiendo el segmento `/page` que Astro requiere para resolver la ruta anidada.

## Affected Areas

### Bug CR-01: CustomerTable → CustomerDetail

| Archivo | Línea | Código actual | Código correcto |
|---------|-------|---------------|-----------------|
| `src-astro/src/components/admin/customers/CustomerTableClient.tsx` | 117 | `window.location.href = \`/admin/clientes/${customerId}\`` | `window.location.href = \`/admin/clientes/${customerId}/page\`` |

- **Función**: `handleViewCustomer(customerId: string)`
- **Ubicación**: Línea 115-119 (handler completo)

### Bug CR-02: OrderTable → OrderDetail

| Archivo | Línea | Código actual | Código correcto |
|---------|-------|---------------|-----------------|
| `src-astro/src/components/admin/orders/OrderTableClient.tsx` | 173 | `window.location.href = \`/admin/ordenes/${orderId}\`` | `window.location.href = \`/admin/ordenes/${orderId}/page\`` |

- **Función**: `handleViewOrder(orderId: string)`
- **Ubicación**: Línea 171-174 (handler completo)

### Mismo patrón roto en otros archivos

| Archivo | Líneas | Ruta actual | Debería ser |
|---------|--------|-------------|-------------|
| `src-astro/src/pages/admin/pagos/[id].astro` | 241 | `` /admin/ordenes/${orden.id} `` | `` /admin/ordenes/${orden.id}/page `` |
| `src-astro/src/pages/admin/pagos/[id].astro` | 259 | `` /admin/ordenes/${orden.id} `` | `` /admin/ordenes/${orden.id}/page `` |
| `src-astro/src/pages/admin/actividad/index.astro` | 170 | `` /admin/ordenes/${ev.orden_id} `` | `` /admin/ordenes/${ev.orden_id}/page `` |

> **Nota**: `actividad/index.astro` y `pagos/[id].astro` también enlazan a órdenes sin el segmento `/page`.

### Inventario — mismo patrón potencial

`src-astro/src/components/admin/inventory/ProductTableClient.tsx:117` navega a `/admin/inventario/${productId}`, pero **no existe** ruta `[id]` en inventario (solo `index.astro`, `stock/page.astro`, `transferencias/page.astro`). No está dentro del alcance de este bug.

## Approaches

### 1. Fix directo (recomendado)

Cambiar el string de la URL en cada handler para incluir `/page`.

- **Pros**: Mínimo cambio, 0 riesgo, corregido en segundos.
- **Cons**: Si en el futuro se cambia la estructura de rutas, hay que acordarse de actualizar estos strings.
- **Esfuerzo**: Bajo — 1 línea por archivo.

### 2. Extraer constantes de ruta

Crear constantes tipo `CUSTOMER_DETAIL_ROUTE = (id) => \`/admin/clientes/${id}/page\`` en un módulo compartido.

- **Pros**: DRY, más fácil de mantener si la estructura cambia.
- **Cons**: Overkill para un fix de 2 líneas. Agrega archivo nuevo.
- **Esfuerzo**: Medio — crear helper + importar en 4+ componentes.

### 3. Reestructurar rutas (no recomendado)

Mover `[id]/page.astro` → `[id].astro` para eliminar la necesidad del segmento `/page`.

- **Pros**: Elimina el bug de raíz, URLs más limpias.
- **Cons**: Rompe URLs existentes, requiere cambios en middleware o links de terceros, esfuerzo mayor.
- **Esfuerzo**: Alto — mover archivos, actualizar referencias, verificar redirects.

## Recommendation

**Approach 1: Fix directo.** Son 2 bugs con 2 líneas de fix. Cada bug se corrige cambiando **un string** en una línea:

**CR-01** — `CustomerTableClient.tsx:117`:
```diff
-     window.location.href = `/admin/clientes/${customerId}`;
+     window.location.href = `/admin/clientes/${customerId}/page`;
```

**CR-02** — `OrderTableClient.tsx:173`:
```diff
-     window.location.href = `/admin/ordenes/${orderId}`;
+     window.location.href = `/admin/ordenes/${orderId}/page`;
```

**Bonus** — Corregir las referencias cruzadas en:
- `pagos/[id].astro:241`
- `pagos/[id].astro:259`
- `actividad/index.astro:170`

## Risks

- **Riesgo bajo**: Las URLs actuales simplemente no funcionan (404), no hay daño colateral.
- **Rutas de inventario**: `ProductTableClient.tsx` también navega a `/admin/inventario/${productId}` pero no existe ruta `[id]` para inventario. Esto es un bug separado, no cubierto aquí.
- **Sin tests**: No hay tests E2E que detecten estos 404s. Considerar agregar smoke test básico de navegación admin.

## Effort

| Bug | Archivos | Líneas a cambiar | Esfuerzo |
|-----|----------|------------------|----------|
| CR-01 | 1 | 1 | 30 segundos |
| CR-02 | 1 | 1 | 30 segundos |
| Bonus | 2 | 3 | 1 minuto |
| **Total** | **3-4 archivos** | **5 líneas** | **<5 minutos** |

## Ready for Proposal

**Sí.** El bug está identificado, localizado en archivos exactos, con la línea exacta y el fix es trivial. Se puede pasar a `sdd-propose` directamente.
