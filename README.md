# Arcana Mistica - App de Tarot con IA Multi-Agente

> App de lectura de tarot construida con React + Vite.
> Las lecturas se generan con Groq (Llama 3.3) mediante un pipeline multi-agente orquestado con LangGraph StateGraph,
> con RAG real sobre historial de lecturas via Upstash Redis, observabilidad completa via LangSmith,
> memoria de perfil local, tiradas personalizadas por dia y una API serverless.

[![LangSmith](https://img.shields.io/badge/LangSmith-Observability-blue)](https://smith.langchain.com)
[![RAG](https://img.shields.io/badge/RAG-Upstash%20Redis-red)](https://upstash.com)

Demo en vivo: [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

### Demo

![Arcana Mystica Demo](./assets/demo.gif)

---

## Resumen

Arcana Mistica combina una experiencia visual de tarot con un backend basado en agentes especializados orquestados con LangGraph.
La app soporta lecturas bilingues, persistencia de perfil, personalizacion por fecha de nacimiento,
RAG sobre historial de lecturas anteriores y loops de retencion como diario de lecturas, contenido diario y sugerencias de siguiente accion.

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
   |       1) memory_init     → prepara el contexto del perfil
   |       2) rag             → recupera lecturas similares desde Upstash Redis
   |       3) planner         → define el orden de ejecucion
   |       4) prompt          → genera la interpretacion con contexto RAG
   |       5) critic          → revisa tono y claridad
   |       6) memory_finalize → actualiza perfil y guarda lectura en Redis
   |       7) hook            → sugiere la siguiente accion personalizada
   |       ↓
        pipeline_error → END (si cualquier nodo falla)
   |
   +--> Groq API (llama-3.3-70b-versatile)
   |
   +--> Upstash Redis (historial de lecturas por usuario)
   |
   +--> LangSmith (tracing + observabilidad completa)
```

### Responsabilidades de los agentes

| Agente | Archivo | Rol |
|---|---|---|
| memory_init | `ai/orchestrator.js` | Prepara y normaliza el perfil del usuario antes de la lectura |
| planner | `ai/agents/planner.agent.js` | Devuelve el plan de ejecucion del pipeline en runtime |
| prompt | `ai/agents/prompt.agent.js` | Genera la lectura usando cartas, tirada, perfil y contexto RAG |
| critic | `ai/agents/critic.agent.js` | Revisa claridad, tono, repeticiones y longitud |
| memory_finalize | `ai/orchestrator.js` | Finaliza y persiste el perfil actualizado con la sesion actual |
| hook | `ai/agents/hook.agent.js` | Crea la siguiente accion sugerida para retener al usuario |
| Orchestrator | `ai/orchestrator.js` | LangGraph StateGraph que coordina el flujo completo |

### Patrones implementados

- **LangGraph StateGraph** — orquestador con estado tipado, nodos y edges condicionales.
- **Estado compartido** — `TarotState` transporta estado entre nodos; cada nodo retorna solo lo que cambia.
- **Edges condicionales** — cada nodo puede derivar al nodo `pipeline_error` si falla.
- **RAG real** — el nodo `rag` recupera lecturas anteriores semanticamente similares desde Upstash Redis y las inyecta como contexto en el prompt agent.
- **Similitud Jaccard** — calcula similitud entre vectores de keywords de cartas para encontrar lecturas relacionadas.
- **Persistencia en servidor** — cada lectura se guarda en Redis al finalizar el pipeline (maximo 50 por usuario).
- **LangSmith tracing** — observabilidad completa del pipeline con latencia por nodo, tokens y metadata.
- **Pipeline dinamico** — el planner define el orden de ejecucion en runtime.
- **Perfil persistente** — el frontend guarda localmente el perfil evolutivo del usuario.
- **Retencion personalizada** — el hook agent recomienda la siguiente tirada o accion.
- **Fallback controlado** — `DEMO_MODE=true` evita Groq y devuelve una lectura local.
- **Secrets seguros** — `GROQ_API_KEY`, `LANGCHAIN_API_KEY` y `UPSTASH_REDIS_REST_TOKEN` existen solo del lado servidor.

---

## 🧩 Problema que resuelve

Las apps de tarot existentes son:
- **Genéricas**: dan la misma interpretación a todos
- **Sin memoria**: no recuerdan tus lecturas anteriores
- **Estáticas**: no aprenden de tus patrones

**Arcana Mistica** usa IA multi-agente para crear lecturas personalizadas que evolucionan con tu historial, usando RAG real sobre tus tiradas previas.

## RAG — Retrieval Augmented Generation

El sistema implementa RAG real sobre el historial de lecturas del usuario:

### Flujo RAG
```text
Cartas actuales
      ↓
cardsToVector() → extrae keywords y significados como vector
      ↓
Redis lrange() → recupera hasta 50 lecturas anteriores
      ↓
similarity() → calcula similitud Jaccard entre vectores
      ↓
Top 3 lecturas mas similares → contexto para el prompt agent
      ↓
Interpretacion enriquecida con patrones historicos reales
```

### Estructura en Redis
```text
Key: readings:{userId}
Tipo: List (lpush + ltrim — maximo 50 entradas)
Entry: { id, cardData, reading, spread, lang, createdAt }
```

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
- Pasarela de pago integrada con Mercado Pago para compra de créditos (packs y lectura individual).

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
|  |  |- prompt.agent.js       ← recibe similarReadings como contexto RAG
|  |  `- rag.agent.js          ← RAG con Upstash Redis + similitud Jaccard
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
| Upstash Redis | Historial de lecturas por usuario (serverless, gratis) |
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
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
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
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DEMO_MODE`
- `MP_ACCESS_TOKEN`
- `APP_URL`

Notas:

- En desarrollo local, Vite expone `/api/generate-reading` mediante middleware en `vite.config.js`.
- LangSmith requiere flush explicito antes de cerrar la funcion serverless para que las trazas cierren correctamente.
- Upstash Redis guarda hasta 50 lecturas por usuario usando `lpush` + `ltrim`.

---


### Pasarela de pago (Mercado Pago)

Se incorporó una pasarela de pago con **Mercado Pago Checkout** para monetizar lecturas adicionales mediante créditos.

Flujo:

1. El frontend solicita una preferencia con `POST /api/create-preference` enviando `userId` y `pack`.
2. El backend crea la preferencia en Mercado Pago y devuelve `init_point` para redirigir al checkout.
3. Mercado Pago notifica el pago en `/api/mp-webhook`.
4. El webhook valida el pago `approved`, evita duplicados por `paymentId` y acredita créditos en Redis (`credits:paid:{userId}`).
5. La app consume créditos con `/api/use-credit` y consulta saldo con `/api/check-credits`.

Packs configurados actualmente:

- `single`: 1 lectura
- `pack5`: 5 lecturas

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
- `UPSTASH_REDIS_REST_URL`: URL de tu base de datos en upstash.com
- `UPSTASH_REDIS_REST_TOKEN`: token de tu base de datos en upstash.com
- `DEMO_MODE`: `false` en produccion
- `MP_ACCESS_TOKEN`: access token privado de Mercado Pago
- `APP_URL`: URL pública de la app (usada para `success/failure/pending`)

---

## Que demuestra este proyecto

- **Orquestacion multi-agente real** con LangGraph StateGraph en JavaScript.
- **Estado tipado** con `TarotState` — cada nodo recibe el estado completo y retorna solo lo que cambia.
- **Edges condicionales** — manejo de errores por nodo con derivacion a `pipeline_error`.
- **RAG real** — recuperacion semantica de lecturas anteriores desde Upstash Redis como contexto para el LLM.
- **Similitud Jaccard** — calculo de similitud entre vectores de keywords sin dependencias externas de embeddings.
- **Observabilidad completa** con LangSmith — tracing por nodo, tokens, latencia y error metadata en local y produccion.
- **LLM gratuito** con Groq API (llama-3.3-70b-versatile) en produccion.
- **Persistencia serverless** con Upstash Redis — historial de lecturas por usuario sin BD tradicional.
- **Memoria persistente** de perfil impulsada por el historial de lecturas.
- **Diseno orientado a retencion** mediante hook agent y siguientes acciones sugeridas.
- **Logica diaria personalizada** basada en fecha de nacimiento mas dia actual.
- **Frontend React** con UI animada, diario y flujo de compartido.

---
## 🎓 Aprendizajes clave

- **Optimización de costos**: Reemplacé embeddings costosos por similitud Jaccard con keywords, reduciendo costos a ~$0
- **Serverless constraints**: Aprendí a manejar el cold start y el flush de LangSmith antes de que cierre la función
- **UX asíncrona**: Diseñé estados de carga que mantienen al usuario informado durante el pipeline multi-agente

## Autor

Desarrollado por **Andres Vallarino**

- [Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/)
- [GitHub](https://github.com/AndyV01)
