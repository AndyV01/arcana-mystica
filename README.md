# 🔮 Arcana Mística — App de Tarot Bilingüe

> Una app de lectura de Tarot de nivel producción, construida con **React + Vite**.  
> Bilingüe (🇦🇷 Español / 🇺🇸 English), con animaciones 3D, mazo completo de 78 cartas, múltiples tiradas, lectura personalizada por fecha de nacimiento, carta del día, horóscopo semanal, diario y generación de interpretación mediante IA orquestada.

🌐 **Demo en vivo:** [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## ✨ Funcionalidades

### 🎴 Core — Lectura de Tarot
- **🤖 IA** - Generación de interpretación con IA
- **🌐 Bilingüe** — Soporte completo EN/ES con cambio de idioma en un click
- **🎴 Mazo de 78 cartas** — 22 Arcanos Mayores + 56 Arcanos Menores (Rider-Waite)
- **🃏 4 Tiradas** — Carta del Día, Pasado·Presente·Futuro, Cruz Celta (10), Lectura de Amor (5)
- **🔄 Flip 3D de cartas** — Animación cinemática CSS `preserve-3d`
- **🔀 Animación de barajado** — Secuencia animada antes de cada lectura
- **🔁 Cartas invertidas** — 30% de probabilidad de carta invertida con interpretaciones distintas

### 🤖 Sistema de IA — Arquitectura Multi-Agente
La generación de lecturas no es un simple prompt estático.

El sistema implementa un flujo Planner → Prompt → Critic → Orchestrator, separando responsabilidades y mejorando calidad de salida.

🔹 Flujo Interno
- **Planner Agent** - Analiza la tirada seleccionada
                    - Define estructura narrativa
                    - Determina enfoque emocional y simbólico
- **Prompt Agent** - Construye el prompt dinámico
                   - Inyecta: (Cartas seleccionadas, Posición (normal/invertida), Tipo de tirada, Fecha de nacimiento, Número de vida, Signo zodiacal, Idioma )
- **Critic Agent** - Evalúa coherencia
                   - Ajusta tono
                   - Refuerza profundidad simbólica
- **Orchestrator** - Coordina agentes
                   - Maneja contexto compartido
                   - Devuelve interpretación final al endpoint


### 🌟 Personalización por Fecha de Nacimiento
- **📅 Modal de nacimiento** — Antes de cada tirada pide fecha de nacimiento
- **🔢 Numerología** — Calcula el Número de Camino de Vida con su significado
- **♌ Signo zodiacal** — Detectado automáticamente con símbolo y elemento
- **🎴 Barajado semilla** — El mismo cumpleaños siempre genera el mismo destino
- **🏷 Badge personal** — Visible durante el barajado, la tirada y la lectura

### 🌟 Carta del Día
- **🃏 Carta única por día** — Generada determinísticamente, cambia cada medianoche
- **💫 Afirmación diaria** — Frase mística personalizada por idioma
- **🧘 Meditación guiada** — Texto de meditación de 3 minutos alineado a la carta

### ♌ Horóscopo Semanal
- **12 signos** — Lectura semanal única para cada signo del zodíaco
- **Tema de la semana** — Palabra clave que rige la energía del signo
- **Integración con perfil** — Resalta automáticamente el signo del usuario

### 📖 Diario de Lecturas
- **Historial completo** — Todas las tiradas guardadas con fecha y cartas
- **Vista expandible** — Click para ver las cartas de cada lectura pasada
- **Persistencia** — Guardado en `localStorage` + `window.storage` como fallback
- **Hasta 50 lecturas** almacenadas

### 📤 Compartir Lectura
- **Tarjeta visual** — Genera una imagen hermosa con las cartas y la interpretación
- **Lista para Stories** — Formato optimizado para Instagram Stories y TikTok
- **Web Share API** — Comparte directamente desde el celular, copia link como fallback

### 📊 Métricas
- **👁 Contador de visitas** — Visitas únicas acumuladas
- **🔮 Contador de lecturas** — Total de tiradas completadas

### 🎨 UI/UX
- **⭐ Fondo de estrellas** — 220 estrellas animadas con Canvas API
- **🧭 Navegación por tabs** — Barra inferior con 4 secciones
- **📱 Responsive** — Funciona en móvil y escritorio

---

## 🚀 Inicio Rápido

### Requisitos
- [Node.js](https://nodejs.org/) v18 o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AndyV01/arcana-mystica.git
cd arcana-mystica

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción

```bash
npm run build
```

El output queda en la carpeta `dist/` — listo para deployar.

---

## 🗂 Estructura del Proyecto

```
arcana-mystica/
├── ai/                          # Sistema interno de agentes de IA
│   ├── agents/
│   │   ├── critic.agent.js      # Evalúa y mejora la lectura generada
│   │   ├── planner.agent.js     # Planifica la estructura de la interpretación
│   │   └── prompt.agent.js      # Construye el prompt dinámico para el LLM
│   ├── context.store.js         # Manejo de contexto compartido entre agentes
│   └── orchestrator.js          # Orquestador principal del flujo multi-agente
│
├── api/
│   └── generate-reading.js      # Serverless function (Vercel) — endpoint de IA
│
├── src/                         # Frontend React (Vite)
│   ├── main.jsx                 # Entry point de React
│   ├── App.jsx                  # Shell principal, estado, navegación por tabs
│   ├── data.js                  # 78 cartas + traducciones bilingüe + tiradas
│   ├── dailyContent.js          # Afirmaciones, meditaciones, horóscopo semanal
│   ├── StarField.jsx            # Fondo animado de estrellas (Canvas API)
│   ├── CardSVG.jsx              # SVG generativo de cartas
│   ├── TarotCard.jsx            # Carta con flip 3D
│   ├── BirthDateModal.jsx       # Modal de fecha de nacimiento + numerología
│   ├── ReadingPanel.jsx         # Panel final con interpretación IA
│   ├── DailyCard.jsx            # Carta del día
│   ├── WeeklyHoroscope.jsx      # Horóscopo semanal
│   ├── ReadingDiary.jsx         # Historial persistente en localStorage
│   └── ShareCard.jsx            # Generador de tarjeta para compartir
│
├── public/                      # Assets estáticos
├── .env                         # Variables de entorno (local)
├── .env.local                   # Overrides locales
├── index.html                   # Entry point HTML
├── vite.config.js               # Configuración de Vite
├── package.json
└── README.md
```

---

## 🛠 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 18** | Framework UI, state management con hooks |
| **Vite 5** | Build tool, servidor HMR ultra-rápido |
| **CSS-in-JS** | Estilos inline + animaciones con `<style>` tag |
| **HTML Canvas API** | Fondo animado de estrellas |
| **SVG generativo** | Arte de cartas 100% generativo, sin imágenes externas |
| **CSS 3D Transforms** | Flip de cartas (`preserve-3d`, `backface-visibility`) |
| **localStorage** | Persistencia de contadores y diario |
| **window.storage** | Fallback de storage para entornos especiales |
| **Web Share API** | Compartir nativo en mobile |
| **Google Fonts** | Cinzel (display) + Cormorant Garamond (body) |
| **Claude Anthropic API** | Modelo LLM |

---

## 🎨 Decisiones de Diseño

- **Paleta de colores:** Púrpuras espaciales `#050210` → `#1c0b30` con brillos de acento
- **Tipografía:** `Cinzel` (display, titulos) + `Cormorant Garamond` (body, cuerpo) — elegante y místico
- **Arte de cartas:** SVG 100% generativo — hue rotado por ID de carta, sin imágenes externas necesarias
- **Animaciones:** CSS keyframes + cubic-bezier easing para movimiento natural
- **Sin librería UI externa** — 100% custom, demuestra dominio de CSS y React puros
- **i18n sin librerías** — Sistema de traducción propio con objetos `{ en, es }`

---

## 📱 Flujo de la App

```
Tab 🔮 Tiradas
  → Elegir tirada
  → Modal fecha de nacimiento (opcional)
  → Animación de barajado personalizada
  → Mesa de cartas → flip una a una
  → Panel de lectura completa
  → Compartir en Stories

Tab 🌟 Hoy
  → Carta del día (flip automático)
  → Afirmación diaria
  → Meditación guiada expandible

Tab ♌ Horóscopo
  → Grilla de 12 signos
  → Texto semanal único por signo
  → Tema + elemento + carta regente

Tab 📖 Diario
  → Historial de todas las lecturas
  → Vista expandible con cartas
  → Borrar historial
```

---

## 📦 Deployment

### Vercel (recomendado)
Conectar repo → auto-deploya en cada push. Vite detectado automáticamente.

```bash
git add .
git commit -m "descripción del cambio"
git push
# Vercel despliega en ~60 segundos ✅
```

### GitHub Pages
```bash
npm run build
# Pushear la carpeta dist/ a tu rama gh-pages
```
---

## 🧠 Decisiones de Engagement

| Funcionalidad | Loop de retención |
| Separación frontend / backend |
| Arquitectura multi-agente |
| Orquestador desacoplado |
| Context store compartido |
| DEMO_MODE para control de costos |
| API key protegida en entorno serverless |
| Escalable a backend dedicado |
|---|---|
| Carta del Día | Razón para abrir la app todos los días |
| Diario | El usuario siente que su "viaje espiritual" se registra |
| Compartir | Genera contenido viral orgánico en Instagram/TikTok |
| Horóscopo | Atrae usuarios del nicho astrología, no solo tarot |
| Meditación | Aumenta el tiempo en app 3–5 minutos por sesión |
| Fecha de nacimiento | Personalización = mayor attachment emocional |

---

## 👤 Autor

Desarrollado por **Andres_Vallarino** — Proyecto portfolio que demuestra:

- Arquitectura de componentes React avanzada
- i18n bilingüe sin librerías externas
- Animaciones CSS y transforms 3D
- Canvas API para backgrounds creativos
- Arte SVG generativo
- State management con hooks
- Persistencia de datos con localStorage
- Diseño responsive mobile-first
- Integración Web Share API
- Numerología y cálculos astrológicos
- Diseño multi-agente para LLM
- Orquestación de agentes
- Integración segura con Claude (Anthropic)


---

*"Las cartas revelan lo que el corazón ya sabe."*
