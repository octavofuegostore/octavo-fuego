"use client"

import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, formatCOP } from '@/stores/cartStore';

export function OrderSummary() {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);

  return (
    <div class="bg-humo/20 border border-humo/30 p-6 sticky top-24">
      <h2 class="font-display text-lg font-semibold mb-6">Resumen del pedido</h2>
      
      {items.length === 0 ? (
        <p class="text-ceniza text-sm">Tu carrito está vacío</p>
      ) : (
        <>
          <div class="space-y-4 mb-6">
            {items.slice(0, 3).map((item) => (
              <div key={item.variantId} class="flex gap-3">
                <div class="w-16 h-16 bg-humo/50 flex-shrink-0">
                  <img src={item.imagen} alt={item.nombre} class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{item.nombre}</p>
                  <p class="text-xs text-ceniza">{item.cantidad} × {formatCOP(item.precio)}</p>
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <p class="text-xs text-ceniza">+ {items.length - 3} más</p>
            )}
          </div>

          <div class="space-y-3 border-t border-humo/30 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">Subtotal</span>
              <span>{formatCOP(total)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">Envío</span>
              <span class="text-success">Gratis</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">Total</span>
              <span class="font-semibold">{formatCOP(total)}</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-humo/30 rounded-lg">
            <p class="text-xs text-ceniza text-center">
              Pago 100% seguro. Aceptamos PSE, Nequi, Daviplata y tarjetas.
            </p>
          </div>
        </>
      )}
    </div>
  );
}