// ai/agents/prompt.agent.js

export async function promptAgent({ cardData, context, llm }) {
  const prompt = `
Eres un intérprete místico de tarot.

Carta: ${cardData.name}
Significado: ${cardData.meaning}

Escribe una interpretación de tarot concisa pero poderosa.
Máximo 3 párrafos.
Tono: místico, reflexivo, elegante.
`

  const text = await llm(prompt)

  context.update("generatedText", text)

  return text
}