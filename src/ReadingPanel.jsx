import { useState } from "react"
import { CardFaceSVG } from "./CardSVG.jsx"
import { getLifePathMeaning } from "./BirthDateModal.jsx"

export default function ReadingPanel({ cards, spread, onClose, lang, t, birthData, onShare }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const item = cards[activeIdx]
  const card = item?.card
  const isReversed = item?.reversed
  const hue = card ? (card.id * 137) % 360 : 270

  const cardName     = card ? (typeof card.name        === "object" ? card.name[lang]        : card.name)        : ""
  const cardElement  = card ? (typeof card.element     === "object" ? card.element[lang]     : card.element)     : ""
  const cardKeywords = card ? (typeof card.keywords    === "object" ? card.keywords[lang]    : card.keywords)    : ""
  const cardDesc     = card ? (typeof card.description === "object" ? card.description[lang] : card.description) : ""
  const cardMeaning  = card
    ? (isReversed
        ? (typeof card.reversed === "object" ? card.reversed[lang] : card.reversed)
        : (typeof card.upright  === "object" ? card.upright[lang]  : card.upright))
    : ""

  const shareLabel = lang === "es" ? "📤 Compartir lectura" : "📤 Share reading"

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(4,1,14,.96)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"20px 16px 40px",overflowY:"auto",animation:"panelIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
      <style>{`
        @keyframes panelIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .rt:hover{border-color:rgba(200,160,255,.5)!important;color:rgba(220,190,255,.9)!important;}
        .nb:hover:not(:disabled){background:rgba(140,80,255,.2)!important;color:rgba(220,190,255,.9)!important;}
        .cb:hover{background:linear-gradient(135deg,rgba(140,80,220,.5),rgba(100,60,180,.5))!important;border-color:rgba(200,160,255,.6)!important;}
        .sb:hover{background:rgba(100,200,100,.15)!important;border-color:rgba(100,200,100,.4)!important;}
      `}</style>

      <div style={{ maxWidth:"820px",width:"100%",textAlign:"center",paddingTop:"16px" }}>

        {/* Birth badge */}
        {birthData && (
          <div style={{ display:"inline-flex",gap:"12px",flexWrap:"wrap",justifyContent:"center",padding:"9px 20px",marginBottom:"18px",background:"linear-gradient(135deg,rgba(80,30,160,.25),rgba(50,15,100,.3))",border:"1px solid rgba(160,100,255,.22)",borderRadius:"40px",animation:"panelIn .7s ease" }}>
            <span style={{ fontSize:"16px" }}>{birthData.zodiac?.symbol}</span>
            <span style={{ fontSize:"10px",color:"rgba(200,165,255,.7)",letterSpacing:"1.5px",fontFamily:"'Cinzel',serif",alignSelf:"center" }}>{birthData.zodiac?.[lang]}</span>
            <span style={{ color:"rgba(160,120,255,.3)",alignSelf:"center" }}>·</span>
            <span style={{ fontSize:"10px",color:"rgba(200,165,255,.7)",letterSpacing:"1.5px",fontFamily:"'Cinzel',serif",alignSelf:"center" }}>{lang==="es"?"Camino":"Life Path"} {birthData.lifePathNum}</span>
            <span style={{ color:"rgba(160,120,255,.3)",alignSelf:"center" }}>·</span>
            <span style={{ fontSize:"10px",color:"rgba(180,145,255,.5)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",alignSelf:"center" }}>{getLifePathMeaning(birthData.lifePathNum, lang)}</span>
          </div>
        )}

        <p style={{ fontSize:"10px",letterSpacing:"5px",color:"rgba(180,140,255,.42)",textTransform:"uppercase",marginBottom:"8px",fontFamily:"'Cinzel',serif" }}>{t.yourReading}</p>
        <h2 style={{ fontSize:"clamp(18px,4vw,28px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#e8d5ff",marginBottom:"22px",letterSpacing:"2px" }}>{spread.name}</h2>

        {/* Tabs */}
        {cards.length > 1 && (
          <div style={{ display:"flex",gap:"7px",justifyContent:"center",flexWrap:"wrap",marginBottom:"22px" }}>
            {cards.map((c,i) => {
              const h2=(c.card.id*137)%360; const active=i===activeIdx
              return <button key={i} className="rt" onClick={() => setActiveIdx(i)} style={{ padding:"5px 13px",borderRadius:"20px",border:`1px solid ${active?`hsl(${h2},65%,55%)`:"rgba(180,140,255,.2)"}`,background:active?`hsla(${h2},55%,18%,.55)`:"rgba(255,255,255,.03)",color:active?"#e8d5ff":"rgba(180,140,255,.42)",fontSize:"9px",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"'Cinzel',serif",textTransform:"uppercase",transition:"all .3s" }}>{spread.positions[i]}</button>
            })}
          </div>
        )}

        {/* Card display */}
        {card && (
          <div style={{ display:"flex",gap:"32px",alignItems:"center",justifyContent:"center",flexWrap:"wrap",textAlign:"left" }}>
            <div style={{ flexShrink:0,textAlign:"center" }}>
              <div style={{ width:"140px",height:"233px",borderRadius:"12px",overflow:"hidden",animation:"floatCard 4.5s ease-in-out infinite",boxShadow:`0 0 50px hsla(${hue},70%,50%,.45),0 24px 64px rgba(0,0,0,.8)`,margin:"0 auto" }}>
                <CardFaceSVG card={card} reversed={isReversed} lang={lang}/>
              </div>
              <div style={{ marginTop:"12px",display:"inline-block",padding:"4px 16px",background:isReversed?"rgba(255,80,80,.1)":"rgba(80,255,160,.08)",border:`1px solid ${isReversed?"rgba(255,80,80,.3)":"rgba(80,255,160,.25)"}`,borderRadius:"20px",fontSize:"9px",letterSpacing:"2px",color:isReversed?"#ff8888":"#80ffb4",textTransform:"uppercase",fontFamily:"serif" }}>
                {isReversed?t.reversed:t.upright}
              </div>
            </div>
            <div style={{ maxWidth:"400px",flex:"1 1 260px",minWidth:"230px" }}>
              {cards.length>1 && <p style={{ color:`hsl(${hue},55%,60%)`,fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"6px",fontFamily:"'Cinzel',serif" }}>{spread.positions[activeIdx]}</p>}
              <h3 style={{ color:"#ede0ff",fontSize:"clamp(20px,4vw,32px)",fontFamily:"'Cinzel',serif",fontWeight:400,marginBottom:"5px",letterSpacing:"2px" }}>{cardName}</h3>
              <p style={{ color:`hsl(${hue},45%,56%)`,fontSize:"10px",letterSpacing:"2px",marginBottom:"18px",fontFamily:"sans-serif",textTransform:"uppercase" }}>{cardElement}</p>
              <div style={{ background:`linear-gradient(135deg,hsla(${hue},40%,14%,.45),hsla(${hue+40},30%,9%,.45))`,border:`1px solid hsla(${hue},40%,38%,.22)`,borderRadius:"14px",padding:"18px 20px",marginBottom:"14px" }}>
                <p style={{ color:"rgba(200,175,255,.52)",fontSize:"9px",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:"8px",fontFamily:"'Cinzel',serif" }}>{isReversed?t.reversedMeaning:t.uprightMeaning}</p>
                <p style={{ color:"#d8c8f5",fontSize:"14px",lineHeight:"1.75",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>"{cardMeaning}"</p>
              </div>
              <p style={{ color:"rgba(210,185,245,.65)",fontSize:"13px",lineHeight:"1.85",fontFamily:"'Cormorant Garamond',serif",marginBottom:"16px" }}>{cardDesc}</p>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"7px" }}>
                {cardKeywords.split(", ").map((kw,i) => <span key={i} style={{ padding:"3px 12px",background:`hsla(${hue},40%,18%,.45)`,border:`1px solid hsla(${hue},40%,38%,.22)`,borderRadius:"20px",fontSize:"9px",color:`hsl(${hue},45%,66%)`,fontFamily:"sans-serif" }}>{kw}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* Prev / Next */}
        {cards.length > 1 && (
          <div style={{ display:"flex",gap:"10px",justifyContent:"center",marginTop:"24px" }}>
            {[{label:t.prev,fn:()=>setActiveIdx(i=>Math.max(0,i-1)),dis:activeIdx===0},{label:t.next,fn:()=>setActiveIdx(i=>Math.min(cards.length-1,i+1)),dis:activeIdx===cards.length-1}].map(({label,fn,dis}) => (
              <button key={label} className="nb" onClick={fn} disabled={dis} style={{ padding:"9px 22px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(180,140,255,.2)",borderRadius:"4px",color:dis?"rgba(180,140,255,.18)":"rgba(180,140,255,.62)",cursor:dis?"default":"pointer",fontFamily:"'Cinzel',serif",letterSpacing:"2px",fontSize:"10px",transition:"all .3s" }}>{label}</button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:"flex",flexDirection:"column",gap:"10px",marginTop:"24px" }}>
          {/* Share button */}
          {onShare && (
            <button className="sb" onClick={onShare} style={{ padding:"14px 48px",background:"rgba(80,200,120,.08)",border:"1px solid rgba(80,200,120,.25)",borderRadius:"4px",color:"rgba(120,230,160,.75)",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Cinzel',serif",transition:"all .35s" }}>
              {shareLabel}
            </button>
          )}
          {/* New reading */}
          <button className="cb" onClick={onClose} style={{ padding:"14px 48px",background:"linear-gradient(135deg,rgba(120,60,200,.3),rgba(80,40,160,.3))",border:"1px solid rgba(180,140,255,.4)",borderRadius:"4px",color:"#d4b4ff",fontSize:"11px",letterSpacing:"3.5px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Cinzel',serif",transition:"all .35s" }}>
            {t.newReading}
          </button>
        </div>
      </div>
    </div>
  )
}
