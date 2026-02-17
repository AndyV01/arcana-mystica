# 🔮 Arcana Mística — App de Tarot con IA Multi-Agente

> App de lectura de Tarot de nivel producción con **sistema multi-agente de IA** integrado.  
> Construida con **React + Vite**, interpretaciones generadas por **Claude 3 Haiku** via Anthropic API  
> en una arquitectura de 3 agentes especializados deployados como Serverless Functions en Vercel.

🌐 **Demo en vivo:** [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## 🤖 Sistema Multi-Agente de IA

El corazón técnico del proyecto es una arquitectura de agentes que trabajan en pipeline para generar interpretaciones personalizadas de alta calidad.

```
Frontend React
     │
     │  POST /api/generate-reading
     ▼
┌─────────────────────────────────────────────────────┐
│              Vercel Serverless Function              │
│                generate-reading.js                  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │            ORQUESTADOR PRINCIPAL             │  │
│  │               orchestrator.js               │  │
│  │  1. Instancia AgentContext (memoria)         │  │
│  │  2. Llama al Planner → obtiene plan JSON     │  │
│  │  3. Ejecuta cada paso del plan               │  │
│  │  4. Retorna resultado final al frontend      │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│       ┌─────────┼──────────┐                       │
│       ▼         ▼          ▼                       │
│  ┌─────────┐ ┌────────┐ ┌─────────┐               │
│  │ PLANNER │ │ PROMPT │ │ CRITIC  │               │
│  │  AGENT  │ │  AGENT │ │  AGENT  │               │
│  │         │ │        │ │         │               │
│  │Decide   │ │Genera  │ │Evalúa   │               │
│  │los pasos│ │el texto│ │y corrige│               │
│  └─────────┘ └────────┘ └─────────┘               │
│                 │                                   │
│       ┌─────────▼──────────┐                       │
│       │    AgentContext     │                       │
│       │  (memoria compartida│                       │
│       │   entre agentes)    │                       │
│       └─────────┬───────────┘                       │
│                 │                                   │
│       ┌─────────▼───────────┐                      │
│       │   Claude 3 Haiku    │                      │
│       │   Anthropic API     │                      │
│       └─────────────────────┘                      │
└─────────────────────────────────────────────────────┘
```

### Responsabilidades de cada agente

| Agente | Archivo | Rol |
|---|---|---|
| **Planner** | `ai/agents/planner.agent.js` | Recibe el objetivo y devuelve un plan JSON con los pasos a ejecutar |
| **Prompt** | `ai/agents/prompt.agent.js` | Construye el prompt dinámico y llama al LLM para generar la interpretación |
| **Critic** | `ai/agents/critic.agent.js` | Evalúa claridad, tono y repetición — reescribe si no aprueba |
| **Context** | `ai/context.store.js` | Store centralizado de memoria compartida entre todos los agentes |
| **Orchestrator** | `ai/orchestrator.js` | Coordina el flujo completo: instancia el contexto y ejecuta cada paso |

### Patrones de arquitectura implementados

- 🔄 **Pipeline dinámico** — el Planner decide en runtime el orden de ejecución
- 🧠 **Memoria compartida** — `AgentContext` persiste el estado entre agentes sin acoplamiento
- ✅ **Autocorrección** — el Critic reescribe la respuesta si detecta baja calidad
- 🔀 **Fallback inteligente** — `DEMO_MODE=true` devuelve respuesta local sin consumir tokens API
- 🔐 **API key segura** — `ANTHROPIC_API_KEY` solo existe en el servidor, nunca llega al browser
- ⚡ **Serverless** — zero infrastructure, escala automáticamente con Vercel

---

## ✨ Funcionalidades de la App

### 🎴 Core — Lectura de Tarot
- **🌐 Bilingüe** — Soporte completo EN/ES con cambio en un click
- **🎴 78 cartas** — 22 Arcanos Mayores + 56 Arcanos Menores (Rider-Waite)
- **🃏 4 Tiradas** — Carta Única, Pasado·Presente·Futuro, Cruz Celta (10), Amor (5)
- **🔄 Flip 3D** — Animación CSS `preserve-3d` cinemática
- **🔁 Cartas invertidas** — 30% de probabilidad con interpretaciones distintas
- **🤖 Interpretación IA** — Generada por el sistema multi-agente en tiempo real

### 🌟 Personalización por fecha de nacimiento
- **📅 Modal de nacimiento** — Antes de cada tirada, opcional
- **🔢 Numerología** — Cálculo del Número de Camino de Vida con significado
- **♌ Zodíaco** — Detección automática de signo con elemento y símbolo
- **🎴 Barajado semilla** — Mismo cumpleaños = mismo destino (determinístico)

### 📱 Contenido diario
- **🌟 Carta del Día** — Cambia cada medianoche, con afirmación y meditación guiada
- **♌ Horóscopo Semanal** — Texto único para los 12 signos del zodíaco
- **📖 Diario de Lecturas** — Historial completo guardado en localStorage
- **📤 Compartir** — Tarjeta visual lista para Instagram Stories y TikTok

---

## 🗂 Estructura del Proyecto

```
arcana-mystica/
├── ai/                          # Sistema de agentes de IA
│   ├── agents/
│   │   ├── critic.agent.js      # Evalúa y mejora la interpretación
│   │   ├── planner.agent.js     # Planifica los pasos del pipeline
│   │   └── prompt.agent.js      # Construye el prompt y llama al LLM
│   ├── context.store.js         # Memoria compartida entre agentes
│   └── orchestrator.js          # Orquestador principal del flujo
│
├── api/
│   └── generate-reading.js      # Serverless Function (Vercel) — endpoint IA
│
├── src/                         # Frontend React + Vite
│   ├── main.jsx
│   ├── App.jsx                  # Shell principal, tabs, estado global
│   ├── data.js                  # 78 cartas + traducciones + tiradas
│   ├── dailyContent.js          # Afirmaciones, meditaciones, horóscopo
│   ├── StarField.jsx            # Canvas API — fondo de estrellas animado
│   ├── CardSVG.jsx              # SVG generativo de cartas
│   ├── TarotCard.jsx            # Carta con flip 3D
│   ├── BirthDateModal.jsx       # Modal de nacimiento + numerología
│   ├── ReadingPanel.jsx         # Panel de interpretación con IA
│   ├── DailyCard.jsx            # Carta del día
│   ├── WeeklyHoroscope.jsx      # Horóscopo semanal
│   ├── ReadingDiary.jsx         # Historial persistente
│   └── ShareCard.jsx            # Tarjeta para compartir en redes
│
├── public/
│   └── img/                     # Assets de iconos UI personalizados
├── .env                         # Variables de entorno locales (no commitear)
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🛠 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 18** | UI framework, hooks, estado global |
| **Vite 5** | Build tool, HMR ultra-rápido |
| **Anthropic API** | LLM — Claude 3 Haiku para interpretaciones |
| **Vercel Serverless** | Endpoint `/api/generate-reading` sin servidor propio |
| **Node.js** | Runtime del sistema de agentes |
| **CSS-in-JS** | Estilos inline + animaciones CSS keyframes |
| **Canvas API** | Fondo de estrellas animado (220 estrellas) |
| **SVG generativo** | Arte de cartas 100% sin imágenes externas |
| **localStorage** | Persistencia del diario y contadores |
| **Google Fonts** | Cinzel + Cormorant Garamond |

---

## ⚙️ Variables de Entorno

```bash
# .env  — nunca subir al repo, agregar al .gitignore
ANTHROPIC_API_KEY=sk-ant-...   # API key de Anthropic
DEMO_MODE=false                 # true = sin llamadas a la API
```

En Vercel: **Settings → Environment Variables** — agregar las mismas keys.

> Con `DEMO_MODE=true` la app funciona al 100% sin consumir tokens, usando respuestas de fallback locales. Ideal para demos de portfolio o desarrollo sin costo.

---

## 🚀 Inicio Rápido

```bash
# Clonar
git clone https://github.com/AndyV01/arcana-mystica.git
cd arcana-mystica

# Instalar dependencias
npm install

# Configurar entorno
# Crear .env con ANTHROPIC_API_KEY o DEMO_MODE=true

# Desarrollo
npm run dev
# → http://localhost:5173

# Build producción
npm run build
```

---

## 📦 Deploy en Vercel

```bash
git add .
git commit -m "feat: descripción del cambio"
git push
# Vercel auto-deploya en ~60 segundos ✅
```

Configurar en Vercel → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` → tu clave de Anthropic
- `DEMO_MODE` → `false` en producción, `true` para demo

---

## 👤 Autor

Desarrollado por **Andres Vallarino**  
[Portfolio](https://portfolio-nextjs-nine-lac.vercel.app/) · [GitHub](https://github.com/AndyV01)

Este proyecto demuestra:
- Diseño e implementación de arquitectura multi-agente de IA desde cero
- Integración real de Anthropic API (Claude 3 Haiku) en producción
- Serverless Functions en Vercel con manejo seguro de API keys
- React con animaciones 3D, Canvas API y SVG generativo
- i18n bilingüe sin librerías externas
- Persistencia con localStorage y state management con hooks

---

*"Las cartas revelan lo que el corazón ya sabe."*
