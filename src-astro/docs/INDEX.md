# 📚 Octavo Fuego — Documentation Map

> Mapa de navegación de los ~25 documentos principales del proyecto.
> Última actualización: 17 Junio 2026

## 🏠 Inicio
- [README.md](../README.md) — Presentación del proyecto, stack, bifurcación ecommerce/admin
- [AGENTS.md](../AGENTS.md) — Instrucciones para agentes de IA (ecommerce + admin + constraints)
- [PENDIENTES.md](../PENDIENTES.md) — Tareas completadas y pendientes

## 🛒 Ecommerce (Tienda Pública)

### Negocio & Producto
- [PROYECTO.md](../../PROYECTO.md) — Identidad, roadmap, modelo de negocio, productos, SEO schema
- [estrategia-contenido-consejos-o-paje.md](../.atl/estrategia-contenido-consejos-o-paje.md) — Estrategia contenido / blog

### SEO & Marketing
- [arquitectura-seo-transnacional.md](../.atl/arquitectura-seo-transnacional.md) — 3 mercados, keywords, hreflang
- [arquitectura-seo-extraccion-completa.md](../.atl/arquitectura-seo-extraccion-completa.md) — Gap análisis SEO (11 gaps)
- [octavo-fuego-seo-blog-strategy.md](../../04-marketing/seo/octavo-fuego-seo-blog-strategy.md) — Calendario editorial, keywords
- [b2b-mayoristas-landing-audit.md](../.atl/b2b-mayoristas-landing-audit.md) — Auditoría landing mayoristas
- [b2b-mayoristas-revision-completa.md](../.atl/b2b-mayoristas-revision-completa.md) — Revisión completa B2B

### Specs & Diseño
- [ecommerce-spec.md](../../.atl/specs/ecommerce-spec.md) — Spec funcional: homepage, PLP, PDP, cart, checkout
- [ui-spec.md](../../.atl/specs/ui-spec.md) — Spec UI: colores, tipografía, componentes
- [design.md](../../.atl/design.md) — Diseño visual: inspiración, iconos, navbar, footer
- [design-refresh-airbnb-style/spec.md](../../.atl/sdd/design-refresh-airbnb-style/spec.md) — Refresh diseño estilo Airbnb

### Mobile
- [mobile-first-overhaul/spec.md](../openspec/changes/mobile-first-overhaul/spec.md) — Especificación mobile-first
- [mobile-first-overhaul/design.md](../openspec/changes/mobile-first-overhaul/design.md) — Diseño responsive mobile

### SDD Implementado
- [seo-technical-enrichment/](../openspec/changes/seo-technical-enrichment/) — Enriquecimiento técnico SEO
- [mobile-first-overhaul/](../openspec/changes/mobile-first-overhaul/) — Reestructuración mobile-first

## ⚙️ Admin Panel (Dashboard)
- [AGENTS.md](../AGENTS.md) — Sección Admin Panel: auth, rutas, módulos, prerender
- [contabilidad-integration-plan.md](../.atl/proposals/contabilidad-integration-plan.md) — Plan integración contable
- [contabilidad-integration.md](../.atl/proposals/contabilidad-integration.md) — Plan corto contabilidad

## 🏗️ Arquitectura (Backend)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — Manifiesto técnico, 3 fases, monorepo
- [l-medusa-architecture.md](../.atl/l-medusa-architecture.md) — Backend Supabase-First
- [l-medusa-complete-specs.md](../.atl/specs/l-medusa-complete-specs.md) — Requirements formales L-Medusa
- [l-medusa-complete-design.md](../.atl/design/l-medusa-complete-design.md) — Diseño técnico L-Medusa
- [l-medusa-complete-tasks.md](../.atl/tasks/l-medusa-complete-tasks.md) — Task breakdown L-Medusa
- [medusajs-patterns-analysis.md](../.atl/medusajs-patterns-analysis.md) — Patrones MedusaJS

## 🎨 Design System
- [ui-spec.md](../../.atl/specs/ui-spec.md) — Tokens: colores, tipografía, spacing, sombras
- [design.md](../../.atl/design.md) — Guía visual: iconos, navbar, footer, componentes
- [design-refresh-airbnb-style/spec.md](../../.atl/sdd/design-refresh-airbnb-style/spec.md) — Design tokens actualizados

## 📋 Sistema SDD & Gestión

> **Nota sobre SDD**: El proyecto usa dos sistemas de documentación:
> - **`.atl/`** — Planeación y arquitectura (propuestas, specs, diseño, análisis)
> - **`openspec/`** — Cambios implementados y verificados con ciclo SDD completo
>
> No intentar fusionarlos. Cada uno tiene su propósito.

### Propuestas
- [l-medusa-complete-architecture.md](../.atl/proposals/l-medusa-complete-architecture.md) — Arquitectura completa L-Medusa
- [sdd-proposal-l-medusa-alfred.md](../.atl/proposals/sdd-proposal-l-medusa-alfred.md) — Propuesta L-Medusa Alfred
- [contabilidad-integration-plan.md](../.atl/proposals/contabilidad-integration-plan.md) — Plan integración contable

### Análisis
- [analisis-critico-pendientes.md](../.atl/analisis-critico-pendientes.md) — Análisis crítico 137 pendientes
- [plan-migracion-urls.md](../.atl/plan-migracion-urls.md) — Plan de migración URLs
- [medusajs-patterns-analysis.md](../.atl/medusajs-patterns-analysis.md) — Patrones MedusaJS

### Sesiones & Skills
- [sesion-completa-junio-16-2026.md](../.atl/sesion-completa-junio-16-2026.md) — Decisiones consolidadas
- [skill-registry.md](../.atl/skill-registry.md) — Skills disponibles para agentes

### Cambios SDD Implementados
- [openspec/changes/](../openspec/changes/) — Directorio de cambios completados
  - `icons-unified/` — Unificación de iconografía
  - `medusajs-exploration/` — Exploración MedusaJS
  - `mobile-first-overhaul/` — Reestructuración mobile-first
  - `seo-technical-enrichment/` — Enriquecimiento técnico SEO
  - `social-icons-lucide/` — Iconos sociales Lucide
  - `doc-restructure/` — Reestructuración documentación
  - `archive/` — Cambios archivados
