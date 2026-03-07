function buildFallbackHook({ profile, spread, lang = "es" }) {
  const topTheme = profile.themeUsage?.[0]?.name
  const topSpread = profile.spreadUsage?.[0]
  const spreadId = topSpread?.id ?? spread?.id ?? "three"
  const spreadName = topSpread?.name ?? (lang === "es" ? "Pasado · Presente · Futuro" : "Past · Present · Future")

  if (lang === "en") {
    return {
      title: topTheme ? `Go deeper into ${topTheme}` : "Return for a deeper pull",
      message: topTheme
        ? `Your readings keep circling around ${topTheme}. A focused spread can turn that pattern into a clearer decision.`
        : "Your profile is starting to show a pattern. A focused spread is the fastest way to turn that signal into direction.",
      cta: `Try ${spreadName}`,
      spreadId
    }
  }

  return {
    title: topTheme ? `Profundiza en ${topTheme}` : "Vuelve por una tirada mas profunda",
    message: topTheme
      ? `Tus lecturas vuelven una y otra vez sobre ${topTheme}. Una tirada enfocada puede convertir ese patron en una decision mas clara.`
      : "Tu perfil ya empieza a mostrar un patron. Una tirada enfocada es la forma mas rapida de convertir esa senal en direccion.",
    cta: `Probar ${spreadName}`,
    spreadId
  }
}

export async function hookAgent({
  context,
  llm,
  spread,
  lang = "es"
}) {
  const profile = context.get("userProfile") ?? {}

  try {
    const prompt = `
Eres un agente de retencion para una app de tarot.

Devuelve SOLO JSON valido con esta forma:
{
  "title": "string",
  "message": "string",
  "cta": "string",
  "spreadId": "single|three|celtic|love"
}

Objetivo:
- Sugerir la siguiente accion mas atractiva para que el usuario vuelva a interactuar.
- Basate en su perfil y en la lectura actual.
- El tono debe ser mistico pero concreto.
- No uses lenguaje fatalista ni manipulador.
- Idioma: ${lang === "es" ? "espanol" : "english"}.

Perfil:
${JSON.stringify({
      readingCount: profile.readingCount,
      profileSummary: profile.profileSummary,
      spreadUsage: profile.spreadUsage?.slice(0, 3),
      recurringCards: profile.recurringCards?.slice(0, 3),
      themeUsage: profile.themeUsage?.slice(0, 3),
      lastReadingPreview: profile.lastReadingPreview
    })}

Lectura actual:
${JSON.stringify({
      spreadId: spread?.id ?? null,
      spreadName: spread?.name ?? null
    })}
`

    const response = await llm(prompt)
    const parsed = JSON.parse(response)

    const nextAction = {
      title: parsed.title,
      message: parsed.message,
      cta: parsed.cta,
      spreadId: ["single", "three", "celtic", "love"].includes(parsed.spreadId)
        ? parsed.spreadId
        : (spread?.id ?? "three")
    }

    context.update("nextAction", nextAction)
    context.update("userProfile", {
      ...profile,
      nextAction
    })

    return nextAction
  } catch {
    const nextAction = buildFallbackHook({ profile, spread, lang })

    context.update("nextAction", nextAction)
    context.update("userProfile", {
      ...profile,
      nextAction
    })

    return nextAction
  }
}
