import {
  buildProfileSummary,
  normalizeProfile,
  summarizeCardData,
  updateProfileFromSession
} from "../profile.utils.js"

export async function memoryAgent({
  context,
  llm,
  cardData,
  spread,
  birthData,
  lang = "es",
  finalize = false
}) {
  const currentProfile = normalizeProfile(context.get("userProfile"))

  if (!finalize) {
    const updatedProfile = updateProfileFromSession({
      profile: currentProfile,
      cardData,
      spread,
      birthData,
      lang
    })

    context.update("userProfile", updatedProfile)
    return updatedProfile
  }

  const generatedText = context.get("generatedText") ?? ""
  const cards = summarizeCardData(cardData, lang)
  const baseProfile = updateProfileFromSession({
    profile: {
      ...currentProfile,
      readingCount: Math.max(0, currentProfile.readingCount - 1)
    },
    cardData,
    spread,
    birthData,
    lang,
    generatedText
  })

  try {
    const prompt = `
You are a memory agent for a tarot app.

Summarize the user profile in a single sentence, without markdown, in ${lang === "es" ? "Spanish" : "English"}.
It should sound observational, not fatalistic.

Structured profile:
${JSON.stringify({
      readingCount: baseProfile.readingCount,
      preferredLanguage: baseProfile.preferredLanguage,
      spreadUsage: baseProfile.spreadUsage.slice(0, 3),
      recurringCards: baseProfile.recurringCards.slice(0, 3),
      themeUsage: baseProfile.themeUsage.slice(0, 3),
      birthProfile: baseProfile.birthProfile
    })}

Current Session:
${JSON.stringify({
      cards: cards.map(card => ({
        name: card.name,
        orientation: card.orientation,
        keywords: card.keywords.slice(0, 3)
      })),
      readingPreview: generatedText.slice(0, 240)
    })}
`

    const summary = await llm(prompt)
    baseProfile.profileSummary = summary?.trim() || buildProfileSummary(baseProfile, lang)
  } catch {
    baseProfile.profileSummary = buildProfileSummary(baseProfile, lang)
  }

  context.update("userProfile", baseProfile)
  return baseProfile
}
