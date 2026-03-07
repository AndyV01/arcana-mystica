# Arcana Mistica - App de Tarot con IA Multi-Agente

> App de lectura de tarot construida con React + Vite.
> Las lecturas se generan con OpenAI `gpt-5.4` mediante un pipeline multi-agente,
> con memoria de perfil local, tiradas personalizadas por dia y una API serverless.

Demo en vivo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## Resumen

Arcana Mistica combina una experiencia visual de tarot con un backend liviano basado en agentes.
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
   +--> Orchestrator (ai/orchestrator.js)
           1) Memory agent prepara el contexto del perfil
           2) Planner agent define el orden de ejecucion
           3) Prompt agent genera la interpretacion de tarot
           4) Critic agent revisa tono y claridad
           5) Memory agent finaliza el perfil del usuario
           6) Hook agent sugiere la siguiente mejor accion
   |
   +--> OpenAI Responses API (gpt-5.4)
```

### Responsabilidades de los agentes

| Agente | Archivo | Rol |
|---|---|---|
| Memory | `ai/agents/memory.agent.js` | Construye y actualiza un perfil persistente del usuario a partir de cartas recurrentes, tiradas, temas y datos de nacimiento |
| Planner | `ai/agents/planner.agent.js` | Devuelve el plan de ejecucion del pipeline |
| Prompt | `ai/agents/prompt.agent.js` | Genera la lectura usando cartas, tirada, datos de nacimiento y contexto del perfil |
| Critic | `ai/agents/critic.agent.js` | Revisa claridad, tono, repeticiones y longitud |
| Hook | `ai/agents/hook.agent.js` | Crea la siguiente accion sugerida para traer al usuario de vuelta a la app |
| Context | `ai/context.store.js` | Store de estado compartido usado por todos los agentes |
| Orchestrator | `ai/orchestrator.js` | Coordina el flujo completo multi-agente |

### Patrones implementados

- Pipeline dinamico: el planner puede definir el orden de ejecucion en runtime.
- Memoria compartida: `AgentContext` transporta estado a lo largo de toda la orquestacion.
- Perfil persistente: el frontend guarda localmente el perfil evolutivo del usuario.
- Retencion personalizada: el hook agent recomienda la siguiente tirada o accion.
- Fallback controlado: `DEMO_MODE=true` evita OpenAI y devuelve una lectura local.
- Secrets seguros: `OPENAI_API_KEY` existe solo del lado servidor.

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
|  |- orchestrator.js
|  `- profile.utils.js
|- api/
|  `- generate-reading.js
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
| OpenAI API | Generacion LLM con `gpt-5.4` |
| Vercel Serverless | Despliegue del endpoint API |
| Node.js | Runtime de agentes y capa API |
| localStorage | Persistencia de diario y perfil |

---

## Variables de entorno

```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
DEMO_MODE=false
```

```bash
# .env
DEMO_MODE=false
```

En Vercel (`Settings -> Environment Variables`):

- `OPENAI_API_KEY`
- `DEMO_MODE`

Notas:

- En desarrollo local, Vite expone `/api/generate-reading` mediante middleware en `vite.config.js`.
- Con `DEMO_MODE=true`, la app evita OpenAI y responde con lecturas fallback.

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
git commit -m "feat: update profile memory and retention flow"
git push
```

Configurar en Vercel:

- `OPENAI_API_KEY`: tu secret key de OpenAI
- `DEMO_MODE`: `false` en produccion

---

## Que demuestra este proyecto

- Orquestacion multi-agente aplicada a un producto real.
- Integracion con OpenAI usando `gpt-5.4`.
- Memoria persistente de perfil impulsada por el historial de lecturas.
- Diseno orientado a retencion mediante hook agent y siguientes acciones sugeridas.
- Logica diaria de tarot personalizado basada en fecha de nacimiento mas dia actual.
- Frontend React con UI animada, diario y flujo de compartido.

---

## Autor

Desarrollado por **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)
