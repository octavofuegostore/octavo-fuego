export interface Transaccion {
  id: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
}

export interface Kpis {
  ingresosMes: number;
  egresosMes: number;
  balance: number;
}

export interface BarChartData {
  label: string;
  ingreso: number;
  egreso: number;
}

export interface LineChartData {
  label: string;
  value: number;
}

// Categories
export const CATEGORIAS_INGRESO = [
  { nombre: 'Venta Rapé', subcategorias: ['Tisunú', 'Pixuri', 'Pariká', 'Cumaru de Cheiro', 'Vena de Pajé'] },
  { nombre: 'Venta Sananga', subcategorias: ['Sananga 5ml', 'Sananga 10ml'] },
  { nombre: 'Venta Kuripe/Tepi', subcategorias: ['Kuripe Clásico', 'Kuripe Doble', 'Tepi'] },
  { nombre: 'Distribución B2B', subcategorias: ['Mayorista Colombia', 'Mayorista Brasil'] },
  { nombre: 'Servicios', subcategorias: ['Ceremonias', 'Consultas', 'Talleres'] },
];

export const CATEGORIAS_EGRESO = [
  { nombre: 'Amazonía / Comunidades', subcategorias: ['Yawanawá', 'Nukini', 'Kaxinawá', 'Shanenawa', 'Logística Acre'] },
  { nombre: 'Producción', subcategorias: ['Materia Prima', 'Envases y Etiquetas', 'Herramientas'] },
  { nombre: 'Logística y Envíos', subcategorias: ['Envíos Nacionales', 'Envíos Brasil', 'Envíos Internacionales'] },
  { nombre: 'Marketing', subcategorias: ['Meta Ads', 'Google Ads', 'Contenido', 'Fotografía'] },
  { nombre: 'Infraestructura', subcategorias: ['Arriendo', 'Servicios', 'Software'] },
  { nombre: 'Nómina', subcategorias: ['Josue'] },
  { nombre: 'Impuestos', subcategorias: ['IVA', 'Renta'] },
  { nombre: 'Otros Egresos', subcategorias: ['Material Oficina', 'Viajes'] },
];

export const MEDIOS_PAGO = ['Nequi', 'Daviplata', 'Bancolombia', 'Davivienda', 'Efectivo', 'Transferencia', 'PayPal', 'Wompi'];
export const ESTADOS_IVA = ['Exento', 'Incluido', 'Discriminado', 'N/A'];

// Mock data
export const MOCK_KPIS: Kpis = {
  ingresosMes: 4500000,
  egresosMes: 2800000,
  balance: 1700000,
};

export const MOCK_GRAFICA_MENSUAL: BarChartData[] = [
  { label: 'Ene', ingreso: 3800000, egreso: 2100000 },
  { label: 'Feb', ingreso: 4200000, egreso: 2500000 },
  { label: 'Mar', ingreso: 3900000, egreso: 2300000 },
  { label: 'Abr', ingreso: 5100000, egreso: 2700000 },
  { label: 'May', ingreso: 4800000, egreso: 2900000 },
  { label: 'Jun', ingreso: 4500000, egreso: 2800000 },
];

export const MOCK_EVOLUCION_ANUAL: LineChartData[] = [
  { label: 'Ene', value: 1700000 },
  { label: 'Feb', value: 1700000 },
  { label: 'Mar', value: 1600000 },
  { label: 'Abr', value: 2400000 },
  { label: 'May', value: 1900000 },
  { label: 'Jun', value: 1700000 },
  { label: 'Jul', value: 0 },
  { label: 'Ago', value: 0 },
  { label: 'Sep', value: 0 },
  { label: 'Oct', value: 0 },
  { label: 'Nov', value: 0 },
  { label: 'Dic', value: 0 },
];

export const MOCK_TRANSACCIONES: Transaccion[] = [
  { id: '1', fecha: '2026-06-15', descripcion: 'Venta Tisunú 20g - María García', categoria: 'Venta Rapé', tipo: 'Ingreso', monto: 70000 },
  { id: '2', fecha: '2026-06-14', descripcion: 'Compra materia prima Acre', categoria: 'Producción', tipo: 'Egreso', monto: 850000 },
  { id: '3', fecha: '2026-06-12', descripcion: 'Venta Pixuri 30g - João Silva', categoria: 'Venta Rapé', tipo: 'Ingreso', monto: 100000 },
  { id: '4', fecha: '2026-06-10', descripcion: 'Pago Meta Ads junio', categoria: 'Marketing', tipo: 'Egreso', monto: 350000 },
  { id: '5', fecha: '2026-06-08', descripcion: 'Venta Kuripe Doble + Tepi', categoria: 'Venta Kuripe/Tepi', tipo: 'Ingreso', monto: 120000 },
  { id: '6', fecha: '2026-06-05', descripcion: 'Envío nacional Colombia x5', categoria: 'Logística y Envíos', tipo: 'Egreso', monto: 45000 },
  { id: '7', fecha: '2026-06-03', descripcion: 'Venta B2B - Tienda Bogotá', categoria: 'Distribución B2B', tipo: 'Ingreso', monto: 580000 },
];

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}
