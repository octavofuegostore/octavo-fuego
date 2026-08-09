## Exploration: Optimizar Cadena Crítica JS (~588ms)

### Current State

Lighthouse reporta 4 bundles JS cargados secuencialmente en la página principal:

```
1. ClientRouter.astro_ast_….js (6.14KB)  — ViewTransitions runtime
2. Navbar.astro_ast_….js (2.01KB)       — Menú mobile, dropdown catálogo, badge carrito
3. cartStore.BYQiG6Jg.js (1.17KB)       — Nanostores cart store
4. index.C7BV1ZGy.js (1.05KB)           — Dependencia del dynamic import
```

**Total: ~10.37KB** en 4 requests secuenciales = ~588ms en 3G simulado.

### Root Cause Identified

El problema principal está en **Navbar.astro línea 262-271**:

```js
document.addEventListener('astro:page-load', () => {
    import('@/stores/cartStore').then(({ cartCount }) => {
```

Ese **dynamic `import()`** fuerza al browser a esperar a que Navbar.js se descargue Y ejecute antes de siquiera *descubrir* que necesita cartStore. El bundle compilado confirma el waterfall en `__vite__mapDeps([0,1])` que mapea a `cartStore.BYQiG6Jg.js` e `index.C7BV1ZGy.js`.

Adicionalmente, Astro convierte CADA bloque `<script>` en un archivo module separado — Layout.astro tiene un script de breakpoint handler, Navbar.astro tiene 3 scripts (pero Astro los fusiona en uno), y cada página puede tener los suyos.

### Affected Areas

- `src-astro/src/components/Navbar.astro:262-271` — Dynamic `import('@/stores/cartStore')` que crea el waterfall
- `src-astro/src/layouts/Layout.astro:105-118` — Inline `<script>` de breakpoint detection (se convierte en módulo separado)
- `src-astro/src/stores/cartStore.ts` — Store completo (~1.17KB min) importado dinámicamente
- `src-astro/astro.config.mjs:74-77` — `@playform/inline` configurado solo para `preload: 'media'`
- `src-astro/dist/client/_astro/` — Bundles generados por Astro/Vite

### Approaches

#### 1. **Convertir dynamic import a static import en Navbar** ⭐ RECOMENDADO

Cambiar el `import('@/stores/cartStore')` en Navbar.astro a un import estático al inicio del bloque `<script>`. Vite lo bundleará junto con Navbar.js, eliminando 2 requests (cartStore + index) de la cadena.

```diff
+ import { cartCount } from '@/stores/cartStore';
  
  document.addEventListener('astro:page-load', () => {
-   import('@/stores/cartStore').then(({ cartCount }) => {
      const badge = document.getElementById('cart-badge');
      if (!badge) return;
      cartCount.subscribe((count) => { ... });
-   });
  });
```

- **Pros**: Elimina 2 requests (~2.22KB) de la cadena crítica. El bundle Navbar pasa de 2KB → ~3.17KB pero se carga en paralelo. Cero riesgo funcional.
- **Cons**: El store se ejecuta aunque no haya badge (el subscription handler igual lo protege con null-check).
- **Effort**: Low (~5 min, 1 archivo)
- **Beneficio estimado**: Elimina ~250ms de la cadena (2 requests secuenciales)

#### 2. **Añadir `<link rel="modulepreload">` para bundles críticos**

Agregar `modulepreload` hints para que el browser descubra y descargue los módulos en paralelo antes de que el parser los necesite.

Se necesita un plugin Vite simple que genere los links o agregarlos manualmente (pero los hashes cambian en cada build).

- **Pros**: El browser descubre cartStore ANTES de que Navbar se ejecute. Bajo riesgo.
- **Cons**: Requiere un Vite plugin o script post-build para manejar hashes. `@playform/inline` no soporta `modulepreload` nativamente. No elimina requests, solo los solapa.
- **Effort**: Medium (crear plugin Vite de ~40 líneas o script post-build)
- **Riesgo**: Muy bajo (solo añade `<link>` tags)
- **Beneficio estimado**: Reduce ~100-150ms al paralelizar descubrimiento

#### 3. **Fusionar `<script>` blocks en Layout.astro**

El script de breakpoint detection en Layout.astro actualmente genera su propio módulo separado. Fusionarlo con scripts de página reduce request count.

- **Pros**: Reduce 1 request de la cadena (~0.5KB del breakpoint handler)
- **Cons**: El breakpoint handler se carga aunque no se necesite. Cambio cosmético vs beneficio marginal.
- **Effort**: Low
- **Riesgo**: Bajo
- **Beneficio estimado**: Marginal (~30-50ms)

#### 4. **Configurar `vite.environments.client.build.rollupOptions.output.manualChunks`**

Usar `manualChunks` en Astro 6 para agrupar chunks pequeños relacionados. Por ejemplo, crear un chunk común para `nanostores` + `cartStore` que se cargue temprano.

- **Pros**: Agrupa lógica relacionada en chunks predecibles
- **Cons**: No resuelve el waterfall directamente. `manualChunks` puede crear chunks demasiado grandes si no se configura bien.
- **Effort**: Medium (investigar la configuración exacta en Astro 6)
- **Riesgo**: Medio (podría empeorar el caching si se usan hashes)
- **Beneficio estimado**: Indirecto, depende de la configuración

#### 5. **ClientRouter condicional (solo en páginas que lo necesiten)**

ViewTransitions solo es necesario en páginas donde hay navegación interna (tienda → producto, blog → post). La homepage podría cargar sin ClientRouter.

- **Pros**: Elimina 6.14KB de request en la homepage
- **Cons**: Requiere un layout separado para homepage (sin VT) o prop condicional. Decision de arquitectura mayor.
- **Effort**: Medium (crear variante de layout sin ClientRouter)
- **Riesgo**: Bajo (VT no es crítico en homepage)
- **Beneficio estimado**: Elimina ~200ms (request 6KB + exec time)

### Recommendation

**Approach 1 (static import) es el fix de mayor impacto con mínimo esfuerzo.** Ataca la raíz del waterfall: el dynamic import.

Lo implementaría en este orden:

1. **Fase 1 — Static import** (5 min, 1 archivo): Cambiar `import()` a static import en Navbar. Esto solo elimina 2 requests.
2. **Fase 2 — modulepreload plugin** (~1h): Crear Vite plugin que emita `<link rel="modulepreload">` para entry points y chunks críticos. Esto paraleliza descubrimiento.
3. **Fase 3 — Evaluar ClientRouter condicional** (~30 min): Si después de F1+F2 la cadena sigue siendo problema, considerar layout sin VT para homepage y landing pages.

### Risks

- **Fase 1**: Riesgo mínimo. El static import ejecuta `cartStore.init` apenas se parsea el módulo, pero solo suscribe al badge si existe. Sin cambio funcional.
- **Fase 2**: El plugin modulepreload no debe romper nada — solo añade `<link>` tags. Verificar que no duplique requests en dev.
- **Fase 3**: Layout sin VT pierde animaciones de transición en homepage. Aceptable si la homepage es entry point (~60%+ de tráfico).

### Ready for Proposal

**Sí.** Comenzar con Fase 1 (static import en Navbar.astro) que es trivial y tiene high confidence. Después evaluar si modulepreload aún vale la pena midiendo con Lighthouse post-cambio.

Lo que deberías decirle al usuario: "Identifiqué la causa raíz: un dynamic `import()` en Navbar.astro crea un waterfall que impide que el browser descubra cartStore hasta después de ejecutar Navbar. Con cambiar a static import eliminamos 2 requests y ~250ms. Después evaluamos si agregamos modulepreload para los chunks restantes."
