import { useState, useEffect } from "react"
import { CardBackSVG, CardFaceSVG } from "./CardSVG.jsx"

export default function TarotCard({ card, index, isRevealed, isReversed, position, onClick, delay = 0, lang = "en" }) {
  const [flipped, setFlipped] = useState(false)
  const [entered, setEntered] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (isRevealed) {
      const t = setTimeout(() => setFlipped(true), 300)
      return () => clearTimeout(t)
    } else {
      setFlipped(false)
    }
  }, [isRevealed])

  const hue = card ? (card.id * 137) % 360 : 270

  return (
    <div
      style={{
        position: "relative",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0) scale(1)" : "translateY(32px) scale(0.88)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
        cursor: isRevealed ? "default" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
      }}
      onClick={() => !isRevealed && onClick(index)}
      onMouseEnter={() => !isRevealed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Position label */}
      {position && (
        <div style={{
          fontSize: "9px",
          letterSpacing: "2.5px",
          color: isRevealed ? `hsl(${hue},50%,60%)` : "rgba(180,140,255,0.5)",
          textTransform: "uppercase",
          fontFamily: "'Cinzel', 'Georgia', serif",
          transition: "color 0.4s",
          maxWidth: "100px",
          textAlign: "center",
          lineHeight: 1.4,
        }}>
          {position}
        </div>
      )}

      {/* Card flip container */}
      <div style={{ width: "100px", height: "167px", perspective: "900px" }}>
        <div style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(-12deg) scale(1.05)" : "rotateY(0deg)",
        }}>
          {/* ─ Back face ─ */}
          <div style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "9px",
            overflow: "hidden",
            boxShadow: hovered
              ? "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(140,80,255,0.4)"
              : "0 6px 24px rgba(0,0,0,0.55)",
            transition: "box-shadow 0.35s ease",
          }}>
            <CardBackSVG />
          </div>

          {/* ─ Front face ─ */}
          <div style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "9px",
            overflow: "hidden",
            boxShadow: `0 0 35px hsla(${hue},70%,50%,0.45), 0 10px 36px rgba(0,0,0,0.65)`,
          }}>
            {card && <CardFaceSVG card={card} reversed={isReversed} lang={lang} />}
          </div>
        </div>
      </div>

      {/* Hint label */}
      {!isRevealed && (
        <div style={{
          fontSize: "8px",
          letterSpacing: "1.5px",
          color: hovered ? "rgba(200,160,255,0.7)" : "rgba(180,140,255,0.25)",
          textTransform: "uppercase",
          fontFamily: "serif",
          transition: "color 0.3s",
        }}>
          {hovered ? "✦ click ✦" : "·  ·  ·"}
        </div>
      )}
    </div>
  )
}
