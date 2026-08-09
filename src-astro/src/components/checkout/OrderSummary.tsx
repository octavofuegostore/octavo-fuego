import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, formatCOP } from '@/stores/cartStore';
import { useT, setLocale, type Locale } from '@/stores/localeStore';
import { boldStatusStore, boldTransactionIdStore, boldOrderIdStore } from '@/stores/checkoutStore';

export function OrderSummary({ locale }: { locale?: Locale }) {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);
  const $t = useT();
  const boldStatus = useStore(boldStatusStore);
  const boldTransactionId = useStore(boldTransactionIdStore);
  const boldOrderId = useStore(boldOrderIdStore);

  useEffect(() => {
    if (locale) setLocale(locale);
  }, [locale]);

  return (
    <div class="bg-humo/20 border border-humo/30 p-6 sticky top-24">
      <h2 class="font-display text-lg font-semibold mb-6">{$t('checkout.resumenPedido')}</h2>

      {items.length === 0 && boldStatus === 'idle' ? (
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

          {/* ── Bold payment status ── */}
          {boldStatus !== 'idle' && (
            <div class="mb-4 p-3 bg-humo/20 rounded-lg border border-humo/30">
              <p class="text-xs font-medium mb-1">{$t('checkout.boldStatus')}</p>
              <p class="text-xs text-ceniza">
                {boldStatus === 'processing' && $t('checkout.boldProcesando')}
                {boldStatus === 'redirecting' && $t('checkout.boldRedirecting')}
                {boldStatus === 'success' && $t('checkout.boldSuccess')}
                {boldStatus === 'failed' && $t('checkout.boldFailed')}
              </p>
              {boldTransactionId && (
                <p class="text-xs text-ceniza mt-1">
                  {$t('checkout.boldReference')} {boldTransactionId}
                </p>
              )}
              {boldOrderId && (
                <p class="text-xs text-ceniza mt-1">
                  {$t('checkout.referencia')} {boldOrderId}
                </p>
              )}

              {/* WhatsApp fallback inline */}
              {boldStatus === 'failed' && (
                <a
                  href={`https://wa.me/573172137932?text=${encodeURIComponent(
                    `${$t('checkout.whatsappConfirmMsg').replace('{referenceId}', boldOrderId ?? '')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {$t('checkout.confirmarWhatsApp')}
                </a>
              )}
            </div>
          )}

          {/* ── Totals ── */}
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

          {/* WhatsApp option when cart is visible */}
          {boldStatus === 'idle' && items.length > 0 && (
            <div class="mt-4 p-3 border border-humo/30 rounded-lg">
              <p class="text-xs text-ceniza text-center mb-2">
                {$t('checkout.whatsappFallbackDesc')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
