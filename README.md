# 🔮 Arcana Mystica — Bilingual Tarot Card App

> A stunning, production-grade Tarot card reading app built with **React + Vite**.  
> Bilingual (🇺🇸 English / 🇪🇸 Español) with beautiful animations, 78-card deck, multiple spreads, and persistent visit/reading counters.

---

## ✨ Features

- **🌐 Bilingual** — Full EN/ES support with one-click language switch
- **🎴 78-Card Deck** — All 22 Major Arcana + 56 Minor Arcana (Rider-Waite)
- **🃏 4 Spreads** — Single Card, Past·Present·Future, Celtic Cross (10), Love Reading (5)
- **🔄 3D Card Flip** — Cinematic CSS `preserve-3d` animations
- **🔀 Shuffle Animation** — Animated shuffling sequence before every reading
- **🔁 Reversed Cards** — 30% chance of reversed draws, with different interpretations
- **👁 Visit Counter** — Tracks total unique visits (persists via localStorage)
- **🔮 Readings Counter** — Counts completed tarot readings
- **⭐ Starfield Canvas** — 220 animated twinkling stars background
- **📱 Responsive** — Works on mobile and desktop

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — ready to deploy to GitHub Pages, Netlify, Vercel, etc.

---

## 🗂 Project Structure

```
arcana-mystica/
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main app shell, state management, routing
│   ├── data.js           # 78-card data + bilingual translations + spreads
│   ├── StarField.jsx     # Canvas-based animated star background
│   ├── CardSVG.jsx       # SVG card back and face renderers
│   ├── TarotCard.jsx     # 3D flip card component
│   └── ReadingPanel.jsx  # Full-screen reading result overlay
├── index.html            # HTML entry point
├── vite.config.js        # Vite config
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

| Tech | Purpose |
|------|---------|
| **React 18** | UI framework, hooks-based state |
| **Vite 5** | Build tool, fast HMR dev server |
| **CSS-in-JS** | Inline styles + `<style>` tag animations |
| **HTML Canvas API** | Animated star field background |
| **SVG** | Fully generative card artwork |
| **CSS 3D Transforms** | Card flip animations (`preserve-3d`) |
| **localStorage** | Persistent counters (falls back gracefully) |
| **Google Fonts** | Cinzel + Cormorant Garamond typography |

---

## 🎨 Design Decisions

- **Color palette**: Deep space purples `#050210` → `#1c0b30` with accent glows
- **Typography**: `Cinzel` (display) + `Cormorant Garamond` (body) — elegant and mystical
- **Card art**: Fully generative SVG — hue rotated per card ID, no external images needed
- **Animations**: CSS keyframes + cubic-bezier easing for natural motion
- **No external UI library** — 100% custom, showcasing raw CSS and React skills

---

## 📦 Deployment

### GitHub Pages
```bash
npm run build
# Push the dist/ folder to your gh-pages branch
```

### Netlify / Vercel
Connect repo → auto-deploys on push.

---

## 👤 Author

Built by **Andres_Vallarino** — Portfolio project demonstrating:
- React component architecture
- Bilingual i18n without external libraries
- CSS animation and 3D transforms
- Canvas API for creative backgrounds
- SVG generative art
- State management with hooks

---

*"The cards reveal what the heart already knows."*
