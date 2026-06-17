/**
 * L-Medusa Region Service
 * Adapted from MedusaJS v2: packages/core/src/services/pricing.ts
 *
 * Provider: Supabase (database)
 *
 * Rules:
 * - CO: ships only to CO, from CO-BOGOTA, Wompi (COP)
 * - BR: ships to BR, from BR-ACRE, Stripe + Pix (BRL)
 * - EU/US: ships internationally from BR-ACRE, Stripe (USD)
 */

import {
  type Region,
  type RegionService,
  type RegionCodigo,
  type ConversionFactor,
  type TarifaEnvio,
  REGION_DEFAULT,
  CURRENCY_DEFAULT,
} from './types';
import { supabase } from '../supabase';

// ─── Implementation ──────────────────────────────────────────────────────────

class SupabaseRegionService implements RegionService {
  async getRegionByCodigo(codigo: RegionCodigo): Promise<Region | null> {
    const { data, error } = await supabase
      .from('regiones')
      .select('*')
      .eq('codigo', codigo)
      .eq('activa', true)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getRegionById(id: string): Promise<Region | null> {
    const { data, error } = await supabase
      .from('regiones')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getAllRegions(): Promise<Region[]> {
    const { data, error } = await supabase
      .from('regiones')
      .select('*')
      .eq('activa', true)
      .order('codigo');

    if (error || !data) return [];
    return data;
  }

  async detectRegionFromHeaders(headers: Headers): Promise<Region> {
    // 1. Try Accept-Language header
    const acceptLang = headers.get('Accept-Language') || '';

    // 2. Map language to region
    if (acceptLang.includes('pt')) {
      return (await this.getRegionByCodigo('BR')) || (await this.getRegionByCodigo(REGION_DEFAULT))!;
    }

    if (acceptLang.includes('es')) {
      return (await this.getRegionByCodigo('CO')) || (await this.getRegionByCodigo(REGION_DEFAULT))!;
    }

    // 3. Default to EU/US for English speakers
    return (await this.getRegionByCodigo('EU')) || (await this.getRegionByCodigo(REGION_DEFAULT))!;
  }

  async getConversionFactor(monedaOrigen: string, monedaDestino: string): Promise<number> {
    if (monedaOrigen === monedaDestino) return 1;

    const { data, error } = await supabase
      .from('factores_conversion')
      .select('factor')
      .eq('moneda_origen', monedaOrigen)
      .eq('moneda_destino', monedaDestino)
      .single();

    if (error || !data) {
      console.warn(`No conversion factor found for ${monedaOrigen} → ${monedaDestino}`);
      return 1;
    }

    return data.factor;
  }

  async convertCurrency(
    amount: number,
    monedaOrigen: string,
    monedaDestino: string
  ): Promise<number> {
    const factor = await this.getConversionFactor(monedaOrigen, monedaDestino);
    return Math.round(amount * factor * 100) / 100;
  }

  async getTarifaEnvio(regionId: string, gramos: number): Promise<TarifaEnvio | null> {
    const { data, error } = await supabase
      .from('tarifas_envio')
      .select('*')
      .eq('region_id', regionId)
      .lte('min_gramos', gramos)
      .gte('max_gramos', gramos)
      .single();

    if (error || !data) return null;
    return data;
  }

  async calcularEnvio(regionId: string, gramos: number): Promise<number> {
    const tarifa = await this.getTarifaEnvio(regionId, gramos);
    if (!tarifa) return 0;

    return tarifa.tarifa_fija + (tarifa.tarifa_por_gramo * gramos);
  }
}

// ─── Mock Implementation (for testing without Supabase) ──────────────────────

class MockRegionService implements RegionService {
  private regions: Region[] = [
    {
      id: 'reg_co',
      codigo: 'CO',
      nombre: 'Colombia',
      moneda: 'COP',
      idioma: 'es',
      gateway: 'wompi',
      bodega_default: 'bod_co_bogota',
      activa: true,
    },
    {
      id: 'reg_br',
      codigo: 'BR',
      nombre: 'Brasil',
      moneda: 'BRL',
      idioma: 'pt',
      gateway: 'stripe',
      bodega_default: 'bod_br_acre',
      activa: true,
    },
    {
      id: 'reg_eu',
      codigo: 'EU',
      nombre: 'Europa',
      moneda: 'USD',
      idioma: 'en',
      gateway: 'stripe',
      bodega_default: 'bod_br_acre',
      activa: true,
    },
    {
      id: 'reg_us',
      codigo: 'US',
      nombre: 'Estados Unidos',
      moneda: 'USD',
      idioma: 'en',
      gateway: 'stripe',
      bodega_default: 'bod_br_acre',
      activa: true,
    },
  ];

  private conversionFactors: ConversionFactor[] = [
    { id: 'cf1', moneda_origen: 'BRL', moneda_destino: 'USD', factor: 0.2020, actualizado_en: new Date().toISOString() },
    { id: 'cf2', moneda_origen: 'COP', moneda_destino: 'USD', factor: 0.00024, actualizado_en: new Date().toISOString() },
    { id: 'cf3', moneda_origen: 'BRL', moneda_destino: 'COP', factor: 833.00, actualizado_en: new Date().toISOString() },
    { id: 'cf4', moneda_origen: 'USD', moneda_destino: 'COP', factor: 4166.00, actualizado_en: new Date().toISOString() },
  ];

  private tarifasEnvio: TarifaEnvio[] = [
    // CO (local)
    { id: 'te1', region_id: 'reg_co', min_gramos: 1, max_gramos: 500, tarifa_fija: 5000, tarifa_por_gramo: 10, tiempo_estimado: '3-5 días hábiles' },
    { id: 'te2', region_id: 'reg_co', min_gramos: 501, max_gramos: 2000, tarifa_fija: 8000, tarifa_por_gramo: 5, tiempo_estimado: '3-5 días hábiles' },
    { id: 'te3', region_id: 'reg_co', min_gramos: 2001, max_gramos: 99999, tarifa_fija: 12000, tarifa_por_gramo: 0, tiempo_estimado: '3-5 días hábiles' },
    // BR (nacional)
    { id: 'te4', region_id: 'reg_br', min_gramos: 1, max_gramos: 500, tarifa_fija: 25, tarifa_por_gramo: 0.05, tiempo_estimado: '3-7 días hábiles' },
    { id: 'te5', region_id: 'reg_br', min_gramos: 501, max_gramos: 2000, tarifa_fija: 40, tarifa_por_gramo: 0.02, tiempo_estimado: '3-7 días hábiles' },
    { id: 'te6', region_id: 'reg_br', min_gramos: 2001, max_gramos: 99999, tarifa_fija: 60, tarifa_por_gramo: 0, tiempo_estimado: '3-7 días hábiles' },
    // EU (internacional)
    { id: 'te7', region_id: 'reg_eu', min_gramos: 1, max_gramos: 500, tarifa_fija: 25, tarifa_por_gramo: 0.10, tiempo_estimado: '7-14 días hábiles' },
    { id: 'te8', region_id: 'reg_eu', min_gramos: 501, max_gramos: 2000, tarifa_fija: 35, tarifa_por_gramo: 0.05, tiempo_estimado: '7-14 días hábiles' },
    // US (internacional)
    { id: 'te9', region_id: 'reg_us', min_gramos: 1, max_gramos: 500, tarifa_fija: 25, tarifa_por_gramo: 0.10, tiempo_estimado: '7-14 días hábiles' },
    { id: 'te10', region_id: 'reg_us', min_gramos: 501, max_gramos: 2000, tarifa_fija: 35, tarifa_por_gramo: 0.05, tiempo_estimado: '7-14 días hábiles' },
  ];

  async getRegionByCodigo(codigo: RegionCodigo): Promise<Region | null> {
    return this.regions.find(r => r.codigo === codigo) || null;
  }

  async getRegionById(id: string): Promise<Region | null> {
    return this.regions.find(r => r.id === id) || null;
  }

  async getAllRegions(): Promise<Region[]> {
    return this.regions.filter(r => r.activa);
  }

  async detectRegionFromHeaders(headers: Headers): Promise<Region> {
    const acceptLang = headers.get('Accept-Language') || '';

    if (acceptLang.includes('pt')) {
      return this.regions.find(r => r.codigo === 'BR') || this.regions[0];
    }

    if (acceptLang.includes('es')) {
      return this.regions.find(r => r.codigo === 'CO') || this.regions[0];
    }

    return this.regions.find(r => r.codigo === 'EU') || this.regions[0];
  }

  async getConversionFactor(monedaOrigen: string, monedaDestino: string): Promise<number> {
    if (monedaOrigen === monedaDestino) return 1;

    const factor = this.conversionFactors.find(
      cf => cf.moneda_origen === monedaOrigen && cf.moneda_destino === monedaDestino
    );

    return factor?.factor || 1;
  }

  async convertCurrency(amount: number, monedaOrigen: string, monedaDestino: string): Promise<number> {
    const factor = await this.getConversionFactor(monedaOrigen, monedaDestino);
    return Math.round(amount * factor * 100) / 100;
  }

  async getTarifaEnvio(regionId: string, gramos: number): Promise<TarifaEnvio | null> {
    return this.tarifasEnvio.find(
      t => t.region_id === regionId && t.min_gramos <= gramos && t.max_gramos >= gramos
    ) || null;
  }

  async calcularEnvio(regionId: string, gramos: number): Promise<number> {
    const tarifa = await this.getTarifaEnvio(regionId, gramos);
    if (!tarifa) return 0;

    return tarifa.tarifa_fija + (tarifa.tarifa_por_gramo * gramos);
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: RegionService | null = null;

export function getRegionService(): RegionService {
  if (_service) return _service;

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

  if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co') {
    _service = new SupabaseRegionService();
  } else {
    _service = new MockRegionService();
  }

  return _service;
}
