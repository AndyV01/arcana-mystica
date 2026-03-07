# Arcana Mistica - Tarot App with Multi-Agent AI

> Tarot reading app built with React + Vite.
> Readings are generated with OpenAI `gpt-5.4` through a multi-agent pipeline,
> with local profile memory, daily personalized draws, and a serverless API.

Live demo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## Overview

Arcana Mistica combines a visual tarot experience with a lightweight multi-agent backend.
The app supports bilingual readings, profile persistence, birthdate-based personalization,
and recurring engagement loops such as diary history, daily content, and next-action suggestions.

---

## AI Architecture

```text
React frontend
   |
   | POST /api/generate-reading
   v
Serverless function (api/generate-reading.js)
   |
   +--> Orchestrator (ai/orchestrator.js)
           1) Memory agent prepares profile context
           2) Planner agent defines execution order
           3) Prompt agent generates the tarot interpretation
           4) Critic agent revises tone and clarity
           5) Memory agent finalizes the user profile
           6) Hook agent suggests the next best action
   |
   +--> OpenAI Responses API (gpt-5.4)
```

### Agent responsibilities

| Agent | File | Role |
|---|---|---|
| Memory | `ai/agents/memory.agent.js` | Builds and updates a persistent user profile from recurring cards, spreads, themes, and birth data |
| Planner | `ai/agents/planner.agent.js` | Returns the execution plan for the reading pipeline |
| Prompt | `ai/agents/prompt.agent.js` | Generates the tarot reading using cards, spread, birth data, and profile context |
| Critic | `ai/agents/critic.agent.js` | Revises clarity, tone, repetition, and reading length |
| Hook | `ai/agents/hook.agent.js` | Creates the next suggested action to bring the user back into the app |
| Context | `ai/context.store.js` | Shared state store used by all agents |
| Orchestrator | `ai/orchestrator.js` | Coordinates the full multi-agent workflow |

### Implemented patterns

- Dynamic pipeline: the planner can define the execution order at runtime.
- Shared memory: `AgentContext` carries state through the full orchestration.
- Persistent profile: the frontend stores the evolving user profile locally.
- Personalized retention: the hook agent recommends the next spread or action.
- Graceful fallback: `DEMO_MODE=true` bypasses OpenAI and returns a local reading.
- Secure secrets: `OPENAI_API_KEY` exists only on the server side.

---

## Product Features

### Tarot core

- 78-card bilingual tarot deck.
- 4 spreads: single card, past/present/future, Celtic cross, love reading.
- Upright and reversed interpretations.
- Real-time AI interpretation from the multi-agent backend.

### Birthdate personalization

- Optional birthdate modal before a reading.
- Zodiac sign and life path calculation.
- Personalized seeded draw logic.
- Same birthdate + same day = same reading.
- Same birthdate + different day = refreshed reading.

### Retention features

- Persistent profile memory stored locally.
- Profile view with recurring cards, favorite spreads, active themes, and next action.
- Reading diary in `localStorage`.
- Daily card and weekly horoscope.
- Shareable reading card for social posting.

---

## Project Structure

```text
arcana-mystica/
├── ai/
│   ├── agents/
│   │   ├── critic.agent.js
│   │   ├── hook.agent.js
│   │   ├── memory.agent.js
│   │   ├── planner.agent.js
│   │   └── prompt.agent.js
│   ├── context.store.js
│   ├── orchestrator.js
│   └── profile.utils.js
├── api/
│   └── generate-reading.js
├── src/
│   ├── App.jsx
│   ├── BirthDateModal.jsx
│   ├── ProfileInsights.jsx
│   ├── ReadingDiary.jsx
│   ├── ReadingPanel.jsx
│   ├── WeeklyHoroscope.jsx
│   ├── profile.store.js
│   └── ...
├── public/
├── .env
├── .env.local
├── index.html
├── vite.config.js
└── README.md
```

---

## Stack

| Technology | Usage |
|---|---|
| React 18 | UI and client state |
| Vite 5 | Dev server and build pipeline |
| OpenAI API | LLM generation via `gpt-5.4` |
| Vercel Serverless | API route deployment |
| Node.js | Runtime for agents and API layer |
| localStorage | Persistent diary and user profile |

---

## Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
DEMO_MODE=false
```

```bash
# .env
DEMO_MODE=false
```

In Vercel (`Settings -> Environment Variables`):

- `OPENAI_API_KEY`
- `DEMO_MODE`

Notes:

- During local development, Vite exposes `/api/generate-reading` through middleware in `vite.config.js`.
- With `DEMO_MODE=true`, the app skips OpenAI and returns fallback readings.

---

## Local Development

```bash
git clone https://github.com/AndyV01/arcana-mystica.git
cd arcana-mystica
npm install
npm run dev
```

Local app:

```bash
http://localhost:5173
```

Production build:

```bash
npm run build
```

---

## Deployment

```bash
git add .
git commit -m "feat: update profile memory and retention flow"
git push
```

Configure in Vercel:

- `OPENAI_API_KEY`: your OpenAI secret key
- `DEMO_MODE`: `false` in production

---

## What This Project Demonstrates

- Multi-agent AI orchestration applied to a real product.
- OpenAI integration with `gpt-5.4`.
- Persistent profile memory driven by reading history.
- Retention-oriented product design using a hook agent and suggested next actions.
- Daily personalized tarot logic based on birthdate plus current day.
- React frontend with animated tarot UI, diary, and share flow.

---

## Author

Developed by **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)
