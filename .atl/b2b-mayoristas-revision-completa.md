# Revisión Completa — Copy Mayorista vs Arquitectura SEO

> **Cruce:** `.atl/arquitectura-seo-transnacional.md` §1-11 ↔ Copy landing `/es/mayoristas/`  
> **Fecha:** Junio 16, 2026  

---

## ❌ Lo que ME FALTÓ en la primera revisión

### 1. Violación de la Regla de Oro (§2)

**El doc dice:**
> "Regla de oro: un dominio, una audiencia, un idioma. Nunca mezclar contenido de detal con contenido mayorista en la misma URL indexada. Nunca mezclar idiomas en la misma ruta."

**La landing dice en meta description:**
> "Suministro institucional y mayorista de Rapé do Acre, Sananga y Kuripes para terapeutas y centros de retiro en **Colombia y Brasil**."

❌ Menciona "y Brasil" — pero §2 define que el hub Colombia (`/es/`) solo habla a Colombia. Brasil tiene su propio hub (`octavofogo.com.br`). Esto diluye la señal SEO geolocalizada.

**Corrección:**
> "Suministro institucional y mayorista de Rapé do Acre para terapeutas y centros de retiro en Colombia. Origen verificado y empaque al vacío."

---

### 2. Menciona Sananga pero nunca la desarrolla

**Meta description:** menciona "Sananga".  
**Body copy:** cero menciones de Sananga. Solo habla de Rapé.

❌ Esto es contenido fantasma — Google indexa "Sananga" en la description pero no encuentra la palabra en el body.

**Corrección:** Eliminar "Sananga" de la meta description O agregar sección de Sananga en el body.

---

### 3. Menciona Kuripes pero con una línea al final

**Body copy:**
> "*Nota: También disponemos de aplicadores auto-inyectores (Kuripes) clásicos y de doble soplado..."

❌ Es una nota al pie, no una sección. Si los Kuripes son una categoría de producto en la arquitectura (§3.1), merecen su propio bloque.

---

### 4. 3 perfiles = 3 intenciones distintas (§2)

**La landing lista 3 perfiles:**
1. Facilitadores de Círculos (terapeutas individuales)
2. Centros de Retiro (espacios físicos)
3. Tiendas Etnobotánicas (reventa)

**El doc dice:** "Cada URL le habla a una sola persona con una sola intención."

❌ Un facilitador individual compra 500g para uso propio. Una tienda compra kilos para revender. Son necesidades, objeciones y volúmenes completamente distintos.

---

### 5. La ventaja competitiva CENTRAL no aparece (§1, §9)

**El doc define como ventaja #1:**
> "Octavo Fuego es un 46% más barato por gramo con origen directo del Acre y empaque al vacío."

**La landing menciona:** empaque al vacío ✅, trazabilidad ✅, logística ✅  
**La landing NO menciona:** la ventaja de precio, ni siquiera como propuesta de valor.

❌ La landing dice "precios escalonados" y "tarifas de distribución" pero nunca comunica POR QUÉ Octavo Fuego puede ofrecer mejor precio. El doc dice que la razón es "origen directo sin intermediarios".

**Lo que falta:**
> "Al eliminar intermediarios y trabajar directo con las comunidades del Acre, tu costo por gramo refleja el precio de origen, no el margen de una cadena de reventa."

---

### 6. hreflang ausentes (§7)

**El doc requiere hreflang en TODAS las páginas indexadas:**
```html
<link rel="alternate" hreflang="es-CO" href="https://octavofuego.com/es/mayoristas/" />
<link rel="alternate" hreflang="en"    href="https://octavofuego.com/en/wholesale/" />
<link rel="alternate" hreflang="pt-BR" href="https://octavofogo.com.br/atacado/" />
```

❌ La landing actual NO tiene estas etiquetas. Verificar.

---

### 7. Title tag no sigue la convención del doc (§4)

**Title actual:**
> "Distribuidores y Facilitadores de Rapé Amazónico | Octavo Fuego"

**Title recomendado (siguiendo el patrón del doc):**
> "Rapé por Mayor Colombia — Distribuidor Rapé do Acre | Octavo Fuego"

---

### 8. FAQ menciona ambos países pero el hub es solo CO (§2)

❌ Menciona operación en Brasil en una página del hub Colombia. Según §2, el hub Brasil (`octavofogo.com.br/atacado/`) debe manejar su propia información.

---

### 9. Los 3 pilares no mencionan PRECIO como cuarto pilar (§1)

**Sugiero agregar:**

> ### 4. Precio de Origen, Sin Intermediarios
> Al eliminar la cadena de distribución tradicional, tu inversión se traduce en más gramos de medicina por peso colombiano. El precio por gramo que manejamos en el canal institucional no compite con el retail — lo redefine. (Consulta nuestra tabla de precios en el portal privado una vez aprobado tu perfil.)

---

### 10. "Envío a todo Colombia" aparece solo en meta description

❌ El body copy no menciona cobertura geográfica explícita para Colombia. Dice "transportadoras locales aliadas" y "3 a 5 días hábiles dentro del territorio nacional" pero no especifica que "territorio nacional" = Colombia.

---

## 📊 Resumen: 10 hallazgos

| # | Hallazgo | Severidad | Sección doc |
|---|----------|-----------|-------------|
| 1 | Meta description dice "y Brasil" — viola regla de oro §2 | 🔴 Crítico | §2 |
| 2 | Menciona "Sananga" en meta pero cero en body | 🟡 Medio | — |
| 3 | Kuripes tratado como nota al pie, no como categoría | 🟡 Medio | §3.1 |
| 4 | 3 perfiles = 3 intenciones distintas en misma URL | 🟡 Medio | §2 |
| 5 | Ventaja de precio NUNCA se menciona | 🔴 Crítico | §1, §9 |
| 6 | hreflang ausentes en landing indexada | 🔴 Crítico | §7 |
| 7 | Title no usa "Rapé do Acre" (término consistente del doc) | 🟢 Bajo | §4 |
| 8 | FAQ mezcla operación CO y BR en hub Colombia | 🟡 Medio | §2 |
| 9 | Falta cuarto pilar: "Precio de Origen" | 🔴 Crítico | §1 |
| 10 | Cobertura geográfica no explícita en body | 🟢 Bajo | — |

---

*Revisión completa: Junio 16, 2026 — Gentle-Orchestrator*
