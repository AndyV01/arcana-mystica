import { useState, useEffect, useRef } from "react"
import StarField from "./StarField.jsx"
import TarotCard from "./TarotCard.jsx"
import ReadingPanel from "./ReadingPanel.jsx"
import BirthDateModal, { seededShuffle } from "./BirthDateModal.jsx"
import DailyCard from "./DailyCard.jsx"
import ReadingDiary, { addDiaryEntry } from "./ReadingDiary.jsx"
import WeeklyHoroscope from "./WeeklyHoroscope.jsx"
import ShareCard from "./ShareCard.jsx"
import ProfileInsights from "./ProfileInsights.jsx"
import { CardBackSVG } from "./CardSVG.jsx"
import { TRANSLATIONS, SPREADS, MAJOR_ARCANA, generateMinorArcana } from "./data.js"
import { getUserId, canGenerateReading, consumeCredit } from "./credits.js"
import PaywallModal from "./PaywallModal.jsx"
import { useCredits } from "./hooks/useCredits";

const ALL_CARDS = [...MAJOR_ARCANA, ...generateMinorArcana()]

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS_KEY = "arcana-mystica-stats-v2"
async function loadStats() {
  try {
    if (window.storage) { const r = await window.storage.get(STATS_KEY); if (r) return JSON.parse(r.value) }
    const ls = localStorage.getItem(STATS_KEY); if (ls) return JSON.parse(ls)
  } catch { }
  return { visits: 0, readings: 0 }
}
async function saveStats(s) {
  try {
    if (window.storage) await window.storage.set(STATS_KEY, JSON.stringify(s))
    else localStorage.setItem(STATS_KEY, JSON.stringify(s))
  } catch { }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("es")
  // Tab: home | daily | diary | horoscope
  const [tab, setTab] = useState("home")
  // Reading phases: idle | birthdate | shuffling | drawn
  const [phase, setPhase] = useState("idle")
  const [selectedSpread, setSelectedSpread] = useState(null)
  const [dealtCards, setDealtCards] = useState([])
  const [revealedIndexes, setRevealedIndexes] = useState([])
  const [readingCards, setReadingCards] = useState([])
  const [showReading, setShowReading] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ visits: 0, readings: 0 })
  const [birthData, setBirthData] = useState(null)
  const [visible, setVisible] = useState({ header: false, cards: false })
  const shuffleRef = useRef(null)
  const [shuffleTick, setShuffleTick] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [creditAnimation, setCreditAnimation] = useState(null);

  const t = TRANSLATIONS[lang]
  const spreads = SPREADS[lang]
  const { credits, reloadCredits } = useCredits();

  function getDailyReadingSeed(baseSeed) {
    const now = new Date()
    const daySeed = Number(
      `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
    )

    return (baseSeed * 31 + daySeed) % 2147483647
  }

  async function handleReadingFlow() {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const userId = getUserId();

      const creditStatus = await canGenerateReading(userId);

      if (!creditStatus.hasCredits) {
        setShowReading(false);
        setShowPaywall(true);
        return;
      }

      // Consumir crédito ANTES de mostrar
      await consumeCredit(userId);
      reloadCredits();
      // Mostrar lectura
      setReadingCards(dealtCards);
      setShowReading(true);

      const ns = { visits: stats.visits, readings: stats.readings + 1 };
      setStats(ns);
      await saveStats(ns);

      await addDiaryEntry(dealtCards, selectedSpread, lang, birthData);

    } catch (err) {
      console.error("Reading flow error:", err);
      alert("Ocurrió un error al generar la lectura");
    } finally {

      setIsGenerating(false);
    }
  }

  useEffect(() => {
    ; (async () => {
      const s = await loadStats(); s.visits += 1; setStats({ ...s }); await saveStats(s)
    })()
    setTimeout(() => setVisible(v => ({ ...v, header: true })), 80)
    setTimeout(() => setVisible(v => ({ ...v, cards: true })), 350)
  }, [])

  // Shuffle animation
  useEffect(() => {
    if (phase !== "shuffling") return
    let count = 0
    shuffleRef.current = setInterval(() => {
      setShuffleTick(p => p + 1); count++
      if (count >= 14) { clearInterval(shuffleRef.current); dealCards(selectedSpread, birthData) }
    }, 130)
    return () => clearInterval(shuffleRef.current)
  }, [phase])

  const dealCards = (spread, bd) => {
    const readingSeed = bd?.seed ? getDailyReadingSeed(bd.seed) : null
    const pool = readingSeed ? seededShuffle(ALL_CARDS, readingSeed) : [...ALL_CARDS].sort(() => Math.random() - 0.5)
    const selected = pool.slice(0, spread.count).map((c, i) => ({
      card: c,
      reversed: readingSeed ? ((readingSeed + i * 137) % 10) > 7 : Math.random() > 0.72,
    }))
    setDealtCards(selected); setRevealedIndexes([])
    setTimeout(() => setPhase("drawn"), 150)
  }

  const handleSpreadSelect = (spread) => { setSelectedSpread(spread); setPhase("birthdate") }
  const handleSuggestedSpread = (spreadId) => {
    const suggestedSpread = spreads.find(spread => spread.id === spreadId)
    if (!suggestedSpread) return
    setTab("home")
    handleSpreadSelect(suggestedSpread)
  }
  const handleBirthConfirm = (bd) => { setBirthData(bd); setPhase("shuffling"); setShuffleTick(0) }
  const handleBirthSkip = () => { setBirthData(null); setPhase("shuffling"); setShuffleTick(0) }

  const revealCard = (idx) => {
    setRevealedIndexes(prev => {
      const next = [...new Set([...prev, idx])]
      if (next.length === dealtCards.length) {
        setTimeout(() => {
          handleReadingFlow();
        }, 900)
      }
      return next
    })
  }

  const reset = () => {
    setShowReading(false); setShowShare(false); setPhase("idle")
    setDealtCards([]); setRevealedIndexes([]); setReadingCards([])
    setSelectedSpread(null); setBirthData(null)
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const paymentStatus = params.get("payment");
    const pack = params.get("pack");

    const creditsMap = {
      pack5: 5,
      single: 1,
    };

    const credits = creditsMap[pack] || 0;

    if (paymentStatus === "success" && credits > 0) {
      reloadCredits();
      setShowPaywall(false);

      // ANIMACIÓN dinámica
      setCreditAnimation(credits);

      setTimeout(() => {
        setCreditAnimation(null);
      }, 2500);

      // limpiar URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const tabLabels = {
    en: [{ id: "home", icon: "/img/tarot02.png", label: "Spreads" },
    { id: "daily", icon: "/img/hoy.png", label: "Daily" },
    { id: "horoscope", icon: "/img/horoscopo.png", label: "Horoscope" },
    { id: "diary", icon: "/img/diario03.png", label: "Diary" },
    { id: "profile", icon: "/img/user.png", label: "Profile" }],
    es: [{ id: "home", icon: "/img/tarot02.png", label: "Tiradas" },
    { id: "daily", icon: "/img/hoy.png", label: "Hoy" },
    { id: "horoscope", icon: "/img/horoscopo.png", label: "Horóscopo" },
    { id: "diary", icon: "/img/diario03.png", label: "Diario" },
    { id: "profile", icon: "/img/user.png", label: "Perfil" }],
  }

  const isHomeIdle = tab === "home" && phase === "idle"

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:#050210;}
    ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#050210;} ::-webkit-scrollbar-thumb{background:rgba(140,80,255,.3);border-radius:4px;}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
    input[type=number]{-moz-appearance:textfield;}
 
    @keyframes headerIn{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cardsIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes orbPulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.5;transform:scale(1.1)}}
    @keyframes shuffleAnim{0%{transform:translateX(0) rotate(0)}30%{transform:translateX(-10px) rotate(-4deg)}70%{transform:translateX(10px) rotate(4deg)}100%{transform:translateX(0) rotate(0)}}
    @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes textGlow{0%,100%{text-shadow:0 0 20px rgba(180,130,255,.4)}50%{text-shadow:0 0 50px rgba(200,150,255,.8)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes imageGlow{
      0%{filter:drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #00ffff);}
      50%{filter:drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 40px #00ffff);}
      100%{filter:drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #00ffff);}
    }
    @keyframes goldGlow{
      0%{filter:drop-shadow(0 0 6px rgba(245,180,50,.6)) drop-shadow(0 0 14px rgba(245,180,50,.3));}
      50%{filter:drop-shadow(0 0 22px rgba(255,210,80,.9)) drop-shadow(0 0 44px rgba(245,180,50,.5));}
      100%{filter:drop-shadow(0 0 6px rgba(245,180,50,.6)) drop-shadow(0 0 14px rgba(245,180,50,.3));}
    }
    @keyframes videoFadeIn{from{opacity:0}to{opacity:0.5}}
 @keyframes creditPop {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -55%) scale(1.1);
  }
  50% {
    transform: translate(-50%, -70%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.9);
  }
}
  @media (max-width: 768px) {
    .brand-container {
      display: none !important;
    }
  }
    /* spread cards — paleta base */
    .spread-card{transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease!important;}
    .spread-card:hover{transform:translateY(-8px) scale(1.04)!important;box-shadow:0 24px 64px rgba(0,0,0,.55),0 0 36px rgba(140,80,255,.35)!important;}
 
    /* spread cards — paleta dorada (home) */
    .spread-card-gold{transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease!important;}
    .spread-card-gold:hover{transform:translateY(-8px) scale(1.04)!important;box-shadow:0 24px 64px rgba(0,0,0,.7),0 0 40px rgba(200,140,20,.45)!important;}
 
    .tab-btn{transition:all .3s;}
    .tab-btn.active{background:rgba(140,80,255,.2)!important;color:#e8d5ff!important;border-color:rgba(180,120,255,.4)!important;}
    .tab-btn:hover:not(.active){background:rgba(140,80,255,.1)!important;color:rgba(220,190,255,.8)!important;}
 
    /* tab activo dorado cuando estamos en home */
    .tab-btn-gold.active{background:rgba(200,140,20,.2)!important;color:#f5c842!important;border-color:rgba(220,170,50,.4)!important;}
    .tab-btn-gold:hover:not(.active){background:rgba(200,140,20,.1)!important;color:rgba(245,200,80,.8)!important;}
 
    .lang-btn:hover{background:rgba(180,140,255,.15)!important;color:#e8d5ff!important;}
    .lang-btn-gold:hover{background:rgba(200,140,20,.2)!important;color:#f5c842!important;}
    .stat-pill:hover{border-color:rgba(200,160,255,.4)!important;}
    .stat-pill-gold:hover{border-color:rgba(220,170,50,.45)!important;}

  `

  return (
    <div style={{
      minHeight: "100vh",
      background: isHomeIdle
        ? "#080400"
        : "radial-gradient(ellipse at 15% 15%,#1c0b30 0%,#0b0518 45%,#040212 100%)",
      color: "#e8d5ff",
      fontFamily: "'Cormorant Garamond','Georgia',serif",
      position: "relative",
      overflowX: "hidden",
      transition: "background .6s ease, color .4s ease"
    }}>
      <style>{CSS}</style>

      {/* VIDEO FONDO */}
      {isHomeIdle && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1, overflow: "hidden", pointerEvents: "none"
        }}>
          <video
            autoPlay loop muted playsInline
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: 0.5,
              filter: "saturate(1.15) brightness(0.65)",
              animation: "videoFadeIn 2s ease forwards"
            }}
          >
            <source src="/img/fondo.mp4" type="video/mp4" />
          </video>
          {/* Overlay: oscurece bordes y base para legibilidad */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,4,0,.6) 0%, rgba(5,2,0,.15) 40%, rgba(8,4,0,.75) 100%)"
          }} />
        </div>
      )}

      {/* Orbs — solo en pantallas no-home */}
      {!isHomeIdle && [["18%", "8%", "360px", "rgba(80,30,220,.07)", "4s"], ["78%", "55%", "440px", "rgba(130,20,170,.055)", "5.5s"], ["48%", "88%", "280px", "rgba(50,100,220,.065)", "3.5s"]].map(([l, t2, s, c, d], i) => (
        <div key={i} style={{ position: "fixed", left: l, top: t2, width: s, height: s, borderRadius: "50%", background: c, filter: "blur(90px)", animation: `orbPulse ${d} ease-in-out infinite`, animationDelay: `${i * 1.3}s`, pointerEvents: "none", zIndex: 1 }} />
      ))}

      {/* Orbs dorados — solo home */}
      {isHomeIdle && [["10%", "20%", "300px", "rgba(180,100,10,.08)", "4s"], ["75%", "60%", "380px", "rgba(160,80,5,.06)", "5.5s"]].map(([l, t2, s, c, d], i) => (
        <div key={i} style={{ position: "fixed", left: l, top: t2, width: s, height: s, borderRadius: "50%", background: c, filter: "blur(90px)", animation: `orbPulse ${d} ease-in-out infinite`, animationDelay: `${i * 1.5}s`, pointerEvents: "none", zIndex: 1 }} />
      ))}

      <StarField />

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 18px",
      }}>
        <div className="brand-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="./img/crystal_ball.png"
            alt="Arcana Mystica"
            style={{ width: "18px", height: "18px", animation: isHomeIdle ? "goldGlow 3s ease-in-out infinite" : "imageGlow 3s ease-in-out infinite" }}
          />
          <span style={{
            fontSize: "12px", letterSpacing: "3px",
            color: "rgba(199, 165, 255, 0.62)",
            textTransform: "uppercase", fontFamily: "'Cinzel',serif",
            transition: "color .5s"
          }}>{t.appName}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[{ icon: "👁", val: stats.visits, label: t.seekers }, { icon: "🔮", val: stats.readings, label: t.readings }].map(({ icon, val, label }) => (
            <div key={label}
              className={isHomeIdle ? "stat-pill-gold" : "stat-pill"}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "4px 12px",
                background: "linear-gradient(135deg, rgba(80,35,160,.2), rgba(40,15,80,.3))",
                border: "1px solid rgba(140,80,255,.15)",
                borderRadius: "20px", cursor: "default", transition: "all .3s"
              }}>
              <span style={{ fontSize: "12px" }}>{icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#d4a8ff", fontFamily: "'Cinzel',serif", lineHeight: 1, transition: "color .5s" }}>
                  {val.toLocaleString()}
                </div>
                <div style={{ fontSize: "7px", letterSpacing: "1.5px", color: "rgb(180,140,255)", textTransform: "uppercase", transition: "color .5s" }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
          {credits && (
            <div className={isHomeIdle ? "stat-pill-gold" : "stat-pill"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(140,80,255,.15)",
                background: "linear-gradient(135deg, rgba(80,35,160,.2), rgba(40,15,80,.3))",
                fontFamily: "'Cinzel',serif"
              }}
            >
              <span style={{ fontSize: "12px" }}>
                {credits.hasFree ? "✨" : "💎"}
              </span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#d4b4ff", lineHeight: 1 }} >
                  {credits.hasFree ? "FREE" : credits.paidCredits}
                </div>
                <div style={{ fontSize: "7px", letterSpacing: "1.5px", color: "rgb(180,140,255)", textTransform: "uppercase" }} >
                  {credits.hasFree ? "1 disponible" : "créditos"}
                </div>
              </div>
            </div>
          )}
          <button
            className={isHomeIdle ? "lang-btn-gold" : "lang-btn"}
            onClick={() => setLang(l => l === "en" ? "es" : "en")}
            style={{ padding: "5px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(180,140,255,.22)", borderRadius: "20px", color: "rgba(200,165,255,.6)", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Cinzel',serif", transition: "all .3s" }}
          >
            {t.langSwitch}
          </button>
        </div>
      </header>

      {/* ── TAB NAV ─────────────────────────────────────── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", justifyContent: "center", gap: "6px",
        padding: "10px 12px 14px",
      }}>
        {tabLabels[lang].map(tb => (
          <button
            key={tb.id}
            className={`${isHomeIdle ? "tab-btn-gold" : "tab-btn"}${tab === tb.id ? " active" : ""}`}
            onClick={() => setTab(tb.id)}
            style={{
              flex: 1, maxWidth: "130px", padding: "8px 6px", borderRadius: "12px",
              border: "1px solid rgba(140,80,255,.15)",
              background: "linear-gradient(135deg, rgba(80, 35, 160, 0.2), rgba(40, 15, 80, 0.3))",
              color: "rgb(212, 180, 255)",
              cursor: "pointer", fontFamily: "'Cinzel',serif",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              transition: "all .3s"
            }}>
            {typeof tb.icon === "string" && tb.icon.startsWith("/") ? (
              <img src={tb.icon} alt={tb.label} width={34} height={34} />
            ) : (
              <span>{tb.icon}</span>
            )}
            <span style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase" }}>{tb.label}</span>
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main style={{ position: "relative", zIndex: 10, paddingTop: "62px", paddingBottom: "72px" }}>

        {/* HOME TAB */}
        {tab === "home" && phase === "idle" && (
          <div style={{ maxWidth: "920px", margin: "0 auto", padding: "40px 20px 20px", textAlign: "center" }}>

            {/* Header */}
            <div style={{ opacity: visible.header ? 1 : 0, animation: visible.header ? "headerIn .9s cubic-bezier(.34,1.56,.64,1) forwards" : "none" }}>
              <div style={{ marginBottom: "14px", display: "inline-block" }}>
                <img
                  src="./img/crystal_ball.png"
                  alt="Arcana Mystica"
                  style={{ width: "72px", height: "72px", animation: "goldGlow 3s ease-in-out infinite" }}
                />
              </div>
              <p style={{
                fontSize: "10px", letterSpacing: "7px",
                color: "rgba(230, 190, 90, 0.56)",
                textTransform: "uppercase", marginBottom: "14px", fontFamily: "'Cinzel',serif"
              }}>✦ {t.subtitle} ✦</p>
              <h1 style={{
                fontSize: "clamp(36px,9vw,72px)", fontFamily: "'Cinzel',serif",
                fontWeight: 400, lineHeight: 1.08, marginBottom: "18px",
                background: "linear-gradient(135deg,#fff8e0 0%,#f5c842 45%,#c87820 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "2px"
              }}>
                {t.appName}
              </h1>
              <p style={{
                fontSize: "clamp(14px,2.2vw,18px)",
                color: "rgba(230, 190, 90, 0.56)",
                letterSpacing: "2px", fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic", marginBottom: "40px"
              }}>{t.tagline}</p>
            </div>

            {/* Cards */}
            <div style={{ opacity: visible.cards ? 1 : 0, animation: visible.cards ? "cardsIn .8s ease forwards" : "none" }}>
              <p style={{
                fontSize: "10px", letterSpacing: "5px",
                color: "rgba(200,150,40,.45)",
                textTransform: "uppercase", marginBottom: "22px", fontFamily: "'Cinzel',serif"
              }}>─── {t.chooseSpread} ───</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "14px", marginBottom: "50px" }}>
                {spreads.map((sp, i) => (
                  <div key={sp.id} className="spread-card" onClick={() => handleSpreadSelect(sp)}
                    style={{
                      padding: "24px 18px 20px",
                      background: "linear-gradient(135deg,rgba(80,35,160,.2),rgba(40,15,80,.3))",
                      border: "1px solid rgba(140,80,255,.18)",
                      borderRadius: "14px", cursor: "pointer",
                      backdropFilter: "blur(12px)"
                    }}>
                    <div>
                      <img
                        src={sp.image}
                        alt={sp.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          objectFit: "contain",
                          filter: "drop-shadow(0 0 6px rgba(140,80,255,0.4))"
                        }}
                      />
                    </div>
                    <div style={{
                      fontSize: "13px", letterSpacing: "1px",
                      color: "#d4b4ff",
                      marginBottom: "6px", fontFamily: "'Cinzel',serif", fontWeight: 500
                    }}>{sp.name}</div>
                    <div style={{
                      fontSize: "12px", color: "rgba(180,140,255,.45)",
                      marginBottom: "12px", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic"
                    }}>{sp.description}</div>
                    <div style={{
                      display: "inline-block", padding: "3px 12px",
                      background: "rgba(140,80,255,.12)",
                      border: "1px solid rgba(140,80,255,.2)",
                      borderRadius: "20px", fontSize: "10px",
                      color: "rgba(200,160,255,.6)", letterSpacing: "1px"
                    }}>
                      {t.cards(sp.count)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deck fan */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    width: "48px", height: "80px",
                    marginLeft: i > 0 ? "-14px" : 0,
                    transform: `rotate(${(i - 2) * 5}deg) translateY(${Math.abs(i - 2) * 2.5}px)`,
                    borderRadius: "6px", overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(0,0,0,.7)",
                    position: "relative", zIndex: 5 - Math.abs(i - 2)
                  }}>
                    <CardBackSVG />
                  </div>
                ))}
              </div>
              <p style={{
                fontSize: "10px", color: "rgba(190, 140, 40, 0.58)",
                letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Cinzel',serif"
              }}>
                {t.deckLabel}
                <br /><br />
                by Andres Vallarino
              </p>
            </div>
          </div>
        )}

        {/* ══ DAILY TAB ══════════════════════════════════ */}
        {tab === "daily" && <DailyCard allCards={ALL_CARDS} lang={lang} />}

        {/* ══ HOROSCOPE TAB ══════════════════════════════ */}
        {tab === "horoscope" && <WeeklyHoroscope lang={lang} birthData={birthData} />}

        {/* ══ DIARY TAB ══════════════════════════════════ */}
        {tab === "diary" && <ReadingDiary lang={lang} />}
        {tab === "profile" && <ProfileInsights lang={lang} onStartSuggested={handleSuggestedSpread} />}

        {/* ══ SHUFFLING ══════════════════════════════════ */}
        {phase === "shuffling" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 134px)", gap: "28px", textAlign: "center", padding: "20px" }}>
            {birthData && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 18px", background: "rgba(100,50,200,.15)", border: "1px solid rgba(160,100,255,.22)", borderRadius: "30px", animation: "textGlow 2.5s ease-in-out infinite" }}>
                <span style={{ fontSize: "16px" }}>{birthData.zodiac?.symbol}</span>
                <span style={{ fontSize: "11px", color: "rgba(200,165,255,.7)", letterSpacing: "2px", fontFamily: "'Cinzel',serif" }}>
                  {birthData.zodiac?.[lang]} · {lang === "es" ? "Camino" : "Path"} {birthData.lifePathNum}
                </span>
              </div>
            )}
            <div style={{ position: "relative", width: "160px", height: "120px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: "80px", height: "133px", marginTop: "-66px", marginLeft: "-40px", animation: `shuffleAnim .4s ease-in-out infinite`, animationDelay: `${i * 130}ms`, borderRadius: "7px", overflow: "hidden", boxShadow: "0 6px 24px rgba(0,0,0,.6)" }}>
                  <CardBackSVG />
                </div>
              ))}
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "130px", height: "130px", marginTop: "-65px", marginLeft: "-65px", borderRadius: "50%", border: "1px solid rgba(160,100,255,.2)", animation: "spinSlow 4s linear infinite", pointerEvents: "none" }} />
            </div>
            <div>
              <p style={{ fontSize: "13px", letterSpacing: "4px", color: "rgba(200,160,255,.7)", textTransform: "uppercase", fontFamily: "'Cinzel',serif", marginBottom: "8px" }}>{t.consultingArcana}</p>
              <p style={{ fontSize: "13px", color: "rgba(180,140,255,.4)", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>
                {birthData ? (lang === "es" ? "Alineando las cartas con tu energía cósmica..." : "Aligning the cards to your cosmic energy...") : t.shufflingDesc}
              </p>
            </div>
          </div>
        )}

        {/* ══ DRAWN ══════════════════════════════════════ */}
        {phase === "drawn" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 40px", gap: "22px" }}>
            {birthData && (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", padding: "10px 20px", background: "linear-gradient(135deg,rgba(80,30,160,.2),rgba(50,15,100,.25))", border: "1px solid rgba(160,100,255,.18)", borderRadius: "40px" }}>
                <span style={{ fontSize: "15px" }}>{birthData.zodiac?.symbol}</span>
                <span style={{ fontSize: "10px", color: "rgba(200,165,255,.6)", letterSpacing: "1.5px", fontFamily: "'Cinzel',serif", alignSelf: "center" }}>{birthData.zodiac?.[lang]}</span>
                <span style={{ color: "rgba(160,120,255,.3)", alignSelf: "center" }}>·</span>
                <span style={{ fontSize: "10px", color: "rgba(200,165,255,.6)", letterSpacing: "1.5px", fontFamily: "'Cinzel',serif", alignSelf: "center" }}>{lang === "es" ? "Camino" : "Path"} {birthData.lifePathNum}</span>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(180,140,255,.35)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Cinzel',serif" }}>{selectedSpread?.name}</p>
              <h2 style={{ fontSize: "clamp(16px,3.5vw,24px)", fontFamily: "'Cinzel',serif", fontWeight: 400, color: "#d4b4ff", marginBottom: "6px" }}>
                {revealedIndexes.length === 0 ? t.revealCards : revealedIndexes.length < dealtCards.length ? t.cardsRemaining(dealtCards.length - revealedIndexes.length) : t.readingComplete}
              </h2>
              <p style={{ fontSize: "11px", color: "rgba(180,140,255,.35)", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>{t.clickToReveal}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {dealtCards.map((_, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: revealedIndexes.includes(i) ? "rgba(200,160,255,.85)" : "rgba(140,80,255,.18)", boxShadow: revealedIndexes.includes(i) ? "0 0 10px rgba(200,160,255,.6)" : "none", transition: "all .45s" }} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", justifyContent: "center", maxWidth: "960px" }}>
              {dealtCards.map((c, i) => (
                <TarotCard key={i} card={c.card} index={i} isRevealed={revealedIndexes.includes(i)} isReversed={c.reversed} position={selectedSpread?.positions[i]} onClick={revealCard} delay={i * 90} lang={lang} />
              ))}
            </div>
            <button onClick={reset}
              style={{ marginTop: "8px", padding: "9px 28px", background: "transparent", border: "1px solid rgba(140,80,255,.18)", borderRadius: "4px", color: "rgba(180,140,255,.35)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Cinzel',serif", transition: "all .3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(210,170,255,.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(180,140,255,.35)"}>
              {t.backToSpreads}
            </button>
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────── */}
      {phase === "birthdate" && (
        <BirthDateModal lang={lang} spreadName={selectedSpread?.name ?? ""} onConfirm={handleBirthConfirm} onSkip={handleBirthSkip} />
      )}
      {showReading && (
        <ReadingPanel cards={readingCards} spread={selectedSpread} onClose={reset} lang={lang} t={t} birthData={birthData}
          onShare={() => { setShowReading(false); setShowShare(true) }} />
      )}
      {showShare && (
        <ShareCard cards={readingCards} spread={selectedSpread} lang={lang} birthData={birthData} onClose={() => { setShowShare(false); reset() }} />
      )}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} />
      )}
      {creditAnimation && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          pointerEvents: "none",
          animation: "creditPop 2.5s ease forwards"
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#e9d5ff",
            fontFamily: "'Cinzel',serif",
            textAlign: "center",
            textShadow: "0 0 20px rgba(180,120,255,0.8)"
          }}>
            💎 +{creditAnimation}
          </div>
        </div>
      )}
    </div>
  )
}