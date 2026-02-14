import { useRef, useState } from "react"

const T = {
  en: {
    title:      "Share your reading",
    subtitle:   "Save the image and share it on Instagram Stories or TikTok",
    saveTip:    "💡 Long press the image to save it",
    shareBtn:   "Share on Stories",
    closeBtn:   "Close",
    reading:    "My Tarot Reading",
    via:        "via Arcana Mystica",
    upright:    "Upright",
    reversed:   "Reversed",
    path:       "Life Path",
  },
  es: {
    title:      "Compartí tu lectura",
    subtitle:   "Guardá la imagen y compartila en Stories de Instagram o TikTok",
    saveTip:    "💡 Presioná largo la imagen para guardarla",
    shareBtn:   "Compartir en Stories",
    closeBtn:   "Cerrar",
    reading:    "Mi Lectura de Tarot",
    via:        "vía Arcana Mística",
    upright:    "Al derecho",
    reversed:   "Invertida",
    path:       "Camino de Vida",
  },
}

export default function ShareCard({ cards, spread, lang, birthData, onClose }) {
  const t = T[lang] ?? T.en
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: t.reading, text: `${t.reading} — ${spread.name}\narcana-mystica.vercel.app`, url: "https://arcana-mystica.vercel.app" })
      } else {
        await navigator.clipboard.writeText("https://arcana-mystica.vercel.app")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  const mainCard = cards[0]
  const card = mainCard?.card
  const hue = card ? (card.id * 137) % 360 : 270
  const isReversed = mainCard?.reversed
  const cardName = card ? (typeof card.name === "object" ? card.name[lang] : card.name) : ""
  const cardMeaning = card
    ? (isReversed
        ? (typeof card.reversed === "object" ? card.reversed[lang] : card.reversed)
        : (typeof card.upright  === "object" ? card.upright[lang]  : card.upright))
    : ""

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:2000,
      background:"rgba(3,1,13,.95)",backdropFilter:"blur(24px)",
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"20px",overflowY:"auto",
    }}>
      <style>{`
        @keyframes shareIn{from{opacity:0;transform:scale(.94) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes cardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>

      <div style={{ maxWidth:"420px",width:"100%",animation:"shareIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:"20px" }}>
          <h3 style={{ fontSize:"22px",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",marginBottom:"6px" }}>{t.title}</h3>
          <p style={{ fontSize:"12px",color:"rgba(180,140,255,.45)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>{t.subtitle}</p>
        </div>

        {/* THE SHARE IMAGE — this is what gets screenshotted */}
        <div style={{
          width:"100%",aspectRatio:"9/16",maxHeight:"60vh",
          background:`radial-gradient(ellipse at 50% 20%, hsl(${hue},60%,12%) 0%, hsl(${hue+30},50%,6%) 50%, #03010d 100%)`,
          borderRadius:"20px",overflow:"hidden",position:"relative",
          boxShadow:`0 0 60px hsla(${hue},70%,40%,.4), 0 24px 60px rgba(0,0,0,.8)`,
          display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"space-between",padding:"5%",
        }}>
          {/* Stars bg */}
          {[...Array(16)].map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              top:`${5 + (i*17)%85}%`,left:`${(i*23)%90}%`,
              width:i%3===0?"3px":"2px",height:i%3===0?"3px":"2px",
              borderRadius:"50%",
              background:i%4===0?"rgba(252,211,77,.7)":"rgba(210,190,255,.5)",
              boxShadow:i%4===0?"0 0 4px rgba(252,211,77,.4)":"none",
            }}/>
          ))}

          {/* Border */}
          <div style={{ position:"absolute",inset:"5px",borderRadius:"16px",border:`1px solid hsla(${hue},50%,50%,.2)`,pointerEvents:"none" }}/>

          {/* Top label */}
          <div style={{ zIndex:1,textAlign:"center" }}>
            <p style={{ fontSize:"clamp(8px,2vw,11px)",letterSpacing:"4px",color:`hsl(${hue},50%,60%)`,textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"4px" }}>✦ {t.reading} ✦</p>
            <p style={{ fontSize:"clamp(10px,2.5vw,14px)",fontFamily:"'Cinzel',serif",color:"rgba(200,165,255,.5)",letterSpacing:"2px" }}>{spread.name}</p>
          </div>

          {/* Card visual */}
          <div style={{ zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",flex:1,justifyContent:"center" }}>
            {/* Mini cards row */}
            <div style={{ display:"flex",gap:"6px",justifyContent:"center",marginBottom:"8px" }}>
              {cards.slice(0,Math.min(cards.length,5)).map((c,i) => {
                const h2 = (c.card.id*137)%360
                return (
                  <div key={i} style={{
                    width:i===0?"clamp(70px,16vw,90px)":"clamp(40px,9vw,54px)",
                    height:i===0?"clamp(117px,26vw,150px)":"clamp(67px,15vw,90px)",
                    borderRadius:"6px",overflow:"hidden",flexShrink:0,
                    boxShadow:`0 0 ${i===0?20:8}px hsla(${h2},60%,45%,.4),0 4px 12px rgba(0,0,0,.6)`,
                    transform:`rotate(${(i-Math.floor(cards.length/2))*4}deg) translateY(${i===0?-8:0}px)`,
                    border:`1px solid hsla(${h2},50%,40%,.3)`,
                    animation:i===0?"cardFloat 3s ease-in-out infinite":"none",
                    position:"relative",zIndex:i===0?2:1,
                    alignSelf:"center",
                  }}>
                    <svg viewBox="0 0 120 200" style={{ width:"100%",height:"100%",transform:c.reversed?"rotate(180deg)":"none" }}>
                      <defs><radialGradient id={`sg${i}`} cx="50%" cy="35%"><stop offset="0%" stopColor={`hsl(${h2},50%,18%)`}/><stop offset="100%" stopColor={`hsl(${h2},40%,7%)`}/></radialGradient></defs>
                      <rect width="120" height="200" rx="8" fill={`url(#sg${i})`}/>
                      <rect x="5" y="5" width="110" height="190" rx="6" fill="none" stroke={`hsl(${h2},50%,45%)`} strokeWidth="1" strokeOpacity=".4"/>
                      <text x="60" y="95" textAnchor="middle" dominantBaseline="middle" fontSize="32" fill={`hsl(${h2},70%,68%)`}>{c.card.symbol}</text>
                      <text x="60" y="140" textAnchor="middle" fontSize="6.5" fill={`hsl(${h2},40%,70%)`} fontFamily="serif" letterSpacing="1">
                        {(typeof c.card.name==="object"?c.card.name[lang]:c.card.name).toUpperCase().slice(0,16)}
                      </text>
                    </svg>
                  </div>
                )
              })}
            </div>

            {/* Main card name + meaning */}
            <div style={{ textAlign:"center",maxWidth:"90%" }}>
              <p style={{ fontSize:"clamp(16px,4vw,22px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",letterSpacing:"1px",marginBottom:"6px" }}>{cardName}</p>
              <p style={{ fontSize:"clamp(10px,2.5vw,13px)",color:`hsl(${hue},40%,65%)`,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:"1.6" }}>
                "{cardMeaning?.slice(0,80)}{cardMeaning?.length>80?"...":""}"
              </p>
            </div>
          </div>

          {/* Bottom info */}
          <div style={{ zIndex:1,textAlign:"center",width:"100%" }}>
            {birthData && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"8px" }}>
                <span style={{ fontSize:"16px" }}>{birthData.zodiac?.symbol}</span>
                <span style={{ fontSize:"clamp(9px,2vw,11px)",color:"rgba(200,165,255,.5)",fontFamily:"'Cinzel',serif",letterSpacing:"2px" }}>
                  {birthData.zodiac?.[lang]} · {t.path} {birthData.lifePathNum}
                </span>
              </div>
            )}
            <div style={{ height:"1px",background:`linear-gradient(90deg,transparent,hsla(${hue},40%,50%,.3),transparent)`,marginBottom:"8px" }}/>
            <p style={{ fontSize:"clamp(9px,2vw,11px)",color:`hsl(${hue},35%,45%)`,fontFamily:"'Cinzel',serif",letterSpacing:"3px" }}>
              🔮 arcana-mystica.vercel.app
            </p>
          </div>
        </div>

        {/* Save tip */}
        <p style={{ textAlign:"center",fontSize:"12px",color:"rgba(180,140,255,.4)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",margin:"14px 0 20px" }}>
          {t.saveTip}
        </p>

        {/* Buttons */}
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          <button onClick={handleShare} style={{
            padding:"16px",background:"linear-gradient(135deg,rgba(120,60,200,.35),rgba(80,30,160,.35))",
            border:"1px solid rgba(180,120,255,.4)",borderRadius:"12px",
            color:"#d4b4ff",fontSize:"13px",letterSpacing:"3px",textTransform:"uppercase",
            cursor:"pointer",fontFamily:"'Cinzel',serif",transition:"all .3s",
          }}>
            {copied ? "✓ Link copied!" : `🔗 ${t.shareBtn}`}
          </button>
          <button onClick={onClose} style={{
            padding:"14px",background:"transparent",
            border:"1px solid rgba(160,100,255,.15)",borderRadius:"12px",
            color:"rgba(180,140,255,.4)",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",
            cursor:"pointer",fontFamily:"'Cinzel',serif",transition:"all .3s",
          }}>
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
