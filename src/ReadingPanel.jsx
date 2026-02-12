import { useState } from "react"
import { CardFaceSVG } from "./CardSVG.jsx"

export default function ReadingPanel({ cards, spread, onClose, lang, t }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const item = cards[activeIdx]
  const card = item?.card
  const isReversed = item?.reversed
  const hue = card ? (card.id * 137) % 360 : 270

  const cardName = card ? (typeof card.name === "object" ? card.name[lang] : card.name) : ""
  const cardElement = card ? (typeof card.element === "object" ? card.element[lang] : card.element) : ""
  const cardKeywords = card ? (typeof card.keywords === "object" ? card.keywords[lang] : card.keywords) : ""
  const cardDesc = card ? (typeof card.description === "object" ? card.description[lang] : card.description) : ""
  const cardMeaning = card
    ? (isReversed
        ? (typeof card.reversed === "object" ? card.reversed[lang] : card.reversed)
        : (typeof card.upright === "object" ? card.upright[lang] : card.upright))
    : ""

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(4,1,14,0.96)",
      backdropFilter: "blur(24px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      padding: "20px 16px 40px",
      overflowY: "auto",
      animation: "panelIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <style>{`
        @keyframes panelIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
        @keyframes floatCard { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
        .reading-tab { transition: all 0.3s; }
        .reading-tab:hover { border-color: rgba(200,160,255,0.5) !important; color: rgba(220,190,255,0.9) !important; }
        .nav-btn:hover:not(:disabled) { background: rgba(140,80,255,0.2) !important; color: rgba(220,190,255,0.9) !important; }
        .close-btn:hover { background: linear-gradient(135deg,rgba(140,80,220,0.5),rgba(100,60,180,0.5)) !important; border-color: rgba(200,160,255,0.6) !important; }
      `}</style>

      <div style={{ maxWidth: "820px", width: "100%", textAlign: "center", paddingTop: "20px" }}>

        {/* Header */}
        <p style={{ fontSize: "10px", letterSpacing: "5px", color: "rgba(180,140,255,0.45)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Cinzel','Georgia',serif" }}>
          {t.yourReading}
        </p>
        <h2 style={{ fontSize: "clamp(18px,4vw,30px)", fontFamily: "'Cinzel','Georgia',serif", fontWeight: 400, color: "#e8d5ff", marginBottom: "28px", letterSpacing: "2px" }}>
          {spread.name}
        </h2>

        {/* Position tabs */}
        {cards.length > 1 && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
            {cards.map((c, i) => {
              const h2 = (c.card.id * 137) % 360
              const active = i === activeIdx
              return (
                <button key={i} className="reading-tab" onClick={() => setActiveIdx(i)} style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  border: `1px solid ${active ? `hsl(${h2},65%,55%)` : "rgba(180,140,255,0.2)"}`,
                  background: active ? `hsla(${h2},55%,18%,0.55)` : "rgba(255,255,255,0.03)",
                  color: active ? "#e8d5ff" : "rgba(180,140,255,0.45)",
                  fontSize: "9px", letterSpacing: "1.5px", cursor: "pointer",
                  fontFamily: "'Cinzel','Georgia',serif", textTransform: "uppercase",
                }}>
                  {spread.positions[i]}
                </button>
              )
            })}
          </div>
        )}

        {/* Card display */}
        {card && (
          <div style={{ display: "flex", gap: "40px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", textAlign: "left" }}>

            {/* Animated card */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ width: "150px", height: "250px", borderRadius: "12px", overflow: "hidden", animation: "floatCard 4.5s ease-in-out infinite", boxShadow: `0 0 50px hsla(${hue},70%,50%,0.45), 0 24px 64px rgba(0,0,0,0.8)`, margin: "0 auto" }}>
                <CardFaceSVG card={card} reversed={isReversed} lang={lang} />
              </div>
              <div style={{ marginTop: "14px", display: "inline-block", padding: "5px 18px", background: isReversed ? "rgba(255,80,80,0.1)" : "rgba(80,255,160,0.08)", border: `1px solid ${isReversed ? "rgba(255,80,80,0.3)" : "rgba(80,255,160,0.25)"}`, borderRadius: "20px", fontSize: "10px", letterSpacing: "2px", color: isReversed ? "#ff8888" : "#80ffb4", textTransform: "uppercase", fontFamily: "serif" }}>
                {isReversed ? t.reversed : t.upright}
              </div>
            </div>

            {/* Info panel */}
            <div style={{ maxWidth: "400px", flex: "1 1 280px", minWidth: "240px" }}>
              {cards.length > 1 && (
                <p style={{ color: `hsl(${hue},55%,60%)`, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Cinzel','Georgia',serif" }}>
                  {spread.positions[activeIdx]}
                </p>
              )}
              <h3 style={{ color: "#ede0ff", fontSize: "clamp(22px,4vw,34px)", fontFamily: "'Cinzel','Georgia',serif", fontWeight: 400, marginBottom: "6px", letterSpacing: "2px" }}>
                {cardName}
              </h3>
              <p style={{ color: `hsl(${hue},45%,58%)`, fontSize: "11px", letterSpacing: "2px", marginBottom: "22px", fontFamily: "sans-serif", textTransform: "uppercase" }}>
                {cardElement}
              </p>

              {/* Meaning box */}
              <div style={{ background: `linear-gradient(135deg,hsla(${hue},40%,14%,0.45),hsla(${hue + 40},30%,9%,0.45))`, border: `1px solid hsla(${hue},40%,38%,0.22)`, borderRadius: "14px", padding: "20px 22px", marginBottom: "18px" }}>
                <p style={{ color: "rgba(200,175,255,0.55)", fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'Cinzel','Georgia',serif" }}>
                  {isReversed ? t.reversedMeaning : t.uprightMeaning}
                </p>
                <p style={{ color: "#d8c8f5", fontSize: "14px", lineHeight: "1.75", fontFamily: "'Cormorant Garamond','Georgia',serif", fontStyle: "italic" }}>
                  "{cardMeaning}"
                </p>
              </div>

              {/* Description */}
              <p style={{ color: "rgba(210,185,245,0.7)", fontSize: "13px", lineHeight: "1.85", fontFamily: "'Cormorant Garamond','Georgia',serif", marginBottom: "20px" }}>
                {cardDesc}
              </p>

              {/* Keyword tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {cardKeywords.split(", ").map((kw, i) => (
                  <span key={i} style={{ padding: "4px 13px", background: `hsla(${hue},40%,18%,0.45)`, border: `1px solid hsla(${hue},40%,38%,0.22)`, borderRadius: "20px", fontSize: "10px", color: `hsl(${hue},45%,68%)`, letterSpacing: "0.5px", fontFamily: "sans-serif" }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prev / Next */}
        {cards.length > 1 && (
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "32px" }}>
            {[
              { label: t.prev, onClick: () => setActiveIdx(i => Math.max(0, i - 1)), disabled: activeIdx === 0 },
              { label: t.next, onClick: () => setActiveIdx(i => Math.min(cards.length - 1, i + 1)), disabled: activeIdx === cards.length - 1 },
            ].map(({ label, onClick, disabled }) => (
              <button key={label} className="nav-btn" onClick={onClick} disabled={disabled} style={{
                padding: "10px 26px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(180,140,255,0.2)",
                borderRadius: "4px",
                color: disabled ? "rgba(180,140,255,0.18)" : "rgba(180,140,255,0.65)",
                cursor: disabled ? "default" : "pointer",
                fontFamily: "'Cinzel','Georgia',serif",
                letterSpacing: "2px", fontSize: "11px",
                transition: "all 0.3s",
              }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* New reading button */}
        <button className="close-btn" onClick={onClose} style={{
          marginTop: "32px",
          padding: "15px 52px",
          background: "linear-gradient(135deg,rgba(120,60,200,0.3),rgba(80,40,160,0.3))",
          border: "1px solid rgba(180,140,255,0.4)",
          borderRadius: "4px",
          color: "#d4b4ff",
          fontSize: "11px",
          letterSpacing: "3.5px",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "'Cinzel','Georgia',serif",
          transition: "all 0.35s",
        }}>
          {t.newReading}
        </button>
      </div>
    </div>
  )
}
