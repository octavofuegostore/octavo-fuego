/**
 * Prophecy data — La Profecía de los Siete Fuegos / The Prophecy of the Seven Fires
 *
 * All text is WORD-FOR-WORD from the source HTML prophecy files.
 * Each field has a `// @source:` comment for traceability.
 *
 * Source files:
 *   ES: ProfeciaOctavoFuego-ESPANOL.html
 *   EN: Eighthfire-prophecy-en.html
 *   PT: Oitavofogo-profecia-pt.html
 */

import type { Locale } from '../i18n';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FireBlock {
  id: number;
  title: Record<Locale, string>;
  paragraphs: Record<Locale, string[]>;
}

export interface Prophecy {
  ignition: {
    label: Record<Locale, string>;
    quote: Record<Locale, string>;
  };
  header: {
    title: Record<Locale, string>;
    intro: Record<Locale, string>;
  };
  sectionLabel: Record<Locale, string>;
  introParagraphs: Record<Locale, string[]>;
  fires: FireBlock[];
  narrativeInterlude: Record<Locale, string[]>;
  highlight: Record<Locale, string>;
  closingParagraphs: Record<Locale, string[]>;
  finalQuestion: {
    label: Record<Locale, string>;
    question: Record<Locale, string>;
  };
}

// ─── Prophecy Data ──────────────────────────────────────────────────────────

export const prophecy: Prophecy = {
  // ── Ignition Block ──────────────────────────────────────────────────────
  ignition: {
    /** @source ESP.html .ignition-label | ENG.html .ignition-label | PT.html .ignition-label */
    label: {
      es: 'El Despertar Eterno',
      en: 'The Eternal Awakening',
      pt: 'O Despertar Eterno',
    },
    /** @source ESP.html .ignition-quote | ENG.html .ignition-quote | PT.html .ignition-quote */
    quote: {
      es: '"Si eligen el camino correcto, entonces el Séptimo Fuego encenderá el Octavo y Final Fuego: un Fuego eterno de paz, amor, hermandad y fraternidad."',
      en: '"If they choose the right road, then the Seventh Fire will light the Eighth and Final Fire — an eternal Fire of peace, love, brotherhood and sisterhood."',
      pt: '"Se escolherem o caminho certo, então o Sétimo Fogo acenderá o Oitavo e Final Fogo — um Fogo eterno de paz, amor, irmandade e fraternidade."',
    },
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    /** @source ESP.html .brand | ENG.html .brand | PT.html .brand */
    title: {
      es: 'Octavo Fuego',
      en: 'Eighth Fire',
      pt: 'Oitavo Fogo',
    },
    /** @source ESP.html .intro-text | ENG.html .intro-text | PT.html .intro-text */
    intro: {
      es: 'Las enseñanzas de los siete profetas que vinieron al pueblo Anishinabe hace muchos años, conocidas como los Siete Fuegos de los Ojibway, nos revelan el camino hacia un futuro de paz y unidad.',
      en: 'The teachings of the seven prophets who came to the Anishinabe people many years ago, known as the Seven Fires of the Ojibway, reveal the path toward a future of peace and unity.',
      pt: 'Os ensinamentos dos sete profetas que vieram ao povo Anishinabe há muitos anos, conhecidos como os Sete Fogos dos Ojibway, revelam o caminho em direção a um futuro de paz e unidade.',
    },
  },

  // ── Section Label ───────────────────────────────────────────────────────
  /** @source ESP.html .section-label | ENG.html .section-label | PT.html .section-label */
  sectionLabel: {
    es: 'Crónica de los Siete Fuegos',
    en: 'Chronicle of the Seven Fires',
    pt: 'Crônica dos Sete Fogos',
  },

  // ── Introduction Paragraphs (before Fire 1) ────────────────────────────
  /** @source ESP.html main.prophecy-content > p (first two) | ENG.html same | PT.html same */
  introParagraphs: {
    es: [
      'Los relatos de nuestra vida, transmitidos por nuestros ancianos Ojibway, nos cuentan que hace muchos años, siete grandes nee-gawn-na-kayg (profetas) vinieron a los Anishinabe. Llegaron en un tiempo en que el pueblo vivía una vida plena y pacífica en la costa noreste de América del Norte.',
      'Estos profetas dejaron al pueblo siete predicciones de lo que traería el futuro. Cada una de estas profecías fue llamada un Fuego, y cada Fuego se refería a una era particular de tiempo que vendría en el futuro. Así, las enseñanzas de los siete profetas se conocen ahora como los Neesh-wa-swi\' ish-ko-day-kawn\' (Siete Fuegos) de los Ojibway.',
    ],
    en: [
      'The accounts of our life that have been handed down to us by our Ojibway elders tell us that many years ago, seven major nee-gawn-na-kayg (prophets) came to the Anishinabe. They came at a time when the people were living a full and peaceful life on the northeastern coast of North America.',
      'These prophets left the people with seven predictions of what the future would bring. Each of these prophecies was called a Fire and each Fire referred to a particular era of time that would come in the future. Thus, the teachings of the seven prophets are now called the Neesh-wa-swi\' ish-ko-day-kawn\' (Seven Fires) of the Ojibway.',
    ],
    pt: [
      'Os relatos de nossa vida que foram transmitidos a nós pelos nossos anciãos Ojibway nos contam que há muitos anos, sete grandes nee-gawn-na-kayg (profetas) vieram aos Anishinabe. Eles chegaram numa época em que o povo vivia uma vida plena e pacífica na costa nordeste da América do Norte.',
      'Estes profetas deixaram ao povo sete predições do que o futuro traria. Cada uma destas profecias foi chamada de Fogo e cada Fogo referia-se a uma era particular de tempo que viria no futuro. Assim, os ensinamentos dos sete profetas são agora chamados de Neesh-wa-swi\' ish-ko-day-kawn\' (Sete Fogos) dos Ojibway.',
    ],
  },

  // ── The Seven Fires ─────────────────────────────────────────────────────
  fires: [
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 1
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 1,
      /** @source ESP.html fire-block 1 — .fire-title | ENG.html fire-block 1 | PT.html fire-block 1 */
      title: {
        es: 'El Primer Fuego',
        en: 'The First Fire',
        pt: 'O Primeiro Fogo',
      },
      /** @source ESP.html fire-block 1 — p | ENG.html fire-block 1 — p | PT.html fire-block 1 — p */
      paragraphs: {
        es: [
          'El primer profeta dijo al pueblo: "En el tiempo del Primer Fuego, la nación Anishinabe se levantará y seguirá la Concha Sagrada de la Logia Midewiwin. La Logia servirá como punto de reunión para el pueblo y sus caminos tradicionales serán fuente de mucha fuerza. El Megis Sagrado guiará el camino hacia la tierra elegida de los Anishinabe. Deben buscar una isla con forma de tortuga vinculada a la purificación de la Tierra. Encontrarán tal isla al principio y al final de su viaje. Habrá siete lugares de parada en el camino. Sabrán que han llegado a la tierra elegida cuando encuentren un lugar donde el alimento crece sobre el agua. Si no se mueven, serán destruidos".',
        ],
        en: [
          'The first prophet said to the people, "In the time of the First Fire, the Anishinabe nation will rise up and follow the Sacred Shell of the Midewiwin Lodge. The Midewiwin Lodge will serve as a rallying point for the people and its traditional ways will be the source of much strength. The Sacred Megis will lead the way to the chosen ground of the Anishinabe. You are to look for a turtle-shaped island that is linked to the purification of the Earth. You will find such an island at the beginning and end of your journey. There will be seven stopping places along the way. You will know that the chosen ground has been reached when you come to a land where food grows on water. If you do not move, you will be destroyed."',
        ],
        pt: [
          'O primeiro profeta disse ao povo: "No tempo do Primeiro Fogo, a nação Anishinabe se levantará e seguirá a Concha Sagrada da Loja Midewiwin. A Loja servirá como ponto de reunião para o povo e seus caminhos tradicionais serão a fonte de muita força. O Megis Sagrado guiará o caminho para a terra escolhida dos Anishinabe. Vocês devem procurar uma ilha em forma de tartaruga que esteja ligada à purificação da Terra. Vocês encontrarão tal ilha no início e no fim de sua jornada. Haverá sete locais de parada ao longo do caminho. Vocês saberão que a terra escolhida foi alcançada quando chegarem a uma terra onde o alimento cresce sobre a água. Se não se moverem, serão destruídos."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 2
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 2,
      /** @source ESP.html fire-block 2 — .fire-title | ENG.html fire-block 2 | PT.html fire-block 2 */
      title: {
        es: 'El Segundo Fuego',
        en: 'The Second Fire',
        pt: 'O Segundo Fogo',
      },
      /** @source ESP.html fire-block 2 — p | ENG.html fire-block 2 — p | PT.html fire-block 2 — p */
      paragraphs: {
        es: [
          'El segundo profeta dijo al pueblo: "Reconocerán el Segundo Fuego porque en este tiempo la nación estará acampada junto a un gran cuerpo de agua. En este tiempo se perderá la dirección de la Concha Sagrada. El Midewiwin disminuirá en fuerza. Un niño nacerá para señalar el camino de regreso a las tradiciones. Él mostrará la dirección hacia las piedras de paso al futuro del pueblo Anishinabe".',
        ],
        en: [
          'The second prophet told the people, "You will know the Second Fire because at this time the nation will be camped by a large body of water. In this time the direction of the Sacred Shell will be lost. The Midewiwin will diminish in strength. A boy will be born to point the way back to the traditional ways. He will show the direction to the stepping stones to the future of the Anishinabe people."',
        ],
        pt: [
          'O segundo profeta disse ao povo: "Vocês reconhecerão o Segundo Fogo porque neste tempo a nação estará acampada junto a um grande corpo de água. Neste tempo a direção da Concha Sagrada será perdida. O Midewiwin diminuirá em força. Um menino nascerá para apontar o caminho de volta às tradições. Ele mostrará a direção para as pedras de passagem ao futuro do povo Anishinabe."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 3
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 3,
      /** @source ESP.html fire-block 3 — .fire-title | ENG.html fire-block 3 | PT.html fire-block 3 */
      title: {
        es: 'El Tercer Fuego',
        en: 'The Third Fire',
        pt: 'O Terceiro Fogo',
      },
      /** @source ESP.html fire-block 3 — p | ENG.html fire-block 3 — p | PT.html fire-block 3 — p */
      paragraphs: {
        es: [
          'El tercer profeta dijo al pueblo: "En el Tercer Fuego, los Anishinabe encontrarán el camino hacia su tierra elegida, una tierra en el Oeste hacia la cual deben mover a sus familias. Esta será la tierra donde el alimento crece sobre el agua".',
        ],
        en: [
          'The third prophet said to the people, "In the Third Fire, the Anishinabe will find the path to their chosen ground, a land in the West to which they must move their families. This will be the land where food grows on water."',
        ],
        pt: [
          'O terceiro profeta disse ao povo: "No Terceiro Fogo, os Anishinabe encontrarão o caminho para sua terra escolhida, uma terra no Oeste para a qual devem mover suas famílias. Esta será a terra onde o alimento cresce sobre a água."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 4
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 4,
      /** @source ESP.html fire-block 4 — .fire-title | ENG.html fire-block 4 | PT.html fire-block 4 */
      title: {
        es: 'El Cuarto Fuego',
        en: 'The Fourth Fire',
        pt: 'O Quarto Fogo',
      },
      /** @source ESP.html fire-block 4 — p (both paragraphs) | ENG.html fire-block 4 — p | PT.html fire-block 4 — p */
      paragraphs: {
        es: [
          'El Cuarto Fuego fue originalmente entregado al pueblo por dos profetas. Vinieron como uno solo. Hablaron de la llegada de la Raza de Piel Clara. Uno de los profetas dijo: "Sabrán el futuro de nuestro pueblo por el rostro que use la Raza de Piel Clara. Si vienen usando el rostro de nee-kon-nis-i-win\' (hermandad), entonces habrá un tiempo de cambios maravillosos para las generaciones venideras. Traerán nuevos conocimientos y artículos que podrán unirse al conocimiento de esta tierra. De esta manera, dos naciones se unirán para formar una nación poderosa. A esta nueva nación se unirán dos más, de modo que las cuatro formarán la nación más poderosa de todas. Conocerán el rostro de la hermandad si la Raza de Piel Clara viene sin portar armas, si vienen llevando solo su conocimiento y un apretón de manos".',
          'El otro profeta advirtió: "Tengan cuidado si la Raza de Piel Clara viene usando el rostro de ni-boo-win\' (muerte). Deben ser cuidadosos porque el rostro de la hermandad y el rostro de la muerte se parecen mucho. Si vienen portando un arma... tengan cuidado. Si vienen en sufrimiento... podrían engañarlos. Sus corazones pueden estar llenos de codicia por las riquezas de esta tierra. Si son verdaderamente sus hermanos, dejen que lo demuestren. No los acepten con total confianza. Sabrán que el rostro que usan es el de la muerte si los ríos corren con veneno y los peces no son aptos para comer. Los conocerán por estas muchas cosas".',
        ],
        en: [
          'The Fourth Fire was originally given to the people by two prophets. They came as one. They told of the coming of the Light-skinned Race. One of the prophets said, "You will know the future of our people by what face the Light-skinned Race wears. If they come wearing the face of nee-kon-nis-i-win\' (brotherhood), then there will come a time of wonderful change for generations to come. They will bring new knowledge and articles that can be joined with the knowledge of this country. In this way two nations will join to make a mighty nation. This new nation will be joined by two more so that the four will form the mightiest nation of all. You will know the face of brotherhood if the Light-skinned Race comes carrying no weapons, if they come bearing only their knowledge and a handshake."',
          'The other prophet said, "Beware if the Light-skinned Race comes wearing the face of ni-boo-win\' (death). You must be careful because the face of brotherhood and the face of death look very much alike. If they come carrying a weapon... beware. If they come in suffering... they could fool you. Their hearts may be filled with greed for the riches of this land. If they are indeed your brothers, let them prove it. Do not accept them in total trust. You shall know that the face they wear is the one of death if the rivers run with poison and fish become unfit to eat. You shall know them by these many things."',
        ],
        pt: [
          'O Quarto Fogo foi originalmente entregue ao povo por dois profetas. Eles vieram como um só. Falaram da chegada da Raça de Pele Clara. Um dos profetas disse: "Vocês saberão o futuro de nosso povo pelo rosto que a Raça de Pele Clara usar. Se eles vierem usando o rosto de nee-kon-nis-i-win\' (irmandade), então haverá um tempo de mudanças maravilhosas para as gerações vindouras. Trarão novos conhecimentos e artigos que podem ser unidos ao conhecimento desta terra. Desta forma, duas nações se unirão para formar uma nação poderosa. A esta nova nação se juntarão mais duas, de modo que as quatro formarão a nação mais poderosa de todas. Vocês conhecerão o rosto da irmandade se a Raça de Pele Clara vier sem portar armas, se vierem trazendo apenas seu conhecimento e um aperto de mãos."',
          'O outro profeta alertou: "Tenham cuidado se a Raça de Pele Clara vier usando o rosto de ni-boo-win\' (morte). Vocês devem ser cuidadosos porque o rosto da irmandade e o rosto da morte se parecem muito. Se vierem portando uma arma... tenham cuidado. Se vierem em sofrimento... poderiam enganá-los. Seus corações podem estar cheios de cobiça pelas riquezas desta terra. Se são verdadeiramente seus irmãos, deixem que provem. Não os aceitem com total confiança. Vocês saberão que o rosto que usam é o da morte se os rios correrem com veneno e os peixes não forem próprios para comer. Vocês os conhecerão por estas muitas coisas."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 5
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 5,
      /** @source ESP.html fire-block 5 — .fire-title | ENG.html fire-block 5 | PT.html fire-block 5 */
      title: {
        es: 'El Quinto Fuego',
        en: 'The Fifth Fire',
        pt: 'O Quinto Fogo',
      },
      /** @source ESP.html fire-block 5 — p | ENG.html fire-block 5 — p | PT.html fire-block 5 — p */
      paragraphs: {
        es: [
          'El quinto profeta dijo: "En el tiempo del Quinto Fuego vendrá un tiempo de gran lucha que atrapará las vidas de todos los pueblos nativos. Al menguar este Fuego, vendrá entre el pueblo uno que tiene una promesa de gran alegría y salvación. Si el pueblo acepta esta promesa de un nuevo camino y abandona las viejas enseñanzas, entonces la lucha del Quinto Fuego estará con el pueblo por muchas generaciones. La promesa que viene resultará ser una promesa falsa. Todos aquellos que acepten esta promesa causarán la casi destrucción del pueblo".',
        ],
        en: [
          'The fifth prophet said, "In the time of the Fifth Fire there will come a time of great struggle that will grip the lives of all Native people. At the waning of this Fire there will come among the people one who holds a promise of great joy and salvation. If the people accept this promise of a new way and abandon the old teachings, then the struggle of the Fifth Fire will be with the people for many generations. The promise that comes will prove to be a false promise. All those who accept this promise will cause the near destruction of the people."',
        ],
        pt: [
          'O quinto profeta disse: "No tempo do Quinto Fogo virá um tempo de grande luta que aprisionará as vidas de todos os povos nativos. Ao minguar este Fogo, virá entre o povo um que tem uma promessa de grande alegria e salvação. Se o povo aceitar esta promessa de um novo caminho e abandonar os velhos ensinamentos, então a luta do Quinto Fogo estará com o povo por muitas gerações. A promessa que vem se mostrará como uma promessa falsa. Todos aqueles que aceitarem esta promessa causarão a quase destruição do povo."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 6
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 6,
      /** @source ESP.html fire-block 6 — .fire-title | ENG.html fire-block 6 | PT.html fire-block 6 */
      title: {
        es: 'El Sexto Fuego',
        en: 'The Sixth Fire',
        pt: 'O Sexto Fogo',
      },
      /** @source ESP.html fire-block 6 — p | ENG.html fire-block 6 — p | PT.html fire-block 6 — p */
      paragraphs: {
        es: [
          'El profeta del Sexto Fuego dijo: "En el tiempo del Sexto Fuego será evidente que la promesa del Quinto Fuego vino de manera falsa. Aquellos engañados por esta promesa alejarán a sus hijos de las enseñanzas de los chi-ah-ya-og\' (ancianos). Los nietos y nietas se volverán contra los ancianos. De esta manera los ancianos perderán su razón de vivir... perderán su propósito en la vida. En este tiempo una nueva enfermedad vendrá entre el pueblo. El equilibrio de mucha gente se perturbará. La copa de la vida casi se derramará. La copa de la vida casi se convertirá en la copa del dolor".',
        ],
        en: [
          'The prophet of the Sixth Fire said, "In the time of the Sixth Fire it will be evident that the promise of the Fifth Fire came in a false way. Those deceived by this promise will take their children away from the teachings of the chi-ah-ya-og\' (elders). Grandsons and granddaughters will turn against the elders. In this way the elders will lose their reason for living... they will lose their purpose in life. At this time a new sickness will come among the people. The balance of many people will be disturbed. The cup of life will almost be spilled. The cup of life will almost become the cup of grief."',
        ],
        pt: [
          'O profeta do Sexto Fogo disse: "No tempo do Sexto Fogo ficará evidente que a promessa do Quinto Fogo veio de maneira falsa. Aqueles enganados por esta promessa afastarão seus filhos dos ensinamentos dos chi-ah-ya-og\' (anciãos). Netos e netas se voltarão contra os anciãos. Desta forma os anciãos perderão sua razão de viver... perderão seu propósito na vida. Neste tempo uma nova doença virá entre o povo. O equilíbrio de muitas pessoas será perturbado. A taça da vida quase será derramada. A taça da vida quase se tornará a taça da dor."',
        ],
      },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FIRE 7
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
      id: 7,
      /** @source ESP.html fire-block 7 — .fire-title | ENG.html fire-block 7 | PT.html fire-block 7 */
      title: {
        es: 'El Séptimo Fuego',
        en: 'The Seventh Fire',
        pt: 'O Sétimo Fogo',
      },
      /** @source ESP.html fire-block 7 — p (3 paragraphs) | ENG.html fire-block 7 — p | PT.html fire-block 7 — p */
      paragraphs: {
        es: [
          'El séptimo profeta que vino al pueblo hace mucho tiempo se decía que era diferente de los otros profetas. Era joven y tenía una luz extraña en sus ojos. Dijo: "En el tiempo del Séptimo Fuego surgirá un Osh-ki-bi-ma-di-zeeg\' (Nuevo Pueblo). Retrazarán sus pasos para encontrar lo que se dejó en el sendero. Sus pasos los llevarán a los ancianos a quienes pedirán que los guíen en su viaje. Pero muchos de los ancianos habrán caído dormidos. Despertarán a este nuevo tiempo sin nada que ofrecer. Algunos de los ancianos guardarán silencio por miedo. Algunos de los ancianos guardarán silencio porque nadie les preguntará nada. El Nuevo Pueblo tendrá que ser cuidadoso en cómo se acercan a los ancianos. La tarea del Nuevo Pueblo no será fácil.',
          '"Si el Nuevo Pueblo se mantiene fuerte en su búsqueda, el Tambor de Agua de la Logia Midewiwin volverá a hacer sonar su voz. Habrá un renacimiento de la nación Anishinabe y un reencendido de las viejas llamas. El Fuego Sagrado volverá a encenderse.',
          '"Es en este tiempo que a la Raza de Piel Clara se le dará una elección entre dos caminos. Si eligen el camino correcto, entonces el Séptimo Fuego encenderá el Octavo y Final Fuego — un Fuego eterno de paz, amor, hermandad y fraternidad. Si la Raza de Piel Clara hace la elección equivocada de caminos, entonces la destrucción que trajeron consigo al venir a este país volverá a ellos y causará mucho sufrimiento y muerte a todos los pueblos de la Tierra".',
        ],
        en: [
          'The seventh prophet that came to the people long ago was said to be different from the other prophets. He was young and had a strange light in his eyes. He said, "In the time of the Seventh Fire a Osh-ki-bi-ma-di-zeeg\' (New People) will emerge. They will retrace their steps to find what was left by the trail. Their steps will take them to the elders who they will ask to guide them on their journey. But many of the elders will have fallen asleep. They will awaken to this new time with nothing to offer. Some of the elders will be silent out of fear. Some of the elders will be silent because no one will ask anything of them. The New People will have to be careful in how they approach the elders. The task of the New People will not be easy.',
          '"If the New People will remain strong in their quest, the Waterdrum of the Midewiwin Lodge will again sound its voice. There will be a rebirth of the Anishinabe nation and a rekindling of old flames. The Sacred Fire will again be lit.',
          '"It is at this time that the Light-skinned Race will be given a choice between two roads. If they choose the right road, then the Seventh Fire will light the Eighth and Final Fire — an eternal Fire of peace, love, brotherhood and sisterhood. If the Light-skinned Race makes the wrong choice of roads, then the destruction which they brought with them in coming to this country will come back to them and cause much suffering and death to all the Earth\'s people."',
        ],
        pt: [
          'O sétimo profeta que veio ao povo há muito tempo dizia-se que era diferente dos outros profetas. Era jovem e tinha uma luz estranha em seus olhos. Disse: "No tempo do Sétimo Fogo surgirá um Osh-ki-bi-ma-di-zeeg\' (Novo Povo). Eles refazerão seus passos para encontrar o que foi deixado no caminho. Seus passos os levarão aos anciãos a quem pedirão que os guiem em sua jornada. Mas muitos dos anciãos terão adormecido. Despertarão para este novo tempo sem nada a oferecer. Alguns dos anciãos ficarão em silêncio por medo. Alguns dos anciãos ficarão em silêncio porque ninguém lhes perguntará nada. O Novo Povo terá que ser cuidadoso em como se aproximam dos anciãos. A tarefa do Novo Povo não será fácil.',
          '"Se o Novo Povo permanecer forte em sua busca, o Tambor de Água da Loja Midewiwin voltará a fazer soar sua voz. Haverá um renascimento da nação Anishinabe e uma reacendida das antigas chamas. O Fogo Sagrado será novamente aceso.',
          '"É neste tempo que à Raça de Pele Clara será dada uma escolha entre dois caminhos. Se escolherem o caminho certo, então o Sétimo Fogo acenderá o Oitavo e Final Fogo — um Fogo eterno de paz, amor, irmandade e fraternidade. Se a Raça de Pele Clara fizer a escolha errada de caminhos, então a destruição que trouxeram consigo ao vir para este país voltará para eles e causará muito sofrimento e morte a todos os povos da Terra."',
        ],
      },
    },
  ],

  // ── Narrative Interlude (between Fire 6 and Fire 7) ────────────────────
  /** @source ESP.html paragraphs between fire-block 6 and fire-block 7 | ENG.html same | PT.html same */
  narrativeInterlude: {
    es: [
      'En el tiempo de estas predicciones, mucha gente se burló de los profetas. Entonces tenían mush-kee-ki-wi-nun\' (medicinas) para mantener alejada la enfermedad. Entonces eran saludables y felices como pueblo. Estas fueron las personas que eligieron quedarse atrás en la gran migración de los Anishinabe. Estas personas fueron las primeras en tener contacto con la Raza de Piel Clara. Ellos sufrirían más.',
      'Cuando el Quinto Fuego llegó, una gran lucha ciertamente atrapó las vidas de todos los pueblos nativos. La Raza de Piel Clara lanzó un ataque militar contra los pueblos indígenas en todo el país, con el objetivo de quitarles su tierra y su independencia como pueblo libre y soberano. Ahora se siente que la falsa promesa que vino al final del Quinto Fuego fueron los materiales y riquezas encarnados en el modo de vida de la Raza de Piel Clara. Aquellos que abandonaron las antiguas formas y aceptaron esta nueva promesa fueron un gran factor en causar la casi destrucción de los pueblos nativos de esta tierra.',
      'Cuando el Sexto Fuego llegó, las palabras del profeta sonaron verdaderas cuando los niños fueron alejados de las enseñanzas de los ancianos. La era de los internados para "civilizar" a los niños indígenas había comenzado. El idioma y la religión indígena fueron quitados a los niños. El pueblo comenzó a morir a edad temprana... habían perdido su voluntad de vivir y su propósito en la vida.',
      'En los tiempos confusos del Sexto Fuego, se dice que un grupo de visionarios vino entre los Anishinabe. Reunieron a todos los sacerdotes de la Logia Midewiwin. Les dijeron a los sacerdotes que el Camino Midewiwin estaba en peligro de ser destruido. Reunieron todos los bultos sagrados. Reunieron todos los pergaminos Wee-gwas que registraban las ceremonias. Todas estas cosas fueron colocadas en un tronco ahuecado de Ma-none\' (el árbol de hierro). Los hombres fueron bajados por un acantilado con largas cuerdas. Cavaron un agujero en el acantilado y enterraron el tronco donde nadie pudiera encontrarlo. Así las enseñanzas de los ancianos fueron escondidas de la vista pero no de la memoria. Se dijo que cuando llegara el momento en que el pueblo indígena pudiera practicar su religión sin miedo, un niño pequeño soñaría dónde estaba enterrado el tronco de hierro lleno de bultos sagrados y pergaminos. Él conduciría a su pueblo al lugar.',
    ],
    en: [
      'At the time of these predictions, many people scoffed at the prophets. They then had mush-kee-ki-wi-nun\' (medicines) to keep away sickness. They were then healthy and happy as a people. These were the people who chose to stay behind on the great migration of the Anishinabe. These people were the first to have contact with the Light-skinned Race. They would suffer the most.',
      'When the Fifth Fire came to pass, a great struggle did indeed grip the lives of all Native people. The Light-skinned Race launched a military attack on Indian people throughout the country aimed at taking away their land and their independence as a free and sovereign people. It is now felt that the false promise that came at the end of the Fifth Fire was the materials and riches embodied in the way of life of the Light-skinned Race. Those who abandoned the ancient ways and accepted this new promise were a big factor in causing the near-destruction of the Native people of this land.',
      'When the Sixth Fire came to be, the words of the prophet rang true as children were taken away from the teachings of the elders. The boarding school era of "civilizing" Indian children had begun. The Indian language and religion were taken from the children. The people starting dying at an early age... they had lost their will to live and their purpose in living.',
      'In the confusing times of the Sixth Fire, it is said that a group of visionaries came among the Anishinabe. They gathered all the priests of the Midewiwin Lodge. They told the priests that the Midewiwin Way was in danger of being destroyed. They gathered all the sacred bundles. They gathered all the Wee-gwas scrolls that recorded the ceremonies. All these things were placed in a hollowed-out log from Ma-none\' (the ironwood tree). Men were lowered over a cliff by long ropes. They dug a hole in the cliff and buried the log where no one could find it. Thus the teachings of the elders were hidden out of sight but not out of memory. It was said that when the time came that Indian people could practice their religion without fear that a little boy would dream where the ironwood log full of sacred bundles and scrolls was buried. He would lead his people to the place.',
    ],
    pt: [
      'No tempo destas predições, muitas pessoas zombaram dos profetas. Eles então tinham mush-kee-ki-wi-nun\' (medicinas) para manter afastada a doença. Eram então saudáveis e felizes como povo. Estas foram as pessoas que escolheram ficar para trás na grande migração dos Anishinabe. Estas pessoas foram as primeiras a ter contato com a Raça de Pele Clara. Elas sofreriam mais.',
      'Quando o Quinto Fogo chegou, uma grande luta realmente aprisionou as vidas de todos os povos nativos. A Raça de Pele Clara lançou um ataque militar contra os povos indígenas por todo o país, com o objetivo de tirar-lhes sua terra e sua independência como povo livre e soberano. Agora se sente que a falsa promessa que veio ao final do Quinto Fogo foram os materiais e riquezas encarnados no modo de vida da Raça de Pele Clara. Aqueles que abandonaram as antigas formas e aceitaram esta nova promessa foram um grande fator em causar a quase destruição dos povos nativos desta terra.',
      'Quando o Sexto Fogo chegou, as palavras do profeta soaram verdadeiras quando as crianças foram afastadas dos ensinamentos dos anciãos. A era dos internatos para "civilizar" as crianças indígenas havia começado. A língua e a religião indígena foram tiradas das crianças. O povo começou a morrer em idade precoce... haviam perdido sua vontade de viver e seu propósito na vida.',
      'Nos tempos confusos do Sexto Fogo, diz-se que um grupo de visionários veio entre os Anishinabe. Reuniram todos os sacerdotes da Loja Midewiwin. Disseram aos sacerdotes que o Caminho Midewiwin estava em perigo de ser destruído. Reuniram todos os fardos sagrados. Reuniram todos os pergaminhos Wee-gwas que registravam as cerimônias. Todas estas coisas foram colocadas num tronco oco de Ma-none\' (a árvore de ferro). Homens foram baixados por um penhasco com longas cordas. Cavaram um buraco no penhasco e enterraram o tronco onde ninguém poderia encontrá-lo. Assim os ensinamentos dos anciãos foram escondidos da vista mas não da memória. Foi dito que quando chegasse o momento em que o povo indígena pudesse praticar sua religião sem medo, um menino pequeno sonharia onde o tronco de ferro cheio de fardos sagrados e pergaminhos estava enterrado. Ele conduziria seu povo ao lugar.',
    ],
  },

  // ── Highlight Paragraph ─────────────────────────────────────────────────
  /** @source ESP.html .highlight-para | ENG.html .highlight-para | PT.html .highlight-para */
  highlight: {
    es: '"Los pueblos tradicionales Mide de los Ojibway y personas de otras naciones han interpretado los \'dos caminos\' que enfrenta la Raza de Piel Clara como el camino hacia la tecnología y el camino hacia la espiritualidad."',
    en: '"Traditional Mide people of Ojibway and people from other nations have interpreted the \'two roads\' that face the Light-skinned Race as the road to technology and road to spiritualism."',
    pt: '"Povos tradicionais Mide dos Ojibway e pessoas de outras nações interpretaram os \'dois caminhos\' que enfrentam a Raça de Pele Clara como o caminho para a tecnologia e o caminho para a espiritualidade."',
  },

  // ── Closing Reflection Paragraphs ───────────────────────────────────────
  /** @source ESP.html main.prophecy-content > p (last 3 before final question) | ENG.html same | PT.html same */
  closingParagraphs: {
    es: [
      'Sienten que el camino hacia la tecnología representa una continuación de la prisa precipitada hacia el desarrollo tecnológico. Este es el camino que ha llevado a la sociedad moderna a una Tierra dañada y quemada. ¿Podría ser que el camino hacia la tecnología represente una prisa hacia la destrucción? El camino hacia la espiritualidad representa el sendero más lento que los pueblos nativos tradicionales han recorrido y ahora buscan nuevamente. La Tierra no está quemada en este sendero. La hierba aún crece allí.',
      'El profeta del Cuarto Fuego habló de un tiempo cuando "dos naciones se unirán para formar una nación poderosa". Estaba hablando de la llegada de la Raza de Piel Clara y del rostro de hermandad que el hermano de piel clara podría estar usando. Es obvio por la historia de este país que este no fue el rostro usado por la Raza de Piel Clara en su conjunto. Esa nación poderosa de la que se habló en el Cuarto Fuego nunca se ha formado.',
      'Si nosotros, los pueblos naturales de la Tierra, pudiéramos simplemente usar el rostro de la hermandad, podríamos ser capaces de entregar a nuestra sociedad del camino hacia la destrucción. ¿Podríamos hacer que los dos caminos que hoy representan dos visiones del mundo en conflicto se unan para formar esa nación poderosa? ¿Podría formarse una nación que sea guiada por el respeto a todos los seres vivos?',
    ],
    en: [
      'They feel that the road to technology represents a continuation of the head-long rush to technological development. This is the road that has led modern society to a damaged and seared Earth. Could it be that the road to technology represents a rush to destruction? The road to spirituality represents the slower path that traditional Native people have traveled and are now seeking again. The Earth is not scorched on this trail. The grass is still growing there.',
      'The prophet of the Fourth Fire spoke of a time when "two nations will join to make a mighty nation." He was speaking of the coming of the Light-skinned Race and the face of brotherhood that the Light-skinned brother could be wearing. It is obvious from the history of this country that this was not the face worn by the Light-skinned Race as a whole. That mighty nation spoken of in the Fourth Fire has never been formed.',
      'If we natural people of the Earth could just wear the face of brotherhood, we might be able to deliver our society from the road to destruction. Could we make the two roads that today represent two clashing world views come together to form that mighty nation? Could a nation be formed that is guided by respect for all living things?',
    ],
    pt: [
      'Eles sentem que o caminho para a tecnologia representa uma continuação da pressa precipitada em direção ao desenvolvimento tecnológico. Este é o caminho que levou a sociedade moderna a uma Terra danificada e queimada. Poderia ser que o caminho para a tecnologia represente uma pressa para a destruição? O caminho para a espiritualidade representa o caminho mais lento que os povos nativos tradicionais percorreram e agora buscam novamente. A Terra não está queimada nesta trilha. A grama ainda cresce ali.',
      'O profeta do Quarto Fogo falou de um tempo quando "duas nações se unirão para formar uma nação poderosa". Ele estava falando da chegada da Raça de Pele Clara e do rosto de irmandade que o irmão de pele clara poderia estar usando. É óbvio pela história deste país que este não foi o rosto usado pela Raça de Pele Clara como um todo. Aquela nação poderosa de que se falou no Quarto Fogo nunca foi formada.',
      'Se nós, os povos naturais da Terra, pudéssemos simplesmente usar o rosto da irmandade, poderíamos ser capazes de livrar nossa sociedade do caminho para a destruição. Poderíamos fazer com que os dois caminhos que hoje representam duas visões de mundo em conflito se unissem para formar aquela nação poderosa? Poderia ser formada uma nação que seja guiada pelo respeito a todos os seres vivos?',
    ],
  },

  // ── Final Question ──────────────────────────────────────────────────────
  finalQuestion: {
    /** @source ESP.html .ignition-label (final-question-block) | ENG.html same | PT.html same */
    label: {
      es: 'La Pregunta Final',
      en: 'The Final Question',
      pt: 'A Pergunta Final',
    },
    /** @source ESP.html .final-question-text | ENG.html .final-question-text | PT.html .final-question-text */
    question: {
      es: '¿Somos nosotros el Nuevo Pueblo del Séptimo Fuego?',
      en: 'Are we the New People of the Seventh Fire?',
      pt: 'Somos nós o Novo Povo do Sétimo Fogo?',
    },
  },
};
