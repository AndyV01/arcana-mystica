import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

// Convierte cartas en un vector simple basado en keywords
function cardsToVector(cardData, lang = "es") {
  const keywords = cardData.flatMap(item => {
    const card = item.card ?? item
    const meaning = typeof card.meaning === "object"
      ? card.meaning[lang] ?? card.meaning.es ?? ""
      : card.meaning ?? ""
    const kws = Array.isArray(card.keywords)
      ? card.keywords
      : (card.keywords?.[lang] ?? card.keywords?.es ?? [])
    return [...kws, meaning].join(" ").toLowerCase().split(/\s+/)
  })
  return [...new Set(keywords)]
}

// Similitud entre dos vectores (Jaccard)
function similarity(vecA, vecB) {
  const setA = new Set(vecA)
  const setB = new Set(vecB)
  const intersection = [...setA].filter(w => setB.has(w)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

// Guarda una lectura en Redis
export async function saveReading({ userId, cardData, reading, spread, lang }) {
  const key = `readings:${userId}`
  const entry = {
    id: Date.now(),
    cardData,
    reading,
    spread: spread?.id ?? "single",
    lang,
    createdAt: new Date().toISOString()
  }

  await redis.lpush(key, JSON.stringify(entry))
  await redis.ltrim(key, 0, 49) // máximo 50 lecturas por usuario
}

// Recupera lecturas similares a las cartas actuales
export async function ragAgent({ userId, cardData, lang = "es", topK = 3 }) {
  try {
    const key = `readings:${userId}`
    const raw = await redis.lrange(key, 0, 49)

    if (!raw || raw.length === 0) return []

    const currentVector = cardsToVector(cardData, lang)

    const scored = raw.map(entry => {
      const parsed = typeof entry === "string" ? JSON.parse(entry) : entry
      const vec = cardsToVector(parsed.cardData, lang)
      return {
        ...parsed,
        score: similarity(currentVector, vec)
      }
    })

    return scored
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(e => ({
        reading: e.reading,
        spread: e.spread,
        createdAt: e.createdAt,
        score: e.score
      }))

  } catch (err) {
    console.error("RAG agent error:", err)
    return []
  }
}