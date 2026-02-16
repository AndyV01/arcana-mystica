// ai/agents/planner.agent.js

export async function plannerAgent({ objective, context, llm }) {
  const prompt = `
You are a planning agent.

Break this objective into structured steps.
Return ONLY valid JSON:

{
  "steps": [
    { "id": "1", "agent": "prompt" },
    { "id": "2", "agent": "critic" }
  ]
}

Objective:
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