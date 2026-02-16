// ai/agents/prompt.agent.js

export async function promptAgent({ cardData, context, llm }) {
  const prompt = `
You are a mystical tarot interpreter.

Card: ${cardData.name}
Meaning: ${cardData.meaning}

Write a concise but powerful tarot interpretation.
Max 3 paragraphs.
Tone: mystical, reflective, elegant.
`

  const text = await llm(prompt)

  context.update("generatedText", text)

  return text
}