import OpenAI from "openai"
import { runMultiAgentSystem } from "../ai/orchestrator.js"

const useMock = process.env.DEMO_MODE === "true"

const openai = useMock
  ? null
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

async function llm(prompt) {
  try {
    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: prompt,
      max_output_tokens: 400
    })

    return response.output_text ?? ""
  } catch (error) {
    const openaiError = new Error(`OpenAI API error: ${error.message}`)
    openaiError.code = "OPENAI_API_ERROR"
    openaiError.status = error.status ?? 502
    throw openaiError
  }
}

function isOpenAIApiFailure(errorMessage = "") {
  return (
    errorMessage.includes("OpenAI API error") ||
    errorMessage.includes("insufficient_quota") ||
    errorMessage.includes("rate_limit")
  )
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

    if (!result.success && isOpenAIApiFailure(result.error)) {
      return res.status(200).json({
        success: true,
        reading: generateFallbackReading(cardData),
        warning: "OpenAI API unavailable. Returned fallback reading."
      })
    }

    return res.status(200).json(result)

  } catch (error) {
    const hasCardData = Array.isArray(req.body?.cardData)

    if (error.code === "OPENAI_API_ERROR" && hasCardData) {
      return res.status(200).json({
        success: true,
        reading: generateFallbackReading(req.body.cardData),
        warning: "OpenAI API unavailable. Returned fallback reading."
      })
    }

    return res.status(200).json({
      success: true,
      reading: hasCardData
        ? generateFallbackReading(req.body.cardData)
        : "No fue posible generar una lectura en este momento. Intenta nuevamente."
    })
  }
}
