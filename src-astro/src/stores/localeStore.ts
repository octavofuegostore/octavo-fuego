import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { t, type Locale } from '@/i18n';

export type { Locale };

export const localeStore = atom<Locale>('es');

export function setLocale(locale: Locale) {
  localeStore.set(locale);
}

/**
 * React hook that returns a bound t() function using the current locale from the store.
 * Usage: const $t = useT(); $t('cart.titulo')
 */
export function useT() {
  const locale = useStore(localeStore);
  return (key: string) => t(key, locale);
}
