# 🗺️ Manifiesto de Ingeniería Absoluto: E-commerce Internacional B2C/B2B

**Proyecto:** Octavo Fuego & Octavo Fogo

**Origen de Producción:** Brasil 🇧🇷

**Arquitectura:** Headless Multi-dominio (MedusaJS v2 + Astro SSR Monorepo)

**Última Revisión:** Junio de 2026

**Engram Topic Key:** `architecture/manifesto-v1`

**Engram Topic Key:** `architecture/manifesto-v1`

---

## 📌 0. Ruta Progresiva — Las 3 Fases (LEER PRIMERO)

> **Este documento es el plano del edificio de 20 pisos. No es una lista de tareas para el sprint actual.**

La arquitectura headless multi-dominio con MedusaJS v2 es el estado final. Para llegar sin morir de sobreingeniería, el proyecto avanza en 3 fases de despliegue progresivo — cada una paga la siguiente con flujo de caja real.

```
[FASE 1: MVP de Acero] ──➔ [FASE 2: Centralización] ──➔ [FASE 3: Escala Élite]
     semanas                       meses                       trimestres
```

### Fase 1: MVP de Acero 🚀
- **Stack:** Astro SSG (`output: 'static'`) + JSON estático + WhatsApp checkout
- **Objetivo:** Facturar. Validar demanda en Colombia y Brasil.
- **Sin backend.** Sin base de datos. Sin Medusa.
- El checkout es un link de WhatsApp dinámico: *"Hola, quiero comprar 2 Pariká y 1 Pixuri. Estoy en Bogotá."*
- Subcarpetas `/es/` y `/pt/` bajo el mismo `.com` siembran autoridad SEO.

### Fase 2: Centralización Automatizada 🤖
- **Stack:** Monodominio `octavofuego.com` + Medusa Cloud + Astro SSR
- **Disparador:** Las ventas por WhatsApp se vuelven inmanejables.
- Una sola instancia de Medusa (Railway/Medusa Cloud). Un solo frontend.
- Automatiza pagos B2C en CO y BR desde el mismo sitio. Stock real.
- **Secciones del manifiesto activas:** §4 (Carrito), §5 (API Routes), §6 (Checkout).

### Fase 3: Escala Élite 🌎 (El Manifiesto Completo)
- **Stack:** Monorepo dual-domain + `octavofogo.com.br` + B2B automatizado
- **Disparador:** El volumen mayorista internacional y la operación en Brasil justifican inversión.
- Separación en `apps/colombia` y `apps/brasil`. Dominio `.com.br` con identidad local.
- **Secciones del manifiesto activas:** §1 (Dominios), §2 (Monorepo), §3 (SEO cross-domain), §7 (B2B), §8 (CI/CD).

> ⚠️ **ANTI-PATRÓN:** Montar Medusa, PostgreSQL, Redis y dos deploys en Vercel para vender 5 productos de rapé es sobreingeniería. El flujo de caja real paga la infraestructura — no al revés.

### Regla de Oro
**Shippea la Fase 1 ya. Dejá que el mercado valide el producto. Solo escalá la arquitectura cuando el negocio lo exija.** Las secciones 1-9 de este documento son la referencia para cuando llegue ese momento.

---

## 📑 1. Arquitectura de Dominios e Identidad Local

Para maximizar la confianza del cliente, blindar la marca y dominar el SEO local, dividiremos el ecosistema en **dos aplicaciones independientes** dentro de un único monorepo, conectadas al mismo cerebro backend de MedusaJS.

### Hub A: El Motor de Brasil (`octavofogo.com.br`)

* **Enfoque:** B2C (Detal) y B2B (Mayorista) para todo el mercado brasileño.
* **Idioma nativo:** Portugués.
* **Moneda e Impuestos:** Reales (BRL) y pasarelas de pago brasileñas (Pix, Boleto).
* **Ventaja SEO:** Google Brasil premia los dominios `.com.br`. El consumidor y el distribuidor local sentirán que compran directamente a una fábrica local en su moneda.

### Hub B: El Hub de Colombia e Internacional (`octavofuego.com`)

* **Enfoque:** B2C/B2B para Colombia y compradores internacionales al por mayor.
* **Estructura de subcarpetas interna:**
  * `octavofuego.com` (o `/es/`): Mercado Colombia (Pesos COP, pasarelas locales y envío nacional).
  * `octavofuego.com/en/`: Vitrina global en Inglés (Dólares USD) para capturar compradores mayoristas del resto del mundo.

### 🛡️ Protección de Marca (Redirecciones 301 instantáneas)

Para evitar pérdidas por errores de escritura o robo de identidad digital, se configuran estos dominios a nivel DNS para apuntar automáticamente a su destino principal:

* `octavofuego.com.co` ➔ Redirige a ➔ `octavofuego.com`
* `octavofogo.com` (Genérico global) ➔ Redirige a ➔ `octavofogo.com.br`

---

## 🛠️ 2. Estructura de Desarrollo (Monorepo Workspaces)

Para evitar la complejidad del enrutamiento dinámico por *hostname* en un único proyecto Astro, implementaremos un **Monorepo** utilizando espacios de trabajo (`pnpm workspaces`).

```
                      +-----------------------------------+
                      |     MEDUSAJS BACKEND (v2 Core)    |
                      |  (Inventario Único en Fábrica)   |
                      +-----------------------------------+
                                        |
                +-----------------------+-----------------------+
                |                                               |
                v                                               v
    +-----------------------+                       +-----------------------+
    |     /apps/brasil      |                       |    /apps/colombia     |
    |   (octavofogo.com.br) |                       |   (octavofuego.com)   |
    +-----------------------+                       +-----------------------+
    |  - Idioma Base: PT    |                       |  - Subcarpeta /es/    |
    |  - Moneda: Reales BRL |                       |  - Subcarpeta /en/    |
    |  - Región: Brasil     |                       |  - Región: CO y Global|
    +-----------------------+                       +-----------------------+
                |                                               |
                +-----------------------+-----------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |           /packages/core              |
                    |  (Componentes UI, Stores y Librerías) |
                    +---------------------------------------+

```

### Estructura de `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

```

---

## 📈 3. Configuración de SEO Internacional en Astro

Para evitar penalizaciones por contenido duplicado y garantizar una indexación óptima, implementaremos **rutas de contenido unificadas** y **etiquetas hreflang dinámicas**.

### A. Decisiones de Diseño de URLs

Para evitar URLs rotas al cruzar dominios, las rutas dinámicas deben compartir la misma estructura raíz en ambos proyectos:

* **Páginas de producto:** `/p/[product-slug]` (Ejemplo: `/p/camisa-fuego` tanto en Colombia como en Brasil). Los slugs se mantienen universales.

### B. Inyección Dinámica de `hreflang` (Blindado para CI/CD)

Configuración explícita en el componente `Layout.astro` de los proyectos utilizando variables de entorno de Astro (`import.meta.env`):

```astro
---
// Layout.astro
interface Props {
  title: string;
  description: string;
  productSlug?: string;
  isProductPage?: boolean;
}

const { title, description, productSlug, isProductPage = false } = Astro.props;

const DOMAIN_CO = import.meta.env.PUBLIC_DOMAIN_CO; 
const DOMAIN_BR = import.meta.env.PUBLIC_DOMAIN_BR;

const relativePath = isProductPage ? `/p/${productSlug}` : Astro.url.pathname;
---

<head>
  <meta charset="UTF-8" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Hreflang Cruzados Dinámicos para Googlebot -->
  <link rel="alternate" hreflang="es-CO" href={`${DOMAIN_CO}${relativePath}`} />
  <link rel="alternate" hreflang="en" href={`${DOMAIN_CO}/en${relativePath}`} />
  <link rel="alternate" hreflang="pt-BR" href={`${DOMAIN_BR}${relativePath}`} />
  <link rel="alternate" hreflang="x-default" href={`${DOMAIN_CO}/en${relativePath}`} />
</head>

```

### C. Activación Obligatoria de SSR y Estrategia de Caché

Astro es estático por defecto. Para persistir sesiones B2B, gestionar carritos y optimizar el SEO sin destruir el *Time to First Byte* (TTFB), activaremos el modo SSR junto con cabeceras de caché nativas de CDN (*Stale-While-Revalidate*):

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // SSR Activo
  adapter: node({ mode: 'standalone' }),
});

```

En los endpoints y páginas que renderizan el catálogo, se inyectará la cabecera para servir contenido instantáneo desde el Edge:

```typescript
Astro.response.headers.set(
  'Cache-Control', 
  'public, max-age=60, s-maxage=600, stale-while-revalidate=1200'
);

```

---

## 🛒 4. Nota Técnica: Estado del Carrito en Astro SSR + Medusa

### El Problema Central

En Astro SSR no existe un contexto global nativo en el servidor (como el `useCart` de React/Next.js). Confiar el estado del carrito exclusivamente a un almacenamiento en el cliente (`localStorage`) genera fallos de sincronización y errores de compilación porque el entorno de ejecución Node no reconoce los objetos del navegador durante el renderizado inicial.

### La Solución: Nano Stores + Cookie de Carrito

Astro recomienda oficialmente **Nano Stores** para compartir estados entre islas de hidratación de diferentes componentes. Para el carrito de Medusa, la arquitectura correcta es la siguiente:

#### 1. Crear el store compartido (Espejo reactivo en memoria)

```typescript
// packages/core/src/stores/cart.ts
import { atom } from 'nanostores';

export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  thumbnail: string;
}

export interface CartState {
  id: string | null;
  items: CartItem[];
  total: number;
  region_id: string;
}

export const cartStore = atom<CartState>({
  id: null,
  items: [],
  total: 0,
  region_id: '',
});

```

#### 2. Definir la Inicialización del Carrito (La cookie es la fuente de verdad)

El `cart_id` de Medusa debe vivir en una cookie segura. El store de Nano Stores solo maneja la reactividad visual en el cliente.

```typescript
// packages/core/src/lib/cart.ts
import Medusa from '@medusajs/medusa-js';
import { cartStore } from '../stores/cart';

const client = new Medusa({
  baseUrl: import.meta.env.PUBLIC_MEDUSA_URL,
  maxRetries: 3,
});

export async function initCart(cartIdFromCookie: string | undefined) {
  if (cartIdFromCookie) {
    try {
      const { cart } = await client.carts.retrieve(cartIdFromCookie);
      cartStore.set({
        id: cart.id,
        items: cart.items,
        total: cart.total,
        region_id: cart.region_id,
      });
      return cart.id;
    } catch (error) {
      console.error("Error recuperando carrito:", error);
    }
  }

  const { cart } = await client.carts.create({
    region_id: import.meta.env.PUBLIC_MEDUSA_REGION_ID,
  });
  
  cartStore.set({
    id: cart.id,
    items: cart.items,
    total: 0,
    region_id: cart.region_id,
  });
  return cart.id;
}

```

#### 3. Leer y persistir la Cookie en el Servidor (`Layout.astro`)

```astro
---
// Layout.astro
import { initCart } from '@tu-proyecto/core/lib/cart';

const cartIdFromCookie = Astro.cookies.get('cart_id')?.value;
const cartId = await initCart(cartIdFromCookie);

if (!cartIdFromCookie) {
  Astro.cookies.set('cart_id', cartId, {
    httpOnly: true, // Protege contra XSS
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}
---

```

#### 4. Aislamiento de Carritos Regionales por Dominio

Cada dominio opera con su respectivo identificador `PUBLIC_MEDUSA_REGION_ID` en MedusaJS. Dado que las cookies nativas del navegador están aisladas estrictamente por dominio, el carrito creado en `octavofuego.com` (Colombia) jamás entrará en conflicto con el de `octavofogo.com.br` (Brasil). No compartas `cart_id` entre dominios hermanos.

---

## 🔌 5. Nota Técnica: Rutas de API en Astro SSR + Medusa

### Por Qué Existen las Rutas de API Aquí

En Astro SSR las rutas de API son endpoints del servidor que viven en `src/pages/api/`. Reciben requests del cliente, hablan con Medusa usando las credenciales privadas del servidor, y devuelven JSON. El cliente nunca toca directamente la URL del backend de Medusa ni expone tokens sensibles en el navegador. Actúa como capa proxy o **BFF (Backend For Frontend)**.

### Las Rutas Críticas del Carrito

**`/api/cart/add.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({
  baseUrl: import.meta.env.MEDUSA_BACKEND_URL, // Variable privada de Node
  maxRetries: 3,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { variant_id, quantity = 1 } = await request.json();
    const cart_id = cookies.get('cart_id')?.value;

    if (!cart_id) {
      return new Response(JSON.stringify({ error: 'No hay carrito activo' }), { status: 400 });
    }

    const { cart } = await client.carts.lineItems.create(cart_id, { variant_id, quantity });
    return new Response(JSON.stringify(cart), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al añadir producto' }), { status: 500 });
  }
};

```

**`/api/cart/remove.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({
  baseUrl: import.meta.env.MEDUSA_BACKEND_URL,
});

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const { line_id } = await request.json();
    const cart_id = cookies.get('cart_id')?.value;

    if (!cart_id || !line_id) {
      return new Response(JSON.stringify({ error: 'Parámetros inválidos' }), { status: 400 });
    }

    const { cart } = await client.carts.lineItems.delete(cart_id, line_id);
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar producto' }), { status: 500 });
  }
};
```

### La Ruta Más Importante: Auth B2B

Esta es la compuerta lógica que desbloquea los precios mayoristas de forma segura. Cuando un cliente mayorista inicia sesión, la sesión se valida en el servidor y su credencial de acceso se guarda cifrada en una cookie invisible para scripts del cliente.

**`/api/auth/login.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({
  baseUrl: import.meta.env.MEDUSA_BACKEND_URL,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const { customer } = await client.auth.authenticate({ email, password });
    const { access_token } = await client.auth.getToken({ email, password });

    // Cookie segura con el token (HttpOnly para mitigar ataques XSS)
    cookies.set('medusa_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    });

    // Flag para la UI (No contiene datos sensibles, accesible por JS)
    cookies.set('customer_group', customer.groups?.[0]?.name ?? 'retail', {
      httpOnly: false, // El cliente lee esta flag para pintar layouts específicos B2B/B2C
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return new Response(
      JSON.stringify({ id: customer.id, email: customer.email, group: customer.groups?.[0]?.name }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
  }
};
```

---

## 💳 6. Nota Técnica: Checkout con Medusa v2 y Pasarelas Regionales

### El Cambio que Rompe Todo

Medusa v2 reemplazó por completo el flujo de checkout basado en `cart.complete()` por un sistema adaptado a arquitecturas complejas a través de **Payment Collections**. El nuevo orden secuencial estricto es:

```
Carrito ➔ Dirección de Envío ➔ Método de Envío ➔ Payment Session ➔ Payment Collection ➔ Orden
```

### Rutas de API para Procesamiento de Compra

**`/api/checkout/create-payment.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({ baseUrl: import.meta.env.MEDUSA_BACKEND_URL });

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const cart_id = cookies.get('cart_id')?.value;
    if (!cart_id) return new Response(JSON.stringify({ error: 'Carrito no encontrado' }), { status: 400 });

    const { body } = await request.json();

    // 1. Inyectar datos de despacho y contacto al recurso Cart
    await client.carts.update(cart_id, {
      shipping_address: body.shipping_address,
      email: body.email,
    });

    // 2. Asociar el método logístico seleccionado
    await client.carts.addShippingMethod(cart_id, { option_id: body.shipping_option_id });

    // 3. Inicializar Payment Sessions en el Core
    await client.carts.createPaymentSessions(cart_id);

    // 4. Seleccionar Proveedor según la variable de entorno del Dominio
    const provider = import.meta.env.PUBLIC_PAYMENT_PROVIDER; // 'wompi' en CO, 'stripe' en BR
    const { cart } = await client.carts.setPaymentSession(cart_id, { provider_id: provider });

    return new Response(
      JSON.stringify({ cart, client_secret: cart.payment_session?.data?.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error iniciando pago' }), { status: 500 });
  }
};
```

**`/api/checkout/complete.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({ baseUrl: import.meta.env.MEDUSA_BACKEND_URL });

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const cart_id = cookies.get('cart_id')?.value;
    if (!cart_id) return new Response(JSON.stringify({ error: 'Carrito no encontrado' }), { status: 400 });

    const { type, data } = await client.carts.complete(cart_id);

    if (type === 'order') {
      cookies.delete('cart_id', { path: '/' }); // Limpieza de estado del checkout exitoso
      return new Response(JSON.stringify({ order_id: data.id, display_id: data.display_id }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Pago no completado', cart: data }), { status: 402 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error completando orden' }), { status: 500 });
  }
};
```

### Gestión de Pagos Asíncronos (Pix y Boleto en Brasil via Stripe)

Debido a que Pix y Boleto procesan confirmaciones asíncronas, el webhook intercepta el éxito definitivo del pago para impactar a Medusa:

**`/api/webhooks/stripe.ts`**

```typescript
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_PRIVATE_KEY);

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, import.meta.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntentId = event.data.object.id;
      console.log(`[Webhook] Confirmación de pago recibida en backend: ${paymentIntentId}`);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Webhook inválido' }), { status: 400 });
  }
};
```

---

## 👔 7. Nota Técnica: Flujo de Aprobación B2B Automatizado

Para mitigar la fricción de aprobaciones manuales centralizadas, el backend persistirá metadatos de validación empresarial (`tax_id`, `company_name`) directo en el esquema del cliente, aislando los estados mediante vistas condicionales en Astro.

```
Formulario Web ➔ Webhook Interno ➔ Registro en DB (Pending) ➔ Acción del Admin ➔ Desbloqueo de Grupo
```

### Endpoint de Registro Corporativo

**`/api/b2b/register.ts`**

```typescript
import type { APIRoute } from 'astro';
import Medusa from '@medusajs/medusa-js';

const client = new Medusa({ baseUrl: import.meta.env.MEDUSA_BACKEND_URL });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password, company_name, tax_id, phone, country } = await request.json();

    const { customer } = await client.customers.create({
      email,
      password,
      first_name: company_name,
      last_name: '',
      phone,
      metadata: {
        company_name,
        tax_id,
        country,
        b2b_status: 'pending', // pending | approved | rejected
        registered_at: new Date().toISOString(),
      },
    });

    // Despacho de webhook a sistema de notificaciones del administrador
    await fetch(import.meta.env.ADMIN_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'b2b_registration', customer_id: customer.id, company_name, tax_id, email }),
    });

    return new Response(JSON.stringify({ message: 'Solicitud en proceso' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el registro B2B' }), { status: 500 });
  }
};
```

### Pantalla de Validación de Estado para el Mayorista

El portal valida dinámicamente las credenciales contra el metadata inyectado en el servidor para evitar que usuarios sin privilegios accedan a las listas de precios al por mayor.

**`/pages/mayorista/estado.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';

const token = Astro.cookies.get('medusa_token')?.value;
if (!token) return Astro.redirect('/mayorista/login');

const res = await fetch(`${import.meta.env.MEDUSA_BACKEND_URL}/store/customers/me`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { customer } = await res.json();
const status = customer.metadata?.b2b_status ?? 'pending';

const visuales = {
  pending: { titulo: 'Solicitud en revisión', texto: 'Verificando credenciales fiscales. Alta en 24-48 horas.', clase: 'warn' },
  approved: { titulo: 'Cuenta mayorista activa', texto: 'Precios de volumen desbloqueados.', clase: 'success' },
  rejected: { titulo: 'Solicitud declinada', texto: 'Escribe a mayoristas@octavofuego.com.', clase: 'danger' }
};

const card = visuales[status];
---

<Layout title="Estado B2B">
  <div class={`card-${card.clase}`}>
    <h1>{card.titulo}</h1>
    <p>{card.texto}</p>
    {status === 'approved' && <a href="/p/">Ir al catálogo de volumen</a>}
  </div>
</Layout>
```

---

## 🚀 8. Estrategia de Deployment de Monorepo en Vercel y CI/CD

Vercel compilará de forma aislada e independiente cada aplicación del espacio de trabajo apuntando al mismo repositorio de GitHub a través del aislamiento del directorio raíz.

### Configuración del Panel de Proyectos en Vercel

* **Proyecto Vercel 1: Colombia e Internacional**
  * *Root Directory:* `apps/colombia`
  * *Build Command:* `pnpm build`
  * *Output Directory:* `dist`
  * *Dominio:* `octavofuego.com`

* **Proyecto Vercel 2: Hub Brasil**
  * *Root Directory:* `apps/brasil`
  * *Build Command:* `pnpm build`
  * *Output Directory:* `dist`
  * *Dominio:* `octavofogo.com.br`

### Integración Continua: Pipeline de Control de Compilación

Para mitigar efectos colaterales donde una mutación en el paquete lógico compartido `/packages/core` quiebre de forma silenciosa una de las dos aplicaciones, se ejecuta una GitHub Action obligatoria bloqueante previa al *merge* en `main`.

**.github/workflows/check-builds.yml**

```yaml
name: Validar Ecosistema Monorepo

on:
  pull_request:
    branches: [main]

jobs:
  build-colombia:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - run: pnpm install
      - run: pnpm --filter colombia build
        env:
          MEDUSA_BACKEND_URL: ${{ secrets.MEDUSA_PROD_URL }}
          PUBLIC_MEDUSA_URL: ${{ secrets.MEDUSA_PROD_URL }}
          PUBLIC_MEDUSA_REGION_ID: reg_colombia_01
          PUBLIC_PAYMENT_PROVIDER: wompi
          PUBLIC_DOMAIN_CO: https://octavofuego.com
          PUBLIC_DOMAIN_BR: https://octavofogo.com.br

  build-brasil:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - run: pnpm install
      - run: pnpm --filter brasil build
        env:
          MEDUSA_BACKEND_URL: ${{ secrets.MEDUSA_PROD_URL }}
          PUBLIC_MEDUSA_URL: ${{ secrets.MEDUSA_PROD_URL }}
          PUBLIC_MEDUSA_REGION_ID: reg_brasil_01
          PUBLIC_PAYMENT_PROVIDER: stripe
          PUBLIC_DOMAIN_CO: https://octavofuego.com
          PUBLIC_DOMAIN_BR: https://octavofogo.com.br
```

---

## 📋 9. Diccionario de Variables de Entorno del Entorno de Red

Las variables privadas del servidor **no se prefijan con `PUBLIC_`**, quedando totalmente blindadas del lado de la ejecución de Node. Las variables públicas se inyectan en el cliente para la hidratación reactiva.

```bash
# ==============================================================================
# /apps/colombia/.env (Despliegue Vercel - Hub Colombia)
# ==============================================================================
MEDUSA_BACKEND_URL=https://api.octavofuego.com      # Privada: BFF Proxy Endpoint
PUBLIC_MEDUSA_URL=https://api.octavofuego.com       # Pública: Cliente JS SDK
PUBLIC_MEDUSA_REGION_ID=reg_colombia_01             # Configuración Región CO en Medusa
PUBLIC_PAYMENT_PROVIDER=wompi                       # Pasarela Colombia
PUBLIC_DOMAIN_CO=https://octavofuego.com            # Dominio absoluto SEO CO
PUBLIC_DOMAIN_BR=https://octavofogo.com.br          # Dominio absoluto SEO BR

# ==============================================================================
# /apps/brasil/.env (Despliegue Vercel - Hub Brasil)
# ==============================================================================
MEDUSA_BACKEND_URL=https://api.octavofuego.com      # Privada: Comparte misma base centralizada
PUBLIC_MEDUSA_URL=https://api.octavofuego.com       # Pública
PUBLIC_MEDUSA_REGION_ID=reg_brasil_01               # Configuración Región BR en Medusa
PUBLIC_PAYMENT_PROVIDER=stripe                      # Pasarela Brasil (Pix/Boleto nativo)
PUBLIC_DOMAIN_CO=https://octavofuego.com            # Dominio absoluto SEO CO
PUBLIC_DOMAIN_BR=https://octavofogo.com.br          # Dominio absoluto SEO BR
STRIPE_PRIVATE_KEY=sk_live_51...                    # Privada: Pasarela Servidor Node
STRIPE_WEBHOOK_SECRET=whsec_...                     # Privada: Validación Firmas Webhook
```

---

## 📎 Documentos Relacionados

| Documento | Propósito |
|-----------|-----------|
| `PROYECTO.md` | Single source of truth del proyecto |
| `PENDIENTES.md` | Task tracking + design system extendido |
| `AGENTS.md` | Instrucciones para AI agents |
| `ARCHITECTURE.md` | **← Este archivo** — Manifiesto de ingeniería |

---

*Manifiesto generado: Junio 15, 2026*
*Engram Topic Key: `architecture/manifesto-v1`*
