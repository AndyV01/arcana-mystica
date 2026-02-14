import { useState, useEffect } from "react"
import { CardFaceSVG } from "./CardSVG.jsx"
import { getDailyCardIndex, getDailyAffirmation, getDailyMeditation } from "./dailyContent.js"

const T = {
  en: {
    badge:        "✦ Daily Card ✦",
    subtitle:     "Your cosmic message for today",
    affirmLabel:  "Today's Affirmation",
    meditLabel:   "Guided Meditation",
    meditBtn:     "Read meditation",
    hideBtn:      "Close",
    keywordsLbl:  "Energy",
    date:         (d) => d.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" }),
    reversed:     "Reversed",
    upright:      "Upright",
    meaning:      "Message",
  },
  es: {
    badge:        "✦ Carta del Día ✦",
    subtitle:     "Tu mensaje cósmico para hoy",
    affirmLabel:  "Afirmación de Hoy",
    meditLabel:   "Meditación Guiada",
    meditBtn:     "Leer meditación",
    hideBtn:      "Cerrar",
    keywordsLbl:  "Energía",
    date:         (d) => d.toLocaleDateString("es-AR", { weekday:"long", month:"long", day:"numeric" }),
    reversed:     "Invertida",
    upright:      "Al derecho",
    meaning:      "Mensaje",
  },
}

export default function DailyCard({ allCards, lang }) {
  const t = T[lang] ?? T.en
  const [visible, setVisible]       = useState(false)
  const [flipped, setFlipped]       = useState(false)
  const [showMedit, setShowMedit]   = useState(false)

  const idx       = getDailyCardIndex(allCards.length)
  const card      = allCards[idx]
  const isReversed = (new Date().getDate() % 3 === 0)
  const affirmation = getDailyAffirmation(lang)
  const meditation  = getDailyMeditation(lang)
  const today       = new Date()
  const hue = (card.id * 137) % 360

  const cardName    = typeof card.name    === "object" ? card.name[lang]    : card.name
  const cardKeywords= typeof card.keywords=== "object" ? card.keywords[lang]: card.keywords
  const cardMeaning = isReversed
    ? (typeof card.reversed === "object" ? card.reversed[lang] : card.reversed)
    : (typeof card.upright  === "object" ? card.upright[lang]  : card.upright)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setFlipped(true), 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "all 0.7s cubic-bezier(.34,1.56,.64,1)",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "20px", padding: "0 16px 40px",
    }}>

      {/* Header */}
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:"10px",letterSpacing:"5px",color:`hsl(${hue},50%,55%)`,textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"6px" }}>
          {t.badge}
        </p>
        <p style={{ fontSize:"13px",color:"rgba(200,170,255,.5)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
          {t.date(today)}
        </p>
      </div>

      {/* Card + info side by side on wider screens */}
      <div style={{ display:"flex",gap:"24px",alignItems:"flex-start",flexWrap:"wrap",justifyContent:"center",width:"100%",maxWidth:"800px" }}>

        {/* Flip card */}
        <div style={{ width:"130px",height:"217px",perspective:"900px",flexShrink:0 }}>
          <div style={{
            width:"100%",height:"100%",position:"relative",
            transformStyle:"preserve-3d",
            transition:"transform 1s cubic-bezier(.4,0,.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
          }}>
            {/* Back */}
            <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",borderRadius:"10px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.6)" }}>
              <svg viewBox="0 0 120 200" style={{ width:"100%",height:"100%" }}>
                <defs>
                  <radialGradient id="db"><stop offset="0%" stopColor="#1a0a2e"/><stop offset="100%" stopColor="#0a0415"/></radialGradient>
                  <pattern id="dp" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0,4 L4,0 L8,4 L4,8 Z" fill="none" stroke="rgba(160,120,255,0.15)" strokeWidth="0.5"/></pattern>
                </defs>
                <rect width="120" height="200" rx="8" fill="url(#db)"/>
                <rect width="120" height="200" rx="8" fill="url(#dp)"/>
                <rect x="6" y="6" width="108" height="188" rx="5" fill="none" stroke="rgba(180,140,255,0.3)" strokeWidth="1"/>
                <text x="60" y="105" textAnchor="middle" dominantBaseline="middle" fontSize="30" fill="rgba(200,170,255,0.5)">✦</text>
              </svg>
            </div>
            {/* Face */}
            <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",borderRadius:"10px",overflow:"hidden",boxShadow:`0 0 30px hsla(${hue},70%,50%,.45),0 10px 32px rgba(0,0,0,.7)` }}>
              <CardFaceSVG card={card} reversed={isReversed} lang={lang}/>
            </div>
          </div>
        </div>

        {/* Card info */}
        <div style={{ flex:"1 1 220px",minWidth:"200px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",flexWrap:"wrap" }}>
            <h3 style={{ fontSize:"clamp(18px,4vw,26px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",letterSpacing:"1px" }}>
              {cardName}
            </h3>
            <span style={{ padding:"3px 12px",background:isReversed?"rgba(255,80,80,.1)":"rgba(80,255,160,.08)",border:`1px solid ${isReversed?"rgba(255,80,80,.3)":"rgba(80,255,160,.25)"}`,borderRadius:"20px",fontSize:"9px",letterSpacing:"2px",color:isReversed?"#ff8888":"#80ffb4",textTransform:"uppercase",fontFamily:"serif" }}>
              {isReversed ? t.reversed : t.upright}
            </span>
          </div>

          {/* Meaning */}
          <div style={{ background:`linear-gradient(135deg,hsla(${hue},40%,14%,.4),hsla(${hue+40},30%,9%,.4))`,border:`1px solid hsla(${hue},40%,35%,.2)`,borderRadius:"12px",padding:"14px 16px",marginBottom:"12px" }}>
            <p style={{ fontSize:"9px",letterSpacing:"2px",color:`hsl(${hue},40%,55%)`,textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>{t.meaning}</p>
            <p style={{ fontSize:"13px",lineHeight:"1.75",color:"#d8c8f5",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>"{cardMeaning}"</p>
          </div>

          {/* Keywords */}
          <p style={{ fontSize:"9px",letterSpacing:"2px",color:"rgba(180,140,255,.4)",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>{t.keywordsLbl}</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
            {cardKeywords.split(", ").slice(0,4).map((kw,i) => (
              <span key={i} style={{ padding:"3px 10px",background:`hsla(${hue},40%,18%,.4)`,border:`1px solid hsla(${hue},40%,35%,.2)`,borderRadius:"20px",fontSize:"10px",color:`hsl(${hue},45%,65%)`,fontFamily:"sans-serif" }}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Affirmation */}
      <div style={{ width:"100%",maxWidth:"700px",padding:"20px 24px",background:"linear-gradient(135deg,rgba(100,50,180,.12),rgba(60,20,120,.15))",border:"1px solid rgba(160,100,255,.18)",borderRadius:"16px" }}>
        <p style={{ fontSize:"9px",letterSpacing:"3px",color:"rgba(200,160,255,.45)",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"10px" }}>✦ {t.affirmLabel}</p>
        <p style={{ fontSize:"clamp(14px,3.5vw,18px)",color:"rgba(230,210,255,.85)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:"1.7",textAlign:"center" }}>
          "{affirmation}"
        </p>
      </div>

      {/* Meditation toggle */}
      <div style={{ width:"100%",maxWidth:"700px" }}>
        <button onClick={() => setShowMedit(v => !v)} style={{
          width:"100%",padding:"14px",
          background:showMedit?"rgba(100,50,180,.2)":"rgba(255,255,255,.03)",
          border:"1px solid rgba(160,100,255,.2)",borderRadius:"12px",
          color:"rgba(200,165,255,.65)",fontSize:"12px",letterSpacing:"2px",
          textTransform:"uppercase",cursor:"pointer",fontFamily:"'Cinzel',serif",
          transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",
        }}>
          <span>🧘</span>
          <span>{showMedit ? t.hideBtn : `${t.meditBtn} — ${meditation.title}`}</span>
        </button>

        {showMedit && (
          <div style={{ marginTop:"12px",padding:"24px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(160,100,255,.12)",borderRadius:"12px",animation:"fadeIn .4s ease" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"8px" }}>
              <p style={{ fontSize:"14px",fontFamily:"'Cinzel',serif",color:"#d4b4ff",letterSpacing:"1px" }}>{meditation.title}</p>
              <span style={{ padding:"3px 12px",background:"rgba(160,100,255,.15)",border:"1px solid rgba(160,100,255,.2)",borderRadius:"20px",fontSize:"10px",color:"rgba(200,165,255,.6)",fontFamily:"sans-serif" }}>⏱ {meditation.duration}</span>
            </div>
            {meditation.text.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize:"14px",color:"rgba(210,190,255,.7)",fontFamily:"'Cormorant Garamond',serif",lineHeight:"1.85",marginBottom:"14px",fontStyle:"italic" }}>{para}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
