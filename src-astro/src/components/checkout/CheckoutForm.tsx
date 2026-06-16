"use client"

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, formatCOP, clearCart } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 1 | 2 | 3 | 4;

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

interface PaymentInfo {
  metodo: 'pse' | 'nequi' | 'daviplata' | 'tarjeta';
}

const departamentosColombia = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
  'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
  'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
  'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

export function CheckoutForm() {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);
  
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
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({ metodo: 'pse' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateStepIndicator = (step: Step) => {
    for (let i = 1; i <= 4; i++) {
      const indicator = document.getElementById(`step-${i}-indicator`);
      if (indicator) {
        const div = indicator.querySelector('div');
        const span = indicator.querySelector('span');
        if (i === step) {
          div?.classList.add('border-tabacco', 'bg-tabacco', 'text-white');
          div?.classList.remove('border-humo');
          if (span) span.classList.remove('text-ceniza', 'opacity-50');
        } else if (i < step) {
          div!.innerHTML = '✓';
          div?.classList.add('border-tabacco', 'bg-tabacco', 'text-white');
          div?.classList.remove('border-humo');
          if (span) span.classList.remove('text-ceniza', 'opacity-50');
        } else {
          div?.classList.remove('border-tabacco', 'bg-tabacco', 'text-white');
          div?.classList.add('border-humo');
          if (span) {
            span.classList.add('text-ceniza', 'opacity-50');
            span.classList.remove('text-tabacco');
          }
        }
      }
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!contactInfo.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!contactInfo.email.trim()) newErrors.email = 'El email es requerido';
    else if (!validateEmail(contactInfo.email)) newErrors.email = 'Email inválido';
    if (!contactInfo.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!shippingInfo.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!shippingInfo.departamento) newErrors.departamento = 'El departamento es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      updateStepIndicator(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      updateStepIndicator(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      updateStepIndicator(4);
      handlePayment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      updateStepIndicator((currentStep - 1) as Step);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    setIsProcessing(false);
  };

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div class="text-center py-12">
        <p class="text-ceniza mb-4">Tu carrito está vacío</p>
        <Button onClick={() => window.location.href='/es/tienda'}>Ir al catálogo</Button>
      </div>
    );
  }

  return (
    <div class="bg-humo/20 border border-humo/30 p-6 md:p-8">
      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <div class="space-y-6">
          <h2 class="font-display text-xl font-semibold mb-6">Información de contacto</h2>
          
          <div>
            <label class="block text-sm mb-2">Nombre completo *</label>
            <Input
              type="text"
              value={contactInfo.nombre}
              onChange={(e) => setContactInfo({ ...contactInfo, nombre: e.target.value })}
              placeholder="María García"
              className={errors.nombre ? 'border-error' : ''}
            />
            {errors.nombre && <p class="text-error text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label class="block text-sm mb-2">Email *</label>
            <Input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="maria@email.com"
              className={errors.email ? 'border-error' : ''}
            />
            {errors.email && <p class="text-error text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label class="block text-sm mb-2">Teléfono *</label>
            <Input
              type="tel"
              value={contactInfo.telefono}
              onChange={(e) => setContactInfo({ ...contactInfo, telefono: e.target.value })}
              placeholder="+57 300 123 4567"
              className={errors.telefono ? 'border-error' : ''}
            />
            {errors.telefono && <p class="text-error text-xs mt-1">{errors.telefono}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Shipping */}
      {currentStep === 2 && (
        <div class="space-y-6">
          <h2 class="font-display text-xl font-semibold mb-6">Información de envío</h2>
          
          <div>
            <label class="block text-sm mb-2">Dirección *</label>
            <Input
              type="text"
              value={shippingInfo.direccion}
              onChange={(e) => setShippingInfo({ ...shippingInfo, direccion: e.target.value })}
              placeholder="Carrera 7 # 12-34, Apartamento 501"
              className={errors.direccion ? 'border-error' : ''}
            />
            {errors.direccion && <p class="text-error text-xs mt-1">{errors.direccion}</p>}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-2">Ciudad *</label>
              <Input
                type="text"
                value={shippingInfo.ciudad}
                onChange={(e) => setShippingInfo({ ...shippingInfo, ciudad: e.target.value })}
                placeholder="Bogotá"
                className={errors.ciudad ? 'border-error' : ''}
              />
              {errors.ciudad && <p class="text-error text-xs mt-1">{errors.ciudad}</p>}
            </div>

            <div>
              <label class="block text-sm mb-2">Departamento *</label>
              <select
                value={shippingInfo.departamento}
                onChange={(e) => setShippingInfo({ ...shippingInfo, departamento: e.target.value })}
                className={`w-full h-11 px-2 bg-transparent border rounded-lg text-base md:text-sm transition-colors outline-none focus:border-tabacco ${errors.departamento ? 'border-error' : 'border-humo'}`}
              >
                <option value="">Seleccionar...</option>
                {departamentosColombia.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.departamento && <p class="text-error text-xs mt-1">{errors.departamento}</p>}
            </div>
          </div>

          <div>
            <label class="block text-sm mb-2">Notas adicionales</label>
            <textarea
              value={shippingInfo.notas}
              onChange={(e) => setShippingInfo({ ...shippingInfo, notas: e.target.value })}
              placeholder="Indicaciones para la entrega..."
              rows={3}
              className="w-full bg-transparent border border-humo rounded-lg px-3 py-2 text-base md:text-sm resize-none focus:border-tabacco focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div class="space-y-6">
          <h2 class="font-display text-xl font-semibold mb-6">Método de pago</h2>
          
          <div class="space-y-3">
            <label class={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentInfo.metodo === 'pse' ? 'border-tabacco bg-tabacco/10' : 'border-humo hover:border-tabacco/50'}`}>
              <input
                type="radio"
                name="payment"
                value="pse"
                checked={paymentInfo.metodo === 'pse'}
                onChange={() => setPaymentInfo({ metodo: 'pse' })}
                class="accent-tabacco"
              />
              <div class="flex-1">
                <span class="font-medium">PSE</span>
                <p class="text-xs text-ceniza">Pago con tu banco</p>
              </div>
              <span class="text-sm text-ceniza">Transferencia</span>
            </label>

            <label class={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentInfo.metodo === 'nequi' ? 'border-tabacco bg-tabacco/10' : 'border-humo hover:border-tabacco/50'}`}>
              <input
                type="radio"
                name="payment"
                value="nequi"
                checked={paymentInfo.metodo === 'nequi'}
                onChange={() => setPaymentInfo({ metodo: 'nequi' })}
                class="accent-tabacco"
              />
              <div class="flex-1">
                <span class="font-medium">Nequi</span>
                <p class="text-xs text-ceniza">Pago móvil</p>
              </div>
              <span class="text-ceniza font-semibold text-sm">Nequi</span>
            </label>

            <label class={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentInfo.metodo === 'daviplata' ? 'border-tabacco bg-tabacco/10' : 'border-humo hover:border-tabacco/50'}`}>
              <input
                type="radio"
                name="payment"
                value="daviplata"
                checked={paymentInfo.metodo === 'daviplata'}
                onChange={() => setPaymentInfo({ metodo: 'daviplata' })}
                class="accent-tabacco"
              />
              <div class="flex-1">
                <span class="font-medium">Daviplata</span>
                <p class="text-xs text-ceniza">Pago móvil</p>
              </div>
              <span class="text-ceniza font-semibold text-sm">Daviplata</span>
            </label>

            <label class={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentInfo.metodo === 'tarjeta' ? 'border-tabacco bg-tabacco/10' : 'border-humo hover:border-tabacco/50'}`}>
              <input
                type="radio"
                name="payment"
                value="tarjeta"
                checked={paymentInfo.metodo === 'tarjeta'}
                onChange={() => setPaymentInfo({ metodo: 'tarjeta' })}
                class="accent-tabacco"
              />
              <div class="flex-1">
                <span class="font-medium">Tarjeta de crédito</span>
                <p class="text-xs text-ceniza">Visa, Mastercard, AMEX</p>
              </div>
              <div class="flex gap-2">
                <span class="text-xs border border-humo px-2 py-1 rounded">VISA</span>
                <span class="text-xs border border-humo px-2 py-1 rounded">MC</span>
              </div>
            </label>
          </div>

          <div class="bg-humo/30 p-4 text-sm text-ceniza">
            <p>Al continuar, serás redirigido a la pasarela de pago segura de Bold para completar tu transacción.</p>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <div class="text-center py-8">
          <div class="w-20 h-20 rounded-full bg-success/20 mx-auto mb-6 flex items-center justify-center">
            <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="font-display text-2xl font-semibold mb-4">¡Pedido confirmado!</h2>
          <p class="text-ceniza mb-6">
            Tu pedido ha sido recibido. Te enviamos un correo a <strong class="text-white">{contactInfo.email}</strong> con los detalles.
          </p>
          <div class="bg-humo/20 p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
            <h3 class="font-semibold mb-4">Resumen del pedido</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-ceniza">Nombre:</span>
                <span>{contactInfo.nombre}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ceniza">Envío:</span>
                <span>{shippingInfo.ciudad}, {shippingInfo.departamento}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ceniza">Método de pago:</span>
                <span class="capitalize">{paymentInfo.metodo}</span>
              </div>
              <div class="border-t border-humo/50 pt-2 mt-4 flex justify-between font-semibold">
                <span>Total:</span>
                <span class="text-tabacco">{formatCOP(total)}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4 max-w-md mx-auto">
            <Button onClick={() => window.open(`https://wa.me/573172137932?text=Hola, acabo de hacer un pedido y me gustaría confirmar`, '_blank')}>
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmar por WhatsApp
            </Button>
            <Button variant="secondary" onClick={() => window.location.href='/es/tienda'}>
              Continuar comprando
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {currentStep !== 4 && (
        <div class="flex justify-between mt-8 pt-6 border-t border-humo/30">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            ← Volver
          </Button>
          <Button onClick={handleNext} disabled={isProcessing}>
            {isProcessing ? (
              <span>Procesando...</span>
            ) : currentStep === 3 ? (
              'Pagar ahora'
            ) : (
              'Continuar →'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}