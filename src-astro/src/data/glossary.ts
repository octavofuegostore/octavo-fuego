/**
 * Glossary data — 6 terms × 3 locales (es, en, pt)
 *
 * All descriptions are WORD-FOR-WORD from the source HTML catalog files.
 * Each field has a `// @source:` comment for traceability.
 *
 * Source files:
 *   ES: Octavofuego_Catalogo_ESP.html → .glossary section
 *   EN: Octavofuego_Catalog_ENG.html → .glossary section
 *   PT: Octavofuego_Catalogo_PT.html → .glossary section
 */

import type { Locale } from '../i18n';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GlossaryTerm {
  /** Language-independent term name (proper noun) */
  term: string;
  /** Term name as rendered in each locale's HTML (may differ slightly) */
  termDisplay: Record<Locale, string>;
  /** Description — word-for-word from source HTML */
  description: Record<Locale, string>;
}

// ─── Glossary Terms ─────────────────────────────────────────────────────────

export const glossary: GlossaryTerm[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. Tabaco de Moho / Mold Tobacco / Tabaco de Molde
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Tabaco de Moho',
    /** @source ESP.html glossary dt (1st) | ENG.html glossary dt (1st) | PT.html glossary dt (1st) */
    termDisplay: {
      es: 'Tabaco de Moho',
      en: 'Mold Tobacco',
      pt: 'Tabaco de Molde',
    },
    /** @source ESP.html glossary dd (1st) | ENG.html glossary dd (1st) | PT.html glossary dd (1st) */
    description: {
      es: 'Un tabaco que ha pasado por un proceso de fermentación natural controlada. Este método eleva su carga vibracional, convirtiéndolo en el corazón de las medicinas destinadas a la limpieza energética.',
      en: 'A tobacco that has undergone a controlled natural fermentation process. This method elevates its vibrational charge, making it the heart of medicines intended for energetic cleansing.',
      pt: 'Tabaco que passou por fermentação natural controlada. Este método eleva sua carga vibracional, tornando-o o coração das medicinas de limpeza energética.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. Tabaco de Cuerda / Rope Tobacco / Tabaco de Corda
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Tabaco de Cuerda',
    /** @source ESP.html glossary dt (2nd) | ENG.html glossary dt (2nd) | PT.html glossary dt (2nd) */
    termDisplay: {
      es: 'Tabaco de Cuerda',
      en: 'Rope Tobacco',
      pt: 'Tabaco de Corda',
    },
    /** @source ESP.html glossary dd (2nd) | ENG.html glossary dd (2nd) | PT.html glossary dd (2nd) */
    description: {
      es: 'Tabaco puro, curado y enrollado a presión. Aporta una base sólida y estable, permitiendo que las propiedades de las cenizas sagradas se liberen de forma equilibrada.',
      en: 'Pure tobacco, cured and rolled under pressure. It provides a solid and stable base, allowing the properties of sacred ashes to be released in a balanced manner.',
      pt: 'Tabaco puro, curado e enrolado sob pressão. Fornece uma base sólida que permite a liberação equilibrada das cinzas sagradas.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. Tabaco de Savia / Sap Tobacco / Tabaco de Seiva
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Tabaco de Savia',
    /** @source ESP.html glossary dt (3rd) | ENG.html glossary dt (3rd) | PT.html glossary dt (3rd) */
    termDisplay: {
      es: 'Tabaco de Savia',
      en: 'Sap Tobacco',
      pt: 'Tabaco de Seiva',
    },
    /** @source ESP.html glossary dd (3rd) | ENG.html glossary dd (3rd) | PT.html glossary dd (3rd) */
    description: {
      es: 'Tabaco de origen orgánico utilizado principalmente en la preparación del Pixurí. Su naturaleza más suave lo convierte en el vehículo ideal para medicinas de uso cotidiano y aromaterapia.',
      en: 'Tobacco of organic origin used primarily in the preparation of Pixurí. Its softer nature makes it the ideal vehicle for daily use medicines and aromatherapy.',
      pt: 'Tabaco orgânico mais suave, utilizado no Pixurí. Ideal para uso cotidiano e aromaterapia.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. Cipó
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Cipó',
    /** @source ESP.html glossary dt (4th) | ENG.html glossary dt (4th) | PT.html glossary dt (4th) */
    termDisplay: {
      es: 'Cipó',
      en: 'Cipó',
      pt: 'Cipó',
    },
    /** @source ESP.html glossary dd (4th) | ENG.html glossary dd (4th) | PT.html glossary dd (4th) */
    description: {
      es: 'Término amazónico para designar las lianas o enredaderas de la selva. En el caso de la Vena de Pajé, se emplea un cipó de tamaño pequeño pero de aroma sumamente intenso.',
      en: 'Amazonian term for vines or lianas of the jungle. In the case of Vena de Pajé, a small vine with an extremely intense aroma is used.',
      pt: 'Termo amazônico para lianas. No caso da Veia de Pajé, emprega-se um cipó pequeno de aroma extremamente intenso.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. Cenizas Sagradas / Sacred Ashes / Cinzas Sagradas
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Cenizas Sagradas',
    /** @source ESP.html glossary dt (5th) | ENG.html glossary dt (5th) | PT.html glossary dt (5th) */
    termDisplay: {
      es: 'Cenizas Sagradas',
      en: 'Sacred Ashes',
      pt: 'Cinzas Sagradas',
    },
    /** @source ESP.html glossary dd (5th) | ENG.html glossary dd (5th) | PT.html glossary dd (5th) */
    description: {
      es: 'No actúan como un componente de relleno. La ceniza es el vehículo que permite que la medicina penetre en los canales del cuerpo, aportando la fuerza y el "espíritu" específico de cada árbol.',
      en: 'Ashes do not act as filler components. The ash is the vehicle that allows the medicine to penetrate the body\'s channels, providing the specific strength and "spirit" of each tree.',
      pt: 'O veículo que permite à medicina penetrar nos canais do corpo, aportando o "espírito" específico de cada árvore.',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. Descalcificación Pineal / Pineal Decalcification / Descalcificação Pineal
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    /** @source Constant across languages */
    term: 'Descalcificación Pineal',
    /** @source ESP.html glossary dt (6th) | ENG.html glossary dt (6th) | PT.html glossary dt (6th) */
    termDisplay: {
      es: 'Descalcificación Pineal',
      en: 'Pineal Decalcification',
      pt: 'Descalcificação Pineal',
    },
    /** @source ESP.html glossary dd (6th) | ENG.html glossary dd (6th) | PT.html glossary dd (6th) */
    description: {
      es: 'Proceso referido específicamente en la variedad Vena de Pajé, que busca despejar la percepción sutil para facilitar estados de conciencia expandida.',
      en: 'A process specifically referred to in the Vena de Pajé variety, which seeks to clear subtle perception to facilitate expanded states of consciousness.',
      pt: 'Processo referido na Veia de Pajé que busca clarear a percepção sutil para facilitar estados de consciência expandida.',
    },
  },
];
