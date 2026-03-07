import { AgentContext } from "./context.store.js"
import { memoryAgent } from "./agents/memory.agent.js"
import { hookAgent } from "./agents/hook.agent.js"
import { plannerAgent } from "./agents/planner.agent.js"
import { promptAgent } from "./agents/prompt.agent.js"
import { criticAgent } from "./agents/critic.agent.js"

export async function runMultiAgentSystem({
  objective,
  cardData,
  llm,
  userProfile,
  spread,
  birthData,
  lang = "es"
}) {
  const context = new AgentContext({
    objective,
    cardData,
    userProfile,
    spread,
    birthData,
    lang,
    logs: []
  })

  try {
    await memoryAgent({ context, llm, cardData, spread, birthData, lang })
    context.get("logs").push("Memory agent prepared profile")

    const plan = await plannerAgent({ objective, context, llm })
    context.update("plan", plan)

    for (const step of plan.steps) {
      switch (step.agent) {
        case "prompt":
          await promptAgent({ cardData, context, llm, spread, birthData, lang })
          context.get("logs").push("Prompt agent executed")
          break

        case "critic":
          await criticAgent({ context, llm })
          context.get("logs").push("Critic agent executed")
          break

        default:
          context.get("logs").push(`Unknown agent: ${step.agent}`)
      }
    }

    await memoryAgent({
      context,
      llm,
      cardData,
      spread,
      birthData,
      lang,
      finalize: true
    })
    context.get("logs").push("Memory agent finalized profile")

    await hookAgent({ context, llm, spread, lang })
    context.get("logs").push("Hook agent prepared next action")

    return {
      success: true,
      data: context.getAll()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
