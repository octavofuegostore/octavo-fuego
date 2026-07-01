import type { Product, PriceGram } from '@/data/products';
import type { Locale } from '@/i18n';

export interface FAQContentItem {
  question: string;
  answer: string;
}

export function buildFAQContent(product: Product, locale: Locale): FAQContentItem[] {
  const name = product.nombre[locale];
  const desc = product.descripcion[locale];
  const enfoque = product.enfoque[locale];
  const uso = product.usoRecomendado[locale];
  const nivel = product.intensidad.nivel[locale];
  const fuerza = product.intensidad.fuerza[locale];
  const aroma = product.intensidad.aroma[locale];
  const lowestPricing = product.pricing.reduce((min: PriceGram, p: PriceGram) =>
    p.precio < min.precio ? p : min, product.pricing[0]
  );

  if (locale === 'es') {
    return [
      {
        question: `¿Qué es el Rapé ${name} y de dónde viene?`,
        answer: `El Rapé ${name} es una medicina ancestral amazónica. ${desc.split('.')[0]}. Se prepara de forma artesanal por comunidades indígenas de la Amazonía brasileña, siguiendo tradiciones transmitidas por generaciones.`
      },
      {
        question: `¿Para qué sirve ${name}? ¿Qué efectos tiene?`,
        answer: `${name} tiene un enfoque ${enfoque.toLowerCase()}. ${desc.split('.')[0]}. Sus efectos varían según la persona, pero está diseñado para apoyar prácticas espirituales y de conexión con la naturaleza.`
      },
      {
        question: `¿Cuánto cuesta ${name} y qué presentaciones hay?`,
        answer: `${name} está disponible en presentaciones de ${lowestPricing.cantidad}g desde COP $${lowestPricing.precio.toLocaleString('es-CO')}. Ofrecemos tamaños de 10g, 20g y 30g para adaptarnos a tus necesidades.`
      },
      {
        question: `¿Es ${name} para mí? ¿Nivel principiante o avanzado?`,
        answer: `${name} tiene un nivel ${nivel.toLowerCase()} y una fuerza ${fuerza.toLowerCase()}. Si eres nuevo en el mundo del rapé, te recomendamos consultar con un guía experimentado para determinar si esta variedad es adecuada para tu práctica.`
      },
      {
        question: `¿Cómo se aplica correctamente ${name}?`,
        answer: `${name} se aplica mediante insuflación nasal usando un kuripe (aplicador personal). ${uso.toLowerCase()}. Es importante hacerlo en un espacio tranquilo y con la intención adecuada.`
      },
      {
        question: `¿En qué se diferencia ${name} de otras variedades de rapé?`,
        answer: `${name} se distingue por su enfoque ${enfoque.toLowerCase()} y su perfil de intensidad ${fuerza.toLowerCase()} con aroma ${aroma.toLowerCase()}. Cada variedad de rapé tiene propiedades únicas, y ${name} es especialmente valorado por ${desc.split('.')[0].toLowerCase()}.`
      }
    ];
  }

  if (locale === 'en') {
    return [
      {
        question: `What is Rapé ${name} and where does it come from?`,
        answer: `Rapé ${name} is an ancestral Amazonian medicine. ${desc.split('.')[0]}. It is handcrafted by indigenous communities in the Brazilian Amazon, following traditions passed down through generations.`
      },
      {
        question: `What is ${name} for? What effects does it have?`,
        answer: `${name} has a ${enfoque.toLowerCase()} focus. ${desc.split('.')[0]}. Its effects vary by person, but it is designed to support spiritual practices and connection with nature.`
      },
      {
        question: `How much does ${name} cost and what sizes are available?`,
        answer: `${name} is available from ${lowestPricing.cantidad}g starting at COP $${lowestPricing.precio.toLocaleString('es-CO')}. We offer 10g, 20g, and 30g sizes to suit your needs.`
      },
      {
        question: `Is ${name} for me? Beginner or advanced level?`,
        answer: `${name} has a ${nivel.toLowerCase()} level and ${fuerza.toLowerCase()} strength. If you are new to rapé, we recommend consulting with an experienced guide to determine if this variety is right for your practice.`
      },
      {
        question: `How is ${name} correctly applied?`,
        answer: `${name} is applied through nasal insufflation using a kuripe (personal applicator). ${uso.toLowerCase()}. It is important to do this in a quiet space with the right intention.`
      },
      {
        question: `What makes ${name} different from other rapé varieties?`,
        answer: `${name} stands out for its ${enfoque.toLowerCase()} focus and ${fuerza.toLowerCase()} intensity profile with a ${aroma.toLowerCase()} aroma. Each rapé variety has unique properties, and ${name} is especially valued for ${desc.split('.')[0].toLowerCase()}.`
      }
    ];
  }

  // pt
  return [
    {
      question: `O que é o Rapé ${name} e de onde vem?`,
      answer: `O Rapé ${name} é uma medicina ancestral amazônica. ${desc.split('.')[0]}. É preparado artesanalmente por comunidades indígenas da Amazônia brasileira, seguindo tradições transmitidas por gerações.`
    },
    {
      question: `Para que serve ${name}? Que efeitos tem?`,
      answer: `${name} tem um enfoque ${enfoque.toLowerCase()}. ${desc.split('.')[0]}. Seus efeitos variam conforme a pessoa, mas é projetado para apoiar práticas espirituais e de conexão com a natureza.`
    },
    {
      question: `Quanto custa ${name} e quais apresentações estão disponíveis?`,
      answer: `${name} está disponível em apresentações de ${lowestPricing.cantidad}g a partir de COP $${lowestPricing.precio.toLocaleString('es-CO')}. Oferecemos tamanhos de 10g, 20g e 30g para atender suas necessidades.`
    },
    {
      question: `${name} é para mim? Nível iniciante ou avançado?`,
      answer: `${name} tem nível ${nivel.toLowerCase()} e força ${fuerza.toLowerCase()}. Se você é novo no rapé, recomendamos consultar um guia experiente para determinar se esta variedade é adequada para sua prática.`
    },
    {
      question: `Como aplicar ${name} corretamente?`,
      answer: `${name} é aplicado por insuflação nasal usando um kuripe (aplicador pessoal). ${uso.toLowerCase()}. É importante fazer isso em um espaço tranquilo e com a intenção adequada.`
    },
    {
      question: `O que diferencia ${name} de outras variedades de rapé?`,
      answer: `${name} se destaca por seu enfoque ${enfoque.toLowerCase()} e perfil de intensidade ${fuerza.toLowerCase()} com aroma ${aroma.toLowerCase()}. Cada variedade de rapé tem propriedades únicas, e ${name} é especialmente valorizado por ${desc.split('.')[0].toLowerCase()}.`
    }
  ];
}
