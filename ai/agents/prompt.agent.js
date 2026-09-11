import { summarizeCardData } from "../profile.utils.js"

export async function promptAgent({
  cardData,
  context,
  llm,
  spread,
  birthData,
  lang = "es",
  similarReadings = []
}) {
  const cards = summarizeCardData(cardData, lang)
  const profile = context.get("userProfile")
  const spreadName = typeof spread?.name === "string"
    ? spread.name
    : spread?.name?.[lang] ?? spread?.name ?? ""

  const prompt = `
You are a mystical tarot interpreter.

Write a unified, concrete, and evocative interpretation.
Do not use lists.
Maximum 3 paragraphs.
Language: ${lang === "es" ? "espanol" : "english"}.
Tone: mystical, reflective, elegant, and approachable.

User Context:
${profile?.profileSummary ?? "Sin historial previo."}

Reading:
${spreadName || "Lectura general"}

Birth details:
${birthData ? JSON.stringify({
    zodiac: birthData.zodiac?.[lang] ?? birthData.zodiac?.en ?? null,
    lifePathNum: birthData.lifePathNum ?? null
  }) : "No birth details"}
  
${similarReadings.length > 0 ? `
Related previous readings (use them as energetic context, do not repeat them verbatim):
${similarReadings.map((r, i) => `${i + 1}. ${r.reading?.slice(0, 200)}...`).join("\n")}
` : ""}

Cartas:
${cards.map((card, index) => (
    `${index + 1}. ${card.name} (${card.orientation}) | significado: ${card.meaning} | palabras clave: ${card.keywords.join(", ")}`
  )).join("\n")}
`

  const text = await llm(prompt)

  context.update("generatedText", text)

  return text
}
