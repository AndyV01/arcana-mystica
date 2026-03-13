import Groq from "groq-sdk"
import { runMultiAgentSystem } from "../ai/orchestrator.js"
import { updateProfileFromSession } from "../ai/profile.utils.js"

const useMock = process.env.DEMO_MODE === "true"

const openai = useMock
  ? null
  : new OpenAI({
      apiKey: process.env.GROQ_API_KEY
    })

async function llm(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400
    })
    return response.choices[0]?.message?.content ?? ""
  } catch (error) {
    const groqError = new Error(`Groq API error: ${error.message}`)
    groqError.code = "OPENAI_API_ERROR"
    groqError.status = error.status ?? 502
    throw groqError
  }
}

function isOpenAIApiFailure(errorMessage = "") {
  return (
    errorMessage.includes("OpenAI API error") ||
    errorMessage.includes("insufficient_quota") ||
    errorMessage.includes("rate_limit")
  )
}

function generateFallbackReading(cardData, lang = "es") {
  const names = cardData.map(item =>
    typeof item.card.name === "object"
      ? item.card.name[lang] ?? item.card.name.es ?? item.card.name.en
      : item.card.name
  )

  if (lang === "en") {
    return `The energies of ${names.join(", ")} point to a moment of personal transformation. Trust your intuition and move with intention. The path becomes visible when you choose to advance.`
  }

  return `Las energias de ${names.join(", ")} indican un momento de transformacion personal. Confia en tu intuicion y actua con determinacion. El camino se revela cuando decides avanzar.`
}

function buildResponseProfile({
  userProfile,
  cardData,
  spread,
  birthData,
  lang,
  reading,
  nextAction
}) {
  return {
    ...updateProfileFromSession({
      profile: userProfile,
      cardData,
      spread,
      birthData,
      lang,
      generatedText: reading
    }),
    nextAction: nextAction ?? userProfile?.nextAction ?? null
  }
}

function buildFallbackNextAction({ userProfile = {}, spread, lang = "es" }) {
  const topSpread = userProfile?.spreadUsage?.[0]
  const spreadId = topSpread?.id ?? spread?.id ?? "three"
  const spreadName = topSpread?.name ?? (
    lang === "es"
      ? "Pasado · Presente · Futuro"
      : "Past · Present · Future"
  )

  return {
    title: lang === "es" ? "Siguiente puerta abierta" : "Your next open doorway",
    message: lang === "es"
      ? "Tu perfil ya muestra un patron. Vuelve con una tirada enfocada para ver como evoluciona."
      : "Your profile is already showing a pattern. Return with a focused spread to see how it evolves.",
    cta: lang === "es" ? `Probar ${spreadName}` : `Try ${spreadName}`,
    spreadId
  }
}

function buildFallbackPayload({
  userProfile,
  cardData,
  spread,
  birthData,
  lang,
  reading,
  warning
}) {
  const nextAction = buildFallbackNextAction({ userProfile, spread, lang })

  return {
    reading,
    nextAction,
    warning,
    profile: buildResponseProfile({
      userProfile,
      cardData,
      spread,
      birthData,
      lang,
      reading,
      nextAction
    })
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const {
      cardData,
      userProfile = {},
      spread = null,
      birthData = null,
      lang = "es"
    } = req.body

    if (!Array.isArray(cardData) || cardData.length === 0) {
      return res.status(400).json({ error: "Missing cardData" })
    }

    if (useMock) {
      const reading = generateFallbackReading(cardData, lang)
      const payload = buildFallbackPayload({
        userProfile,
        cardData,
        spread,
        birthData,
        lang,
        reading
      })

      return res.status(200).json({
        success: true,
        reading: payload.reading,
        profile: payload.profile,
        nextAction: payload.nextAction
      })
    }

    const result = await runMultiAgentSystem({
      objective: "Generate tarot interpretation",
      cardData,
      llm,
      userProfile,
      spread,
      birthData,
      lang
    })

    if (!result.success && isOpenAIApiFailure(result.error)) {
      const reading = generateFallbackReading(cardData, lang)
      const payload = buildFallbackPayload({
        userProfile,
        cardData,
        spread,
        birthData,
        lang,
        reading,
        warning: "OpenAI API unavailable. Returned fallback reading."
      })

      return res.status(200).json({
        success: true,
        reading: payload.reading,
        profile: payload.profile,
        nextAction: payload.nextAction,
        warning: payload.warning
      })
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
      reading: result.data.generatedText,
      profile: result.data.userProfile,
      nextAction: result.data.nextAction,
      logs: result.data.logs
    })
  } catch (error) {
    const hasCardData = Array.isArray(req.body?.cardData) && req.body.cardData.length > 0
    const reading = hasCardData
      ? generateFallbackReading(req.body.cardData, req.body?.lang ?? "es")
      : "No fue posible generar una lectura en este momento. Intenta nuevamente."

    if (hasCardData) {
      const payload = buildFallbackPayload({
        userProfile: req.body?.userProfile ?? {},
        cardData: req.body.cardData,
        spread: req.body?.spread ?? null,
        birthData: req.body?.birthData ?? null,
        lang: req.body?.lang ?? "es",
        reading,
        warning: error.code === "OPENAI_API_ERROR"
          ? "OpenAI API unavailable. Returned fallback reading."
          : undefined
      })

      return res.status(200).json({
        success: true,
        reading: payload.reading,
        profile: payload.profile,
        nextAction: payload.nextAction,
        warning: payload.warning
      })
    }

    return res.status(200).json({
      success: true,
      reading
    })
  }
}
