// ai/orchestrator.js

import { AgentContext } from "./context.store.js"
import { plannerAgent } from "./agents/planner.agent.js"
import { promptAgent } from "./agents/prompt.agent.js"
import { criticAgent } from "./agents/critic.agent.js"

export async function runMultiAgentSystem({
  objective,
  cardData,
  llm
}) {
  const context = new AgentContext({
    objective,
    cardData,
    logs: []
  })

  try {
    // 1️⃣ Planning
    const plan = await plannerAgent({ objective, context, llm })
    context.update("plan", plan)

    // 2️⃣ Execution loop
    for (const step of plan.steps) {
      switch (step.agent) {
        case "prompt":
          await promptAgent({ cardData, context, llm })
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