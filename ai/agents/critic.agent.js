// ai/agents/critic.agent.js

export async function criticAgent({ context, llm }) {
  const text = context.get("generatedText")

  const prompt = `
Eres un agente de control de calidad para lecturas de tarot.

Revisa este texto y devuelve ÚNICAMENTE la versión final lista para mostrar al usuario.

Reglas:
- Si el texto está bien, devuélvelo exactamente igual sin cambios.
- Si necesita mejoras, devuelve solo el texto corregido.
- NUNCA agregues comentarios, explicaciones ni frases como "aquí está la versión mejorada".
- NUNCA empieces con frases como "La interpretación..." o "A continuación...".
- Solo devuelve el texto de la lectura, nada más.

Texto a revisar:
${text}
`

  const review = await llm(prompt)
  context.update("generatedText", review)

  return review
}
