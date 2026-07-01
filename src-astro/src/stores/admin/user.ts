import { atom } from 'nanostores'

export interface AdminUser {
  id: string
  email: string
  nombre: string
  role: 'admin' | 'b2b_client' | 'viewer'
}

export const $adminUser = atom<AdminUser | null>(null)

export function setAdminUser(user: AdminUser): void {
  $adminUser.set(user)
}

export function clearAdminUser(): void {
  $adminUser.set(null)
}
