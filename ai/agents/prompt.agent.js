import { summarizeCardData } from "../profile.utils.js"

export async function promptAgent({
  cardData,
  context,
  llm,
  spread,
  birthData,
  lang = "es"
}) {
  const cards = summarizeCardData(cardData, lang)
  const profile = context.get("userProfile")
  const spreadName = typeof spread?.name === "string"
    ? spread.name
    : spread?.name?.[lang] ?? spread?.name ?? ""

  const prompt = `
Eres un interprete mistico de tarot.

Escribe una interpretacion unificada, concreta y evocadora.
No uses listas.
Maximo 3 parrafos.
Idioma: ${lang === "es" ? "espanol" : "english"}.
Tono: mistico, reflexivo, elegante y cercano.

Contexto del usuario:
${profile?.profileSummary ?? "Sin historial previo."}

Tirada:
${spreadName || "Lectura general"}

Datos de nacimiento:
${birthData ? JSON.stringify({
    zodiac: birthData.zodiac?.[lang] ?? birthData.zodiac?.en ?? null,
    lifePathNum: birthData.lifePathNum ?? null
  }) : "Sin datos de nacimiento"}

Cartas:
${cards.map((card, index) => (
    `${index + 1}. ${card.name} (${card.orientation}) | significado: ${card.meaning} | palabras clave: ${card.keywords.join(", ")}`
  )).join("\n")}
`

  const text = await llm(prompt)

  context.update("generatedText", text)

  return text
}
