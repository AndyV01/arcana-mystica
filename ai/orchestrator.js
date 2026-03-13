/**
 * Orquestador con LangGraph StateGraph
 * Migrado desde funciones async manuales a un grafo de estados tipado
 */

import { StateGraph, END } from "@langchain/langgraph"
import { Annotation } from "@langchain/langgraph"
import { hookAgent } from "./agents/hook.agent.js"
import { plannerAgent } from "./agents/planner.agent.js"
import { promptAgent } from "./agents/prompt.agent.js"
import { criticAgent } from "./agents/critic.agent.js"

// ---------------------------------------------------------------------------
// Estado compartido — reemplaza AgentContext
// Cada nodo recibe el estado completo y retorna solo lo que cambia
// ---------------------------------------------------------------------------
const TarotState = Annotation.Root({
  // inputs
  objective:     Annotation({ reducer: (_, v) => v }),
  cardData:      Annotation({ reducer: (_, v) => v }),
  llm:           Annotation({ reducer: (_, v) => v }),
  userProfile:   Annotation({ reducer: (_, v) => v }),
  spread:        Annotation({ reducer: (_, v) => v }),
  birthData:     Annotation({ reducer: (_, v) => v }),
  lang:          Annotation({ reducer: (_, v) => v }),
  // outputs de agentes
  plan:          Annotation({ reducer: (_, v) => v }),
  generatedText: Annotation({ reducer: (_, v) => v }),
  nextAction:    Annotation({ reducer: (_, v) => v }),
  // control
  logs:          Annotation({ reducer: (a, b) => [...(a ?? []), ...(b ?? [])] }),
  error:         Annotation({ reducer: (_, v) => v }),
})

// ---------------------------------------------------------------------------
// Nodos
// ---------------------------------------------------------------------------

async function nodoMemoryInit(state) {
  try {
    const { normalizeProfile, updateProfileFromSession } = await import("./profile.utils.js")

    const currentProfile = normalizeProfile(state.userProfile ?? {})
    const updatedProfile = updateProfileFromSession({
      profile: currentProfile,
      cardData: state.cardData,
      spread: state.spread,
      birthData: state.birthData,
      lang: state.lang
    })

    return {
      userProfile: updatedProfile,
      logs: ["Memory agent prepared profile"]
    }
  } catch (err) {
    return { error: err.message, logs: ["Memory init failed"] }
  }
}

async function nodoPlanner(state) {
  try {
    const plan = await plannerAgent({
      objective: state.objective,
      context: {
        get: (key) => state[key],
        update: () => {}
      },
      llm: state.llm
    })

    return { plan, logs: ["Planner agent executed"] }
  } catch (err) {
    return { error: err.message, logs: ["Planner failed"] }
  }
}

async function nodoPrompt(state) {
  try {
    let generatedText = ""

    const fakeContext = {
      get: (key) => state[key],
      update: (key, value) => { if (key === "generatedText") generatedText = value }
    }

    await promptAgent({
      cardData: state.cardData,
      context: fakeContext,
      llm: state.llm,
      spread: state.spread,
      birthData: state.birthData,
      lang: state.lang
    })

    return { generatedText, logs: ["Prompt agent executed"] }
  } catch (err) {
    return { error: err.message, logs: ["Prompt failed"] }
  }
}

async function nodoCritic(state) {
  try {
    let generatedText = state.generatedText

    const fakeContext = {
      get: (key) => state[key],
      update: (key, value) => { if (key === "generatedText") generatedText = value }
    }

    await criticAgent({ context: fakeContext, llm: state.llm })

    return { generatedText, logs: ["Critic agent executed"] }
  } catch (err) {
    return { error: err.message, logs: ["Critic failed"] }
  }
}

async function nodoMemoryFinalize(state) {
  try {
    const { normalizeProfile, updateProfileFromSession, buildProfileSummary, summarizeCardData } = await import("./profile.utils.js")

    const currentProfile = normalizeProfile(state.userProfile ?? {})
    const cards = summarizeCardData(state.cardData, state.lang)

    const baseProfile = updateProfileFromSession({
      profile: {
        ...currentProfile,
        readingCount: Math.max(0, currentProfile.readingCount - 1)
      },
      cardData: state.cardData,
      spread: state.spread,
      birthData: state.birthData,
      lang: state.lang,
      generatedText: state.generatedText
    })

    try {
      const prompt = `
Eres un agente de memoria para una app de tarot.

Resume el perfil del usuario en una sola frase, sin markdown, en ${state.lang === "es" ? "espanol" : "english"}.
Debe sonar observacional, no fatalista.

Perfil estructurado:
${JSON.stringify({
        readingCount: baseProfile.readingCount,
        preferredLanguage: baseProfile.preferredLanguage,
        spreadUsage: baseProfile.spreadUsage.slice(0, 3),
        recurringCards: baseProfile.recurringCards.slice(0, 3),
        themeUsage: baseProfile.themeUsage.slice(0, 3),
        birthProfile: baseProfile.birthProfile
      })}

Sesion actual:
${JSON.stringify({
        cards: cards.map(card => ({
          name: card.name,
          orientation: card.orientation,
          keywords: card.keywords.slice(0, 3)
        })),
        readingPreview: state.generatedText?.slice(0, 240)
      })}
`
      const summary = await state.llm(prompt)
      baseProfile.profileSummary = summary?.trim() || buildProfileSummary(baseProfile, state.lang)
    } catch {
      baseProfile.profileSummary = buildProfileSummary(baseProfile, state.lang)
    }

    return {
      userProfile: baseProfile,
      logs: ["Memory agent finalized profile"]
    }
  } catch (err) {
    return { error: err.message, logs: ["Memory finalize failed"] }
  }
}

async function nodoHook(state) {
  try {
    let nextAction = null

    const fakeContext = {
      get: (key) => state[key],
      update: (key, value) => { if (key === "nextAction") nextAction = value }
    }

    await hookAgent({
      context: fakeContext,
      llm: state.llm,
      spread: state.spread,
      lang: state.lang
    })

    return { nextAction, logs: ["Hook agent prepared next action"] }
  } catch (err) {
    return { error: err.message, logs: ["Hook failed"] }
  }
}

async function nodoError(state) {
  console.error("❌ Error en el pipeline:", state.error)
  return { logs: [`Pipeline error: ${state.error}`] }
}

// ---------------------------------------------------------------------------
// Edges condicionales
// ---------------------------------------------------------------------------

function decidirTrasMemoryInit(state) {
  if (state.error) return "pipeline_error"
  return "planner"
}

function decidirTrasPlanner(state) {
  if (state.error) return "pipeline_error"
  return "prompt"
}

function decidirTrasPrompt(state) {
  if (state.error) return "pipeline_error"
  return "critic"
}

function decidirTrasCritic(state) {
  if (state.error) return "pipeline_error"
  return "memory_finalize"
}

function decidirTrasMemoryFinalize(state) {
  if (state.error) return "pipeline_error"
  return "hook"
}

// ---------------------------------------------------------------------------
// Grafo
// ---------------------------------------------------------------------------

const grafo = new StateGraph(TarotState)

grafo.addNode("memory_init",      nodoMemoryInit)
grafo.addNode("planner",          nodoPlanner)
grafo.addNode("prompt",           nodoPrompt)
grafo.addNode("critic",           nodoCritic)
grafo.addNode("memory_finalize",  nodoMemoryFinalize)
grafo.addNode("hook",             nodoHook)
grafo.addNode("pipeline_error",            nodoError)

grafo.setEntryPoint("memory_init")

grafo.addConditionalEdges("memory_init",     decidirTrasMemoryInit)
grafo.addConditionalEdges("planner",         decidirTrasPlanner)
grafo.addConditionalEdges("prompt",          decidirTrasPrompt)
grafo.addConditionalEdges("critic",          decidirTrasCritic)
grafo.addConditionalEdges("memory_finalize", decidirTrasMemoryFinalize)

grafo.addEdge("hook",  END)
grafo.addEdge("pipeline_error", END)

export const graph = grafo.compile({ checkpointer: undefined })

// ---------------------------------------------------------------------------
// Función pública — misma firma que antes para no romper generate-reading.js
// ---------------------------------------------------------------------------

export async function runMultiAgentSystem({
  objective,
  cardData,
  llm,
  userProfile,
  spread,
  birthData,
  lang = "es"
}) {
  try {
    const result = await graph.invoke({
      objective,
      cardData,
      llm,
      userProfile:   userProfile ?? {},
      spread:        spread ?? null,
      birthData:     birthData ?? null,
      lang,
      logs:          [],
      error:         null,
      plan:          null,
      generatedText: null,
      nextAction:    null
    })

    if (result.error) {
      return { success: false, error: result.error }
    }

    return { success: true, data: result }

  } catch (err) {
    return { success: false, error: err.message }
  }
}