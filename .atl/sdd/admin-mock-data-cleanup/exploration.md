## Exploration: admin-mock-data-cleanup (CR-03)

### Current State

El admin de Octavo Fuego tiene contaminación de mock data de otro negocio (Pipod). Hay tres tipos de contaminación:

1. **UI — Filtros de categoría**: Muestran categorías ajenas ("Cera de Ducha", "Sabonete", "Packs", "Accesorios") que no existen en Octavo Fuego.
2. **UI — Formulario de producto**: El dropdown de categorías tiene opciones del otro negocio y el placeholder usa "Cera de Ducha - Cacao" como ejemplo.
3. **Mock data — Nombres de productos**: Los 20 productos mock generados tienen nombres incorrectos (Bobinsana, Kaxinawá, etc.) que no corresponden a los 5 rapés reales.

Afortunadamente, la categoría **en los datos generados** ya es `'rapé'` — la contaminación de categorías está solo en la UI, no en los datos mock. Cuando Supabase está configurado, `mapper.ts` hardcodea `category: 'rapé'` correctamente.

### Real Products (from `src/data/products.ts`)

| Producto | Slug | Presentaciones | Categoría |
|----------|------|----------------|-----------|
| Tsunú | `tsunu` | 10g / 20g / 30g | rapé |
| Pixurí | `pixuri` | 10g / 20g / 30g | rapé |
| Pariká | `parika` | 10g / 20g / 30g | rapé |
| Cumarú de Cheiro | `cumaru-de-cheiro` | 10g / 20g / 30g | rapé |
| Vena de Pajé | `vena-de-paje` | 10g / 20g / 30g | rapé |

Todos los productos del negocio son rapés. No existe "Cera de Ducha", "Sabonete", "Packs" ni "Accesorios". Octavo Fuego vende exclusivamente rapés (aunque la tienda pública menciona sananga y kuripes como contenido SEO, no como productos en inventario).

### Affected Areas

| # | Archivo | Líneas | Problema |
|---|---------|--------|----------|
| 1 | `src/components/admin/inventory/ProductTableClient.tsx` | 171-175 | Filter dropdown hardcodea "Cera de Ducha", "Sabonete", "Packs", "Accesorios" |
| 2 | `src/components/admin/inventory/ProductForm.astro` | 73, 107-109 | Placeholder "Ej: Cera de Ducha - Cacao" + dropdown con "Cera de Ducha", "Sabonete", "Pack" |
| 3 | `src/lib/admin/service.ts` | 33, 95-128 | `generarMockProductos()` genera 20 productos con nombres Bobinsana, Kaxinawá, Nukini, Shawandawa, Katukina |
| 4 | `src/lib/admin/domain/servicios/producto-servicio.ts` | 218-265 | `MockProductoServicio._generarMock()` genera los mismos nombres incorrectos |
| 5 | `src/lib/admin/services/productos.ts` | 16-28 | `generarMock()` mapea desde `generarMockProductos()` heredando nombres incorrectos |
| 6 | `src/types/admin.ts` | 34 | Tipo `category` permite `'sananga' | 'kuripe' | 'b2b'` que no se usan en admin |

### Approaches

1. **Reemplazar mock data y limpiar UI filters**
   - Reemplazar nombres mock (Bobinsana → Tsunú, etc.) en los 3 archivos donde se generan
   - Reemplazar filtros de categoría con solo `'rapé'` (o remover el filtro si solo hay una categoría)
   - Reemplazar dropdown de ProductForm.astro con solo `'rapé'`
   - Simplificar el type `category` si es posible
   - Pros: Completo, elimina toda la contaminación de raíz
   - Cons: Los mock products ahora mostrarán los mismos 5 rapés que los reales (pierde valor como mock data diferente)
   - Effort: **Low** (~30 min)

2. **Solo limpiar UI + type, mantener mock names variados**
   - Limpiar solo los filtros y forms de UI (items 1, 2, 6)
   - Dejar los mock names como están (no afectan al usuario final si Supabase está configurado)
   - Pros: Mínimo cambio, los mock names son irrelevantes en producción
   - Cons: Contaminación parcial permanece, alguien que vea el código se confunde
   - Effort: **Very Low** (~15 min)

3. **Refactor completo — mock data desde products.ts**
   - `generarMockProductos()` lee de `src/data/products.ts` en vez de tener su propio array
   - Elimina duplicación de datos de productos (DRY)
   - Pros: Data source única, los mocks siempre reflejan los reales
   - Cons: Más esfuerzo, requiere importar el tipo `Product` de data/products.ts vs `Producto` de types/admin.ts
   - Effort: **Medium** (~1-2 hrs si hay incompatibilidades de tipos)

### Recommendation

**Approach 1** — Reemplazar mock data y limpiar UI filters. Es el punto óptimo entre esfuerzo y limpieza completa:

| Archivo | Cambio |
|---------|--------|
| `ProductTableClient.tsx:171-175` | Reemplazar 4 options con solo `<option value="rapé">Rapé</option>` (o remover filtro de categoría si solo hay una) |
| `ProductForm.astro:73` | Cambiar placeholder a "Ej: Tsunú" |
| `ProductForm.astro:107-109` | Reemplazar 3 options con solo `<option value="rapé">Rapé</option>` |
| `service.ts:33,95-128` | Cambiar `RAPES` a `['Tsunú', 'Pixurí', 'Pariká', 'Cumarú de Cheiro', 'Vena de Pajé']` |
| `producto-servicio.ts:218-265` | Mismo cambio en el array `rapes` y nombres |
| `services/productos.ts:16-28` | Ya hereda de `service.ts` — se actualiza automáticamente |
| `types/admin.ts:34` | Simplificar a `category: 'rapé'` (o dejar para expansión futura) |

### Category Decision

**La categoría única debe ser `'rapé'`.** Octavo Fuego actualmente solo comercializa rapés. Aunque el i18n y SEO mencionan sananga y kuripes, no hay productos de esas categorías en el inventario ni en el catálogo de la tienda. Si en el futuro se agregan, se puede expandir el tipo entonces (YAGNI).

### Risks

- Ninguno de los cambios afecta datos reales de Supabase — solo mock data y UI components
- El filtro de categoría dejará de tener sentido funcional si solo hay una categoría. Considerar removerlo completamente de `ProductTableClient.tsx` en vez de dejarlo con una sola opción
- Puede haber otros archivos con referencias a estas categorías que no aparecieron en la búsqueda

### Dependencias

- Ninguna — es un cambio independiente, no bloquea ni es bloqueado por otros trabajos

### Ready for Proposal

**Yes.** El alcance está claro, los archivos identificados, el fix es directo. Se puede pasar a proposal/spec.
