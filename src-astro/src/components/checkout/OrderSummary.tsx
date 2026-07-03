

import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, formatCOP } from '@/stores/cartStore';
import { useT, setLocale, type Locale } from '@/stores/localeStore';

export function OrderSummary({ locale }: { locale?: Locale }) {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);
  const $t = useT();

  useEffect(() => {
    if (locale) setLocale(locale);
  }, [locale]);

  return (
    <div class="bg-humo/20 border border-humo/30 p-6 sticky top-24">
      <h2 class="font-display text-lg font-semibold mb-6">{$t('checkout.resumenPedido')}</h2>
      
      {items.length === 0 ? (
        <p class="text-ceniza text-sm">{$t('cart.vacío')}</p>
      ) : (
        <>
          <div class="space-y-4 mb-6">
            {items.slice(0, 3).map((item) => (
              <div key={item.variantId} class="flex gap-3">
                <div class="w-16 h-16 bg-humo/50 flex-shrink-0">
                   <img src={item.imagen} alt={item.nombre.es} class="w-full h-full object-cover" />
                 </div>
                 <div class="flex-1 min-w-0">
                   <p class="text-sm font-medium truncate">{item.nombre.es}</p>
                  <p class="text-xs text-ceniza">{item.cantidad} × {formatCOP(item.precio)}</p>
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <p class="text-xs text-ceniza">{$t('checkout.masItems').replace('{count}', String(items.length - 3))}</p>
            )}
          </div>

          <div class="space-y-3 border-t border-humo/30 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">{$t('cart.subtotal')}</span>
              <span>{formatCOP(total)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">{$t('cart.envio')}</span>
              <span class="text-success">{$t('cart.envioGratis')}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ceniza">{$t('cart.total')}</span>
              <span class="font-semibold">{formatCOP(total)}</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-humo/30 rounded-lg">
            <p class="text-xs text-ceniza text-center">
              {$t('checkout.pagoSeguro')}
            </p>
          </div>
        </>
      )}
    </div>
  );
}