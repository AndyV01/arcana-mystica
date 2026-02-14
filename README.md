# 🔮 Arcana Mística — App de Tarot Bilingüe

> Una app de lectura de Tarot de nivel producción, construida con **React + Vite**.  
> Bilingüe (🇦🇷 Español / 🇺🇸 English), con animaciones 3D, mazo completo de 78 cartas, múltiples tiradas, lectura personalizada por fecha de nacimiento, carta del día, horóscopo semanal, diario de lecturas y función para compartir.

🌐 **Demo en vivo:** [arcana-mystica.vercel.app](https://arcana-mystica.vercel.app)

---

## ✨ Funcionalidades

### 🎴 Core — Lectura de Tarot
- **🌐 Bilingüe** — Soporte completo EN/ES con cambio de idioma en un click
- **🎴 Mazo de 78 cartas** — 22 Arcanos Mayores + 56 Arcanos Menores (Rider-Waite)
- **🃏 4 Tiradas** — Carta del Día, Pasado·Presente·Futuro, Cruz Celta (10), Lectura de Amor (5)
- **🔄 Flip 3D de cartas** — Animación cinemática CSS `preserve-3d`
- **🔀 Animación de barajado** — Secuencia animada antes de cada lectura
- **🔁 Cartas invertidas** — 30% de probabilidad de carta invertida con interpretaciones distintas

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
├── src/
│   ├── main.jsx              # Entry point de React
│   ├── App.jsx               # Shell principal, estado, navegación por tabs
│   ├── data.js               # 78 cartas + traducciones bilingüe + tiradas
│   ├── dailyContent.js       # Afirmaciones, meditaciones, horóscopo semanal
│   ├── StarField.jsx         # Fondo animado de estrellas (Canvas API)
│   ├── CardSVG.jsx           # Renders SVG de frente y dorso de cartas
│   ├── TarotCard.jsx         # Carta con flip 3D y hover effects
│   ├── BirthDateModal.jsx    # Modal de fecha de nacimiento + numerología
│   ├── ReadingPanel.jsx      # Overlay de lectura completa
│   ├── DailyCard.jsx         # Carta del día + afirmación + meditación
│   ├── WeeklyHoroscope.jsx   # Horóscopo semanal por signo
│   ├── ReadingDiary.jsx      # Historial de lecturas persistente
│   └── ShareCard.jsx         # Tarjeta visual para compartir en redes
├── index.html                # Entry point HTML
├── vite.config.js            # Configuración de Vite
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

### Netlify
Conectar repo → auto-deploya en push. Sin configuración extra.

---

## 🧠 Decisiones de Engagement

| Funcionalidad | Loop de retención |
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

- Arquitectura de componentes React
- i18n bilingüe sin librerías externas
- Animaciones CSS y transforms 3D
- Canvas API para backgrounds creativos
- Arte SVG generativo
- State management con hooks
- Persistencia de datos con localStorage
- Diseño responsive mobile-first
- Integración Web Share API
- Numerología y cálculos astrológicos

---

*"Las cartas revelan lo que el corazón ya sabe."*
