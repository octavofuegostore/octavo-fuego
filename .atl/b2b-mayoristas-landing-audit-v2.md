# B2B Mayoristas — Landing Page Audit

> **URL:** [www.octavofuego.com/es/mayoristas/](https://www.octavofuego.com/es/mayoristas/)  
> **Fecha del audit:** Junio 16, 2026  
> **Revisor:** Gentle-Orchestrator (DeepSeek V4 Pro)

---

## Contenido Original (copy completo)

```markdown
---
title: "Distribuidores y Facilitadores de Rapé Amazónico | Octavo Fuego"
description: "Suministro institucional y mayorista de Rapé do Acre, Sananga y Kuripes para terapeutas y centros de retiro en Colombia y Brasil. Origen verificado y empaque al vacío."
layout: "../../layouts/MarkdownPostLayout.astro"
seo:
  keywords: ["rapé por mayor colombia", "distribuidor rapé", "rapé mayorista", "proveedor de rapé do acre", "comprar rapé por kilo", "rapé para facilitadores"]
  robots: "index, follow"
---

# Alianza Ancestral: Suministro Institucional de Medicinas del Acre para Facilitadores y Distribuidores

[... contenido completo del landing page B2B ...]
```

---

## Veredicto: 9/10

---

## Lo que está MUY bien

### Posicionamiento y narrativa
- La distinción "no es un producto de consumo masivo, sino un puente de conexión espiritual" es el tono correcto para facilitadores serios.
- Los 3 pilares (vacío, trazabilidad, logística) son concretos y verificables.

### Estructura B2B
- Perfiles elegibles con criterio de entrada — filtra curiosos y sube valor percibido.
- Mínimo 500g razonable para facilitador activo sin excluir terapeutas independientes.
- Marca blanca ofrecida explícitamente — muchos centros lo necesitan y no saben que pueden pedirlo.

### SEO y arquitectura técnica
- Apéndice técnico con intención de `noindex` por capa de ruta.
- SSR con Vercel + MedusaJS para validar sesiones sin exponer precios en build estático.

---

## Keywords — Discrepancia vs Arquitectura SEO

> Referencia: [`.atl/arquitectura-seo-transnacional.md` §4](arquitectura-seo-transnacional.md)

| Keywords actuales | Keywords Arquitectura SEO | Acción |
|---|---|---|
| `rapé por mayor colombia` | `rapé por mayor Colombia` | Corregir capitalización |
| `distribuidor rapé` | `distribuidor rapé do Acre` | Agregar "do Acre" |
| `rapé mayorista` | `rapé mayorista Colombia` | Geolocalizar |
| `proveedor de rapé do acre` | `proveedor rapé Colombia` | Alinear |
| `comprar rapé por kilo` | `rapé por kilo Colombia` | Cambiar intención |
| `rapé para facilitadores` | `rapé para facilitadores Colombia` | Geolocalizar |
| ❌ Faltante | `rapé para centros de retiro` | Agregar |
| ❌ Faltante | `proveedor medicina amazónica Colombia` | Agregar |

**H1 actual:** "Alianza Ancestral: Suministro Institucional..."
**H1 recomendado:** "Distribución Institucional de Rapé do Acre para Facilitadores y Distribuidores en Colombia"

---

## Mejoras Recomendadas

### 1. CTA más visible (Conversión)
**Problema:** El link al formulario está al final, en párrafo denso. El lector B2B escanea.
**Solución:** Bloque destacado a mitad de página, después de "Variedades Disponibles":

```markdown
> **💡 ¿Listo para formalizar tu canal?**  
> [Solicitar Acceso al Portal Mayorista →](/es/mayoristas/registro/)
```

### 2. FAQs — tiempo de respuesta urgente (Operaciones)
**Problema:** 24-48h puede ser demasiado para un facilitador con retiro el viernes.
**Solución:** Agregar al FAQ:

> "Si tu solicitud es urgente (retiro programado, reposición de inventario), indicá `URGENTE` en el campo de notas del formulario y priorizaremos tu caso en menos de 12 horas hábiles."

### 3. Cantidad mínima flexible (Conversión)
**Problema:** 500g es buen piso, pero ¿y el terapeuta que ya es cliente retail y quiere probar mayorista?
**Solución:** "Prueba piloto B2B" de 250g con precios intermedios (más caro que mayorista puro, más barato que retail). Upsell natural para clientes actuales.

### 4. Mover astro.config.mjs de la página pública (UX)
**Problema:** Código de configuración en una página B2B sobra. El lector no necesita saber que usás Vercel serverless.
**Solución:** Mover el snippet a `README.md` interno o documentación del proyecto. Dejar solo mención conceptual en la página.

### 5. Schema.org para B2B (SEO Técnico)
**Problema:** Google no tiene contexto de que esto es B2B, no retail.
**Solución:** Agregar structured data en `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  "name": "Octavo Fuego — Canal Mayorista",
  "currenciesAccepted": "COP, BRL",
  "areaServed": ["CO", "BR"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catálogo Mayorista de Medicinas del Acre",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Tisunú" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Pixurí" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Pariká" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Cumarú de Cheiro" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Vena de Pajé" } }
    ]
  }
}
```

---

## Hallazgos Copy (segunda revisión — cruce completo con arquitectura SEO)

> Ver detalle completo: [`.atl/b2b-mayoristas-revision-completa.md`](b2b-mayoristas-revision-completa.md)

| # | Hallazgo | Severidad |
|---|----------|-----------|
| 1 | Meta description dice "Colombia **y Brasil**" — viola regla de oro §2 | 🔴 |
| 2 | Menciona "Sananga" en meta pero NUNCA en body | 🟡 |
| 3 | Kuripes tratado como nota al pie, no como categoría | 🟡 |
| 4 | 3 perfiles distintos (facilitador, centro, tienda) en misma URL | 🟡 |
| 5 | **Ventaja de precio (46% más barato) NUNCA se comunica** | 🔴 |
| 6 | hreflang ausentes en landing indexada | 🔴 |
| 7 | Title no usa "Rapé do Acre" — término consistente del doc | 🟢 |
| 8 | FAQ mezcla operación CO y BR en hub Colombia | 🟡 |
| 9 | **Falta cuarto pilar: Precio de Origen Sin Intermediarios** | 🔴 |
| 10 | Cobertura geográfica no explícita en body | 🟢 |

## Estado de Implementación

| # | Mejora | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Keywords + H1 alineados con doc | 🔴 Alto | ⏳ |
| 2 | CTA más visible | 🔴 Alto | ⏳ |
| 3 | Eliminar "y Brasil" de meta + body | 🔴 Alto | ⏳ |
| 4 | Cuarto pilar: Precio de Origen | 🔴 Alto | ⏳ |
| 5 | hreflang en landing | 🔴 Alto | ⏳ |
| 6 | FAQ tiempo urgente | 🟡 Medio | ⏳ |
| 7 | Mínimo flexible 250g | 🟡 Medio | ⏳ |
| 8 | Eliminar "Sananga" de meta O agregar sección | 🟡 Medio | ⏳ |
| 9 | Separar FAQ Colombia de FAQ Brasil | 🟡 Medio | ⏳ |
| 10 | Elevar Kuripes a sección propia | 🟡 Medio | ⏳ |
| 11 | Mover astro.config.mjs | 🟢 Bajo | ⏳ |
| 12 | Schema.org WholesaleStore | 🟢 Bajo | ⏳ |
| 13 | Title alineado con patrón del doc | 🟢 Bajo | ⏳ |
| 14 | Cobertura geográfica explícita | 🟢 Bajo | ⏳ |

---

*Audit inicial: Junio 16, 2026 — Gentle-Orchestrator*
