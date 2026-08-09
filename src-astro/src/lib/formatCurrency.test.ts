import { describe, it, expect } from 'vitest';
import { formatCurrency, formatForLocation, parseCurrency } from './formatCurrency';

describe('formatCurrency()', () => {
  it('formats COP without decimals', () => {
    const result = formatCurrency(45000, 'COP');
    expect(result).toMatch(/^[\$]/);
    expect(result).not.toContain(',');
  });

  it('formats BRL with 2 decimals and comma separator', () => {
    const result = formatCurrency(89, 'BRL');
    expect(result).toContain(',');
  });

  it('formats USD with 2 decimals', () => {
    const result = formatCurrency(12, 'USD');
    expect(result).toMatch(/\.\d{2}/);
  });

  it('includes currency code when showCode is true', () => {
    const result = formatCurrency(45000, 'COP', { showCode: true });
    expect(result).toContain('COP');
  });

  it('returns "$0" for zero in COP', () => {
    expect(formatCurrency(0, 'COP')).toMatch(/0/);
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-1000, 'COP')).toContain('-');
  });
});

describe('formatForLocation()', () => {
  it('formats for Colombia (COP)', () => {
    const result = formatForLocation(45000, 'CO');
    expect(result).toMatch(/^[\$]/);
  });

  it('formats for Brazil (BRL)', () => {
    const result = formatForLocation(89, 'BR');
    expect(result).toContain('R$');
  });

  it('formats for US (USD)', () => {
    const result = formatForLocation(12, 'US');
    expect(result).toMatch(/^\$/);
  });

  it('defaults to USD for unknown locations', () => {
    const result = formatForLocation(10, 'XX');
    expect(result).toMatch(/\.\d{2}/);
  });
});

describe('parseCurrency()', () => {
  it('parses plain numeric string without separators', () => {
    expect(parseCurrency('$45000')).toBe(45000);
  });

  it('parses Brazilian format like "R$89,00"', () => {
    expect(parseCurrency('R$89,00')).toBe(89);
  });

  it('parses zero', () => {
    expect(parseCurrency('$0')).toBe(0);
  });
});
