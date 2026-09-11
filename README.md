# Arcana Mistica – Multi-Agent AI Tarot App

> Tarot reading app built with React + Vite.
> Readings are generated using Groq (Llama 3.3) via a multi-agent pipeline orchestrated with LangGraph StateGraph,
> featuring true RAG on reading history via Upstash Redis, full observability via LangSmith,
> local profile memory, personalized daily spreads, and a serverless API.

[![LangSmith](https://img.shields.io/badge/LangSmith-Observability-blue)](https://smith.langchain.com)
[![RAG](https://img.shields.io/badge/RAG-Upstash%20Redis-red)](https://upstash.com)

Live demo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

### Demo

![Arcana Mystica Demo](./assets/demo.gif)

---

## Resumen

Arcana Mistica combines a visual tarot experience with a backend powered by specialized agents orchestrated using LangGraph.
The app supports bilingual readings, profile persistence, and personalization based on date of birth,
as well as RAG (Retrieval-Augmented Generation) over past reading history and retention loops—such as a reading journal, daily content, and next-step suggestions.

---

## AI Architecture

```text
Frontend React
   |
   | POST /api/generate-reading
   v
Serverless function (api/generate-reading.js)
   |
   +--> LangGraph StateGraph (ai/orchestrator.js)
   |       1) memory_init     → prepares the profile context
   |       2) rag             → retrieves similar readings from Upstash Redis
   |       3) planner         → defines the execution order
   |       4) prompt          → generates the interpretation using RAG context
   |       5) critic          → reviews tone and clarity
   |       6) memory_finalize → updates the profile and saves the reading to Redis
   |       7) hook            → suggests the next custom action
   |       ↓
        pipeline_error → END (if any node fails)
   |
   +--> Groq API (llama-3.3-70b-versatile)
   |
   +--> Upstash Redis (reading history by user)
   |
   +--> LangSmith (tracing + full observability)
```

### Agent Responsibilities

| Agent | File | Role |
|---|---|---|
| memory_init | `ai/orchestrator.js` | Prepares and normalizes the user profile before the reading |
| planner | `ai/agents/planner.agent.js` | Returns the pipeline execution plan at runtime |
| prompt | `ai/agents/prompt.agent.js` | Generates the reading using cards, the spread, the profile, and RAG context |
| critic | `ai/agents/critic.agent.js` | Reviews clarity, tone, repetition, and length |
| memory_finalize | `ai/orchestrator.js` | Finalizes and persists the profile updated with the current session |
| hook | `ai/agents/hook.agent.js` | Creates the next suggested action to retain the user |
| Orchestrator | `ai/orchestrator.js` | LangGraph StateGraph that coordinates the entire flow |

### Implemented Patterns

- **LangGraph StateGraph** — orchestrator featuring typed state, nodes, and conditional edges.
- **Shared state** — `TarotState` carries state between nodes; each node returns only the changes.
- **Conditional edges** — each node can route to the `pipeline_error` node upon failure.
- **True RAG** ​​— the `rag` node retrieves semantically similar past readings from Upstash Redis and injects them as context into the agent prompt.
- **Jaccard Similarity** — calculates similarity between card keyword vectors to find related readings.
- **Server-side persistence** — each reading is saved to Redis upon pipeline completion (max. 50 per user).
- **LangSmith tracing** — full pipeline observability, including per-node latency, token counts, and metadata.
- **Dynamic pipeline** — the planner determines the execution order at runtime.
- **Persistent profile** — the frontend locally stores the user's evolving profile.
- **Personalized retention** — the agent hook recommends the next spread or action.
- **Controlled fallback** — `DEMO_MODE=true` bypasses Groq and returns a local reading.
- **Secure secrets** — `GROQ_API_KEY`, `LANGCHAIN_API_KEY`, and `UPSTASH_REDIS_REST_TOKEN` exist only on the server side.

---

## 🧩 The Problem It Solves

Existing tarot apps are:
- **Generic**: they provide the same interpretation to everyone
- **Memoryless**: they do not remember your previous readings
- **Static**: they do not learn from your patterns

**Arcana Mistica** uses multi-agent AI to create personalized readings that evolve with your history, utilizing true RAG based on your previous spreads.

## RAG — Retrieval-Augmented Generation

The system implements true RAG based on the user's reading history:

### RAG Flow
```text
Current readings
      ↓
cardsToVector() → extracts keywords and meanings as a vector
      ↓
Redis lrange() → retrieves up to 50 previous readings
      ↓
similarity() → calculates Jaccard similarity between vectors
      ↓
Top 3 most similar readings → context for the agent prompt
      ↓
Interpretation enriched with actual historical patterns
```

### Redis Structure
```text
Key: readings:{userId}
Type: List (lpush + ltrim — max. 50 entries)
Entry: { id, cardData, reading, spread, lang, createdAt }
```

---

## Observability with LangSmith

Each pipeline execution is tracked in LangSmith with:

| Data | Description |
|---|---|
| Node latency | Execution time of each agent in isolation |
| Tokens consumed | Input and output tokens per LLM call |
| Input/Output | Input and output of each StateGraph node |
| Error metadata | Which node failed and the error message |
| Tags | Environment (`arcana-mystica`, `production`) |

---

## Funcionalidades del producto

### Core Tarot

- 78-card bilingual deck.
- 4 spreads: single card, past/present/future, Celtic Cross, and love.
- Upright and reversed interpretations.
- Real-time AI interpretation via multi-agent backend.

### Personalization by Date of Birth

- Optional modal before each reading.
- Zodiac sign and life path calculation.
- Spread logic customized by seed.
- Same date of birth + same day = same reading.
- Same date of birth + different day = new reading.

### Retention and Memory

- Locally persisted profile data.
- Profile view featuring recurring cards, favorite spreads, active themes, and next action.
- Reading history stored in `localStorage`.
- Daily card and weekly horoscope.
- Shareable card for social media.

---

## Project structure

```text
arcana-mystica/
|- ai/
|  |- agents/
|  |  |- critic.agent.js
|  |  |- hook.agent.js
|  |  |- memory.agent.js
|  |  |- planner.agent.js
|  |  |- prompt.agent.js       ← receives similar readings as RAG context
|  |  `- rag.agent.js          ← RAG with Upstash Redis + Jaccard similarity
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

| Technology | Usage |
|---|---|
| React 18 | UI and client-side state |
| Vite 5 | Dev server and build pipeline |
| LangGraph JS | Multi-agent orchestration with StateGraph |
| LangSmith | Pipeline observability, tracing, and monitoring |
| Groq API | LLM generation with `llama-3.3-70b-versatile` (free) |
| Upstash Redis | User reading history (serverless, free) |
| Vercel Serverless | API endpoint deployment |
| Node.js | Agent runtime and API layer |
| localStorage | Journal and profile persistence |

---

## Environment variables

```bash
# .env.local
GROQ_API_KEY=gsk_...
DEMO_MODE=false
LANGCHAIN_API_KEY=lsv2_pt_...
LANGCHAIN_PROJECT=arcana-mystica
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
DEMO_MODE=false
```

```bash
# .env
DEMO_MODE=false
```

In Vercel (`Settings -> Environment Variables`):

- `GROQ_API_KEY`
- `LANGCHAIN_TRACING_V2`
- `LANGCHAIN_API_KEY`
- `LANGCHAIN_PROJECT`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DEMO_MODE`

Notes:

- In local development, Vite exposes `/api/generate-reading` via middleware in `vite.config.js`.
- LangSmith requires an explicit flush before the serverless function closes to ensure traces are properly finalized.
- Upstash Redis stores up to 50 readings per user using `lpush` + `ltrim`.

---

## Local development

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

---


Configure in Vercel:

- `GROQ_API_KEY`: your Groq secret key (free at console.groq.com)
- `LANGCHAIN_TRACING_V2`: `true`
- `LANGCHAIN_API_KEY`: your LangSmith secret key
- `LANGCHAIN_PROJECT`: `arcana-mystica`
- `UPSTASH_REDIS_REST_URL`: URL of your database on upstash.com
- `UPSTASH_REDIS_REST_TOKEN`: token of your database on upstash.com
- `DEMO_MODE`: `false` in production

---

## What this project demonstrates

- **True multi-agent orchestration** using LangGraph StateGraph in JavaScript.
- **Typed state** with `TarotState` — each node receives the full state and returns only the changes.
- **Conditional edges** — per-node error handling with routing to `pipeline_error`.
- **Real RAG** ​​— semantic retrieval of past readings from Upstash Redis to provide context for the LLM.
- **Jaccard similarity** — similarity calculation between keyword vectors without external embedding dependencies.
- **Full observability** with LangSmith — tracing by node, token usage, latency, and error metadata in both local and production environments.
- **Free LLM** using the Groq API (llama-3.3-70b-versatile) in production.
- **Serverless persistence** with Upstash Redis — user reading history without a traditional database.
- **Persistent profile memory** driven by reading history.
- **Retention-focused design** via a "hook agent" and suggested follow-up actions.
- **Personalized daily logic** based on date of birth and the current date.
- **React frontend** featuring animated UI, a journal, and a sharing flow.

---
## 🎓 Key Takeaways

- **Cost optimization**: Replaced expensive embeddings with Jaccard similarity based on keywords, reducing costs to ~$0
- **Serverless constraints**: Learned to handle cold starts and LangSmith flushing before the function terminates
- **Asynchronous UX**: Designed loading states to keep the user informed during the multi-agent pipeline

## Author

Developed by **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)
