// ai/agents/critic.agent.js

export async function criticAgent({ context, llm }) {
  const text = context.get("generatedText")

  const prompt = `
You are a quality control agent for tarot readings.

Review this text and return ONLY the final version ready to be shown to the user.

Rules:
- If the text is fine, return it exactly as is, without changes.
- If it needs improvements, return only the corrected text.
- NEVER add comments, explanations, or phrases like "here is the improved version."
- NEVER start with phrases like "The interpretation..." or "Below...".
- Return only the text of the reading; nothing else.

Text to review:
${text}
`

  const review = await llm(prompt)
  context.update("generatedText", review)

  return review
}
