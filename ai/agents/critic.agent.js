// ai/agents/critic.agent.js

export async function criticAgent({ context, llm }) {
  const text = context.get("generatedText")

  const prompt = `
Eres un agente de control de calidad.

Revisa esta interpretación de tarot.

Verifica:
- claridad
- repetición
- tono místico
- adecuación de la longitud

Si está bien, devuelve:
APPROVED

Si necesita mejoras, devuelve solo la versión mejorada.

Texto:
${text}
`

  const review = await llm(prompt)

  if (review !== "APPROVED") {
    context.update("generatedText", review)
  }

  return review
}
