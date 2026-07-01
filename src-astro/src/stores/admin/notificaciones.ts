import { atom, computed } from 'nanostores'

export interface NotificacionUI {
  id: string
  titulo: string
  leida: boolean
  creado_en: string
}

export const $notificaciones = atom<NotificacionUI[]>([])

export const $noLeidas = computed($notificaciones, n =>
  n.filter(x => !x.leida).length,
)

export function setNotificaciones(list: NotificacionUI[]): void {
  $notificaciones.set(list)
}

export function marcarLeida(id: string): void {
  const current = $notificaciones.get()
  $notificaciones.set(
    current.map(n => n.id === id ? { ...n, leida: true } : n),
  )
}
