function getLocalizedValue(value, lang = "es") {
  if (value && typeof value === "object") {
    return value[lang] ?? value.es ?? value.en ?? Object.values(value)[0] ?? ""
  }

  return value ?? ""
}

function listToMap(items = []) {
  return new Map(
    items.map(item => [String(item.id ?? item.name), { ...item }])
  )
}

function mapToSortedList(map, limit = 5) {
  return [...map.values()]
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, limit)
}

function incrementMappedItem(map, key, payload) {
  const current = map.get(key)

  if (current) {
    current.count += 1
    return
  }

  map.set(key, { ...payload, count: 1 })
}

export function normalizeProfile(profile = {}) {
  return {
    version: 1,
    readingCount: Number(profile.readingCount ?? 0),
    lastReadingAt: profile.lastReadingAt ?? null,
    preferredLanguage: profile.preferredLanguage ?? "es",
    languageUsage: Array.isArray(profile.languageUsage) ? profile.languageUsage : [],
    spreadUsage: Array.isArray(profile.spreadUsage) ? profile.spreadUsage : [],
    recurringCards: Array.isArray(profile.recurringCards) ? profile.recurringCards : [],
    themeUsage: Array.isArray(profile.themeUsage) ? profile.themeUsage : [],
    profileSummary: typeof profile.profileSummary === "string" ? profile.profileSummary : "",
    lastReadingPreview: typeof profile.lastReadingPreview === "string" ? profile.lastReadingPreview : "",
    birthProfile: profile.birthProfile ?? null,
    nextAction: profile.nextAction ?? null
  }
}

export function summarizeCardData(cardData = [], lang = "es") {
  return cardData.map((item, index) => {
    const card = item.card ?? {}
    const orientation = item.reversed ? "reversed" : "upright"
    const meaningSource = item.reversed ? card.reversed : card.upright
    const keywordsRaw = getLocalizedValue(card.keywords, lang)

    return {
      index,
      id: card.id ?? index,
      name: getLocalizedValue(card.name, lang),
      orientation,
      meaning: getLocalizedValue(meaningSource, lang),
      element: getLocalizedValue(card.element, lang),
      keywords: String(keywordsRaw)
        .split(",")
        .map(keyword => keyword.trim())
        .filter(Boolean)
    }
  })
}

export function buildProfileSummary(profile, lang = "es") {
  const topSpread = profile.spreadUsage[0]
  const topCard = profile.recurringCards[0]
  const topTheme = profile.themeUsage[0]

  if (lang === "en") {
    const parts = [`${profile.readingCount} readings recorded`]

    if (topSpread) parts.push(`favorite spread: ${topSpread.name}`)
    if (topCard) parts.push(`recurring card: ${topCard.name}`)
    if (topTheme) parts.push(`current theme: ${topTheme.name}`)

    return parts.join(" | ")
  }

  const parts = [`${profile.readingCount} lecturas registradas`]

  if (topSpread) parts.push(`tirada favorita: ${topSpread.name}`)
  if (topCard) parts.push(`carta recurrente: ${topCard.name}`)
  if (topTheme) parts.push(`tema actual: ${topTheme.name}`)

  return parts.join(" | ")
}

export function updateProfileFromSession({
  profile,
  cardData,
  spread,
  birthData,
  lang = "es",
  generatedText = ""
}) {
  const nextProfile = normalizeProfile(profile)
  const cards = summarizeCardData(cardData, lang)
  const languageUsage = listToMap(nextProfile.languageUsage)
  const spreadUsage = listToMap(nextProfile.spreadUsage)
  const recurringCards = listToMap(nextProfile.recurringCards)
  const themeUsage = listToMap(nextProfile.themeUsage)

  nextProfile.readingCount += 1
  nextProfile.lastReadingAt = new Date().toISOString()
  nextProfile.preferredLanguage = lang

  incrementMappedItem(languageUsage, lang, { id: lang, name: lang.toUpperCase() })

  if (spread?.id || spread?.name) {
    incrementMappedItem(spreadUsage, String(spread.id ?? spread.name), {
      id: spread.id ?? spread.name,
      name: typeof spread.name === "string" ? spread.name : getLocalizedValue(spread.name, lang)
    })
  }

  for (const card of cards) {
    incrementMappedItem(recurringCards, String(card.id), {
      id: card.id,
      name: card.name
    })

    for (const keyword of card.keywords.slice(0, 3)) {
      incrementMappedItem(themeUsage, keyword.toLowerCase(), {
        id: keyword.toLowerCase(),
        name: keyword
      })
    }
  }

  if (birthData?.zodiac || birthData?.lifePathNum) {
    nextProfile.birthProfile = {
      zodiac: birthData.zodiac ?? null,
      lifePathNum: birthData.lifePathNum ?? null
    }
  }

  nextProfile.languageUsage = mapToSortedList(languageUsage, 2)
  nextProfile.spreadUsage = mapToSortedList(spreadUsage, 5)
  nextProfile.recurringCards = mapToSortedList(recurringCards, 6)
  nextProfile.themeUsage = mapToSortedList(themeUsage, 6)
  nextProfile.lastReadingPreview = String(generatedText).slice(0, 220)
  nextProfile.profileSummary = buildProfileSummary(nextProfile, lang)

  return nextProfile
}
