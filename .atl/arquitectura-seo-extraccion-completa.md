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

| URL | Keywords | Objetivo |
|-----|----------|----------|
| `/es/que-es-el-rape/` | qué es el rapé, para qué sirve, efectos | Capturar discovery → catálogo |
| `/es/como-usar-el-rape/` | cómo aplicar, kuripe cómo usar, ceremonial | Última barrera antes de comprar |
| `/es/rape-do-acre-origen/` | rapé brasileño vs colombiano, empaque vacío | Diferenciación competitiva |

---

## 🔴 Gap 3: Categoría Kuripe + 2 productos NO existen

| URL | Producto |
|-----|----------|
| `/es/tienda/kuripe/kuripe-clasico/` | Kuripe Clásico |
| `/es/tienda/kuripe/kuripe-doble/` | Kuripe Doble |

---

## 🟡 Gap 4: URLs actuales ≠ URLs del doc

| Actual (código) | Doc Arquitectura SEO |
|---|---|
| `/tienda/rape/tisunu/` | `/tienda/rape/tisunu/` |

✅ RESUELTO — El código ya usa `/tienda/`. La migración está completa.

---

## 🟡 Gap 5: hreflang Cruzados NO implementados

```html
<link rel="alternate" hreflang="es-CO" href="https://octavofuego.com/es/tienda/rape/tisunu/" />
<link rel="alternate" hreflang="en"    href="https://octavofuego.com/en/shop/rape/tsunu/" />
<link rel="alternate" hreflang="pt-BR" href="https://octavofogo.com.br/loja/rape/tisunu/" />
<link rel="alternate" hreflang="x-default" href="https://octavofuego.com/en/shop/rape/tsunu/" />
```

---

## 🟡 Gap 6: Hub EN (inglés) NO existe

| URL | Estado |
|-----|--------|
| `/en/` Home Internacional | ❌ |
| `/en/shop/` | ❌ |
| `/en/wholesale/` | ❌ |

---

## 🟡 Gap 7: Hub BR (Brasil) NO existe

Dominio `octavofogo.com.br` no adquirido.

---

## 🟡 Gap 8: Landing Mayorista — H1 y Keywords wrong

| Elemento | Actual | Doc recomienda |
|----------|--------|---------------|
| H1 | "Alianza Ancestral..." | "Distribución Institucional de Rapé do Acre para Facilitadores y Distribuidores en Colombia" |
| Keywords | 6 | 8 (4 primarias + 4 secundarias) |

---

## 🟢 Gap 9: Directivas SEO — Faltan verify

Verificar robots, hreflang, sitemap por tipo de página (matriz en §8 del doc).

---

## 🟢 Gap 10: Blog NO existe

10 keywords de cola larga definidas en §11.

---

## 🟢 Gap 11: Meta Descriptions — probablemente NO alineadas

El doc tiene meta descriptions específicas para Home, Tienda, Categoría Rapé, Categoría Kuripe, 7 productos, Landing Mayorista — todas con precio $3.500/g.

---

## 📊 Matriz Completa

| # | Gap | Impacto | Plazo doc |
|---|-----|---------|-----------|
| 1 | Precio/g no visible en PDP | 🔴 Alto | Semana 1 |
| 2 | 3 páginas informacionales | 🔴 Alto | Semana 2-3 |
| 3 | Kuripe cat + 2 productos | 🔴 Alto | ? |
| 4 | URLs /catalogo/ → /tienda/ | ✅ YA MIGRADO | — |
| 5 | hreflang cruzados | 🟡 Medio | Semana 3 |
| 6 | Hub EN completo | 🟡 Alto | Mes 2 |
| 7 | Hub BR completo | 🟡 Alto | Mes 2 |
| 8 | Landing keywords + H1 | 🟡 Medio | Ya |
| 9 | Directivas SEO verify | 🟢 Bajo | Auditoría |
| 10 | Blog | 🟢 Acumulativo | Mes 3+ |
| 11 | Meta descriptions | 🟢 Medio | Auditoría |

---

*Extracción: Junio 16, 2026 — Gentle-Orchestrator*  
*Guardado en Engram: `octavo-fuego/arquitectura-seo-gaps` (ID #486)*
