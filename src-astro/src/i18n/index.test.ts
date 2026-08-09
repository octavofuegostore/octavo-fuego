import { describe, it, expect } from 'vitest';
import { t, useTranslations, getLocaleFromUrl, changeLanguage } from './index';

describe('t()', () => {
  it('returns the correct translation for an existing key in default locale', () => {
    expect(t('common.brand')).toBe('Octavo Fuego');
  });

  it('returns the translation for the requested locale', () => {
    expect(t('common.brand', 'en')).toBe('Octavo Fuego');
    expect(t('nav.tienda', 'en')).toBe('Shop');
  });

  it('falls back to the key when translation is missing entirely', () => {
    expect(t('does.not.exist')).toBe('does.not.exist');
  });

  it('resolves keys in non-default locales', () => {
    // NOTE: All 3 locale files share the exact same keys, so the fallback
    // path (key missing in target locale → resolve from es) cannot be
    // exercised with current data. This test confirms the happy path works.
    const ptResult = t('common.brand', 'pt');
    expect(ptResult).toBe('Octavo Fuego');
  });
});

describe('useTranslations()', () => {
  it('returns Spanish translations by default', () => {
    const tr = useTranslations();
    expect(tr.common.brand).toBe('Octavo Fuego');
  });

  it('returns English translations when specified', () => {
    const tr = useTranslations('en');
    expect(tr.nav.tienda).toBe('Shop');
  });
});

describe('getLocaleFromUrl()', () => {
  it('parses locale from URL pathname', () => {
    const url = new URL('https://example.com/en/tienda');
    expect(getLocaleFromUrl(url)).toBe('en');
  });

  it('returns default locale when no locale in URL', () => {
    const url = new URL('https://example.com/tienda');
    expect(getLocaleFromUrl(url)).toBe('es');
  });
});

describe('changeLanguage()', () => {
  it('strips the locale prefix when switching to default locale (es)', () => {
    expect(changeLanguage('es', '/en/tienda')).toBe('/tienda');
  });

  it('adds locale prefix for non-default locales', () => {
    expect(changeLanguage('en', '/tienda')).toBe('/en/tienda');
  });
});
