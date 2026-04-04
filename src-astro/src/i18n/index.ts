import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Locale = 'es' | 'en' | 'pt';

export const locales: Locale[] = ['es', 'en', 'pt'];
export const defaultLocale: Locale = 'es';

const translations = { es, en, pt };

type TranslationKeys = typeof es;

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) || path;
}

export function useTranslations(locale: Locale = defaultLocale): TranslationKeys {
  return translations[locale] || translations[defaultLocale];
}

export function t(key: string, locale: Locale = defaultLocale): string {
  const translation = getNestedValue(translations[locale], key);
  if (translation === key && locale !== defaultLocale) {
    return getNestedValue(translations[defaultLocale], key);
  }
  return translation;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (locales.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale;
}

export function changeLanguage(lang: Locale): string {
  return `/${lang}`;
}

export const languageNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};
