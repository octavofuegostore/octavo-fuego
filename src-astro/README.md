# Octavo Fuego - Ecommerce de Medicinas Ancestrales

Tienda online de rapé amazónico, sananga y kuripes. Tienda minimalista con catálogo WhatsApp-first.

## 🚀 Tech Stack

- **Framework**: [Astro 6](https://astro.build/) - 100% estático, 0KB JS en páginas principales
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) con design tokens personalizados
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **State**: [Nanostores](https://github.com/nanostores/nanostores) para carrito
- **i18n**: 3 idiomas (Español, Inglés, Portugués)
- **Deploy**: [Vercel](https://vercel.com/) con dominio `octavofuego.com`

## 📁 Project Structure

```
src-astro/
├── src/
│   ├── components/
│   │   ├── Navbar.astro          # Header con dropdown de 5 rapés
│   │   ├── Footer.astro          # Footer locale-aware
│   │   ├── LanguageSwitcher.astro # Selector de idioma ES/EN/PT
│   │   ├── product/
│   │   │   ├── ProductCard.astro  # Tarjeta de producto
│   │   │   └── PricingTable.astro # Botones de precio seleccionables
│   │   ├── tienda/
│   │   │   ├── IntentMap.astro    # Mapa de intenciones
│   │   │   ├── IntensityProfile.astro # Perfil de intensidad
│   │   │   ├── QuickReferenceTable.astro # Tabla de referencia
│   │   │   └── Glossary.astro    # Glosario
│   │   ├── prophecy/
│   │   │   └── ProphecyContent.astro # Contenido profético
│   │   └── ui/
│   │       ├── FloatingWhatsApp.astro # Botón WhatsApp (0KB JS)
│   │       ├── button.tsx         # Componente Button
│   │       └── card.tsx           # Componente Card
│   ├── data/
│   │   ├── products.ts            # 5 rapés × 3 idiomas
│   │   ├── prophecy.ts            # Profecía × 3 idiomas
│   │   └── glossary.ts            # Glosario × 3 idiomas
│   ├── i18n/
│   │   ├── index.ts               # Tipos y funciones i18n
│   │   ├── es.json                # Español
│   │   ├── en.json                # Inglés
│   │   └── pt.json                # Portugués
│   ├── layouts/
│   │   └── Layout.astro           # Layout principal
│   └── pages/
│       ├── [locale]/
│       │   ├── index.astro        # Homepage
│       │   ├── profecia.astro     # Profecía completa
│       │   └── tienda/
│       │       ├── index.astro    # Tienda principal
│       │       └── rape/
│       │           ├── index.astro # Categoría Rapé
│       │           └── [product].astro # Detalle de producto
│       └── carrito/
│           └── index.astro        # Carrito de compras
├── public/
│   └── images/
│       └── products/              # Imágenes de productos
└── package.json
```

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia servidor local en `localhost:4321` |
| `npm run build` | Genera sitio de producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente |

## 🌐 i18n

El sitio soporta 3 idiomas:
- `/es/` - Español (por defecto)
- `/en/` - Inglés
- `/pt/` - Portugués

El language switcher está en el Navbar y preserva la página actual al cambiar idioma.

## 📱 WhatsApp Commerce

El modelo de negocio es WhatsApp-first:
- Los precios se muestran como botones seleccionables (10g, 20g, 30g)
- Al hacer clic en "Consultar por WhatsApp", se abre WhatsApp con mensaje pre-llenado
- Incluye: nombre del producto + peso + precio

## 🎨 Design System

- **Colores**: Negro, Blanco, Tabaco (#8B4513), Ceniza, Humo, Papel
- **Tipografía**: Playfair Display (títulos), Inter (cuerpo)
- **Estilo**: Minimalista sacred - blanco primero, sombras Airbnb
- **Componentes**: shadcn/ui con personalización Octavo Fuego

## 🚀 Deploy

El proyecto se despliega automáticamente en Vercel al hacer push a `main`.

**Dominio**: `www.octavofuego.com` (propagando via Vercel)

## 📝 Licencia

Propiedad de Octavo Fuego. Todos los derechos reservados.
