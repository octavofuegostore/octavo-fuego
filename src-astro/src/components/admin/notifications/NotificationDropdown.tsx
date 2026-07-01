/**
 * NotificationDropdown — React island for header notifications.
 *
 * Shows bell icon with unread count badge.
 * Dropdown panel with notification list, mark-as-read, and "mark all read".
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  link: string | null;
  leida: boolean;
  creado_en: string;
}

interface Props {
  notificaciones: Notificacion[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'ahora';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay === 1) return 'ayer';
  if (diffDay < 7) return `${diffDay}d`;
  return new Date(isoDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function notificationIcon(tipo: string): string {
  if (tipo.includes('orden')) return 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z';
  if (tipo.includes('b2b')) return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z';
  if (tipo.includes('stock')) return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
  if (tipo.includes('pago')) return 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z';
  return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}

function notificationColor(tipo: string): string {
  if (tipo.includes('orden')) return 'text-tabacco';
  if (tipo.includes('b2b')) return 'text-blue-500';
  if (tipo.includes('stock')) return 'text-amber-500';
  if (tipo.includes('pago')) return 'text-green-500';
  return 'text-ceniza';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationDropdown({ notificaciones: initial }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(initial);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    try {
      await fetch('/api/notificaciones/leer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Silent fail — optimistic update already applied
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    try {
      await fetch('/api/notificaciones/leer-todas', {
        method: 'POST',
      });
    } catch {
      // Silent fail
    }
  }, []);

  const handleClick = useCallback((notif: Notificacion) => {
    markAsRead(notif.id);
    if (notif.link) {
      window.location.href = notif.link;
    }
  }, [markAsRead]);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-humo hover:text-tabacco transition-colors"
        title="Notificaciones"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-tabacco text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-papel z-50 overflow-hidden"
          style={{ boxShadow: 'var(--shadow-hover, rgba(0,0,0,0.08) 0 4px 12px)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-papel flex items-center justify-between">
            <h3 className="font-medium text-humo text-sm">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-tabacco hover:underline"
              >
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="py-8 text-center">
                <svg className="w-8 h-8 text-ceniza mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-ceniza">No hay notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-papel/50 transition-colors border-b border-papel/50 last:border-0 ${
                    !notif.leida ? 'bg-tabacco/[0.03]' : ''
                  }`}
                >
                  {/* Unread accent bar */}
                  {!notif.leida && (
                    <div className="w-0.5 self-stretch rounded-full bg-tabacco flex-shrink-0" />
                  )}

                  {/* Icon */}
                  <div className={`flex-shrink-0 mt-0.5 ${notificationColor(notif.tipo)}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notificationIcon(notif.tipo)} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.leida ? 'font-semibold text-humo' : 'text-humo'}`}>
                      {notif.titulo}
                    </p>
                    {notif.mensaje && (
                      <p className="text-xs text-ceniza truncate mt-0.5">{notif.mensaje}</p>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-ceniza whitespace-nowrap flex-shrink-0">
                    {relativeTime(notif.creado_en)}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notificaciones.length > 0 && (
            <div className="px-4 py-2.5 border-t border-papel text-center">
              <a href="/admin/actividad" className="text-xs text-tabacco hover:underline">
                Ver todo el registro de actividad
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
