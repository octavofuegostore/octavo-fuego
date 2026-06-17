/**
 * L-Medusa Region Module
 *
 * Usage:
 *   import { region, REGION_MAP, REGION_DEFAULT } from '@/lib/region';
 *
 *   const region = await region.getRegionByCodigo('CO');
 *   const envio = await region.calcularEnvio(regionId, 200);
 *   const usd = await region.convertCurrency(35000, 'COP', 'USD');
 */

export { getRegionService as region } from './service';
export {
  type Region,
  type RegionCodigo,
  type ConversionFactor,
  type TarifaEnvio,
  type RegionContext,
  type RegionService,
  REGION_DEFAULT,
  CURRENCY_DEFAULT,
  REGION_MAP,
} from './types';
