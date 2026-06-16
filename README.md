# Octavo Fuego — Rapé do Acre

## 📖 [PROYECTO.md](PROYECTO.md) ← Documento maestro del proyecto

## Ecommerce de Medicinas Ancestrales

**Estado**: 🟢 En desarrollo (95% core completo)
**Stack**: Astro 6.1.3 · TailwindCSS 4 · shadcn/ui · Nanostores
**Dominio**: [www.octavofuego.com](https://www.octavofuego.com) (Vercel)
**Modelo**: WhatsApp Commerce + Carrito digital

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6.1.3 (SSG estático, 0KB JS en páginas core) |
| UI | TailwindCSS 4 + shadcn/ui + Radix UI |
| Estado | Nanostores (carrito con persistencia localStorage) |
| i18n | 3 idiomas (ES/EN/PT) con `[locale]` params |
| Deploy | Vercel (automático desde `main`) |
| SEO | Schema markup, sitemap, OG tags, robots.txt |

---

## Estado del Proyecto

```
Fase 1: Estrategia    ██████████ 100% ✅
Fase 2: Diseño        ██████████ 100% ✅
Fase 3: Desarrollo    █████████░  95% ✅  ← Estamos aquí
Fase 4: Marketing     ██████░░░░  60% 🔄
Fase 5: Testing       ███░░░░░░░  30% 🔄
Fase 6: Lanzamiento   ██░░░░░░░░  10% ⏳
```

### ✅ Completado
- 5 rapés con descripciones verbatim en 3 idiomas
- Layout completo (Navbar, Footer, FloatingWhatsApp puro Astro)
- i18n funcional con LanguageSwitcher
- Catálogo con categorías + breadcrumb corregido
- Homepage con hero, profecía, intenciones, productos
- Carrito + Checkout (4 pasos)
- SEO completo (Schema, sitemap, OG, robots)
- Blog con 4 posts
- FloatingWhatsApp convertido a Astro puro (0KB JS)

### 🔄 En progreso
- WhatsAppButton.tsx → .astro (migración pendiente)
- Imágenes reales de productos
- Blog posts adicionales
- Testing y optimización CWV

---

## Productos

5 variedades de Rapé do Acre (precios unificados):

| # | Rapé | Etnia | Intención |
|---|------|-------|-----------|
| 1 | Tisunú | Yawanawá | Energético — Reset Energético |
| 2 | Pixurí | Nukini | Medicinal — Bienestar Físico |
| 3 | Pariká | Kaxinawá | Espiritual — Conexión Espiritual |
| 4 | Cumarú de Cheiro | Yawanawá | Mixto — Protección |
| 5 | Vena de Pajé | Shanenawa | Mixto — Claridad Mental |

**Precios**: 10g $35.000 · 20g $70.000 · 30g $100.000 · Wholesale 500g+ $1.300/g

---

## Convenciones Git

1. **Trabajar en LOCAL** (`develop` o `feature/*`)
2. **Push a `origin/develop` SIEMPRE**
3. **Merge a `main` SOLO con autorización explícita**

---

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `PENDIENTES.md` | Estado completo del proyecto |
| `AGENTS.md` | Instrucciones para AI agents |
| `tasks.md` | Task tracking detallado |
| `src-astro/README.md` | Documentación técnica del código |

---

*Última actualización: Junio 13, 2026*
