/**
 * Currency formatting helper using Intl.NumberFormat.
 *
 * Supports COP, BRL, USD with locale-aware formatting.
 * Use in Astro components (.astro) and React islands (.tsx).
 */

type CurrencyCode = 'COP' | 'BRL' | 'USD' | 'EUR';

interface FormatOptions {
  locale?: string;
  showCode?: boolean;
  decimals?: number;
}

const LOCALE_MAP: Record<CurrencyCode, string> = {
  COP: 'es-CO',
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
};

/**
 * Format a numeric amount for display.
 *
 * @example
 *   formatCurrency(45000, 'COP')        // → "$45.000"
 *   formatCurrency(89, 'BRL')           // → "R$89,00"
 *   formatCurrency(12, 'USD')           // → "$12.00"
 *   formatCurrency(45000, 'COP', { showCode: true }) // → "$45.000 COP"
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  options: FormatOptions = {},
): string {
  const { locale = LOCALE_MAP[currency], showCode = false, decimals } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ?? (currency === 'COP' ? 0 : 2),
    maximumFractionDigits: decimals ?? (currency === 'COP' ? 0 : 2),
  }).format(amount);

  if (showCode) {
    return `${formatted} ${currency}`;
  }

  return formatted;
}

/**
 * Format an amount in the user's locale (or a given locale).
 * Auto-detects currency from location if not provided.
 *
 * @example
 *   formatForLocation(45000, 'CO')  // → "$45.000"
 *   formatForLocation(89, 'BR')     // → "R$89,00"
 */
export function formatForLocation(
  amount: number,
  location: string,
): string {
  const currencyMap: Record<string, CurrencyCode> = {
    CO: 'COP',
    BR: 'BRL',
    US: 'USD',
    EU: 'EUR',
  };

  const currency = currencyMap[location] || 'USD';
  return formatCurrency(amount, currency);
}

/**
 * Parse a formatted currency string back to a number.
 * Handles locale-specific formats like "$45.000" or "R$89,00".
 *
 * @example
 *   parseCurrency("$45.000")    // → 45000
 *   parseCurrency("R$89,00")    // → 89
 */
export function parseCurrency(formatted: string): number {
  const cleaned = formatted.replace(/[^\d,.-]/g, '');

  // Detect Brazilian format (12.345,67 → 12345.67)
  if (cleaned.includes(',') && cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
    return Number(cleaned.replace(/\./g, '').replace(',', '.'));
  }

  // Standard format
  return Number(cleaned.replace(/,/g, ''));
}
