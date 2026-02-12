import { useState, useEffect, useRef } from "react"
import StarField from "./StarField.jsx"
import TarotCard from "./TarotCard.jsx"
import ReadingPanel from "./ReadingPanel.jsx"
import { CardBackSVG } from "./CardSVG.jsx"
import { TRANSLATIONS, SPREADS, MAJOR_ARCANA, generateMinorArcana } from "./data.js"

// Build full 78-card deck once
const ALL_CARDS = [...MAJOR_ARCANA, ...generateMinorArcana()]

// ─── Stats storage helpers ────────────────────────────────────────────────────
const STORAGE_KEY = "arcana-mystica-stats-v2"

async function loadStats() {
  try {
    if (window.storage) {
      const r = await window.storage.get(STORAGE_KEY)
      if (r) return JSON.parse(r.value)
    }
    const ls = localStorage.getItem(STORAGE_KEY)
    if (ls) return JSON.parse(ls)
  } catch {}
  return { visits: 0, readings: 0 }
}

async function saveStats(stats) {
  try {
    if (window.storage) {
      await window.storage.set(STORAGE_KEY, JSON.stringify(stats))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    }
  } catch {}
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en")
  const [phase, setPhase] = useState("home") // home | shuffling | drawn | reading
  const [selectedSpread, setSelectedSpread] = useState(null)
  const [dealtCards, setDealtCards] = useState([])
  const [revealedIndexes, setRevealedIndexes] = useState([])
  const [readingCards, setReadingCards] = useState([])
  const [showReading, setShowReading] = useState(false)
  const [stats, setStats] = useState({ visits: 0, readings: 0 })
  const [shufflePhase, setShufflePhase] = useState(0)
  const [visible, setVisible] = useState({ header: false, cards: false })
  const shuffleRef = useRef(null)

  const t = TRANSLATIONS[lang]
  const spreads = SPREADS[lang]

  // ── On mount: load stats + increment visits ──
  useEffect(() => {
    ;(async () => {
      const s = await loadStats()
      s.visits += 1
      setStats({ ...s })
      await saveStats(s)
    })()
    setTimeout(() => setVisible(v => ({ ...v, header: true })), 80)
    setTimeout(() => setVisible(v => ({ ...v, cards: true })), 350)
  }, [])

  // ── Shuffle animation ──
  useEffect(() => {
    if (phase !== "shuffling") return
    let count = 0
    shuffleRef.current = setInterval(() => {
      setShufflePhase(p => p + 1)
      count++
      if (count >= 14) {
        clearInterval(shuffleRef.current)
        dealCards(selectedSpread)
      }
    }, 130)
    return () => clearInterval(shuffleRef.current)
  }, [phase])

  const dealCards = (spread) => {
    const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, spread.count).map(c => ({
      card: c,
      reversed: Math.random() > 0.72,
    }))
    setDealtCards(selected)
    setRevealedIndexes([])
    setTimeout(() => setPhase("drawn"), 150)
  }

  const startReading = (spread) => {
    setSelectedSpread(spread)
    setPhase("shuffling")
    setShufflePhase(0)
  }

  const revealCard = (idx) => {
    setRevealedIndexes(prev => {
      const next = [...new Set([...prev, idx])]
      if (next.length === dealtCards.length) {
        setTimeout(async () => {
          setReadingCards(dealtCards)
          setShowReading(true)
          const newStats = { visits: stats.visits, readings: stats.readings + 1 }
          setStats(newStats)
          await saveStats(newStats)
        }, 900)
      }
      return next
    })
  }

  const reset = () => {
    setShowReading(false)
    setPhase("home")
    setDealtCards([])
    setRevealedIndexes([])
    setReadingCards([])
    setSelectedSpread(null)
  }

  const toggleLang = () => setLang(l => l === "en" ? "es" : "en")

  // ── Shared CSS ──
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #050210; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #050210; }
    ::-webkit-scrollbar-thumb { background: rgba(140,80,255,0.3); border-radius:4px; }
    @keyframes headerIn  { from { opacity:0; transform:translateY(-28px) } to { opacity:1; transform:translateY(0) } }
    @keyframes cardsIn   { from { opacity:0; transform:translateY(20px)  } to { opacity:1; transform:translateY(0) } }
    @keyframes orbPulse  { 0%,100%{opacity:.28;transform:scale(1)} 50%{opacity:.55;transform:scale(1.1)} }
    @keyframes shuffleAnim { 0%{transform:translateX(0) rotate(0deg)} 30%{transform:translateX(-10px) rotate(-4deg)} 70%{transform:translateX(10px) rotate(4deg)} 100%{transform:translateX(0) rotate(0deg)} }
    @keyframes spinSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes textGlow  { 0%,100%{text-shadow:0 0 20px rgba(180,130,255,.4)} 50%{text-shadow:0 0 50px rgba(200,150,255,.8),0 0 80px rgba(160,100,255,.4)} }
    @keyframes statCount { from{transform:scale(1.25);opacity:.4} to{transform:scale(1);opacity:1} }
    .spread-card { transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s ease !important; }
    .spread-card:hover { transform: translateY(-8px) scale(1.04) !important; box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 36px rgba(140,80,255,.35) !important; }
    .lang-btn:hover { background: rgba(180,140,255,0.15) !important; color: #e8d5ff !important; }
    .stat-pill:hover { border-color: rgba(200,160,255,0.4) !important; background: rgba(120,60,200,0.12) !important; }
    @media (max-width: 768px) {
  header span.logo-text {
    font-size: 7px !important;
    margin-right: 6px !important;
  }
}
  `

  // ── Render ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 15% 15%, #1c0b30 0%, #0b0518 45%, #040212 100%)",
      color: "#e8d5ff",
      fontFamily: "'Cormorant Garamond','Georgia',serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{globalStyles}</style>
      <StarField />

      {/* Ambient orbs */}
      {[
        ["18%","8%","360px","rgba(80,30,220,0.07)","4s"],
        ["78%","55%","440px","rgba(130,20,170,0.055)","5.5s"],
        ["48%","88%","280px","rgba(50,100,220,0.065)","3.5s"],
        ["5%","60%","200px","rgba(100,40,180,0.05)","6s"],
      ].map(([l,t2,s,c,d],i) => (
        <div key={i} style={{ position:"fixed", left:l, top:t2, width:s, height:s, borderRadius:"50%", background:c, filter:"blur(90px)", animation:`orbPulse ${d} ease-in-out infinite`, animationDelay:`${i*1.3}s`, pointerEvents:"none", zIndex:1 }} />
      ))}

      {/* ── Top Bar ────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top:0, left:0, right:0, zIndex:200,
        display: "flex", justifyContent:"space-between", alignItems:"center",
        padding: "11px 22px",
        background: "rgba(4,1,14,0.82)",
        backdropFilter: "blur(22px)",
        borderBottom: "1px solid rgba(140,80,255,0.12)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"20px", filter:"drop-shadow(0 0 8px rgba(200,150,255,0.6))" }}>🔮</span>
          <span className="logo-text" style={{ fontSize:"13px", letterSpacing:"3px", color:"rgba(200,165,255,0.55)", textTransform:"uppercase", fontFamily:"'Cinzel','Georgia',serif", fontWeight:400 }}>
            {t.appName}
          </span>
        </div>

        {/* Stats + lang */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {/* Stats */}
          {[
            { icon:"👁", val:stats.visits,   label:t.seekers   },
            { icon:"🔮", val:stats.readings, label:t.readings  },
          ].map(({ icon, val, label }) => (
            <div key={label} className="stat-pill" style={{
              display:"flex", alignItems:"center", gap:"7px",
              padding:"5px 14px",
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(140,80,255,0.15)",
              borderRadius:"20px",
              cursor:"default",
              transition:"all 0.3s",
            }}>
              <span style={{ fontSize:"13px" }}>{icon}</span>
              <div>
                <div style={{ fontSize:"15px", fontWeight:"bold", color:"#d4a8ff", fontFamily:"'Cinzel','Georgia',serif", lineHeight:1, animation:`statCount 0.4s ease` }}>
                  {val.toLocaleString()}
                </div>
                <div style={{ fontSize:"11px", letterSpacing:"1.5px", color:"rgb(170, 126, 251)", textTransform:"uppercase" }}>
                  {label}
                </div>
              </div>
            </div>
          ))}

          {/* Language toggle */}
          <button className="lang-btn" onClick={toggleLang} style={{
            padding:"6px 14px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(180,140,255,0.22)",
            borderRadius:"20px",
            color:"rgba(200,165,255,0.65)",
            fontSize:"11px",
            letterSpacing:"2px",
            cursor:"pointer",
            fontFamily:"'Cinzel','Georgia',serif",
            transition:"all 0.3s",
          }}>
            {t.langSwitch}
          </button>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────── */}
      <main style={{ position:"relative", zIndex:10, paddingTop:"65px" }}>

        {/* ══ HOME ════════════════════════════════════════════════ */}
        {phase === "home" && (
          <div style={{ maxWidth:"920px", margin:"0 auto", padding:"56px 20px 60px", textAlign:"center" }}>

            {/* Hero section */}
            <div style={{
              opacity: visible.header ? 1 : 0,
              animation: visible.header ? "headerIn 0.9s cubic-bezier(.34,1.56,.64,1) forwards" : "none",
            }}>
              <div style={{ fontSize:"56px", marginBottom:"18px", animation:"textGlow 3s ease-in-out infinite", display:"inline-block" }}>🔮</div>
              <p style={{ fontSize:"10px", letterSpacing:"7px", color:"rgba(200,160,255,0.42)", textTransform:"uppercase", marginBottom:"16px", fontFamily:"'Cinzel','Georgia',serif" }}>
                ✦ {t.subtitle} ✦
              </p>
              <h1 style={{
                fontSize:"clamp(40px,9vw,80px)",
                fontFamily:"'Cinzel','Georgia',serif",
                fontWeight:400, lineHeight:1.08,
                marginBottom:"22px",
                background:"linear-gradient(135deg,#f0e2ff 0%,#c8a4ff 40%,#9060ef 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                letterSpacing:"2px",
              }}>
                {t.appName}
              </h1>
              <p style={{ fontSize:"clamp(14px,2.2vw,20px)", color:"rgba(200,170,255,0.55)", letterSpacing:"2px", fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:"italic", marginBottom:"52px" }}>
                {t.tagline}
              </p>
            </div>

            {/* Spread cards grid */}
            <div style={{
              opacity: visible.cards ? 1 : 0,
              animation: visible.cards ? "cardsIn 0.8s ease forwards" : "none",
            }}>
              <p style={{ fontSize:"10px", letterSpacing:"5px", color:"rgba(180,140,255,0.38)", textTransform:"uppercase", marginBottom:"28px", fontFamily:"'Cinzel','Georgia',serif" }}>
                ─── {t.chooseSpread} ───
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:"16px", marginBottom:"64px" }}>
                {spreads.map((sp, i) => (
                  <div key={sp.id} className="spread-card" onClick={() => startReading(sp)}
                    style={{
                      padding:"28px 20px 24px",
                      background:"linear-gradient(135deg,rgba(80,35,160,0.2),rgba(40,15,80,0.3))",
                      border:"1px solid rgba(140,80,255,0.18)",
                      borderRadius:"14px",
                      cursor:"pointer",
                      backdropFilter:"blur(12px)",
                    }}
                  >
                    <div style={{ fontSize:"30px", marginBottom:"14px" }}>{["🃏","🎴","✨","🌙"][i]}</div>
                    <div style={{ fontSize:"13px", letterSpacing:"1px", color:"#d4b4ff", marginBottom:"8px", fontFamily:"'Cinzel','Georgia',serif", fontWeight:500 }}>
                      {sp.name}
                    </div>
                    <div style={{ fontSize:"12px", color:"rgba(180,140,255,0.48)", marginBottom:"14px", fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:"italic" }}>
                      {sp.description}
                    </div>
                    <div style={{ display:"inline-block", padding:"4px 14px", background:"rgba(140,80,255,0.13)", border:"1px solid rgba(140,80,255,0.22)", borderRadius:"20px", fontSize:"10px", color:"rgba(200,160,255,0.65)", letterSpacing:"1px", fontFamily:"sans-serif" }}>
                      {t.cards(sp.count)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deck preview */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    width:"52px", height:"87px",
                    marginLeft: i > 0 ? "-16px" : 0,
                    transform:`rotate(${(i - 2) * 5}deg) translateY(${Math.abs(i - 2) * 2.5}px)`,
                    borderRadius:"6px", overflow:"hidden",
                    boxShadow:"0 5px 20px rgba(0,0,0,0.55)",
                    transition:"transform 0.3s",
                    zIndex: 5 - Math.abs(i - 2),
                    position:"relative",
                  }}>
                    <CardBackSVG />
                  </div>
                ))}
              </div>
              <p style={{ fontSize:"15px", color:"rgba(180,140,255,0.28)", letterSpacing:"3px", textTransform:"uppercase", fontFamily:"'Cinzel','Georgia',serif" }}>
                {t.deckLabel}
                <br />
                <br />
                by Andres Vallarino 
              </p>
            </div>
          </div>
        )}

        {/* ══ SHUFFLING ═══════════════════════════════════════════ */}
        {phase === "shuffling" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 65px)", gap:"32px", textAlign:"center", padding:"20px" }}>

            {/* Animated shuffling cards */}
            <div style={{ position:"relative", width:"180px", height:"130px" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  position:"absolute", top:"50%", left:"50%",
                  width:"88px", height:"147px",
                  marginTop:"-73px", marginLeft:"-44px",
                  animation:`shuffleAnim 0.4s ease-in-out infinite`,
                  animationDelay:`${i * 130}ms`,
                  borderRadius:"7px", overflow:"hidden",
                  boxShadow:"0 8px 30px rgba(0,0,0,0.6)",
                }}>
                  <CardBackSVG />
                </div>
              ))}
              {/* Glow ring */}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                width:"140px", height:"140px",
                marginTop:"-70px", marginLeft:"-70px",
                borderRadius:"50%",
                border:"1px solid rgba(160,100,255,0.25)",
                animation:"spinSlow 4s linear infinite",
                pointerEvents:"none",
              }} />
            </div>

            <div>
              <p style={{ fontSize:"13px", letterSpacing:"4px", color:"rgba(200,160,255,0.7)", textTransform:"uppercase", fontFamily:"'Cinzel','Georgia',serif", marginBottom:"10px" }}>
                {t.consultingArcana}
              </p>
              <p style={{ fontSize:"13px", color:"rgba(180,140,255,0.4)", fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:"italic" }}>
                {t.shufflingDesc}
              </p>
            </div>
          </div>
        )}

        {/* ══ DRAWN ════════════════════════════════════════════════ */}
        {phase === "drawn" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 16px 60px", gap:"28px" }}>

            {/* Header */}
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"10px", letterSpacing:"4px", color:"rgba(180,140,255,0.38)", textTransform:"uppercase", marginBottom:"10px", fontFamily:"'Cinzel','Georgia',serif" }}>
                {selectedSpread?.name}
              </p>
              <h2 style={{ fontSize:"clamp(16px,3.5vw,26px)", fontFamily:"'Cinzel','Georgia',serif", fontWeight:400, color:"#d4b4ff", marginBottom:"8px" }}>
                {revealedIndexes.length === 0
                  ? t.revealCards
                  : revealedIndexes.length < dealtCards.length
                    ? t.cardsRemaining(dealtCards.length - revealedIndexes.length)
                    : t.readingComplete}
              </h2>
              <p style={{ fontSize:"12px", color:"rgba(180,140,255,0.38)", fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:"italic" }}>
                {t.clickToReveal}
              </p>
            </div>

            {/* Progress dots */}
            <div style={{ display:"flex", gap:"10px" }}>
              {dealtCards.map((_,i) => (
                <div key={i} style={{
                  width:"9px", height:"9px", borderRadius:"50%",
                  background: revealedIndexes.includes(i) ? "rgba(200,160,255,0.85)" : "rgba(140,80,255,0.18)",
                  boxShadow: revealedIndexes.includes(i) ? "0 0 12px rgba(200,160,255,0.6)" : "none",
                  transition:"all 0.45s ease",
                }} />
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"22px", justifyContent:"center", maxWidth:"960px" }}>
              {dealtCards.map((c, i) => (
                <TarotCard
                  key={i}
                  card={c.card}
                  index={i}
                  isRevealed={revealedIndexes.includes(i)}
                  isReversed={c.reversed}
                  position={selectedSpread?.positions[i]}
                  onClick={revealCard}
                  delay={i * 90}
                  lang={lang}
                />
              ))}
            </div>

            {/* Back button */}
            <button onClick={reset} style={{
              marginTop:"12px", padding:"10px 32px",
              background:"transparent",
              border:"1px solid rgba(140,80,255,0.18)",
              borderRadius:"4px",
              color:"rgba(180,140,255,0.38)",
              fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase",
              cursor:"pointer",
              fontFamily:"'Cinzel','Georgia',serif",
              transition:"all 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.color="rgba(210,170,255,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(180,140,255,0.38)"}
            >
              {t.backToSpreads}
            </button>
          </div>
        )}
      </main>

      {/* ── Reading overlay ─────────────────────────────────────── */}
      {showReading && (
        <ReadingPanel
          cards={readingCards}
          spread={selectedSpread}
          onClose={reset}
          lang={lang}
          t={t}
        />
      )}
    </div>
  )
}
