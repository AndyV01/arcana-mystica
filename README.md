# Arcana Mistica - App de Tarot con IA Multi-Agente

> App de lectura de tarot construida con React + Vite.
> Las lecturas se generan con Groq (Llama 3.3) mediante un pipeline multi-agente orquestado con LangGraph StateGraph,
> con observabilidad completa via LangSmith, memoria de perfil local, tiradas personalizadas por dia y una API serverless.

[![LangSmith](https://img.shields.io/badge/LangSmith-Observability-blue)](https://smith.langchain.com)

Demo en vivo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## Resumen

Arcana Mistica combina una experiencia visual de tarot con un backend basado en agentes especializados orquestados con LangGraph.
La app soporta lecturas bilingues, persistencia de perfil, personalizacion por fecha de nacimiento
y loops de retencion como diario de lecturas, contenido diario y sugerencias de siguiente accion.

---

## Arquitectura de IA

```text
Frontend React
   |
   | POST /api/generate-reading
   v
Funcion serverless (api/generate-reading.js)
   |
   +--> LangGraph StateGraph (ai/orchestrator.js)
           1) memory_init   → prepara el contexto del perfil
           2) planner       → define el orden de ejecucion
           3) prompt        → genera la interpretacion de tarot
           4) critic        → revisa tono y claridad
           5) memory_finalize → finaliza el perfil del usuario
           6) hook          → sugiere la siguiente mejor accion
           ↓
        pipeline_error → END (si cualquier nodo falla)
   |
   +--> Groq API (llama-3.3-70b-versatile)
   |
   +--> LangSmith (tracing + observabilidad completa)
```

### Responsabilidades de los agentes

| Agente | Archivo | Rol |
|---|---|---|
| memory_init | `ai/orchestrator.js` | Prepara y normaliza el perfil del usuario antes de la lectura |
| planner | `ai/agents/planner.agent.js` | Devuelve el plan de ejecucion del pipeline en runtime |
| prompt | `ai/agents/prompt.agent.js` | Genera la lectura usando cartas, tirada, datos de nacimiento y perfil |
| critic | `ai/agents/critic.agent.js` | Revisa claridad, tono, repeticiones y longitud |
| memory_finalize | `ai/orchestrator.js` | Finaliza y persiste el perfil actualizado con la sesion actual |
| hook | `ai/agents/hook.agent.js` | Crea la siguiente accion sugerida para retener al usuario |
| Orchestrator | `ai/orchestrator.js` | LangGraph StateGraph que coordina el flujo completo |

### Patrones implementados

- **LangGraph StateGraph** — orquestador con estado tipado, nodos y edges condicionales.
- **Estado compartido** — `TarotState` reemplaza al `AgentContext` manual, transportando estado entre nodos.
- **Edges condicionales** — cada nodo puede derivar al nodo `pipeline_error` si falla.
- **Pipeline dinamico** — el planner define el orden de ejecucion en runtime.
- **Perfil persistente** — el frontend guarda localmente el perfil evolutivo del usuario.
- **Retencion personalizada** — el hook agent recomienda la siguiente tirada o accion.
- **Fallback controlado** — `DEMO_MODE=true` evita Groq y devuelve una lectura local.
- **Secrets seguros** — `GROQ_API_KEY`y `LANGCHAIN_API_KEY` existen solo del lado servidor.

---

## Observabilidad con LangSmith

Cada ejecucion del pipeline queda trackeada en LangSmith con:

| Dato | Descripcion |
|---|---|
| Latencia por nodo | Tiempo de ejecucion de cada agente de forma aislada |
| Tokens consumidos | Tokens de entrada y salida por llamada al LLM |
| Input/Output | Entrada y salida de cada nodo del StateGraph |
| Error metadata | Que nodo fallo y con que mensaje |
| Tags | Entorno (`arcana-mystica`, `production`) |

---

## Funcionalidades del producto

### Tarot base

- Baraja bilingue de 78 cartas.
- 4 tiradas: carta unica, pasado/presente/futuro, cruz celta y amor.
- Interpretaciones al derecho e invertidas.
- Interpretacion IA en tiempo real desde el backend multi-agente.

### Personalizacion por fecha de nacimiento

- Modal opcional antes de cada lectura.
- Calculo de signo zodiacal y camino de vida.
- Logica de tirada personalizada por semilla.
- Misma fecha de nacimiento + mismo dia = misma lectura.
- Misma fecha de nacimiento + distinto dia = lectura renovada.

### Retencion y memoria

- Memoria de perfil persistida localmente.
- Vista de perfil con cartas recurrentes, tiradas favoritas, temas activos y siguiente accion.
- Diario de lecturas en `localStorage`.
- Carta diaria y horoscopo semanal.
- Tarjeta compartible para redes sociales.

---

## Estructura del proyecto

```text
arcana-mystica/
|- ai/
|  |- agents/
|  |  |- critic.agent.js
|  |  |- hook.agent.js
|  |  |- memory.agent.js
|  |  |- planner.agent.js
|  |  `- prompt.agent.js
|  |- context.store.js
|  |- orchestrator.js        ← LangGraph StateGraph + LangSmith tracing
|  `- profile.utils.js
|- api/
|  `- generate-reading.js    ← Groq API + LangSmith flush
|- src/
|  |- App.jsx
|  |- BirthDateModal.jsx
|  |- ProfileInsights.jsx
|  |- ReadingDiary.jsx
|  |- ReadingPanel.jsx
|  |- WeeklyHoroscope.jsx
|  |- profile.store.js
|  `- ...
|- public/
|- .env
|- .env.local
|- index.html
|- vite.config.js
`- README.md
```

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 18 | UI y estado del cliente |
| Vite 5 | Dev server y pipeline de build |
| LangGraph JS | Orquestacion multi-agente con StateGraph |
| LangSmith | Observabilidad, tracing y monitoreo del pipeline |
| Groq API | Generacion LLM con `llama-3.3-70b-versatile` (gratis) |
| Vercel Serverless | Despliegue del endpoint API |
| Node.js | Runtime de agentes y capa API |
| localStorage | Persistencia de diario y perfil |

---

## Variables de entorno

```bash
# .env.local
GROQ_API_KEY=gsk_...
DEMO_MODE=false
LANGCHAIN_API_KEY=lsv2_pt_...
LANGCHAIN_PROJECT=arcana-mystica
DEMO_MODE=false
```

```bash
# .env
DEMO_MODE=false
```

En Vercel (`Settings -> Environment Variables`):

- `GROQ_API_KEY`
- `LANGCHAIN_TRACING_V2`
- `LANGCHAIN_API_KEY`
- `LANGCHAIN_PROJECT`
- `DEMO_MODE`

Notas:

- En desarrollo local, Vite expone `/api/generate-reading` mediante middleware en `vite.config.js`.
- Con `DEMO_MODE=true`, la app evita OpenAI y responde con lecturas fallback.
- LangSmith requiere flush explicito antes de cerrar la funcion serverless para que las trazas cierren correctamente.

---

## Desarrollo local

```bash
git clone https://github.com/AndyV01/arcana-mystica.git
cd arcana-mystica
npm install
npm run dev
```

App local:

```bash
http://localhost:5173
```

Build de produccion:

```bash
npm run build
```

---

## Deploy

```bash
git add .
git commit -m "feat: descripcion del cambio"
git push
```

Configurar en Vercel:

- `GROQ_API_KEY`: tu secret key de Groq (gratis en console.groq.com)
- `LANGCHAIN_TRACING_V2`: `true`
- `LANGCHAIN_API_KEY`: tu secret key de LangSmith
- `LANGCHAIN_PROJECT`: `arcana-mystica`
- `DEMO_MODE`: `false` en produccion

---

## Que demuestra este proyecto

- **Orquestacion multi-agente real** con LangGraph StateGraph en JavaScript.
- **Estado tipado** con `TarotState` — cada nodo recibe el estado completo y retorna solo lo que cambia.
- **Edges condicionales** — manejo de errores por nodo con derivacion a `pipeline_error`.
- **Observabilidad completa** con LangSmith — tracing por nodo, tokens, latencia y error metadata en local y produccion.
- **LLM gratuito** con Groq API (llama-3.3-70b-versatile) en produccion.
- **Memoria persistente** de perfil impulsada por el historial de lecturas.
- **Diseno orientado a retencion** mediante hook agent y siguientes acciones sugeridas.
- **Logica diaria personalizada** basada en fecha de nacimiento mas dia actual.
- **Frontend React** con UI animada, diario y flujo de compartido.

---

## Autor

Desarrollado por **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)
