/**
 * Products data — 5 rapé varieties × 3 locales (es, en, pt)
 *
 * All descriptions, highlights, and metadata are WORD-FOR-WORD from the source HTML files.
 * Each field has a `// @source:` comment for traceability.
 *
 * Source files:
 *   ES: Octavofuego_Catalogo_ESP.html
 *   EN: Octavofuego_Catalog_ENG.html
 *   PT: Octavofuego_Catalogo_PT.html
 */

import type { Locale } from '../i18n';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PriceGram {
  cantidad: number; // grams
  precio: number;   // COP
  label: string;    // e.g. "10g"
}

export interface Product {
  slug: string;
  varietyOrder: number;
  nombre: Record<Locale, string>;
  enfoque: Record<Locale, string>;
  usoRecomendado: Record<Locale, string>;
  descripcion: Record<Locale, string>;
  highlight: Record<Locale, string>;
  intensidad: {
    fuerza: Record<Locale, string>;
    aroma: Record<Locale, string>;
    nivel: Record<Locale, string>;
  };
  intentMap: string;
  pricing: PriceGram[];
  wholesale: {
    enabled: boolean;
    minGrams: number;
    pricePerGram: number;
  };
  imagenes: string[];
  metaDescription: Record<Locale, string>;
}

// ─── Fixed Pricing (same for all 5 products) ────────────────────────────────

const RAPE_PRICING: PriceGram[] = [
  { cantidad: 10, precio: 35000, label: '10g' },
  { cantidad: 20, precio: 70000, label: '20g' },
  { cantidad: 30, precio: 100000, label: '30g' },
];

const WHOLESALE = {
  enabled: true,
  minGrams: 500,
  pricePerGram: 1300,
};

// TODO: Replace with actual product images for each variety
// Currently using placeholder until product photoshoot is complete
const PLACEHOLDER_IMAGE = '/images/productos/rape/bobinsana-rape-2.webp';
const IMAGE_TISUNU = '/images/productos/rape/tisunu.webp';
const IMAGE_PIXURI = '/images/productos/rape/pixuri.webp';
const IMAGE_PARIKA = '/images/productos/rape/parika.webp';
const IMAGE_CUMARU = '/images/productos/rape/cumaru-de-cheiro.webp';
const IMAGE_VENA = '/images/productos/rape/vena-de-paje.webp';

// ─── Products ───────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TISUNÚ — Variety 01
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: 'tisunu',
    varietyOrder: 1,
    /** @source ESP.html v-name (1st) | ENG.html v-name (1st) | PT.html v-name (1st) */
    nombre: {
      es: 'Tisunú',
      en: 'Tisunú',
      pt: 'Tisunú',
    },
    /** @source ESP.html table row 1 — Enfoque Principal | ENG.html table row 1 | PT.html table row 1 */
    enfoque: {
      es: 'Energético',
      en: 'Energetic',
      pt: 'Energético',
    },
    /** @source ESP.html table row 1 — Uso Recomendado | ENG.html table row 1 | PT.html table row 1 */
    usoRecomendado: {
      es: 'Limpieza / ceremonia',
      en: 'Cleansing / Ceremony',
      pt: 'Limpeza / cerimônia',
    },
    /** @source ESP.html variety-item 1 — p.v-text | ENG.html variety-item 1 — p.v-text | PT.html variety-item 1 — p.v-text */
    descripcion: {
      es: `El rapé de Tisunú se elabora con la ceniza del árbol homónimo, considerado por las tradiciones amazónicas como el más poderoso y fuerte de la selva. Esta fortaleza se transmite directamente a la medicina, otorgándole su intensidad característica. Su preparación auténtica emplea una combinación de tabaco de moho y tabaco orgánico. Es una de las medicinas más antiguas utilizadas por los pueblos indígenas, con un enfoque primordialmente energético más que curativo a nivel físico. Se destina principalmente a limpiezas energéticas profundas, el equilibrio del mundo interior, la purificación del aura y el fortalecimiento de la conexión con la naturaleza.`,
      en: `Tisunú rapé is crafted with ash from the tree of the same name, considered by Amazonian traditions to be the most powerful and strongest tree in the rainforest. This strength is directly transmitted to the medicine, giving it its characteristic intensity. Its authentic preparation employs a combination of mold tobacco and organic tobacco. It is one of the oldest medicines used by indigenous peoples, with a primarily energetic focus rather than physical healing. It is mainly intended for deep energetic cleansing, balancing the inner world, purifying the aura, and strengthening the connection with nature.`,
      pt: `O rapé de Tisunú é elaborado com a cinza da árvore homônima, considerada pelas tradições amazônicas como a mais poderosa e forte da floresta. Esta fortaleza é transmitida diretamente à medicina, conferindo-lhe sua intensidade característica. Sua preparação autêntica emprega uma combinação de tabaco de molde e tabaco orgânico. É uma das medicinas mais antigas utilizadas pelos povos indígenas, com um enfoque primordialmente energético em vez de curativo a nível físico. Destina-se principalmente a limpezas energéticas profundas, ao equilíbrio do mundo interior, à purificação da aura e ao fortalecimento da conexão com a natureza.`,
    },
    /** @source ESP.html variety-item 1 — div.v-highlight | ENG.html variety-item 1 — div.v-highlight | PT.html variety-item 1 — div.v-highlight */
    highlight: {
      es: '✦ La fuerza del árbol más poderoso de la selva, en una sola medicina.',
      en: '✦ The strength of the rainforest\'s most powerful tree, in a single medicine.',
      pt: '✦ A força da árvore mais poderosa da floresta, em uma única medicina.',
    },
    /** @source ESP.html Intensity table row 1 | ENG.html Intensity table row 1 | PT.html Intensity table row 1 */
    intensidad: {
      fuerza: {
        es: 'Muy Alta',
        en: 'Very High',
        pt: 'Muito Alta',
      },
      aroma: {
        es: 'Terroso y seco',
        en: 'Earthy and dry',
        pt: 'Terroso e seco',
      },
      nivel: {
        es: 'Avanzado',
        en: 'Advanced',
        pt: 'Avançado',
      },
    },
    /** @source ESP.html Intent Map — "Reset Energético" | ENG.html Intent Map — "Energetic Reset" | PT.html Intent Map — "Reset Energético" */
    intentMap: 'reset-energetico',
    pricing: RAPE_PRICING,
    wholesale: WHOLESALE,
    // TODO: Replace IMAGE_TISUNU with actual product image
    imagenes: [IMAGE_TISUNU],
    /** @source ESP.html header subtitle + intro-text | ENG.html same | PT.html same */
    metaDescription: {
      es: 'Tisunú — rapé con la fuerza del árbol más poderoso de la selva. Limpieza energética profunda y purificación del aura.',
      en: 'Tisunú — rapé with the strength of the rainforest\'s most powerful tree. Deep energetic cleansing and aura purification.',
      pt: 'Tisunú — rapé com a força da árvore mais poderosa da floresta. Limpeza energética profunda e purificação da aura.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PIXURÍ — Variety 02
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: 'pixuri',
    varietyOrder: 2,
    /** @source ESP.html v-name (2nd) | ENG.html v-name (2nd) | PT.html v-name (2nd) */
    nombre: {
      es: 'Pixurí',
      en: 'Pixurí',
      pt: 'Pixurí',
    },
    /** @source ESP.html table row 2 — Enfoque Principal | ENG.html table row 2 | PT.html table row 2 */
    enfoque: {
      es: 'Medicinal',
      en: 'Medicinal',
      pt: 'Medicinal',
    },
    /** @source ESP.html table row 2 — Uso Recomendado | ENG.html table row 2 | PT.html table row 2 */
    usoRecomendado: {
      es: 'Uso diario / respiratorio',
      en: 'Daily use / Respiratory',
      pt: 'Uso diário / respiratório',
    },
    /** @source ESP.html variety-item 2 — p.v-text | ENG.html variety-item 2 — p.v-text | PT.html variety-item 2 — p.v-text */
    descripcion: {
      es: `Esta variedad es reconocida por su aroma profundo y agradable, siendo muy valorada en la aromaterapia ceremonial. El Pixurí posee propiedades antisépticas, analgésicas y expectorantes gracias a la presencia natural de eucaliptol en sus hojas. Dado que el árbol Pixurí crece muy lentamente, la preparación utiliza únicamente sus hojas cuidadosamente deshidratadas, combinadas con ceniza de Tisunú o Pariká y tabaco de savia, logrando una mezcla aromática y curativa de alta calidad. Es altamente eficaz para tratar afecciones del tracto respiratorio como sinusitis y asma, además de ser un remedio tradicional para aliviar dolores de cabeza.`,
      en: `This variety is recognized for its deep and pleasant aroma, being highly valued in ceremonial aromatherapy. Pixurí possesses antiseptic, analgesic, and expectorant properties thanks to the natural presence of eucalyptol in its leaves. Since the Pixurí tree grows very slowly, the preparation uses only its carefully dehydrated leaves, combined with ash from Tisunú or Pariká and sap tobacco, achieving a high-quality aromatic and healing blend. It is highly effective for treating respiratory tract conditions such as sinusitis and asthma, and is also a traditional remedy for relieving headaches.`,
      pt: `Esta variedade é reconhecida pelo seu aroma profundo e agradável, sendo muito valorizada na aromaterapia cerimonial. O Pixurí possui propriedades antissépticas, analgésicas e expectorantes graças à presença natural de eucaliptol em suas folhas. Como a árvore Pixurí cresce muito lentamente, a preparação utiliza unicamente suas folhas cuidadosamente desidratadas, combinadas com cinza de Tisunú ou Pariká e tabaco de seiva, resultando em uma mistura aromática e curativa de alta qualidade. É altamente eficaz para tratar condições do trato respiratório, como sinusite e asma, além de aliviar dores de cabeça.`,
    },
    /** @source ESP.html variety-item 2 — div.v-highlight | ENG.html variety-item 2 — div.v-highlight | PT.html variety-item 2 — div.v-highlight */
    highlight: {
      es: '✦ Alivio respiratorio, aroma intenso y propiedades analgésicas en cada aplicación.',
      en: '✦ Respiratory relief, intense aroma, and analgesic properties in each application.',
      pt: '✦ Alívio respiratório, aroma intenso e propriedades analgésicas em cada aplicação.',
    },
    /** @source ESP.html Intensity table row 5 | ENG.html Intensity table row 5 | PT.html Intensity table row 5 */
    intensidad: {
      fuerza: {
        es: 'Media / Suave',
        en: 'Medium / Soft',
        pt: 'Média / Suave',
      },
      aroma: {
        es: 'Fresco y mentolado',
        en: 'Fresh and mentholated',
        pt: 'Fresco e mentolado',
      },
      nivel: {
        es: 'Inicial / Diario',
        en: 'Initial / Daily',
        pt: 'Inicial / Diário',
      },
    },
    /** @source ESP.html Intent Map — "Bienestar Físico y Respiratorio" | ENG.html — "Physical and Respiratory Well-being" | PT.html — "Bem-estar Físico e Respiratório" */
    intentMap: 'bienestar-fisico',
    pricing: RAPE_PRICING,
    wholesale: WHOLESALE,
    // TODO: Replace IMAGE_PIXURI with actual product image
    imagenes: [IMAGE_PIXURI],
    /** @source ESP.html header subtitle + intro-text | ENG.html same | PT.html same */
    metaDescription: {
      es: 'Pixurí — rapé medicinal con aroma profundo, propiedades antisépticas y analgésicas. Ideal para uso diario y vías respiratorias.',
      en: 'Pixurí — medicinal rapé with deep aroma, antiseptic and analgesic properties. Ideal for daily use and respiratory health.',
      pt: 'Pixurí — rapé medicinal com aroma profundo, propriedades antissépticas e analgésicas. Ideal para uso diário e vias respiratórias.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PARIKÁ — Variety 03
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: 'parika',
    varietyOrder: 3,
    /** @source ESP.html v-name (3rd) | ENG.html v-name (3rd) | PT.html v-name (3rd) */
    nombre: {
      es: 'Pariká',
      en: 'Pariká',
      pt: 'Pariká',
    },
    /** @source ESP.html table row 3 — Enfoque Principal | ENG.html table row 3 | PT.html table row 3 */
    enfoque: {
      es: 'Espiritual',
      en: 'Spiritual',
      pt: 'Espiritual',
    },
    /** @source ESP.html table row 3 — Uso Recomendado | ENG.html table row 3 | PT.html table row 3 */
    usoRecomendado: {
      es: 'Ceremonia profunda',
      en: 'Deep ceremony',
      pt: 'Cerimônia profunda',
    },
    /** @source ESP.html variety-item 3 — p.v-text | ENG.html variety-item 3 — p.v-text | PT.html variety-item 3 — p.v-text */
    descripcion: {
      es: `El Pariká —conocido también como Pereira en las selvas de Brasil— es una variedad esencialmente ceremonial que actúa sobre el plano espiritual. Su preparación es artesanal y lleva únicamente dos componentes: ceniza de Pariká y tabaco de cuerda. Profundamente arraigado en la tradición del pueblo Kaxinawá, es uno de los rapés con mayor presencia en ceremonias de los pueblos indígenas amazónicos. Se utiliza para alcanzar el equilibrio de la "tierra interior" y para realizar limpiezas de cargas negativas o energías densas. Más que un enfoque curativo físico, el Pariká es una herramienta de fuerza ancestral que facilita la conexión con guías espirituales y la apertura de caminos, promoviendo una purificación energética integral.`,
      en: `Pariká —also known as Pereira in the jungles of Brazil— is an essentially ceremonial variety that acts on the spiritual plane. Its preparation is artisanal and contains only two components: Pariká ash and rope tobacco. Deeply rooted in the tradition of the Kaxinawá people, it is one of the rapés with the greatest presence in ceremonies of Amazonian indigenous peoples. It is used to achieve balance of the "inner earth" and to perform cleansing of negative charges or dense energies. More than a physical healing focus, Pariká is a tool of ancestral strength that facilitates connection with spiritual guides and the opening of pathways, promoting integral energetic purification.`,
      pt: `O Pariká —conhecido também como Pereira nas selvas do Brasil— é uma variedade essencialmente cerimonial que atua sobre o plano espiritual. Sua preparação é artesanal e leva unicamente dois componentes: cinza de Pariká e tabaco de corda. Profundamente enraizado na tradição do povo Kaxinawá, é um dos rapés com maior presença em cerimônias indígenas. Utiliza-se para alcançar o equilíbrio da "terra interior" e para realizar limpezas de cargas negativas. Mais do que um enfoque físico, o Pariká é uma ferramenta de força ancestral que facilita a conexão com guias espirituais e a abertura de caminhos.`,
    },
    /** @source ESP.html variety-item 3 — div.v-highlight | ENG.html variety-item 3 — div.v-highlight | PT.html variety-item 3 — div.v-highlight */
    highlight: {
      es: '✦ Limpia lo que no se ve. Abre lo que está cerrado.',
      en: '✦ Cleanses what cannot be seen. Opens what is closed.',
      pt: '✦ Limpa o que não se vê. Abre o que está fechado.',
    },
    /** @source ESP.html Intensity table row 2 | ENG.html Intensity table row 2 | PT.html Intensity table row 2 */
    intensidad: {
      fuerza: {
        es: 'Alta',
        en: 'High',
        pt: 'Alta',
      },
      aroma: {
        es: 'Madera profunda',
        en: 'Deep wood',
        pt: 'Madeira profunda',
      },
      nivel: {
        es: 'Ceremonial',
        en: 'Ceremonial',
        pt: 'Cerimonial',
      },
    },
    /** @source ESP.html Intent Map — "Conexión Espiritual Profunda" | ENG.html — "Deep Spiritual Connection" | PT.html — "Conexão Espiritual Profunda" */
    intentMap: 'conexion-espiritual',
    pricing: RAPE_PRICING,
    wholesale: WHOLESALE,
    // TODO: Replace IMAGE_PARIKA with actual product image
    imagenes: [IMAGE_PARIKA],
    /** @source ESP.html header subtitle + intro-text | ENG.html same | PT.html same */
    metaDescription: {
      es: 'Pariká — rapé ceremonial de conexión espiritual profunda. Tradición Kaxinawá, purificación energética y apertura de caminos.',
      en: 'Pariká — ceremonial rapé for deep spiritual connection. Kaxinawá tradition, energetic purification and pathway opening.',
      pt: 'Pariká — rapé cerimonial de conexão espiritual profunda. Tradição Kaxinawá, purificação energética e abertura de caminhos.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CUMARÚ DE CHEIRO — Variety 04
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: 'cumaru-de-cheiro',
    varietyOrder: 4,
    /** @source ESP.html v-name (4th) | ENG.html v-name (4th) | PT.html v-name (4th) */
    nombre: {
      es: 'Cumarú de Cheiro',
      en: 'Cumarú de Cheiro',
      pt: 'Cumarú de Cheiro',
    },
    /** @source ESP.html table row 4 — Enfoque Principal | ENG.html table row 4 | PT.html table row 4 */
    enfoque: {
      es: 'Mixto',
      en: 'Mixed',
      pt: 'Misto',
    },
    /** @source ESP.html table row 4 — Uso Recomendado | ENG.html table row 4 | PT.html table row 4 */
    usoRecomendado: {
      es: 'Protección / respiratorio',
      en: 'Protection / Respiratory',
      pt: 'Proteção / respiratório',
    },
    /** @source ESP.html variety-item 4 — p.v-text | ENG.html variety-item 4 — p.v-text | PT.html variety-item 4 — p.v-text */
    descripcion: {
      es: `Conocido como el "árbol que no se pudre" por su extrema dureza y resistencia, la ceniza del Cumarú otorga a este rapé una fuerza y solidez únicas. A diferencia de otras tribus que utilizan únicamente la ceniza de la cáscara, en esta preparación se aprovecha el árbol completo, lo que la hace más potente y completa. Su fórmula integra ceniza de Cumarú, tabaco de cuerda y semillas de imburana (Cumarú de olor). Químicamente, contiene cumarina, lo que le confiere propiedades anticoagulantes, antiespasmódicas y broncodilatadoras, siendo ideal para la limpieza de las vías respiratorias. En el ámbito espiritual, actúa como un potente escudo energético contra energías pesadas y densas, trabajando directamente sobre el plexo solar y la limpieza del aura.`,
      en: `Known as the "tree that doesn't rot" due to its extreme hardness and resistance, Cumarú ash gives this rapé a unique strength and solidity. Unlike other tribes that use only the bark ash, this preparation utilizes the entire tree, making it more potent and complete. Its formula integrates Cumarú ash, rope tobacco, and imburana seeds (Cumarú de olor). Chemically, it contains coumarin, which gives it anticoagulant, antispasmodic, and bronchodilator properties, making it ideal for cleansing the respiratory tract. In the spiritual realm, it acts as a powerful energetic shield against heavy and dense energies, working directly on the solar plexus and aura cleansing.`,
      pt: `Conhecido como a "árvore que não apodrece" pela sua extrema dureza e resistência, a cinza do Cumarú confere a este rapé uma força e solidez únicas. Diferente de outras tribos, nesta preparação aproveita-se a árvore completa, tornando-a mais potente. Sua fórmula integra cinza de Cumarú, tabaco de corda e sementes de imburana. Quimicamente, contém cumarina, o que lhe confere propriedades anticoagulantes e broncodilatadoras, sendo ideal para a limpeza das vias respiratórias. No plano espiritual, atua como um potente escudo contra energias densas, trabalhando no plexo solar.`,
    },
    /** @source ESP.html variety-item 4 — div.v-highlight | ENG.html variety-item 4 — div.v-highlight | PT.html variety-item 4 — div.v-highlight */
    highlight: {
      es: '✦ Protección energética, escudo ancestral y limpieza respiratoria en una sola fórmula.',
      en: '✦ Energetic protection, ancestral shield, and respiratory cleansing in a single formula.',
      pt: '✦ Proteção energética, escudo ancestral e limpeza respiratória em uma única fórmula.',
    },
    /** @source ESP.html Intensity table row 3 | ENG.html Intensity table row 3 | PT.html Intensity table row 3 */
    intensidad: {
      fuerza: {
        es: 'Media / Alta',
        en: 'Medium / High',
        pt: 'Média / Alta',
      },
      aroma: {
        es: 'Dulce y amaderado',
        en: 'Sweet and woody',
        pt: 'Doce e amadeirado',
      },
      nivel: {
        es: 'Intermedio',
        en: 'Intermediate',
        pt: 'Intermédio',
      },
    },
    /** @source ESP.html Intent Map — "Protección y Escudo" | ENG.html — "Protection and Shield" | PT.html — "Proteção e Escudo" */
    intentMap: 'proteccion',
    pricing: RAPE_PRICING,
    wholesale: WHOLESALE,
    // TODO: Replace IMAGE_CUMARU with actual product image
    imagenes: [IMAGE_CUMARU],
    /** @source ESP.html header subtitle + intro-text | ENG.html same | PT.html same */
    metaDescription: {
      es: 'Cumarú de Cheiro — rapé de protección ancestral y escudo energético. Limpieza respiratoria y fortalecimiento del plexo solar.',
      en: 'Cumarú de Cheiro — ancestral protection rapé and energetic shield. Respiratory cleansing and solar plexus strengthening.',
      pt: 'Cumarú de Cheiro — rapé de proteção ancestral e escudo energético. Limpeza respiratória e fortalecimento do plexo solar.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VENA DE PAJÉ — Variety 05
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: 'vena-de-paje',
    varietyOrder: 5,
    /** @source ESP.html v-name (5th) | ENG.html v-name (5th) | PT.html v-name (5th) — note: PT uses "Veia de Pajé" */
    nombre: {
      es: 'Vena de Pajé',
      en: 'Vena de Pajé',
      pt: 'Veia de Pajé',
    },
    /** @source ESP.html table row 5 — Enfoque Principal | ENG.html table row 5 | PT.html table row 5 */
    enfoque: {
      es: 'Mixto',
      en: 'Mixed',
      pt: 'Misto',
    },
    /** @source ESP.html table row 5 — Uso Recomendado | ENG.html table row 5 | PT.html table row 5 */
    usoRecomendado: {
      es: 'Meditación / respiratorio / glándula pineal',
      en: 'Meditation / Respiratory / Pineal gland',
      pt: 'Meditação / respiratório / glândula pineal',
    },
    /** @source ESP.html variety-item 5 — p.v-text | ENG.html variety-item 5 — p.v-text | PT.html variety-item 5 — p.v-text */
    descripcion: {
      es: `Esta variedad es única entre las cinco por emplear tres tabacos en su preparación: tabaco orgánico, tabaco de moho y tabaco de cuerda, combinados mediante una alquimia propia con ceniza de Tisunú y un cipó (liana) pequeño de aroma muy intenso conocido como Vena de Pajé. Además de su acción sobre el plano espiritual, esta medicina también actúa sobre el cuerpo físico realizando una limpieza eficaz de las vías respiratorias. Es una de las medicinas más buscadas para la descalcificación de la glándula pineal, facilitando la entrada en estados de meditación profunda. Se recomienda especialmente para rituales de cura espiritual y para la limpieza de los canales energéticos, ayudando a despejar la percepción y fortalecer la conexión con los planos sutiles.`,
      en: `This variety is unique among the five for employing three tobaccos in its preparation: organic tobacco, mold tobacco, and rope tobacco, combined through its own alchemy with Tisunú ash and a small vine (liana) with a very intense aroma known as Vena de Pajé. In addition to its action on the spiritual plane, this medicine also acts on the physical body, performing an effective cleansing of the respiratory tract. It is one of the most sought-after medicines for decalcifying the pineal gland, facilitating entry into deep meditation states. It is especially recommended for spiritual healing rituals and for cleansing energetic channels, helping to clear perception and strengthen connection with subtle planes.`,
      pt: `Esta variedade é única por empregar três tabacos: orgânico, molde e corda, combinados com cinza de Tisunú e um cipó pequeno de aroma muito intenso conhecido como Veia de Pajé. Além da ação espiritual, realiza uma limpeza eficaz das vias respiratórias no corpo físico. É uma das medicinas mais procuradas para a descalcificação da glândula pineal, facilitando a entrada em estados de meditação profunda. Recomenda-se para rituais de cura espiritual e limpeza de canais energéticos, ajudando a clarear a percepção e fortalecer a conexão sutil.`,
    },
    /** @source ESP.html variety-item 5 — div.v-highlight | ENG.html variety-item 5 — div.v-highlight | PT.html variety-item 5 — div.v-highlight */
    highlight: {
      es: '✦ La medicina para despertar la percepción y profundizar la meditación.',
      en: '✦ The medicine to awaken perception and deepen meditation.',
      pt: '✦ A medicina para despertar a percepção e aprofundar a meditação.',
    },
    /** @source ESP.html Intensity table row 4 | ENG.html Intensity table row 4 | PT.html Intensity table row 4 */
    intensidad: {
      fuerza: {
        es: 'Media',
        en: 'Medium',
        pt: 'Média',
      },
      aroma: {
        es: 'Herbal intenso',
        en: 'Intense herbal',
        pt: 'Herbal intenso',
      },
      nivel: {
        es: 'Intermedio',
        en: 'Intermediate',
        pt: 'Intermédio',
      },
    },
    /** @source ESP.html Intent Map — "Claridad Mental y Meditación" | ENG.html — "Mental Clarity and Meditation" | PT.html — "Clareza Mental e Meditação" */
    intentMap: 'claridad-mental',
    pricing: RAPE_PRICING,
    wholesale: WHOLESALE,
    // TODO: Replace IMAGE_VENA with actual product image
    imagenes: [IMAGE_VENA],
    /** @source ESP.html header subtitle + intro-text | ENG.html same | PT.html same */
    metaDescription: {
      es: 'Vena de Pajé — medicina para despertar la percepción y profundizar la meditación. Descalcificación pineal y limpieza de canales energéticos.',
      en: 'Vena de Pajé — medicine to awaken perception and deepen meditation. Pineal decalcification and energetic channel cleansing.',
      pt: 'Veia de Pajé — medicina para despertar a percepção e aprofundar a meditação. Descalcificação pineal e limpeza de canais energéticos.',
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByIntent(intentMap: string): Product[] {
  return products.filter((p) => p.intentMap === intentMap);
}
