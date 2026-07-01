import { atom } from 'nanostores'

export const $sidebarOpen = atom(true)
export const $seccionActual = atom<string>('dashboard')

export function toggleSidebar(): void {
  $sidebarOpen.set(!$sidebarOpen.get())
}

export function navegar(seccion: string): void {
  $seccionActual.set(seccion)
}
