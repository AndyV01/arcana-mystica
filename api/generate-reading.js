import Anthropic from "@anthropic-ai/sdk"
import { runMultiAgentSystem } from "../ai/orchestrator.js"

const useMock = process.env.DEMO_MODE === "true"

const anthropic = useMock
  ? null
  : new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

async function llm(prompt) {
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 400,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return response.content[0].text
}

function generateFallbackReading(cardData) {
  const names = cardData.map(c => 
    typeof c.card.name === "object"
      ? c.card.name.es
      : c.card.name
  )

  return `Las energías de ${names.join(", ")} indican un momento de transformación personal. 
Confía en tu intuición y actúa con determinación. 
El camino se revela cuando decides avanzar.`
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { cardData } = req.body

    if (!cardData) {
      return res.status(400).json({ error: "Missing cardData" })
    }

    if (useMock) {
      return res.status(200).json({
        success: true,
        reading: generateFallbackReading(cardData)
      })
    }

    const result = await runMultiAgentSystem({
      objective: "Generate tarot interpretation",
      cardData,
      llm
    })

    return res.status(200).json(result)

  } catch (error) {
    return res.status(200).json({
      success: true,
      reading: generateFallbackReading(req.body.cardData)
    })
  }
}
