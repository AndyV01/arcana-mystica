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
  // Estado compartido centralizado usado por todos los agentes durante toda la ejecución de la orquestación.
  const context = new AgentContext({
    objective,
    cardData,
    logs: []
  })

  try {
    // 1) Generar un plan de ejecución estructurado según el objetivo y el contexto actual.
    const plan = await plannerAgent({ objective, context, llm })
    context.update("plan", plan)

    // 2) Ejecutar cada paso planificado en orden, dirigiendo el trabajo al agente declarado por el planificador.
    for (const step of plan.steps) {
      switch (step.agent) {
        case "prompt":
          // Produce o refina salidas de prompts usando los datos de cartas disponibles.
          await promptAgent({ cardData, context, llm })
          context.get("logs").push("Prompt agent executed")
          break

        case "critic":
          // Revisa salidas previas y registra retroalimentación para calidad/control.
          await criticAgent({ context, llm })
          context.get("logs").push("Critic agent executed")
          break

        default:
          // Preserva la observabilidad cuando el planificador emite un tipo de agente no compatible.
          context.get("logs").push(`Unknown agent: ${step.agent}`)
      }
    }

    // Devuelve la instantánea completa del contexto para que quienes llaman puedan inspeccionar salidas, plan y logs.
    return {
      success: true,
      data: context.getAll()
    }

  } catch (error) {
    // Expone fallos de ejecución en una forma de respuesta normalizada.
    return {
      success: false,
      error: error.message
    }
  }
}
