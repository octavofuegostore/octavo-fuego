import React, { useState, useEffect, useId, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, formatCOP, clearCart } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useT, setLocale, type Locale } from '@/stores/localeStore';
import { boldStatusStore, boldTransactionIdStore, boldOrderIdStore } from '@/stores/checkoutStore';
import { createCheckoutGateway } from './checkoutPayment';

type Step = 1 | 2 | 3 | 4;

interface SavedOrder {
  id: string;
  fecha: string;
  contacto: ContactInfo;
  envio: ShippingInfo;
  metodoPago: string;
  items: { nombre: string; cantidad: number; precio: number }[];
  total: number;
  estado: 'pendiente_pago' | 'pendiente-whatsapp' | 'pagado-bold';
}

interface ContactInfo {
  nombre: string;
  email: string;
  telefono: string;
}

interface ShippingInfo {
  direccion: string;
  ciudad: string;
  departamento: string;
  notas: string;
}

const departamentosColombia = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
  'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
  'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
  'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

/**
 * Load the most recent saved order from localStorage.
 * Used when returning from a Bold redirect (page reload clears React state).
 */
function loadLatestOrder(): SavedOrder | null {
  try {
    const orders: SavedOrder[] = JSON.parse(localStorage.getItem('of_ordenes') || '[]');
    return orders.length > 0 ? orders[orders.length - 1] : null;
  } catch {
    return null;
  }
}

export function CheckoutForm({ locale }: { locale?: Locale }) {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);
  const $t = useT();

  useEffect(() => {
    if (locale) setLocale(locale);
  }, [locale]);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    direccion: '',
    ciudad: '',
    departamento: '',
    notas: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formId = useId();

  // Bold / payment state
  const [boldStatus, setBoldStatus] = useState<'idle' | 'processing' | 'redirecting' | 'success' | 'failed'>('idle');
  const [boldTransactionId, setBoldTransactionId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bold' | 'whatsapp'>('bold');
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null);

  // Detect Bold return on initial page load (page reloads after redirect)
  const isBrowser = typeof window !== 'undefined';
  const searchParams = isBrowser ? new URLSearchParams(window.location.search) : null;
  const isBoldReturn = searchParams?.get('bold') === 'success' || searchParams?.get('bold') === 'failed';

  // Effect to handle Bold redirect return
  useEffect(() => {
    if (!isBrowser) return;

    const params = new URLSearchParams(window.location.search);
    const boldResult = params.get('bold');

    if (boldResult === 'success' || boldResult === 'failed') {
      const order = loadLatestOrder();
      if (order) {
        setSavedOrder(order);
      }

      const newBoldStatus = boldResult === 'success' ? 'success' : 'failed';
      setBoldStatus(newBoldStatus);
      setPaymentMethod('bold');
      setCurrentStep(4);

      // Reset the store so empty-cart check passes
      boldStatusStore.set(newBoldStatus);

      // Clean URL params
      window.history.replaceState({}, '', '/checkout');
    }
  }, [isBrowser]);

  // Unique field IDs
  const fieldIds = {
    nombre: `${formId}-nombre`,
    email: `${formId}-email`,
    telefono: `${formId}-telefono`,
    direccion: `${formId}-direccion`,
    ciudad: `${formId}-ciudad`,
    departamento: `${formId}-departamento`,
    notas: `${formId}-notas`,
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!contactInfo.nombre.trim()) newErrors.nombre = $t('checkout.errNombreRequerido');
    if (!contactInfo.email.trim()) newErrors.email = $t('checkout.errEmailRequerido');
    else if (!validateEmail(contactInfo.email)) newErrors.email = $t('checkout.errEmailInvalido');
    if (!contactInfo.telefono.trim()) newErrors.telefono = $t('checkout.errTelefonoRequerido');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.direccion.trim()) newErrors.direccion = $t('checkout.errDireccionRequerida');
    if (!shippingInfo.ciudad.trim()) newErrors.ciudad = $t('checkout.errCiudadRequerida');
    if (!shippingInfo.departamento) newErrors.departamento = $t('checkout.errDepartamentoRequerido');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
    // Step 3 has its own action buttons — no Next button rendered
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Reset error/failed state when going back from step 4
      if (currentStep === 4 && boldStatus === 'failed') {
        setBoldStatus('idle');
      }
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const saveOrder = useCallback((metodoPago: string = 'pendiente'): SavedOrder => {
    const orderId = `OF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order: SavedOrder = {
      id: orderId,
      fecha: new Date().toISOString(),
      contacto: { ...contactInfo },
      envio: { ...shippingInfo },
      metodoPago,
      items: items.map((item) => ({
        nombre: item.nombre || item.name || 'Producto',
        cantidad: item.cantidad || item.quantity || 1,
        precio: item.precio || item.price || 0,
      })),
      total,
      estado: metodoPago === 'bold' ? 'pendiente_pago' : 'pendiente-whatsapp',
    };

    // Persistir orden en localStorage
    let ordenesGuardadas: SavedOrder[] = [];
    try {
      ordenesGuardadas = JSON.parse(localStorage.getItem('of_ordenes') || '[]');
    } catch {
      console.warn('[checkout] Failed to read orders from localStorage, starting fresh');
      ordenesGuardadas = [];
    }
    ordenesGuardadas.push(order);
    try {
      localStorage.setItem('of_ordenes', JSON.stringify(ordenesGuardadas));
    } catch {
      console.warn('[checkout] Failed to persist order to localStorage');
    }
    return order;
  }, [contactInfo, shippingInfo, items, total]);

  const handleBoldPayment = async () => {
    setIsProcessing(true);
    setBoldStatus('processing');

    // Save order before redirect
    const order = saveOrder('bold');
    setSavedOrder(order);

    // Clear cart — payment is being processed externally
    clearCart();

    try {
      const gateway = createCheckoutGateway();
      const result = await gateway.cobrar(total, {
        reference: order.id,
        description: `Compra Octavo Fuego - ${order.id}`,
        redirect_url: `${window.location.origin}/checkout?bold=success`,
        customer: {
          name: contactInfo.nombre,
          email: contactInfo.email,
          phone: contactInfo.telefono,
        },
      });

      if (result.exitoso && result.urlPago) {
        setBoldTransactionId(result.codigoPasarela ?? null);
        setBoldStatus('redirecting');

        // Share state with OrderSummary island via nanostore
        boldStatusStore.set('redirecting');
        boldTransactionIdStore.set(result.codigoPasarela ?? null);
        boldOrderIdStore.set(order.id);

        // Brief pause so user sees "redirecting" state
        setTimeout(() => {
          window.location.href = result.urlPago!;
        }, 800);
      } else {
        setBoldStatus('failed');
        setCurrentStep(4);

        boldStatusStore.set('failed');
      }
    } catch (err) {
      console.error('[checkout] Bold payment error:', err);
      setBoldStatus('failed');
      setCurrentStep(4);

      boldStatusStore.set('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const order = saveOrder('whatsapp');
    setSavedOrder(order);
    setPaymentMethod('whatsapp');
    setCurrentStep(4);
  };

  // ── Empty cart guard ───────────────────────────────────────────────────────
  // Show empty state only when not returning from Bold redirect
  if (items.length === 0 && currentStep !== 4 && !isBoldReturn) {
    return (
      <div class="text-center py-12">
        <p class="text-ceniza mb-4">{$t('cart.vacío')}</p>
        <Button onClick={() => { window.location.href = locale === 'es' ? '/tienda' : `/${locale}/tienda`; }}>
          {$t('checkout.irCatalogo')}
        </Button>
      </div>
    );
  }

  const stepLabels = [$t('checkout.info'), $t('checkout.envio'), $t('checkout.pago'), $t('checkout.listo')];

  return (
    <>
      {/* Step Indicator */}
      <div class="flex justify-center mb-12" role="list" aria-label="Progreso del checkout">
        <div class="flex items-center gap-4 md:gap-8">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              {step > 1 && <div class="w-8 md:w-16 h-px bg-humo" aria-hidden="true" />}
              <div
                class={`flex items-center gap-2 ${currentStep < step ? 'opacity-50' : ''}`}
                role="listitem"
                aria-current={currentStep === step ? 'step' : undefined}
              >
                <div
                  class={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? 'border-tabaco bg-tabaco text-white'
                      : 'border-humo'
                  }`}
                  aria-hidden="true"
                >
                  {currentStep > step ? '✓' : step}
                </div>
                <span class={`hidden md:inline text-sm ${currentStep < step ? 'text-ceniza' : ''}`}>
                  {stepLabels[step - 1]}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div class="bg-papel/50 border border-gray-200 p-6 md:p-8">
        {/* ───── Step 1: Contact Information ───── */}
        {currentStep === 1 && (
          <div class="space-y-6">
            <h2 class="font-display text-xl font-semibold mb-6">{$t('checkout.info')}</h2>

            <div>
              <label htmlFor={fieldIds.nombre} class="block text-sm mb-2">{$t('checkout.nombre')} *</label>
              <Input
                id={fieldIds.nombre}
                type="text"
                value={contactInfo.nombre}
                onChange={(e) => setContactInfo({ ...contactInfo, nombre: e.target.value })}
                placeholder="María García"
                className={errors.nombre ? 'border-error' : ''}
                aria-describedby={errors.nombre ? `${fieldIds.nombre}-error` : undefined}
                aria-invalid={errors.nombre ? 'true' : undefined}
              />
              {errors.nombre && (
                <p id={`${fieldIds.nombre}-error`} class="text-error text-xs mt-1" role="alert">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label htmlFor={fieldIds.email} class="block text-sm mb-2">{$t('checkout.email')} *</label>
              <Input
                id={fieldIds.email}
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="maria@email.com"
                className={errors.email ? 'border-error' : ''}
                aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
                aria-invalid={errors.email ? 'true' : undefined}
              />
              {errors.email && (
                <p id={`${fieldIds.email}-error`} class="text-error text-xs mt-1" role="alert">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor={fieldIds.telefono} class="block text-sm mb-2">{$t('checkout.telefono')} *</label>
              <Input
                id={fieldIds.telefono}
                type="tel"
                value={contactInfo.telefono}
                onChange={(e) => setContactInfo({ ...contactInfo, telefono: e.target.value })}
                placeholder="+57 300 123 4567"
                className={errors.telefono ? 'border-error' : ''}
                aria-describedby={errors.telefono ? `${fieldIds.telefono}-error` : undefined}
                aria-invalid={errors.telefono ? 'true' : undefined}
              />
              {errors.telefono && (
                <p id={`${fieldIds.telefono}-error`} class="text-error text-xs mt-1" role="alert">{errors.telefono}</p>
              )}
            </div>
          </div>
        )}

        {/* ───── Step 2: Shipping ───── */}
        {currentStep === 2 && (
          <div class="space-y-6">
            <h2 class="font-display text-xl font-semibold mb-6">{$t('checkout.envio')}</h2>

            <div>
              <label htmlFor={fieldIds.direccion} class="block text-sm mb-2">{$t('checkout.direccion')} *</label>
              <Input
                id={fieldIds.direccion}
                type="text"
                value={shippingInfo.direccion}
                onChange={(e) => setShippingInfo({ ...shippingInfo, direccion: e.target.value })}
                placeholder="Carrera 7 # 12-34, Apartamento 501"
                className={errors.direccion ? 'border-error' : ''}
                aria-describedby={errors.direccion ? `${fieldIds.direccion}-error` : undefined}
                aria-invalid={errors.direccion ? 'true' : undefined}
              />
              {errors.direccion && (
                <p id={`${fieldIds.direccion}-error`} class="text-error text-xs mt-1" role="alert">{errors.direccion}</p>
              )}
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={fieldIds.ciudad} class="block text-sm mb-2">{$t('checkout.ciudad')} *</label>
                <Input
                  id={fieldIds.ciudad}
                  type="text"
                  value={shippingInfo.ciudad}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, ciudad: e.target.value })}
                  placeholder="Bogotá"
                  className={errors.ciudad ? 'border-error' : ''}
                  aria-describedby={errors.ciudad ? `${fieldIds.ciudad}-error` : undefined}
                  aria-invalid={errors.ciudad ? 'true' : undefined}
                />
                {errors.ciudad && (
                  <p id={`${fieldIds.ciudad}-error`} class="text-error text-xs mt-1" role="alert">{errors.ciudad}</p>
                )}
              </div>

              <div>
                <label htmlFor={fieldIds.departamento} class="block text-sm mb-2">{$t('checkout.departamento')} *</label>
                <select
                  id={fieldIds.departamento}
                  value={shippingInfo.departamento}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, departamento: e.target.value })}
                  className={`w-full h-11 px-2 bg-transparent border rounded-lg text-base md:text-sm transition-colors outline-none focus:border-tabaco ${errors.departamento ? 'border-error' : 'border-humo'}`}
                  aria-describedby={errors.departamento ? `${fieldIds.departamento}-error` : undefined}
                  aria-invalid={errors.departamento ? 'true' : undefined}
                >
                  <option value="">{$t('checkout.seleccionar')}</option>
                  {departamentosColombia.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.departamento && (
                  <p id={`${fieldIds.departamento}-error`} class="text-error text-xs mt-1" role="alert">{errors.departamento}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={fieldIds.notas} class="block text-sm mb-2">{$t('checkout.notasAdicionales')}</label>
              <textarea
                id={fieldIds.notas}
                value={shippingInfo.notas}
                onChange={(e) => setShippingInfo({ ...shippingInfo, notas: e.target.value })}
                placeholder={$t('checkout.notasPlaceholder')}
                rows={3}
                className="w-full bg-transparent border border-humo rounded-lg px-3 py-2 text-base md:text-sm resize-none focus:border-tabaco focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ───── Step 3: Payment — Bold-first + WhatsApp fallback ───── */}
        {currentStep === 3 && (
          <div class="space-y-6">
            <h2 class="font-display text-xl font-semibold mb-6">{$t('checkout.metodoPago')}</h2>

            <div class="space-y-4">
              {/* Bold — primary CTA */}
              <button
                onClick={handleBoldPayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-between p-5 border-2 border-[var(--color-action-primary)] bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-action-hover)] transition-colors rounded-lg font-medium text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span class="flex items-center gap-3">
                  {isProcessing ? (
                    <span>{$t('checkout.boldProcesando')}</span>
                  ) : (
                    <span>{$t('checkout.pagarBold')}</span>
                  )}
                </span>
                <span class="text-lg font-semibold">{formatCOP(total)}</span>
              </button>

              {isProcessing && (
                <div class="text-center text-sm text-ceniza py-2 animate-pulse">
                  {$t('checkout.boldRedirecting')}
                </div>
              )}

              {/* Divider */}
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-humo/30"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-white px-3 text-xs text-ceniza">o</span>
                </div>
              </div>

              {/* WhatsApp fallback */}
              <div class="p-5 border border-humo/50 rounded-lg">
                <p class="text-sm text-ceniza mb-3">{$t('checkout.whatsappFallbackDesc')}</p>
                <button
                  onClick={handleWhatsAppFallback}
                  className="w-full flex items-center justify-center gap-3 p-3 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors rounded-lg font-medium"
                >
                  <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {$t('checkout.whatsappFallback')}
                </button>
              </div>
            </div>

            <div class="bg-humo/30 p-4 text-sm text-ceniza">
              <p>{$t('checkout.seguridadBold')}</p>
            </div>
          </div>
        )}

        {/* ───── Step 4: Confirmation ───── */}
        {currentStep === 4 && savedOrder && (
          <div class="text-center py-8">
            {/* Icon — varies by payment state */}
            {boldStatus === 'success' ? (
              <div class="w-20 h-20 rounded-full bg-success/20 mx-auto mb-6 flex items-center justify-center">
                <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : boldStatus === 'failed' ? (
              <div class="w-20 h-20 rounded-full bg-error/20 mx-auto mb-6 flex items-center justify-center">
                <svg class="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : (
              <div class="w-20 h-20 rounded-full bg-warning/20 mx-auto mb-6 flex items-center justify-center">
                <svg class="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}

            {/* Heading */}
            {boldStatus === 'success' ? (
              <h2 class="font-display text-2xl font-semibold mb-2">{$t('checkout.pedidoConfirmado')}</h2>
            ) : boldStatus === 'failed' ? (
              <h2 class="font-display text-2xl font-semibold mb-2">{$t('checkout.boldError')}</h2>
            ) : (
              <h2 class="font-display text-2xl font-semibold mb-2">{$t('checkout.pedidoRecibidoHeading')}</h2>
            )}

            {/* Reference */}
            <p class="text-ceniza text-sm mb-1">
              {$t('checkout.referencia')} <strong class="text-[var(--near-black)] font-mono">{savedOrder.id}</strong>
            </p>

            {/* Status-specific messages */}
            {boldStatus === 'success' && (
              <>
                <p class="text-success text-sm mb-1">
                  {$t('checkout.boldStatus')} {$t('checkout.boldSuccess')}
                </p>
                {boldTransactionId && (
                  <p class="text-ceniza text-xs mb-6">
                    {$t('checkout.boldReference')} {boldTransactionId}
                  </p>
                )}
                {!boldTransactionId && <div class="mb-6" />}
              </>
            )}

            {boldStatus === 'failed' && (
              <p class="text-error text-sm mb-6">{$t('checkout.boldErrorMsg')}</p>
            )}

            {(boldStatus === 'idle' || boldStatus === 'processing') && (
              <p class="text-ceniza mb-6 max-w-sm mx-auto">{$t('checkout.pedidoWhatsAppMsg')}</p>
            )}

            {/* Order detail card */}
            <div class="bg-papel/50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
              <h3 class="font-semibold mb-4">{$t('checkout.resumenPedido')}</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-ceniza">{$t('checkout.nombreLabel')}</span>
                  <span>{savedOrder.contacto.nombre}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ceniza">{$t('checkout.envioLabel')}</span>
                  <span>{savedOrder.envio.ciudad}, {savedOrder.envio.departamento}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ceniza">{$t('checkout.metodoPagoLabel')}</span>
                  <span class="capitalize">{paymentMethod === 'bold' ? 'Bold' : 'WhatsApp'}</span>
                </div>
                <div class="border-t border-humo/50 pt-2 mt-4 flex justify-between font-semibold">
                  <span>{$t('checkout.totalLabel')}</span>
                  <span class="text-tabaco">{formatCOP(savedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div class="flex flex-col gap-4 max-w-md mx-auto">
              {boldStatus === 'failed' ? (
                <>
                  <Button onClick={() => setCurrentStep(3)}>
                    {$t('checkout.boldIntentaDeNuevo')}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => window.open(
                      `https://wa.me/573172137932?text=${encodeURIComponent(
                        $t('checkout.whatsappConfirmMsg')
                          .replace('{referenceId}', savedOrder.id)
                          .replace('{total}', formatCOP(savedOrder.total))
                          .replace('{name}', savedOrder.contacto.nombre)
                      )}`, '_blank'
                    )}
                  >
                    <svg class="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {$t('checkout.confirmarWhatsApp')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => window.open(
                      `https://wa.me/573172137932?text=${encodeURIComponent(
                        $t('checkout.whatsappConfirmMsg')
                          .replace('{referenceId}', savedOrder.id)
                          .replace('{total}', formatCOP(savedOrder.total))
                          .replace('{name}', savedOrder.contacto.nombre)
                      )}`, '_blank'
                    )}
                  >
                    <svg class="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {$t('checkout.confirmarWhatsApp')}
                  </Button>
                  <Button variant="secondary" onClick={() => { window.location.href = locale === 'es' ? '/tienda' : `/${locale}/tienda`; }}>
                    {$t('cart.continuarComprando')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Status messages (a11y live region) */}
        <div aria-live="polite" role="status" class="sr-only">
          {isProcessing ? $t('checkout.procesandoAria') : ''}
          {currentStep === 4 ? $t('checkout.recibidoAria') : ''}
        </div>
      </div>

      {/* ───── Navigation Buttons ───── */}
      {currentStep !== 4 && (
        <div class="sticky bottom-0 bg-white pt-4 border-t border-humo/30">
          <div class="flex justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              ← {$t('checkout.volver')}
            </Button>
            {/* No Next button on step 3 — payment actions are in-page */}
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                {$t('checkout.continuar')} →
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
