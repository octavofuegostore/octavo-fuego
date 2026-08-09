import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Compliance guard for the pre-launch trust hotfix.
 *
 * Locks in the removal of fabricated/unverifiable claims from production
 * content: fake reviews, free-shipping promises, competitor price
 * comparisons, superlative "best price" claims, and placeholder lorem
 * ipsum. If any of these strings reappear in i18n or the PDP, the test
 * fails and the claim must be reviewed before launch.
 */

const locales = ['es', 'en', 'pt'] as const;

const forbiddenPerLocale: Record<(typeof locales)[number], string[]> = {
  es: ['46%', 'más barato', 'mejor precio', 'envío gratuito', 'lorem ipsum'],
  en: ['46%', 'cheaper', 'best price', 'free shipping', 'lorem ipsum'],
  pt: ['46%', 'mais barato', 'melhor preço', 'frete grátis', 'lorem ipsum'],
};

const i18nDir = resolve(process.cwd(), 'src/i18n');
const pdpPath = resolve(process.cwd(), 'src/pages/[locale]/tienda/rape/[product].astro');

describe('claims compliance: i18n content', () => {
  for (const locale of locales) {
    it(`${locale}.json contains no fabricated or unverifiable claims`, () => {
      const raw = readFileSync(resolve(i18nDir, `${locale}.json`), 'utf-8').toLowerCase();
      for (const phrase of forbiddenPerLocale[locale]) {
        expect(raw, `forbidden phrase "${phrase}" in ${locale}.json`).not.toContain(phrase);
      }
    });
  }
});

describe('claims compliance: product detail page', () => {
  const pdp = readFileSync(pdpPath, 'utf-8');

  it('does not promise free shipping (no shipping system exists yet)', () => {
    const lower = pdp.toLowerCase();
    expect(lower).not.toContain('envío gratuito');
    expect(lower).not.toContain('free shipping');
    expect(lower).not.toContain('frete grátis');
  });

  it('does not emit a fabricated aggregate rating or hardcoded reviewer names', () => {
    expect(pdp).not.toContain('ReviewJsonLd');
    expect(pdp).not.toContain('Mateo');
  });
});
