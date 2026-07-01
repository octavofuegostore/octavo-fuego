/**
 * BodegaSwitcher — React island for multi-warehouse selection.
 *
 * Reads/writes `of_admin_bodega` cookie (non-httpOnly).
 * On change, reloads the page so the new bodega context applies.
 */

import { useState, useCallback, useEffect } from 'react';

// ─── Bodega data (sync with src/lib/admin/bodega.ts) ─────────────────────────

interface BodegaOption {
  id: string;
  codigo: string;
  nombre: string;
  pais: string;
}

const BODEGAS: BodegaOption[] = [
  { id: '', codigo: 'GLOBAL', nombre: 'Todas las bodegas', pais: '' },
  { id: 'CO-BOGOTA', codigo: 'CO-BOGOTA', nombre: 'Bogotá', pais: 'CO' },
  { id: 'BR-ACRE', codigo: 'BR-ACRE', nombre: 'Acre', pais: 'BR' },
];

// ─── Cookie helpers (no external dep needed) ──────────────────────────────────

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
}

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; sameSite=lax`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BodegaSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<BodegaOption>(() => {
    const cookie = getCookie('of_admin_bodega');
    return BODEGAS.find((b) => b.id === cookie) || BODEGAS[0];
  });

  const handleSelect = useCallback((option: BodegaOption) => {
    setSelected(option);
    setCookie('of_admin_bodega', option.id);
    setIsOpen(false);
    // Reload so the server picks up the new cookie
    window.location.reload();
  }, []);

  // Sync selection if cookie changed externally
  useEffect(() => {
    const cookie = getCookie('of_admin_bodega');
    const match = BODEGAS.find((b) => b.id === cookie);
    if (match && match.id !== selected.id) {
      setSelected(match);
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setIsOpen(false);
    document.addEventListener('click', handler, { once: true });
    return () => document.removeEventListener('click', handler);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-1.5 border border-papel rounded-lg text-sm text-humo hover:border-tabacco/30 hover:text-tabacco transition-colors"
        title="Seleccionar bodega"
      >
        {/* Location icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{selected.nombre}</span>
        {selected.pais && (
          <span className="text-ceniza text-xs">{selected.pais}</span>
        )}
        <svg
          className={`w-3 h-3 text-ceniza transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-papel rounded-lg shadow-lg z-50 py-1">
          {BODEGAS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                option.id === selected.id
                  ? 'bg-tabacco/10 text-tabacco font-medium'
                  : 'text-humo hover:bg-papel/50'
              }`}
            >
              {option.pais ? (
                <span className="w-6 h-6 rounded-full bg-papel flex items-center justify-center text-xs font-medium text-ceniza">
                  {option.pais}
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full bg-papel flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-ceniza" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate">{option.nombre}</p>
                {option.pais && (
                  <p className="text-xs text-ceniza truncate">
                    {option.id}
                  </p>
                )}
              </div>
              {option.id === selected.id && (
                <svg className="w-4 h-4 text-tabacco flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
