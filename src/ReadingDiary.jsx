import { useState, useEffect } from "react"
import { CardFaceSVG } from "./CardSVG.jsx"

const DIARY_KEY = "arcana-diary-v1"

async function loadDiary() {
  try {
    if (window.storage) {
      const r = await window.storage.get(DIARY_KEY)
      if (r) return JSON.parse(r.value)
    }
    const ls = localStorage.getItem(DIARY_KEY)
    if (ls) return JSON.parse(ls)
  } catch {}
  return []
}

async function saveDiary(entries) {
  try {
    const data = JSON.stringify(entries.slice(0, 50)) // keep last 50
    if (window.storage) await window.storage.set(DIARY_KEY, data)
    else localStorage.setItem(DIARY_KEY, data)
  } catch {}
}

export async function addDiaryEntry(cards, spread, lang, birthData) {
  const existing = await loadDiary()
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    spreadName: typeof spread.name === "string" ? spread.name : spread.name?.[lang] ?? spread.name,
    lang,
    birthData: birthData ? { zodiac: birthData.zodiac, lifePathNum: birthData.lifePathNum } : null,
    cards: cards.map(c => ({
      id: c.card.id,
      name: c.card.name,
      symbol: c.card.symbol,
      reversed: c.reversed,
      upright: c.card.upright,
      reversedMeaning: c.card.reversed,
    })),
  }
  const updated = [entry, ...existing]
  await saveDiary(updated)
  return updated
}

const T = {
  en: {
    title:      "Reading Diary",
    subtitle:   "Your spiritual journey, recorded",
    empty:      "No readings yet",
    emptySub:   "Your diary will fill as you explore the arcana",
    cards:      "cards",
    ago:        (d) => {
      const diff = Date.now() - new Date(d).getTime()
      const mins = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      if (mins < 1) return "just now"
      if (mins < 60) return `${mins}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    },
    reversed: "reversed",
    upright:  "upright",
    expand:   "View reading",
    collapse: "Close",
    clearAll: "Clear diary",
    confirmClear: "Are you sure? This cannot be undone.",
  },
  es: {
    title:      "Diario de Lecturas",
    subtitle:   "Tu viaje espiritual, registrado",
    empty:      "Todavía no hay lecturas",
    emptySub:   "Tu diario se irá llenando mientras explorás los arcanos",
    cards:      "cartas",
    ago:        (d) => {
      const diff = Date.now() - new Date(d).getTime()
      const mins = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      if (mins < 1) return "ahora mismo"
      if (mins < 60) return `hace ${mins}m`
      if (hours < 24) return `hace ${hours}h`
      return `hace ${days}d`
    },
    reversed: "invertida",
    upright:  "al derecho",
    expand:   "Ver lectura",
    collapse: "Cerrar",
    clearAll: "Borrar diario",
    confirmClear: "¿Estás seguro? No se puede deshacer.",
  },
}

export default function ReadingDiary({ lang }) {
  const t = T[lang] ?? T.en
  const [entries, setEntries] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    loadDiary().then(e => { setEntries(e); setLoaded(true) })
    setTimeout(() => setVisible(true), 100)
  }, [])

  const handleClear = async () => {
    if (!window.confirm(t.confirmClear)) return
    setEntries([])
    try {
      if (window.storage) await window.storage.delete(DIARY_KEY)
      else localStorage.removeItem(DIARY_KEY)
    } catch {}
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month:"short", day:"numeric", year:"numeric" })
  }

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
      padding: "0 16px 60px",
      maxWidth: "760px", margin: "0 auto", width: "100%",
    }}>
      <style>{`@keyframes entryIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Header */}
      <div style={{ textAlign:"center",marginBottom:"28px" }}>
        <p style={{ fontSize:"10px",letterSpacing:"5px",color:"rgba(200,160,255,.4)",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>📖</p>
        <h2 style={{ fontSize:"clamp(22px,5vw,34px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",marginBottom:"6px" }}>{t.title}</h2>
        <p style={{ fontSize:"13px",color:"rgba(180,140,255,.45)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>{t.subtitle}</p>
      </div>

      {/* Empty state */}
      {loaded && entries.length === 0 && (
        <div style={{ textAlign:"center",padding:"60px 20px",background:"rgba(255,255,255,.02)",border:"1px dashed rgba(160,100,255,.2)",borderRadius:"16px" }}>
          <div style={{ fontSize:"48px",marginBottom:"16px",opacity:.4 }}>🔮</div>
          <p style={{ fontSize:"16px",color:"rgba(200,165,255,.5)",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>{t.empty}</p>
          <p style={{ fontSize:"13px",color:"rgba(180,140,255,.3)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>{t.emptySub}</p>
        </div>
      )}

      {/* Entries */}
      <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
        {entries.map((entry, i) => {
          const isExp = expanded === entry.id
          const spreadName = typeof entry.spreadName === "object" ? entry.spreadName[lang] ?? entry.spreadName.en : entry.spreadName
          return (
            <div key={entry.id} style={{
              background:"linear-gradient(135deg,rgba(40,15,80,.3),rgba(20,5,50,.3))",
              border:"1px solid rgba(160,100,255,.15)",
              borderRadius:"16px",overflow:"hidden",
              animation:`entryIn .4s ease ${i * 60}ms both`,
              transition:"border-color .3s",
              borderColor: isExp ? "rgba(160,100,255,.35)" : "rgba(160,100,255,.15)",
            }}>
              {/* Entry header — always visible */}
              <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",gap:"14px",cursor:"pointer" }}
                onClick={() => setExpanded(isExp ? null : entry.id)}>
                {/* Mini card preview */}
                <div style={{ display:"flex",gap:"-6px",flexShrink:0 }}>
                  {entry.cards.slice(0,3).map((c,ci) => (
                    <div key={ci} style={{ width:"28px",height:"46px",borderRadius:"4px",overflow:"hidden",marginLeft:ci>0?"-10px":"0",boxShadow:"0 2px 8px rgba(0,0,0,.5)",position:"relative",zIndex:3-ci,border:"1px solid rgba(160,100,255,.2)" }}>
                      <svg viewBox="0 0 120 200" style={{ width:"100%",height:"100%" }}>
                        <rect width="120" height="200" fill={`hsl(${(c.id*137)%360},50%,12%)`}/>
                        <text x="60" y="105" textAnchor="middle" dominantBaseline="middle" fontSize="36" fill={`hsl(${(c.id*137)%360},70%,65%)`}>{c.symbol}</text>
                      </svg>
                    </div>
                  ))}
                  {entry.cards.length > 3 && (
                    <div style={{ width:"28px",height:"46px",borderRadius:"4px",background:"rgba(160,100,255,.15)",border:"1px solid rgba(160,100,255,.2)",marginLeft:"-10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:"rgba(200,165,255,.6)",fontFamily:"'Cinzel',serif",zIndex:0 }}>
                      +{entry.cards.length - 3}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontSize:"13px",fontFamily:"'Cinzel',serif",color:"#d4b4ff",letterSpacing:"1px",marginBottom:"4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                    {spreadName}
                  </p>
                  <div style={{ display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap" }}>
                    <span style={{ fontSize:"10px",color:"rgba(180,140,255,.4)",fontFamily:"sans-serif" }}>{formatDate(entry.date)}</span>
                    <span style={{ fontSize:"9px",color:"rgba(160,120,255,.3)" }}>·</span>
                    <span style={{ fontSize:"10px",color:"rgba(180,140,255,.4)",fontFamily:"sans-serif" }}>{entry.cards.length} {t.cards}</span>
                    {entry.birthData?.zodiac && (
                      <>
                        <span style={{ fontSize:"9px",color:"rgba(160,120,255,.3)" }}>·</span>
                        <span style={{ fontSize:"12px" }}>{entry.birthData.zodiac.symbol}</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ fontSize:"11px",color:"rgba(180,140,255,.4)",letterSpacing:"1px",fontFamily:"'Cinzel',serif",flexShrink:0 }}>
                  {t.ago(entry.date)}
                </div>

                <div style={{ fontSize:"16px",color:"rgba(160,100,255,.5)",transform:isExp?"rotate(180deg)":"rotate(0deg)",transition:"transform .3s",flexShrink:0 }}>▾</div>
              </div>

              {/* Expanded cards */}
              {isExp && (
                <div style={{ padding:"0 20px 20px",borderTop:"1px solid rgba(160,100,255,.1)" }}>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"12px",paddingTop:"16px",justifyContent:"center" }}>
                    {entry.cards.map((c, ci) => {
                      const h2 = (c.id * 137) % 360
                      const name = typeof c.name === "object" ? c.name[lang] ?? c.name.en : c.name
                      const meaning = c.reversed
                        ? (typeof c.reversedMeaning === "object" ? c.reversedMeaning[lang] ?? c.reversedMeaning.en : c.reversedMeaning)
                        : (typeof c.upright === "object" ? c.upright[lang] ?? c.upright.en : c.upright)
                      return (
                        <div key={ci} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",maxWidth:"90px" }}>
                          <div style={{ width:"70px",height:"117px",borderRadius:"7px",overflow:"hidden",boxShadow:`0 0 16px hsla(${h2},60%,45%,.35),0 4px 16px rgba(0,0,0,.6)` }}>
                            <svg viewBox="0 0 120 200" style={{ width:"100%",height:"100%",transform:c.reversed?"rotate(180deg)":"none" }}>
                              <defs><radialGradient id={`dg${ci}`} cx="50%" cy="35%"><stop offset="0%" stopColor={`hsl(${h2},50%,18%)`}/><stop offset="100%" stopColor={`hsl(${h2},40%,8%)`}/></radialGradient></defs>
                              <rect width="120" height="200" rx="8" fill={`url(#dg${ci})`}/>
                              <rect x="5" y="5" width="110" height="190" rx="6" fill="none" stroke={`hsl(${h2},50%,45%)`} strokeWidth="1" strokeOpacity=".4"/>
                              <text x="60" y="95" textAnchor="middle" dominantBaseline="middle" fontSize="30" fill={`hsl(${h2},70%,70%)`}>{c.symbol}</text>
                            </svg>
                          </div>
                          <p style={{ fontSize:"9px",fontFamily:"'Cinzel',serif",color:`hsl(${h2},40%,65%)`,textAlign:"center",letterSpacing:"0.5px",lineHeight:"1.3" }}>{name}</p>
                          <span style={{ fontSize:"8px",padding:"2px 8px",background:c.reversed?"rgba(255,80,80,.1)":"rgba(80,255,160,.07)",border:`1px solid ${c.reversed?"rgba(255,80,80,.25)":"rgba(80,255,160,.2)"}`,borderRadius:"10px",color:c.reversed?"#ff9090":"#80ffb4",letterSpacing:"1px",whiteSpace:"nowrap" }}>
                            {c.reversed ? t.reversed : t.upright}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Clear button */}
      {entries.length > 0 && (
        <div style={{ textAlign:"center",marginTop:"28px" }}>
          <button onClick={handleClear} style={{ padding:"8px 24px",background:"transparent",border:"1px solid rgba(255,80,80,.2)",borderRadius:"8px",color:"rgba(255,100,100,.35)",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Cinzel',serif",transition:"all .3s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,100,100,.7)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,100,100,.35)"}>
            {t.clearAll}
          </button>
        </div>
      )}
    </div>
  )
}
