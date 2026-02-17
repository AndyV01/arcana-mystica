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
  // Centralized shared state used by all agents during the full orchestration run.
  const context = new AgentContext({
    objective,
    cardData,
    logs: []
  })

  try {
    // 1) Generate a structured execution plan based on the objective and current context.
    const plan = await plannerAgent({ objective, context, llm })
    context.update("plan", plan)

    // 2) Execute each planned step in order, routing work to the agent declared by the planner.
    for (const step of plan.steps) {
      switch (step.agent) {
        case "prompt":
          // Produces or refines prompt outputs using the available card data.
          await promptAgent({ cardData, context, llm })
          context.get("logs").push("Prompt agent executed")
          break

        case "critic":
          // Reviews previous outputs and records feedback for quality/control.
          await criticAgent({ context, llm })
          context.get("logs").push("Critic agent executed")
          break

        default:
          // Preserve observability when the planner emits an unsupported agent type.
          context.get("logs").push(`Unknown agent: ${step.agent}`)
      }
    }

    // Return the full context snapshot so callers can inspect outputs, plan, and logs.
    return {
      success: true,
      data: context.getAll()
    }

  } catch (error) {
    // Surface runtime failures in a normalized response shape.
    return {
      success: false,
      error: error.message
    }
  }
}
