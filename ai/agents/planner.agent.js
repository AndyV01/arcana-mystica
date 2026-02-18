// ai/agents/planner.agent.js

export async function plannerAgent({ objective, context, llm }) {
  const prompt = `
Eres un agente de planificación.

Descompón este objetivo en pasos estructurados.
Devuelve SOLO JSON válido:

{
  "steps": [
    { "id": "1", "agent": "prompt" },
    { "id": "2", "agent": "critic" }
  ]
}

Objetivo:
${objective}
`

  const response = await llm(prompt)

  try {
    return JSON.parse(response)
  } catch (err) {
    // Fallback seguro
    return {
      steps: [
        { id: "1", agent: "prompt" },
        { id: "2", agent: "critic" }
      ]
    }
  }
}
