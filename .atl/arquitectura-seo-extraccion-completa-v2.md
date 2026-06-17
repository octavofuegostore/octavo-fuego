# Extracción Completa — Arquitectura SEO Transnacional

> **Fuente:** `.atl/arquitectura-seo-transnacional.md` (521 líneas, 11 secciones)  
> **Extraído:** Junio 16, 2026  
> **Objetivo:** Todo lo accionable del documento, más allá de solo keywords

---

## 🔴 Gap 1: Ventaja Competitiva NO comunicada

El doc define la ventaja central: **46% más barato por gramo** ($3.500 vs $6.500). Ningún competidor comunica precio por gramo. Pero...

| Lo que dice el doc | ¿Implementado? |
|---|---|
| Precio por gramo como elemento MÁS visible en PDP | ❌ |
| Copy: "20 gramos por el precio que otros cobran por 10" | ❌ |
| Jerarquía visual: $/gramo grande → precio total → opciones | ❌ |

**Acción:** Rediseñar jerarquía de precio en las 5 PDPs. Esto es diseño + copy, no solo SEO.

---

## 🔴 Gap 2: 3 Páginas Informacionales NO existen

El doc define 3 páginas de contenido que capturan tráfico frío y lo convierten:

| URL | Keywords | Objetivo |
|-----|----------|----------|
| `/es/que-es-el-rape/` | qué es el rapé, para qué sirve, efectos | Capturar discovery → catálogo |
| `/es/como-usar-el-rape/` | cómo aplicar, kuripe cómo usar, ceremonial | Última barrera antes de comprar |
| `/es/rape-do-acre-origen/` | rapé brasileño vs colombiano, empaque vacío | Diferenciación competitiva |

**Impacto SEO: Alto. Plazo: Semana 2-3 según doc.**

---

## 🔴 Gap 3: Categoría Kuripe + 2 productos NO existen

El doc define 7 productos (5 rapés + 2 kuripes). Pero los kuripes no están:

| URL | Producto |
|-----|----------|
| `/es/tienda/kuripe/kuripe-clasico/` | Kuripe Clásico |
| `/es/tienda/kuripe/kuripe-doble/` | Kuripe Doble |

Con sus keywords, H1s y meta descriptions completos en el doc.

---

## 🟡 Gap 4: URLs actuales ≠ URLs del doc

| Actual (PENDIENTES.md) | Doc Arquitectura SEO |
|---|---|
| `/catalogo/rape/tisunu/` | `/tienda/rape/tisunu/` |
| `/catalogo/` | `/tienda/` |

**El doc usa `/tienda/`, el código usa `/catalogo/`.** Esto es un redirect 301 pendiente o una decisión arquitectónica no resuelta.

---

## 🟡 Gap 5: hreflang Cruzados NO implementados

El doc define hreflang para CADA página indexada. Ejemplo:

```html
<link rel="alternate" hreflang="es-CO" href="https://octavofuego.com/es/tienda/rape/tisunu/" />
<link rel="alternate" hreflang="en"    href="https://octavofuego.com/en/shop/rape/tsunu/" />
<link rel="alternate" hreflang="pt-BR" href="https://octavofogo.com.br/loja/rape/tisunu/" />
<link rel="alternate" hreflang="x-default" href="https://octavofuego.com/en/shop/rape/tsunu/" />
```

**Regla crítica del doc:** Los slugs de producto en Medusa deben ser idénticos en las 3 variantes.

---

## 🟡 Gap 6: Hub EN (inglés) NO existe

| URL | Estado |
|-----|--------|
| `/en/` Home Internacional | ❌ |
| `/en/shop/` | ❌ |
| `/en/shop/rape/` | ❌ |
| `/en/wholesale/` | ❌ |
| 7 productos en inglés | ❌ |

**Impacto SEO: Alto. Plazo: Mes 2.**

---

## 🟡 Gap 7: Hub BR (Brasil) NO existe

| URL | Estado |
|-----|--------|
| `octavofogo.com.br/` | ❌ Dominio no adquirido |
| `/loja/` | ❌ |
| `/atacado/` | ❌ |
| 7 productos en portugués | ❌ |

**Impacto SEO: Alto. Plazo: Mes 2.**

---

## 🟡 Gap 8: Landing Mayorista — H1 y Keywords wrong

| Elemento | Actual | Doc recomienda |
|----------|--------|---------------|
| H1 | "Alianza Ancestral: Suministro Institucional..." | "Distribución Institucional de Rapé do Acre para Facilitadores y Distribuidores en Colombia" |
| Keywords | 6 (2 mal, 4 faltan) | 8 (4 primarias + 4 secundarias) |

---

## 🟢 Gap 9: Directivas SEO — Faltan verify

El doc tiene matriz completa de `robots`, `hreflang`, `sitemap` por tipo de página. Verificar que cada página actual cumple:

| Tipo | robots | ¿Implementado? |
|------|--------|---------------|
| Home | index,follow | Verificar |
| Tienda | index,follow | Verificar |
| Categoría rapé | index,follow | Verificar |
| Producto | index,follow | Verificar |
| Mayoristas landing | index,follow | Verificar |
| Mayoristas registro | noindex,nofollow | Verificar |

---

## 🟢 Gap 10: Blog NO existe

- `/es/blog/` — doc lo planifica para Mes 3+
- 10 keywords de cola larga ya definidas
- Cada artículo → link a producto

---

## 🟢 Gap 11: Meta Descriptions — probablemente NO alineadas

El doc tiene meta descriptions específicas para:
- Home (con precio $3.500/g)
- Tienda
- Categoría Rapé (con precio)
- Categoría Kuripe
- Cada uno de los 7 productos (con precio $3.500/g)
- Landing Mayorista

Verificar si las actuales coinciden.

---

## 📊 Matriz Completa de Gaps

| # | Gap | Sección doc | Impacto | Plazo doc |
|---|-----|-------------|---------|-----------|
| 1 | Precio/g no visible en PDP | §9 | 🔴 Alto | Semana 1 |
| 2 | 3 páginas informacionales | §4 | 🔴 Alto | Semana 2-3 |
| 3 | Kuripe cat + 2 productos | §3.1 | 🔴 Alto | ? |
| 4 | URLs /catalogo/ → /tienda/ | §3.1 | 🟡 Medio | Semana 1 |
| 5 | hreflang cruzados | §7 | 🟡 Medio | Semana 3 |
| 6 | Hub EN completo | §5 | 🟡 Alto | Mes 2 |
| 7 | Hub BR completo | §6 | 🟡 Alto | Mes 2 |
| 8 | Landing keywords + H1 | §4 | 🟡 Medio | Ya |
| 9 | Directivas SEO verify | §8 | 🟢 Bajo | Auditoría |
| 10 | Blog | §11 | 🟢 Acumulativo | Mes 3+ |
| 11 | Meta descriptions | §4-6 | 🟢 Medio | Auditoría |

---

## 🎯 Top 5 Acciones Inmediatas (esta semana)

1. **Corregir keywords + H1 landing B2B** — ya documentado en `.atl/b2b-mayoristas-landing-audit.md`
2. **Rediseñar jerarquía de precio en PDPs** — $/gramo como elemento principal
3. **Agregar copy line en cada producto:** "20 gramos por el precio que otros cobran por 10"
4. **Resolver URLs:** mantener `/catalogo/` o migrar a `/tienda/` — decisión arquitectónica
5. **Crear `/es/que-es-el-rape/`** — primera página informacional (más rápida de las 3)
