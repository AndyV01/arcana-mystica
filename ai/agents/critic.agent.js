// ai/agents/critic.agent.js

export async function criticAgent({ context, llm }) {
  const text = context.get("generatedText")

  const prompt = `
You are a quality control agent.

Review this tarot interpretation.

Check:
- clarity
- repetition
- mystical tone
- length appropriateness

If it is good, return:
APPROVED

If it needs improvement, return the improved version only.

Text:
${text}
`

  const review = await llm(prompt)

  if (review !== "APPROVED") {
    context.update("generatedText", review)
  }

  return review
}