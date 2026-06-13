"use client"

import { useState } from 'react';
import { addToCart, type CartItem } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  product: {
    id: string;
    variantId: string;
    nombre: string;
    nombreEn?: string;
    nombrePt?: string;
    etnia: string;
    tipo: 'rape' | 'sananga' | 'kuripe' | 'accesorio';
    precio: number;
    imagen: string;
    slug: string;
  };
  quantity?: number;
  className?: string;
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartItem: CartItem = {
      id: product.id,
      variantId: product.variantId,
      nombre: product.nombre,
      nombreEn: product.nombreEn || product.nombre,
      nombrePt: product.nombrePt || product.nombre,
      etnia: product.etnia,
      tipo: product.tipo,
      precio: product.precio,
      cantidad: quantity,
      imagen: product.imagen,
      slug: product.slug,
    };

    addToCart(cartItem);

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isAdding}
      className={className}
      size="lg"
    >
      {isAdding ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Añadiendo...
        </span>
      ) : (
        'Añadir al Carrito'
      )}
    </Button>
  );
}

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  className 
}: QuantitySelectorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-ceniza">Cantidad:</span>
      <div className="flex items-center border border-humo">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center text-ceniza hover:text-white hover:border-tabacco transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reducir cantidad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-12 text-center border-x border-humo py-2">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center text-ceniza hover:text-white hover:border-tabacco transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar cantidad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
