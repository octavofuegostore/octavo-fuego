# Análisis Crítico de PENDIENTES.md — Octavo Fuego

> **Fecha**: Junio 16, 2026  
> **Proyecto**: Octavo Fuego — Ecommerce de Medicinas Ancestrales  
> **Stack**: Astro 6.1.3 + TailwindCSS 4 + shadcn/ui + Nanostores + WhatsApp checkout  
> **URL**: www.octavofuego.com (Vercel, SSG estático)  
> **Fase**: MVP de Acero — pre-lanzamiento  
> **Método**: SDD Explore — análisis crítico de 137 tareas pendientes

---

## Principio Rector

> "Shippear rápido > elegancia técnica sin facturación." (§7 ARCHITECTURE.md)

**Contexto real**: Sin Medusa, sin pasarelas, sin facturación. WhatsApp Commerce funciona para el MVP. El monorepo y la automatización vienen después — cuando el flujo de caja lo justifique.

---

## 📊 Top 10 — Prioridades Inmediatas

| # | Tarea | Sección | Esfuerzo | Impacto |
|---|-------|---------|----------|---------|
| 1 | **Precio/g visible en PDPs** + copy "20g por el precio que otros cobran por 10" | §4 SEO Gaps | 1h | 🔥🔥🔥🔥🔥 |
| 2 | **Mobile-First Phase 1** (hamburger nav ROTO, anti-zoom, safe-area, navbar collision) | §7.1 | 2h | 🔥🔥🔥🔥🔥 |
| 3 | **Google Search Console** + verificar que Google indexó las 34 páginas | §4 SEO | 30min | 🔥🔥🔥🔥 |
| 4 | **Imágenes reales de los 5 rapés** (placeholder bobinsana → producto real) | §3.6 | 3h | 🔥🔥🔥🔥 |
| 5 | **og:image social card (1200×630)** — cada share en WhatsApp/Instagram se ve con logo recortado | §3.6 | 1h | 🔥🔥🔥🔥 |
| 6 | **H1 + meta descriptions alineadas con arquitectura SEO** — 5 PDPs + homepage + landing B2B | §4 + §3.10.1 | 2h | 🔥🔥🔥🔥 |
| 7 | **Landing B2B: 5 fixes críticos** (eliminar "y Brasil", H1 correcto, keywords, 4to pilar precio, hreflang) | §3.10.1 | 2h | 🔥🔥🔥🔥 |
| 8 | **3 páginas informacionales** (/es/que-es-el-rape/, /es/como-usar-el-rape/, /es/rape-do-acre-origen/) | §4 SEO Gaps | 6h | 🔥🔥🔥 |
| 9 | **Microsoft Clarity** — heatmaps + session recordings (GRATIS, 5 min setup) | §5 | 5min | 🔥🔥🔥 |
| 10 | **Mobile-First Phase 2** (touch targets 44px, tap delay 300ms, snap-scroll cards) | §7.1 | 1.5h | 🔥🔥🔥 |

**Total**: ~21 horas para las 10 prioridades.

### Menciones de honor (si sobra tiempo)

| # | Tarea | Esfuerzo | Impacto |
|---|-------|----------|---------|
| 11 | IndexNow Protocol (acelerar indexación Bing/Yandex) | 30min | 🔥🔥 |
| 12 | Design system find-replace `--verde-botanico` → `--color-action-primary` | 30min | 🔥🔥 |
| 13 | FAQPage Schema en las 5 PDPs | 2h | 🔥🔥 |
| 14 | Página "Nosotros" | 3h | 🔥🔥 |
| 15 | hreflang cruzados CO↔EN | 1h | 🔥🔥 |
| 16 | "Consejos o Pajé" — artículo #1 (video curado de chamán) | 2h | 🔥🔥 |

---

## ❌ NO hacer ahora (desperdician tiempo del MVP)

| Bloque | Tareas | Razón |
|--------|--------|-------|
| **Todo Medusa** | §3.7, §3.8, §3.9, §3.10.2, §7.2 | "Cuando WhatsApp colapse" (§7.2). No hay facturación aún. Sin Medusa no hay API routes que proxyar ni pasarelas que integrar. |
| **Monorepo + .com.br + cross-domain** | §3.7, §7.3, §4 SEO Cross-Domain | "No activar antes de validar que BR responde. El flujo de caja real debe pagar la infraestructura" (§7.3). |
| **Hub EN / Hub BR completos** | §4 SEO Gaps (fase EN/BR) | Prioridad 2 y 3. Mes 2+. Sin tráfico CO validado. |
| **SEO Score Tracking, @graph, Looker Studio** | §4 SEO Pipod | Optimizaciones. No bloquean lanzamiento. |
| **WCAG AA completo, error boundaries** | §5 Testing | Nice to have. §7.1 Mobile-First (touch targets 44px) cubre lo crítico. |
| **Categoría Kuripe + 2 productos** | §4 SEO Gaps | No hay inventario real de kuripes. post-lanzamiento. |

---

## ⚠️ Tareas que necesitan MODIFICARSE antes de implementar

| Tarea | Problema | Acción requerida |
|-------|----------|------------------|
| **URLs `/catalogo/` vs `/tienda/`** | El doc arquitectura usa `/tienda/`, código ya usa `/tienda/` | ✅ YA MIGRADO — ver [`.atl/plan-migracion-urls.md`](plan-migracion-urls.md) |
| **FAQ tiempo urgente + mínimo 250g** | Son decisiones de negocio, no técnicas | Validar con Josue antes de implementar |
| **hreflang CO↔EN↔BR** | BR no existe aún | Activar solo CO↔EN por ahora |
| **Hub BR: dominio octavofogo.com.br** | No adquirido | Postergar hasta validar demanda BR |

---

## 🔍 Duplicación masiva detectada

5 secciones hablan de lo mismo con nombres distintos:

| Grupo | Secciones duplicadas | Canonical |
|-------|----------------------|-----------|
| Medusa + SSR | §3.7 Monorepo ≈ §7.2 Centralización ≈ §7.3 Escala Élite | §7.2 |
| Carrito + API | §3.8 Carrito ≈ §7.2 Centralización | §7.2 |
| Checkout + Pagos | §3.9 Checkout ≈ §7.2 Centralización | §7.2 |
| Cross-domain | §4 SEO Cross-Domain ≈ §7.3 Escala Élite | §7.3 |
| Imágenes/og:image | §3.6 Por Hacer ≈ §4 SEO ≈ §6 Lanzamiento | §3.6 + §4 SEO |

**Acción**: Las secciones originales (§3.7-§3.10, §4 SEO Cross-Domain) se convierten en referencias a §7.2 y §7.3. Cada tarea mantiene su contexto original.

---

## 🆕 Lo que NO estaba en PENDIENTES.md

| Tarea | Por qué falta | Prioridad |
|-------|---------------|-----------|
| **Test WhatsApp checkout end-to-end** | No existía como tarea explícita | 🔴 Alta |
| **404 audit** | Arquitectura SEO §10 prioridad 1 dice "arreglar 404s" pero no está como tarea | 🔴 Alta |
| **Velocidad en 3G colombiano** | 70%+ tráfico mobile en Colombia no es 5G. Medir con throttling | 🟡 Media |

---

## Consolidación de secciones duplicadas

### Estructura nueva propuesta

```
§3.7 → "Ver §7.2 Centralización"
  Nota: Monorepo + Medusa SSR (planificado, sin fecha)

§3.8 → "Ver §7.2 Centralización"  
  Nota: Carrito + API Routes (planificado, sin fecha)

§3.9 → "Ver §7.2 Centralización"
  Nota: Checkout + Pasarelas (planificado, sin fecha)

§3.10.2 Backend B2B → "Ver §7.3 Escala Élite"
  Nota: B2B automatizado (planificado, sin fecha)

§4 SEO Cross-Domain → "Ver §7.3 Escala Élite"
  Nota: Cross-domain SEO + dominios (planificado, sin fecha)

§7.2 Centralización Automatizada (CANONICAL)
  ### Monorepo Setup (was §3.7)
  ### Carrito + API Routes (was §3.8)
  ### Checkout + Pasarelas (was §3.9)

§7.3 Escala Élite (CANONICAL)
  ### Cross-Domain SEO (was §4 SEO Cross-Domain)
  ### B2B Automatizado (was §3.10.2)
  ### Infraestructura Dual-Domain
```

---

*Análisis generado: Junio 16, 2026 — SDD Explore agent*  
*Guardado en Engram: `sdd/octavo-fuego/analisis-critico-pendientes` (ID #488)*