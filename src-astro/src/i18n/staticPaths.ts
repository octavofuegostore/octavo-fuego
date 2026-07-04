import { locales } from './index';

/**
 * Shared getStaticPaths helper for [locale]/ pages.
 * Generates paths for all 3 locales (es, en, pt).
 * Use in pages like /[locale]/nosotros.astro, /[locale]/contacto.astro, etc.
 */
export function getLocaleStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}
