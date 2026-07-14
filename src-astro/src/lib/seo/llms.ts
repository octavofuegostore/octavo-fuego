/**
 * llms.txt / llms-full.txt content generators.
 * One function per file, consumed by routes + tests.
 */
import { products } from '@/data/products';
import { useTranslations, type Locale } from '@/i18n';

const BASE_URL = 'https://octavofuego.com';

function prefix(locale: Locale): string {
  return locale === 'es' ? '' : `/${locale}`;
}

function formatCop(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Generates the llms.txt content for a single locale.
 * Full sections: Products (with descriptions), Docs, Key Facts, Contact.
 */
export function generateLlmsTxt(locale: Locale): string {
  const p = prefix(locale);
  const lines: string[] = [];

  lines.push('# Octavo Fuego — Rapé do Acre, Sananga y Kuripes. Medicinas ancestrales amazónicas con propósito.');
  lines.push('');

  // Products section
  lines.push('## Products');
  lines.push('');
  for (const product of products) {
    const url = `${BASE_URL}${p}/tienda/rape/${product.slug}`;
    lines.push(`- [${product.nombre[locale]}](${url}): ${product.overview[locale]}`);
  }
  lines.push(`- [Tienda completa](${BASE_URL}${p}/tienda): Catálogo completo de rapés con precios, descripciones e información por variedad.`);
  lines.push('');

  // Docs section
  lines.push('## Docs');
  lines.push('');
  lines.push(`- [Home](${BASE_URL}${p}): Página principal.`);
  lines.push(`- [Sobre Nosotros](${BASE_URL}${p}/nosotros): Historia y misión.`);
  lines.push(`- [Profecía de los Siete Fuegos](${BASE_URL}${p}/profecia): Texto completo de la profecía.`);
  lines.push(`- [FAQ](${BASE_URL}${p}/faq): Preguntas frecuentes sobre rapé.`);
  lines.push(`- [Envíos](${BASE_URL}${p}/envios): Políticas de envío.`);
  lines.push(`- [Blog](${BASE_URL}${p}/blog): Artículos y guías.`);
  lines.push(`- [Qué es el Rapé](${BASE_URL}${p}/que-es-el-rape): Guía completa sobre el rapé amazónico.`);
  lines.push(`- [Origen del Rapé do Acre](${BASE_URL}${p}/rape-do-acre-origen): Historia y significado cultural.`);
  lines.push(`- [Cómo Usar el Rapé](${BASE_URL}${p}/como-usar-el-rape): Instrucciones paso a paso.`);
  lines.push('');

  // Key Facts
  lines.push('## Key Facts');
  lines.push('');
  lines.push('- Fundado en 2026 por Octavo Fuego');
  lines.push('- Sede operativa: Colombia (envíos a Colombia y Brasil)');
  lines.push('- Productos: Rapé do Acre (5 variedades), Sananga, Kuripes/Kuripe');
  lines.push('- Variedades de rapé: Tsunú, Pixurí, Pariká, Cumarú de Cheiro, Vena de Pajé');
  lines.push('- Presentaciones: 10g, 20g, 30g por variedad');
  lines.push('- Industria: Medicinas ancestrales / Ecommerce ceremonial');
  lines.push('- Diferenciador: Rapé artesanal directo de comunidades tradicionales de Acre, Amazonía brasileña');
  lines.push('');

  // Contact
  lines.push('## Contact');
  lines.push('');
  lines.push(`- Website: ${BASE_URL}${p}`);
  lines.push('- Email: hola@octavofuego.com');
  lines.push('- WhatsApp: https://wa.me/573172137932');
  lines.push('- Instagram: https://instagram.com/octavofuego');
  if (locale !== 'es') lines.push(`- Spanish: ${BASE_URL}`);
  if (locale !== 'en') lines.push(`- English: ${BASE_URL}/en`);
  if (locale !== 'pt') lines.push(`- Portuguese: ${BASE_URL}/pt`);

  return lines.join('\n') + '\n';
}

/**
 * Generates the llms-full.txt content for a single locale.
 * Section per product: name, price tiers (10g / 20g / 30g COP), description.
 * Section headers use i18n strings for locale awareness.
 */
export function generateLlmsFullTxt(locale: Locale): string {
  const t = useTranslations(locale);
  const lines: string[] = [];

  lines.push(`# ${t.llms.title}`);
  lines.push('');
  lines.push(`## ${t.llms.sectionProducts}`);
  lines.push('');

  for (const product of products) {
    const prices = product.pricing
      .map((p) => `${p.label} — $${formatCop(p.precio)} COP`)
      .join(', ');

    lines.push(`### ${product.nombre[locale]}`);
    lines.push('');
    lines.push(`- **${t.llms.labelName}**: ${product.nombre[locale]}`);
    lines.push(`- **${t.llms.labelPrices}**: ${prices}`);
    lines.push(`- **${t.llms.labelDescription}**: ${product.overview[locale]}`);
    lines.push('');
  }

  return lines.join('\n') + '\n';
}
