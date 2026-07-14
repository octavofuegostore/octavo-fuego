import { describe, it, expect } from 'vitest';
import { products } from '@/data/products';
import { locales, type Locale } from '@/i18n';
import { generateLlmsTxt, generateLlmsFullTxt } from './llms';

describe('llms.txt', () => {
  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const output = generateLlmsTxt(locale);

      it('includes all 5 product names and their PDP links', () => {
        for (const product of products) {
          expect(output).toContain(product.nombre[locale]);
          expect(output).toContain(`/tienda/rape/${product.slug}`);
        }
      });

      it('includes blog and profecia links', () => {
        expect(output).toContain('/blog');
        expect(output).toContain('/profecia');
      });

      it('is valid UTF-8 with zero HTML', () => {
        expect(output).not.toContain('<');
        expect(output).not.toContain('>');
        expect(output).not.toContain('&amp;');
        expect(output).not.toContain('&lt;');
        expect(output).not.toContain('&gt;');
      });

      it('starts with the summary line', () => {
        expect(output).toMatch(/^# Octavo Fuego/);
      });

      it('has correct URL prefix for the locale', () => {
        const expectedPrefix = locale === 'es'
          ? 'https://octavofuego.com/tienda'
          : `https://octavofuego.com/${locale}/tienda`;
        expect(output).toContain(expectedPrefix);
      });
    });
  }
});

describe('llms-full.txt', () => {
  for (const locale of locales) {
    describe(`locale: ${locale}`, () => {
      const output = generateLlmsFullTxt(locale);

      it('has 5 product sections', () => {
        let sectionCount = 0;
        for (const line of output.split('\n')) {
          if (line.startsWith('### ')) sectionCount++;
        }
        expect(sectionCount).toBe(5);
      });

      it('includes product name, prices, and description for each product', () => {
        for (const product of products) {
          expect(output).toContain(product.nombre[locale]);
          expect(output).toContain(product.overview[locale]);
          // Prices are formatted with thousands separators: $35.000 COP
          expect(output).toContain('$35.000');
          expect(output).toContain('$70.000');
          expect(output).toContain('$100.000');
        }
      });

      it('is valid UTF-8 with zero HTML', () => {
        expect(output).not.toContain('<');
        expect(output).not.toContain('>');
        expect(output).not.toContain('&amp;');
        expect(output).not.toContain('&lt;');
        expect(output).not.toContain('&gt;');
      });

      it('starts with the main title', () => {
        expect(output).toMatch(/^# Octavo Fuego/);
      });

      it('has a translated Products section header', () => {
        // Each locale has its own translation for "sectionProducts"
        // ES: Productos, EN: Products, PT: Produtos
        const headerPatterns: Record<Locale, string> = {
          es: '## Productos',
          en: '## Products',
          pt: '## Produtos',
        };
        expect(output).toContain(headerPatterns[locale]);
      });
    });
  }
});
