import { locales, type Locale } from './index';

/**
 * Builds a locale-prefixed path for use in Navbar/Footer links.
 * ES (default locale) gets no prefix per prefixDefaultLocale: false.
 * External URLs, mailto, tel, and anchor links pass through unchanged.
 */
export function localeUrl(path: string, locale: Locale): string {
  if (path.startsWith('http://') || path.startsWith('https://') ||
      path.startsWith('mailto:') || path.startsWith('#') || path.startsWith('tel:'))
    return path;
  if (locale === 'es') return path;
  return `/${locale}${path}`;
}

/**
 * Extracted and enhanced from LanguageSwitcher.astro:16-30.
 * Returns the URL for the target locale preserving the current page path.
 * @param targetLocale The locale to switch to
 * @param currentPath The current page path (e.g., /en/contacto → /pt/contacto)
 */
export function getLocaleUrl(targetLocale: Locale, currentPath: string): string {
  const segments = currentPath.split('/').filter(Boolean);

  // Remove current locale prefix if present
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }

  const rest = '/' + segments.join('/');

  // Add target locale prefix (except for 'es' which is default)
  if (targetLocale === 'es') {
    return rest;
  }
  return `/${targetLocale}${rest}`;
}
