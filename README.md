# Arcana Mística — App de Tarot con IA Multi-Agente

> App de lectura de Tarot de nivel producción con sistema multi-agente de IA.
> Construida con React + Vite, interpretaciones generadas por GPT-5.4 vía OpenAI API,
> y endpoint serverless en Vercel.

Demo en vivo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## Sistema Multi-Agente de IA

El núcleo técnico del proyecto es una arquitectura de agentes que trabajan en pipeline para generar interpretaciones personalizadas.

```text
Frontend React
   |
   | POST /api/generate-reading
   v
Vercel Serverless Function (api/generate-reading.js)
   |
   +--> Orchestrator (ai/orchestrator.js)
           1) Crea AgentContext
           2) Planner define plan
           3) Ejecuta Prompt/Critic
           4) Devuelve resultado
   |
   +--> LLM: OpenAI GPT-5.4
```

### Responsabilidades de cada agente

| Agente | Archivo | Rol |
|---|---|---|
| Planner | `ai/agents/planner.agent.js` | Recibe el objetivo y devuelve un plan JSON con pasos de ejecución |
| Prompt | `ai/agents/prompt.agent.js` | Construye el prompt dinámico y llama al LLM |
| Critic | `ai/agents/critic.agent.js` | Evalúa claridad/tono y reescribe si la salida no cumple |
| Context | `ai/context.store.js` | Memoria compartida entre agentes |
| Orchestrator | `ai/orchestrator.js` | Coordina el flujo completo |

### Patrones implementados

- Pipeline dinámico: el Planner decide el orden de ejecución en runtime.
- Memoria compartida: `AgentContext` persiste estado entre agentes.
- Autocorrección: el Critic revisa y mejora la respuesta.
- Fallback inteligente: con `DEMO_MODE=true` responde local sin consumir API.
- API key segura: `OPENAI_API_KEY` solo existe en servidor.
- Serverless: despliegue simple y escalable con Vercel.

---

## Funcionalidades

### Core Tarot

- Soporte bilingüe EN/ES.
- 78 cartas (22 arcanos mayores + 56 menores).
- 4 tiradas: única, pasado/presente/futuro, cruz celta, amor.
- Cartas invertidas con significado alterno.
- Interpretación IA en tiempo real.

### Personalización por fecha de nacimiento

- Modal opcional de nacimiento.
- Numerología (camino de vida).
- Signo zodiacal automático.
- Barajado semilla para reproducibilidad.

### Contenido diario

- Carta del día.
- Horóscopo semanal.
- Diario de lecturas en `localStorage`.
- Tarjeta para compartir en redes.

---

## Estructura del proyecto

```text
arcana-mystica/
├── ai/
│   ├── agents/
│   │   ├── critic.agent.js
│   │   ├── planner.agent.js
│   │   └── prompt.agent.js
│   ├── context.store.js
│   └── orchestrator.js
├── api/
│   └── generate-reading.js
├── src/
│   ├── App.jsx
│   ├── ReadingPanel.jsx
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

| Tecnología | Uso |
|---|---|
| React 18 | UI y estado |
| Vite 5 | Dev server y build |
| OpenAI API | LLM (GPT-5.4) |
| Vercel Serverless | Endpoint `/api/generate-reading` |
| Node.js | Runtime de agentes |
| localStorage | Persistencia local |

---

## Variables de entorno

```bash
# .env.local (recomendado para secrets locales, no commitear)
OPENAI_API_KEY=sk-proj-...
DEMO_MODE=false
```

```bash
# .env (opcional, sin secrets)
DEMO_MODE=false
```

En Vercel (`Settings -> Environment Variables`):

- `OPENAI_API_KEY`
- `DEMO_MODE`

Notas:
- En desarrollo local (`npm run dev`), Vite expone el endpoint `/api/generate-reading` mediante middleware en `vite.config.js`.
- Con `DEMO_MODE=true`, la app usa fallback local y no llama a OpenAI.

---

## Inicio rápido

```bash
git clone https://github.com/AndyV01/arcana-mystica.git
cd arcana-mystica
npm install
```

Configura `/.env.local` y luego:

```bash
npm run dev
# http://localhost:5173

npm run build
```

---

## Deploy en Vercel

```bash
git add .
git commit -m "feat: update docs + openai model"
git push
```

Configurar variables en Vercel:

- `OPENAI_API_KEY`: tu clave de OpenAI
- `DEMO_MODE`: `false` en producción (`true` solo para demo)

---

## Autor

Desarrollado por **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)

Este proyecto demuestra:

- Arquitectura multi-agente de IA aplicada a un producto real.
- Integración de OpenAI API (GPT-5.4).
- Serverless Functions en Vercel con manejo seguro de secrets.
- Frontend React con UI interactiva y persistencia local.
