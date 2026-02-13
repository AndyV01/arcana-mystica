// ─── Translations (i18n) ──────────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    appName: "Arcana Mystica",
    tagline: "78 cards. Infinite possibilities. Your destiny, revealed.",
    subtitle: "Ancient Wisdom",
    chooseSpread: "Choose Your Spread",
    deckLabel: "78-Card Rider-Waite Tarot Deck",
    seekers: "Seekers",
    readings: "Readings",
    revealCards: "Reveal your cards",
    cardsRemaining: (n) => `${n} card${n > 1 ? "s" : ""} remaining`,
    readingComplete: "Reading complete ✦",
    clickToReveal: "Click each card to unveil its wisdom",
    backToSpreads: "← Back to Spreads",
    yourReading: "✦ Your Reading ✦",
    newReading: "✦ New Reading ✦",
    upright: "Upright",
    reversed: "Reversed",
    uprightMeaning: "Upright Meaning",
    reversedMeaning: "Reversed Meaning",
    prev: "← Prev",
    next: "Next →",
    consultingArcana: "Consulting the Arcana",
    shufflingDesc: "The cards are aligning to your energy...",
    cards: (n) => `${n} ${n === 1 ? "card" : "cards"}`,
    element: "Element",
    keywords: "Keywords",
    langSwitch: "ES",
    lifePath: "Life Path",
  },
  es: {
    appName: "Arcana Mística",
    tagline: "78 cartas. Infinitas posibilidades. Tu destino, revelado.",
    subtitle: "Sabiduría Ancestral",
    chooseSpread: "Elige Tu Tirada",
    deckLabel: "Baraja Tarot Rider-Waite de 78 cartas",
    seekers: "Visitantes",
    readings: "Lecturas",
    revealCards: "Revela tus cartas",
    cardsRemaining: (n) => `${n} carta${n > 1 ? "s" : ""} restante${n > 1 ? "s" : ""}`,
    readingComplete: "Lectura completa ✦",
    clickToReveal: "Haz clic en cada carta para descubrir su sabiduría",
    backToSpreads: "← Volver a Tiradas",
    yourReading: "✦ Tu Lectura ✦",
    newReading: "✦ Nueva Lectura ✦",
    upright: "Al Derecho",
    reversed: "Invertida",
    uprightMeaning: "Significado al Derecho",
    reversedMeaning: "Significado Invertido",
    prev: "← Ant.",
    next: "Sig. →",
    consultingArcana: "Consultando los Arcanos",
    shufflingDesc: "Las cartas se alinean con tu energía...",
    cards: (n) => `${n} ${n === 1 ? "carta" : "cartas"}`,
    element: "Elemento",
    keywords: "Palabras clave",
    langSwitch: "EN",
    lifePath: "Camino de Vida",
  },
}

// ─── Spread Definitions (bilingual) ──────────────────────────────────────────
export const SPREADS = {
  en: [
    { id: "single",  name: "Single Card",            description: "One card for clarity",           count: 1,  positions: ["Your Message"] },
    { id: "three",   name: "Past · Present · Future", description: "Time's three faces",             count: 3,  positions: ["Past", "Present", "Future"] },
    { id: "celtic",  name: "Celtic Cross",            description: "The grand 10-card reading",      count: 10, positions: ["Present", "Challenge", "Past", "Future", "Above", "Below", "Self", "External", "Hopes & Fears", "Outcome"] },
    { id: "love",    name: "Love Reading",            description: "Matters of the heart",           count: 5,  positions: ["You", "Them", "Connection", "Obstacle", "Outcome"] },
  ],
  es: [
    { id: "single",  name: "Carta Única",             description: "Una carta para claridad",        count: 1,  positions: ["Tu Mensaje"] },
    { id: "three",   name: "Pasado · Presente · Futuro", description: "Las tres caras del tiempo",  count: 3,  positions: ["Pasado", "Presente", "Futuro"] },
    { id: "celtic",  name: "Cruz Celta",              description: "La gran lectura de 10 cartas",  count: 10, positions: ["Presente", "Desafío", "Pasado", "Futuro", "Encima", "Debajo", "Yo Mismo", "Externo", "Esperanzas y Miedos", "Resultado"] },
    { id: "love",    name: "Lectura de Amor",         description: "Asuntos del corazón",           count: 5,  positions: ["Tú", "La Otra Persona", "Conexión", "Obstáculo", "Resultado"] },
  ],
}

// ─── Major Arcana (bilingual) ─────────────────────────────────────────────────
export const MAJOR_ARCANA = [
  {
    id: 0, symbol: "☽", element: { en: "Air", es: "Aire" },
    name:        { en: "The Fool",         es: "El Loco" },
    keywords:    { en: "New beginnings, innocence, spontaneity", es: "Nuevos comienzos, inocencia, espontaneidad" },
    upright:     { en: "New beginnings, innocence, adventure, idealism", es: "Nuevos comienzos, inocencia, aventura, idealismo" },
    reversed:    { en: "Recklessness, taken advantage of, inconsideration", es: "Imprudencia, ingenuidad, inconsideración" },
    description: { en: "The Fool represents the dawn of a new journey — boundless potential before experience has shaped you.", es: "El Loco representa el alba de un nuevo viaje — potencial ilimitado antes de que la experiencia te moldee." },
  },
  {
    id: 1, symbol: "✦", element: { en: "Air", es: "Aire" },
    name:        { en: "The Magician",     es: "El Mago" },
    keywords:    { en: "Willpower, desire, creation, manifestation", es: "Voluntad, deseo, creación, manifestación" },
    upright:     { en: "Willpower, desire, creation, manifestation", es: "Voluntad, deseo, creación, manifestación" },
    reversed:    { en: "Trickery, illusions, out of touch", es: "Engaño, ilusiones, desconexión de la realidad" },
    description: { en: "The Magician channels the forces of the universe through sheer will, transforming intention into reality.", es: "El Mago canaliza las fuerzas del universo mediante la pura voluntad, transformando la intención en realidad." },
  },
  {
    id: 2, symbol: "☾", element: { en: "Water", es: "Agua" },
    name:        { en: "The High Priestess", es: "La Suma Sacerdotisa" },
    keywords:    { en: "Intuition, sacred knowledge, divine feminine", es: "Intuición, conocimiento sagrado, lo divino femenino" },
    upright:     { en: "Intuition, sacred knowledge, divine feminine, the subconscious", es: "Intuición, conocimiento sagrado, lo femenino divino, el subconsciente" },
    reversed:    { en: "Secrets, disconnected from intuition, withdrawal", es: "Secretos, desconexión de la intuición, retraimiento" },
    description: { en: "The High Priestess guards the veil between the seen and unseen worlds, keeper of mysteries.", es: "La Suma Sacerdotisa guarda el velo entre los mundos visible e invisible, guardiana de los misterios." },
  },
  {
    id: 3, symbol: "♀", element: { en: "Earth", es: "Tierra" },
    name:        { en: "The Empress",      es: "La Emperatriz" },
    keywords:    { en: "Femininity, beauty, nature, nurturing, abundance", es: "Feminidad, belleza, naturaleza, nutrición, abundancia" },
    upright:     { en: "Femininity, beauty, nature, nurturing, abundance", es: "Feminidad, belleza, naturaleza, nutrición, abundancia" },
    reversed:    { en: "Creative block, dependence on others", es: "Bloqueo creativo, dependencia de otros" },
    description: { en: "The Empress embodies creation in its most fertile form — abundance, beauty, and the nurturing earth.", es: "La Emperatriz encarna la creación en su forma más fértil — abundancia, belleza y la tierra nutricia." },
  },
  {
    id: 4, symbol: "♂", element: { en: "Fire", es: "Fuego" },
    name:        { en: "The Emperor",      es: "El Emperador" },
    keywords:    { en: "Authority, establishment, structure, a father figure", es: "Autoridad, orden, estructura, figura paterna" },
    upright:     { en: "Authority, establishment, structure, a father figure", es: "Autoridad, estructura, estabilidad, figura paterna" },
    reversed:    { en: "Tyranny, rigidity, coldness", es: "Tiranía, rigidez, frialdad" },
    description: { en: "The Emperor represents order and authority — the structured world built by civilization and reason.", es: "El Emperador representa el orden y la autoridad — el mundo estructurado construido por la civilización y la razón." },
  },
  {
    id: 5, symbol: "⛩", element: { en: "Earth", es: "Tierra" },
    name:        { en: "The Hierophant",   es: "El Sumo Sacerdote" },
    keywords:    { en: "Spiritual wisdom, tradition, conformity, morality", es: "Sabiduría espiritual, tradición, conformidad, moral" },
    upright:     { en: "Spiritual wisdom, tradition, conformity, morality, ethics", es: "Sabiduría espiritual, tradición, conformidad, moral, ética" },
    reversed:    { en: "Personal beliefs, freedom, challenging the status quo", es: "Creencias personales, libertad, cuestionar el statu quo" },
    description: { en: "The Hierophant bridges the divine and mortal realms, keeper of sacred tradition and institutional knowledge.", es: "El Sumo Sacerdote une lo divino y lo mortal, guardián de la tradición sagrada y el conocimiento institucional." },
  },
  {
    id: 6, symbol: "♡", element: { en: "Air", es: "Aire" },
    name:        { en: "The Lovers",       es: "Los Amantes" },
    keywords:    { en: "Love, harmony, relationships, values alignment", es: "Amor, armonía, relaciones, alineación de valores" },
    upright:     { en: "Love, harmony, relationships, values alignment, choices", es: "Amor, armonía, relaciones, alineación de valores, elecciones" },
    reversed:    { en: "Self-love, disharmony, imbalance, misalignment of values", es: "Amor propio, desarmonía, desequilibrio, desalineación de valores" },
    description: { en: "The Lovers speaks of union — both romantic and of opposing forces finding perfect harmony.", es: "Los Amantes hablan de unión — tanto romántica como de fuerzas opuestas encontrando armonía perfecta." },
  },
  {
    id: 7, symbol: "⊕", element: { en: "Water", es: "Agua" },
    name:        { en: "The Chariot",      es: "El Carro" },
    keywords:    { en: "Control, willpower, success, determination", es: "Control, voluntad, éxito, determinación" },
    upright:     { en: "Control, willpower, success, action, determination", es: "Control, voluntad, éxito, acción, determinación" },
    reversed:    { en: "Self-discipline, opposition, lack of direction", es: "Autodisciplina, oposición, falta de dirección" },
    description: { en: "The Chariot commands opposing forces into unified forward motion through discipline and will.", es: "El Carro dirige fuerzas opuestas hacia un movimiento hacia adelante unificado mediante la disciplina y la voluntad." },
  },
  {
    id: 8, symbol: "∞", element: { en: "Fire", es: "Fuego" },
    name:        { en: "Strength",         es: "La Fuerza" },
    keywords:    { en: "Strength, courage, patience, control, compassion", es: "Fuerza, coraje, paciencia, control, compasión" },
    upright:     { en: "Strength, courage, patience, control, compassion", es: "Fuerza, coraje, paciencia, control, compasión" },
    reversed:    { en: "Inner strength, self-doubt, low energy, raw emotion", es: "Fuerza interior, dudas, baja energía, emoción cruda" },
    description: { en: "True strength is not force but mastery — the gentle hand that guides the lion.", es: "La verdadera fuerza no es la violencia sino el dominio — la mano gentil que guía al león." },
  },
  {
    id: 9, symbol: "🕯", element: { en: "Earth", es: "Tierra" },
    name:        { en: "The Hermit",       es: "El Ermitaño" },
    keywords:    { en: "Soul-searching, introspection, being alone, inner guidance", es: "Búsqueda interior, introspección, soledad, guía interna" },
    upright:     { en: "Soul-searching, introspection, being alone, inner guidance", es: "Búsqueda del alma, introspección, soledad, guía interior" },
    reversed:    { en: "Isolation, loneliness, withdrawal", es: "Aislamiento, soledad, retraimiento" },
    description: { en: "The Hermit retreats to the mountaintop not to hide, but to illuminate the path for those who follow.", es: "El Ermitaño se retira a la cima de la montaña no para esconderse, sino para iluminar el camino a quienes siguen." },
  },
  {
    id: 10, symbol: "☸", element: { en: "Fire", es: "Fuego" },
    name:        { en: "Wheel of Fortune", es: "La Rueda de la Fortuna" },
    keywords:    { en: "Good luck, karma, life cycles, destiny, a turning point", es: "Buena suerte, karma, ciclos de vida, destino, punto de inflexión" },
    upright:     { en: "Good luck, karma, life cycles, destiny, a turning point", es: "Buena suerte, karma, ciclos vitales, destino, punto de inflexión" },
    reversed:    { en: "Bad luck, resistance to change, breaking cycles", es: "Mala suerte, resistencia al cambio, ruptura de ciclos" },
    description: { en: "The Wheel of Fortune turns without sentiment — fate elevates and humbles in equal measure.", es: "La Rueda de la Fortuna gira sin sentimiento — el destino eleva y humilla en igual medida." },
  },
  {
    id: 11, symbol: "⚖", element: { en: "Air", es: "Aire" },
    name:        { en: "Justice",          es: "La Justicia" },
    keywords:    { en: "Justice, fairness, truth, cause and effect, law", es: "Justicia, equidad, verdad, causa y efecto, ley" },
    upright:     { en: "Justice, fairness, truth, cause and effect, law", es: "Justicia, equidad, verdad, causa y efecto, ley" },
    reversed:    { en: "Unfairness, lack of accountability, dishonesty", es: "Injusticia, falta de responsabilidad, deshonestidad" },
    description: { en: "Justice holds the scales of truth — every action reverberates through the fabric of karma.", es: "La Justicia sostiene las balanzas de la verdad — cada acción resuena en el tejido del karma." },
  },
  {
    id: 12, symbol: "☯", element: { en: "Water", es: "Agua" },
    name:        { en: "The Hanged Man",   es: "El Colgado" },
    keywords:    { en: "Pause, surrender, letting go, new perspectives", es: "Pausa, rendición, dejar ir, nuevas perspectivas" },
    upright:     { en: "Pause, surrender, letting go, new perspectives", es: "Pausa, rendición, soltar, nuevas perspectivas" },
    reversed:    { en: "Delays, resistance, stalling, indecision", es: "Demoras, resistencia, estancamiento, indecisión" },
    description: { en: "The Hanged Man surrenders control to gain a perspective inaccessible from any other vantage point.", es: "El Colgado renuncia al control para obtener una perspectiva inaccesible desde cualquier otro punto de vista." },
  },
  {
    id: 13, symbol: "⌛", element: { en: "Water", es: "Agua" },
    name:        { en: "Death",            es: "La Muerte" },
    keywords:    { en: "Endings, change, transformation, transition", es: "Finales, cambio, transformación, transición" },
    upright:     { en: "Endings, change, transformation, transition", es: "Finales, cambio, transformación, transición" },
    reversed:    { en: "Resistance to change, personal transformation, inner purging", es: "Resistencia al cambio, transformación personal, purga interior" },
    description: { en: "Death is not an ending but the most profound transformation — the caterpillar becoming the butterfly.", es: "La Muerte no es un final sino la transformación más profunda — la oruga convirtiéndose en mariposa." },
  },
  {
    id: 14, symbol: "◈", element: { en: "Fire", es: "Fuego" },
    name:        { en: "Temperance",       es: "La Templanza" },
    keywords:    { en: "Balance, moderation, patience, purpose, meaning", es: "Equilibrio, moderación, paciencia, propósito, significado" },
    upright:     { en: "Balance, moderation, patience, purpose, meaning", es: "Equilibrio, moderación, paciencia, propósito, significado" },
    reversed:    { en: "Imbalance, excess, self-healing, re-alignment", es: "Desequilibrio, exceso, autocuración, realineación" },
    description: { en: "Temperance blends opposing streams into a perfectly balanced current — the art of the middle way.", es: "La Templanza mezcla corrientes opuestas en un flujo perfectamente equilibrado — el arte del camino medio." },
  },
  {
    id: 15, symbol: "△", element: { en: "Earth", es: "Tierra" },
    name:        { en: "The Devil",        es: "El Diablo" },
    keywords:    { en: "Shadow self, attachment, addiction, restriction, sexuality", es: "Sombra interior, apego, adicción, restricción, sexualidad" },
    upright:     { en: "Shadow self, attachment, addiction, restriction, sexuality", es: "Sombra del ser, apego, adicción, restricción, sexualidad" },
    reversed:    { en: "Releasing limiting beliefs, exploring dark thoughts, detachment", es: "Liberación de creencias limitantes, explorar pensamientos oscuros, desapego" },
    description: { en: "The Devil illuminates what chains us — and reveals that often, we hold our own shackles.", es: "El Diablo ilumina lo que nos encadena — y revela que a menudo, nosotros sostenemos nuestras propias cadenas." },
  },
  {
    id: 16, symbol: "⚡", element: { en: "Fire", es: "Fuego" },
    name:        { en: "The Tower",        es: "La Torre" },
    keywords:    { en: "Sudden change, upheaval, chaos, revelation, awakening", es: "Cambio súbito, caos, revelación, despertar" },
    upright:     { en: "Sudden change, upheaval, chaos, revelation, awakening", es: "Cambio repentino, agitación, caos, revelación, despertar" },
    reversed:    { en: "Personal transformation, fear of change, averting disaster", es: "Transformación personal, miedo al cambio, evitar el desastre" },
    description: { en: "The Tower falls to reveal what was always true — that which is built on false foundations must crumble.", es: "La Torre cae para revelar lo que siempre fue verdad — lo que se construye sobre cimientos falsos debe derrumbarse." },
  },
  {
    id: 17, symbol: "★", element: { en: "Air", es: "Aire" },
    name:        { en: "The Star",         es: "La Estrella" },
    keywords:    { en: "Hope, faith, purpose, renewal, spirituality", es: "Esperanza, fe, propósito, renovación, espiritualidad" },
    upright:     { en: "Hope, faith, purpose, renewal, spirituality", es: "Esperanza, fe, propósito, renovación, espiritualidad" },
    reversed:    { en: "Lack of faith, despair, self-trust, disconnection", es: "Falta de fe, desesperación, confianza en sí mismo, desconexión" },
    description: { en: "The Star pours its healing waters after the storm — a promise that dawn follows every darkness.", es: "La Estrella vierte sus aguas sanadoras tras la tormenta — una promesa de que el alba sigue a toda oscuridad." },
  },
  {
    id: 18, symbol: "☽☾", element: { en: "Water", es: "Agua" },
    name:        { en: "The Moon",         es: "La Luna" },
    keywords:    { en: "Illusion, fear, the unconscious, intuition, confusion", es: "Ilusión, miedo, el inconsciente, intuición, confusión" },
    upright:     { en: "Illusion, fear, the unconscious, intuition, confusion", es: "Ilusión, miedo, el inconsciente, intuición, confusión" },
    reversed:    { en: "Release of fear, repressed emotion, inner confusion", es: "Liberación del miedo, emoción reprimida, confusión interior" },
    description: { en: "The Moon illuminates the hidden landscape of fears and dreams — truth wrapped in shifting shadows.", es: "La Luna ilumina el paisaje oculto de miedos y sueños — la verdad envuelta en sombras cambiantes." },
  },
  {
    id: 19, symbol: "☀", element: { en: "Fire", es: "Fuego" },
    name:        { en: "The Sun",          es: "El Sol" },
    keywords:    { en: "Positivity, fun, warmth, success, vitality", es: "Positividad, alegría, calidez, éxito, vitalidad" },
    upright:     { en: "Positivity, fun, warmth, success, vitality", es: "Positividad, diversión, calidez, éxito, vitalidad" },
    reversed:    { en: "Inner child, feeling down, overly optimistic", es: "Niño interior, sentirse decaído, exceso de optimismo" },
    description: { en: "The Sun radiates pure joy and vitality — the celebration of life in its most luminous expression.", es: "El Sol irradia pura alegría y vitalidad — la celebración de la vida en su expresión más luminosa." },
  },
  {
    id: 20, symbol: "♪", element: { en: "Fire", es: "Fuego" },
    name:        { en: "Judgement",        es: "El Juicio" },
    keywords:    { en: "Judgement, rebirth, inner calling, absolution", es: "Juicio, renacimiento, llamado interior, absolución" },
    upright:     { en: "Judgement, rebirth, inner calling, absolution", es: "Juicio, renacimiento, llamado interior, absolución" },
    reversed:    { en: "Self-doubt, inner critic, ignoring the call", es: "Dudas, crítica interior, ignorar el llamado" },
    description: { en: "Judgement calls forth from within what has been dormant — a resurrection of the truest self.", es: "El Juicio convoca desde adentro lo que ha estado dormido — una resurrección del ser más auténtico." },
  },
  {
    id: 21, symbol: "◉", element: { en: "Earth", es: "Tierra" },
    name:        { en: "The World",        es: "El Mundo" },
    keywords:    { en: "Completion, integration, accomplishment, travel", es: "Completitud, integración, logro, viaje" },
    upright:     { en: "Completion, integration, accomplishment, travel", es: "Completitud, integración, logro, viaje" },
    reversed:    { en: "Seeking personal closure, short-cuts, delays", es: "Buscar cierre personal, atajos, demoras" },
    description: { en: "The World is the moment of perfect wholeness — every cycle complete, every lesson integrated.", es: "El Mundo es el momento de plenitud perfecta — cada ciclo completo, cada lección integrada." },
  },
]

// ─── Minor Arcana generator ───────────────────────────────────────────────────
export function generateMinorArcana() {
  const suits = {
    en: ["Wands", "Cups", "Swords", "Pentacles"],
    es: ["Bastos", "Copas", "Espadas", "Oros"],
  }
  const elements = {
    Wands:     { en: "Fire",  es: "Fuego" },
    Cups:      { en: "Water", es: "Agua" },
    Swords:    { en: "Air",   es: "Aire" },
    Pentacles: { en: "Earth", es: "Tierra" },
  }
  const symbols = { Wands: "🪄", Cups: "🏆", Swords: "⚔️", Pentacles: "⭐" }
  const numbers = {
    en: ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"],
    es: ["As","Dos","Tres","Cuatro","Cinco","Seis","Siete","Ocho","Nueve","Diez"],
  }
  const courts = {
    en: ["Page","Knight","Queen","King"],
    es: ["Sota","Caballero","Reina","Rey"],
  }
  const cards = []
  let id = 22
  const enSuits = suits.en
  const esSuits = suits.es
  for (let si = 0; si < 4; si++) {
    const enSuit = enSuits[si]
    const esSuit = esSuits[si]
    const el = elements[enSuit]
    const sym = symbols[enSuit]
    for (let ni = 0; ni < 10; ni++) {
      cards.push({
        id: id++, symbol: sym,
        element: el,
        name:        { en: `${numbers.en[ni]} of ${enSuit}`, es: `${numbers.es[ni]} de ${esSuit}` },
        keywords:    { en: `${enSuit} energy, ${numbers.en[ni].toLowerCase()} vibration`, es: `Energía de ${esSuit}, vibración del ${numbers.es[ni].toLowerCase()}` },
        upright:     { en: `${enSuit} energy in its ${numbers.en[ni].toLowerCase()} expression`, es: `Energía de ${esSuit} en su expresión del ${numbers.es[ni].toLowerCase()}` },
        reversed:    { en: `Blocked ${enSuit.toLowerCase()} energy`, es: `Energía de ${esSuit.toLowerCase()} bloqueada` },
        description: { en: `The ${numbers.en[ni]} of ${enSuit} channels elemental power in a ${numbers.en[ni].toLowerCase()} expression.`, es: `El ${numbers.es[ni]} de ${esSuit} canaliza el poder elemental en una expresión del ${numbers.es[ni].toLowerCase()}.` },
      })
    }
    for (let ci = 0; ci < 4; ci++) {
      cards.push({
        id: id++, symbol: sym,
        element: el,
        name:        { en: `${courts.en[ci]} of ${enSuit}`, es: `${courts.es[ci]} de ${esSuit}` },
        keywords:    { en: `${courts.en[ci]}'s qualities of ${enSuit}`, es: `Cualidades del/la ${courts.es[ci]} de ${esSuit}` },
        upright:     { en: `Mastery of ${enSuit} energy as the ${courts.en[ci]}`, es: `Dominio de la energía de ${esSuit} como el/la ${courts.es[ci]}` },
        reversed:    { en: `Shadow aspects of the ${courts.en[ci]}`, es: `Aspectos sombríos del/la ${courts.es[ci]}` },
        description: { en: `The ${courts.en[ci]} of ${enSuit} embodies the ${courts.en[ci].toLowerCase()}'s relationship with ${enSuit.toLowerCase()} energy.`, es: `El/La ${courts.es[ci]} de ${esSuit} encarna la relación del/la ${courts.es[ci].toLowerCase()} con la energía de ${esSuit.toLowerCase()}.` },
      })
    }
  }
  return cards
}
