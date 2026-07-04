# Proposal: E5 — Checkout & Payment Architecture

## Intent

Reemplazar el checkout fake (`setTimeout` → "confirmado") por una arquitectura de pagos
desacoplada, empezando por WhatsApp como provider formal. Agregar Bold (CO), Stripe (BR/Intl),
y Mercado Pago (CO+BR) progresivamente según aprobación legal de cada cuenta comercial.

## Architecture

### PaymentProvider interface

```typescript
interface PaymentProvider {
  id: string;
  name: string;

  createCheckout(order: Order): Promise<CheckoutResult>;

  handleWebhook(payload: unknown): Promise<WebhookResult>;

  getStatus(paymentId: string): Promise<'pending' | 'paid' | 'failed' | 'cancelled'>;
}
```

### Locale → provider mapping (editable, sin deploy)

```typescript
const paymentProviders: Record<Locale, string> = {
  es: 'whatsapp',   // → 'bold' cuando esté aprobado
  pt: 'whatsapp',   // → 'stripe' o 'mercadopago'
  en: 'whatsapp',   // → 'stripe'
};
```

### WhatsApp como provider formal

No es un parche — es un `PaymentProvider` de primera clase:

- Registra la orden en persistencia **antes** de mostrar confirmación
- No llama `clearCart()` hasta que la orden está guardada
- Copy honesto: "Recibimos tu pedido — coordiná el pago por WhatsApp"
- Guarda: datos de contacto, productos, total, estado `pending`
- Link WhatsApp pre-llenado con resumen + ID único de orden

## Scope por fase

### Fase 1 — WhatsApp Provider (urgencia inmediata)
- [x] PaymentBanner integrado en checkout
- [ ] Crear `src/payment/types.ts` — interfaz + tipos
- [ ] Implementar `WhatsAppProvider` — registra orden + genera link
- [ ] Crear `src/payment/registry.ts` — mapeo locale → provider
- [ ] Refactorizar CheckoutForm para usar provider activo
- [ ] Fix: copy honesto en confirmación (no "¡Confirmado!" fake)
- [ ] Fix: `clearCart()` solo después de orden guardada
- [ ] Migrar step indicator de DOM API a React state
- [ ] Integrar PaymentBanner en paso de pago

### Fase 2 — Bold Provider (cuando cuenta comercial esté aprobada)
- [ ] Adaptador Bold: redirect a checkout widget
- [ ] Webhook `/api/webhooks/bold`
- [ ] Mapeo `es: 'bold'`
- [ ] Moneda COP

### Fase 3 — Stripe Provider (cuando cuenta BR esté aprobada)
- [ ] Adaptador Stripe: Pix, Boleto, card
- [ ] Webhook `/api/webhooks/stripe`
- [ ] Mapeo `pt: 'stripe'`, `en: 'stripe'`
- [ ] Monedas BRL, USD

### Fase 4 — Mercado Pago Provider (opcional, cuando tenga sentido)
- [ ] Adaptador MP: wallet + card para CO y BR
- [ ] Webhook `/api/webhooks/mercadopago`
- [ ] Se agrega como provider adicional

## File structure propuesta

```
src-astro/src/payment/
├── types.ts            ← interfaz PaymentProvider + tipos
├── registry.ts         ← mapeo locale → provider
├── providers/
│   ├── whatsapp.ts     ← Fase 1: guarda orden + WhatsApp link
│   ├── bold.ts         ← Fase 2: redirect a Bold checkout
│   ├── stripe.ts       ← Fase 3: Stripe Pix/Boleto/card
│   └── mercadopago.ts  ← Fase 4: MP wallet
└── orders.ts           ← persistencia de órdenes (Supabase Free o JSON local)
```

## Dependencies

- Cuenta comercial Bold aprobada (Fase 2)
- Cuenta Stripe con Pix/Boleto (Fase 3)
- Decisión de negocio: volumen esperado de ventas determina si Fase 1 es suficiente para lanzar

## Risks

| Riesgo | Prob. | Mitigación |
|--------|-------|------------|
| Cuenta Bold tarda en aprobarse | Alta | WhatsApp provider listo mientras |
| clearCart() prematuro pierde datos | Alta | **Fix inmediato**: guardar orden antes de limpiar |
| Usuario cierra WhatsApp sin escribir | Media | Orden ya guardada, se puede hacer seguimiento |
| Perder órdenes por fricción WhatsApp | Media | Medir: si volumen > N, acelerar Fase 2 |

## Success Criteria (Fase 1)

- [ ] Checkout guarda orden en persistencia antes de mostrar confirmación
- [ ] Copy honesto: "Recibimos tu pedido — coordiná el pago por WhatsApp"
- [ ] `clearCart()` solo después de orden guardada
- [ ] WhatsApp link incluye ID de orden + resumen + total
- [ ] Orden persiste aunque el usuario cierre WhatsApp
- [ ] Step indicator usa React state, no DOM API
- [ ] PaymentBanner visible en paso de pago
- [ ] `npm run build` pasa sin errores
