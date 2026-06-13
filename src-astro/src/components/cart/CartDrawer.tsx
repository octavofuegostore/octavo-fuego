"use client"

import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, formatCOP, type CartItem } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);
  const count = useStore(cartCount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-humo border-l border-humo/50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-humo/50">
          <h2 className="font-display text-xl font-semibold">
            Tu Carrito ({count})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-ceniza hover:text-white transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ceniza mb-4">Tu carrito está vacío</p>
              <Button variant="secondary" onClick={onClose}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.variantId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-humo/50 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-ceniza">Subtotal</span>
              <span className="font-semibold text-lg">{formatCOP(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ceniza">Envío</span>
              <span className="text-success">Gratis</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-humo/50">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold text-tabacco">
                {formatCOP(total)}
              </span>
            </div>
            <Button className="w-full" size="lg">
              Ir al Checkout
            </Button>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Continuar comprando
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, cantidad: number) => void;
  onRemove: (variantId: string) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-black/20 border border-humo/30">
      {/* Image */}
      <div className="w-20 h-20 bg-humo/50 flex-shrink-0">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.nombre}</h3>
        <p className="text-ceniza text-xs">{item.etnia}</p>
        <p className="text-tabacco text-sm font-semibold mt-1">
          {formatCOP(item.precio)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.variantId, item.cantidad - 1)}
            className="w-8 h-8 flex items-center justify-center border border-humo hover:border-tabacco transition-colors"
            aria-label="Reducir cantidad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-8 text-center text-sm">{item.cantidad}</span>
          <button
            onClick={() => onUpdateQuantity(item.variantId, item.cantidad + 1)}
            className="w-8 h-8 flex items-center justify-center border border-humo hover:border-tabacco transition-colors"
            aria-label="Aumentar cantidad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(item.variantId)}
            className="ml-auto p-2 text-ceniza hover:text-error transition-colors"
            aria-label="Eliminar producto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export { CartItemCard };
