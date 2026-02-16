import { useMemo, useState } from "react"

const T = {
  en: {
    title: "Share your reading",
    subtitle: "Generate a beautiful card to post on Instagram, TikTok or WhatsApp",
    saveTip: "💡 Save or share the generated image directly from your device",
    shareBtn: "Create and share image",
    closeBtn: "Close",
    reading: "My Tarot Reading",
    path: "Life Path",
    prediction: "Prediction",
    guidance: "Guidance",
    cta: "Open Arcana Mystica and continue your spiritual journey ✨",
    copied: "✓ Image ready and link copied",
    fallbackSaved: "✓ Image downloaded",
    shareError: "Could not share automatically. Image downloaded.",
  },
  es: {
    title: "Compartí tu lectura",
    subtitle: "Generá una imagen atractiva para Instagram, TikTok o WhatsApp",
    saveTip: "💡 Guardá o compartí la imagen generada desde tu dispositivo",
    shareBtn: "Crear y compartir imagen",
    closeBtn: "Cerrar",
    reading: "Mi Lectura de Tarot",
    path: "Camino de Vida",
    prediction: "Predicción",
    guidance: "Lectura guía",
    cta: "Abrí Arcana Mística y seguí tu camino espiritual ✨",
    copied: "✓ Imagen lista y enlace copiado",
    fallbackSaved: "✓ Imagen descargada",
    shareError: "No se pudo compartir automáticamente. Imagen descargada.",
  },
}

function safeCardText(value, lang) {
  if (!value) return ""
  return typeof value === "object" ? value[lang] ?? value.en ?? "" : value
}

function buildGuidance(cards, spread, lang) {
  const connector = lang === "es" ? " · " : " · "
  const snippets = cards
    .slice(0, 3)
    .map((item, idx) => {
      const name = safeCardText(item.card?.name, lang)
      const meaning = item.reversed
        ? safeCardText(item.card?.reversed, lang)
        : safeCardText(item.card?.upright, lang)
      const shortMeaning = meaning.split(/[.!?]/)[0]?.trim() ?? ""
      const position = spread?.positions?.[idx] ?? ""
      return [position, name, shortMeaning].filter(Boolean).join(connector)
    })
    .filter(Boolean)

  if (lang === "es") {
    return {
      prediction:
        snippets[0] ||
        "Tu energía se alinea con cambios positivos: confiá en tu intuición y avanzá paso a paso.",
      guidance:
        snippets[1] ||
        "Canalizá esta lectura en una acción concreta hoy para transformar intención en resultado.",
    }
  }

  return {
    prediction:
      snippets[0] ||
      "Your energy is aligning with meaningful change—trust your intuition and move one step at a time.",
    guidance:
      snippets[1] ||
      "Turn this message into one concrete action today to transform insight into progress.",
  }
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3, align = "left") {
  const prevAlign = ctx.textAlign
  ctx.textAlign = align
  const words = text.split(" ")
  let line = ""
  let currentY = y
  let lines = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = `${line}${words[i]} `
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY)
      line = `${words[i]} `
      currentY += lineHeight
      lines += 1
      if (lines >= maxLines - 1) break
    } else {
      line = testLine
    }
  }

  if (line && lines < maxLines) {
    let finalLine = line.trim()
    while (ctx.measureText(finalLine).width > maxWidth && finalLine.length > 3) {
      finalLine = `${finalLine.slice(0, -2)}…`
    }
    ctx.fillText(finalLine, x, currentY)
  }

  ctx.textAlign = prevAlign
}

async function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95)
  })
}

export default function ShareCard({ cards, spread, lang, birthData, onClose }) {
  const t = T[lang] ?? T.en
  const [feedback, setFeedback] = useState("")

  const mainCard = cards[0]
  const card = mainCard?.card
  const hue = card ? (card.id * 137) % 360 : 270

  const cardName = safeCardText(card?.name, lang)
  const cardMeaning = mainCard?.reversed ? safeCardText(card?.reversed, lang) : safeCardText(card?.upright, lang)

  const guidanceData = useMemo(() => buildGuidance(cards, spread, lang), [cards, spread, lang])

  const buildShareImage = async () => {
    const width = 1080
    const height = 1920
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const bg = ctx.createRadialGradient(width * 0.5, height * 0.2, 100, width * 0.5, height * 0.6, height)
    bg.addColorStop(0, `hsl(${hue}, 48%, 16%)`)
    bg.addColorStop(0.55, `hsl(${hue + 18}, 45%, 8%)`)
    bg.addColorStop(1, "#050111")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 34; i++) {
      const x = (i * 173) % width
      const y = (i * 289) % height
      const r = i % 5 === 0 ? 3.4 : 2
      ctx.beginPath()
      ctx.fillStyle = i % 4 === 0 ? "rgba(255,214,122,.72)" : "rgba(213,190,255,.52)"
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.strokeStyle = `hsla(${hue}, 75%, 66%, .22)`
    ctx.lineWidth = 3
    ctx.strokeRect(54, 54, width - 108, height - 108)

    ctx.fillStyle = `hsl(${hue}, 70%, 76%)`
    ctx.font = "500 36px Cinzel, serif"
    ctx.textAlign = "center"
    ctx.fillText(`✦ ${t.reading} ✦`, width / 2, 144)

    ctx.fillStyle = "rgba(224,202,255,.88)"
    ctx.font = "500 52px Cinzel, serif"
    ctx.fillText(spread?.name ?? "", width / 2, 230)

    ctx.fillStyle = `hsl(${hue}, 72%, 72%)`
    ctx.font = "600 140px serif"
    ctx.fillText(card?.symbol ?? "✶", width / 2, 450)

    ctx.fillStyle = "#f3e8ff"
    ctx.font = "400 62px Cinzel, serif"
    ctx.fillText(cardName, width / 2, 560)

    ctx.fillStyle = `hsl(${hue}, 52%, 70%)`
    ctx.font = "italic 38px 'Cormorant Garamond', serif"
    drawWrappedText(ctx, `“${cardMeaning}”`, width / 2, 630, width - 240, 54, 3, "center")

    let cursorY = 850
    const sectionX = 104

    ctx.fillStyle = "rgba(241,224,255,.95)"
    ctx.font = "500 34px Cinzel, serif"
    ctx.textAlign = "left"
    ctx.fillText(t.prediction, sectionX, cursorY)
    cursorY += 56

    ctx.fillStyle = "rgba(224,201,255,.86)"
    ctx.font = "400 42px 'Cormorant Garamond', serif"
    drawWrappedText(ctx, guidanceData.prediction, sectionX, cursorY, width - 208, 50, 4)
    cursorY += 230

    ctx.fillStyle = "rgba(241,224,255,.95)"
    ctx.font = "500 34px Cinzel, serif"
    ctx.fillText(t.guidance, sectionX, cursorY)
    cursorY += 56

    ctx.fillStyle = "rgba(224,201,255,.86)"
    ctx.font = "400 42px 'Cormorant Garamond', serif"
    drawWrappedText(ctx, guidanceData.guidance, sectionX, cursorY, width - 208, 50, 4)

    if (birthData?.zodiac) {
      ctx.fillStyle = `hsla(${hue}, 68%, 65%, .22)`
      ctx.fillRect(92, 1455, width - 184, 112)
      ctx.fillStyle = "rgba(241,224,255,.92)"
      ctx.font = "500 30px Cinzel, serif"
      ctx.fillText(
        `${birthData.zodiac.symbol} ${birthData.zodiac?.[lang]} · ${t.path} ${birthData.lifePathNum}`,
        sectionX,
        1522,
      )
    }

    ctx.fillStyle = "rgba(221,198,255,.86)"
    ctx.font = "400 38px 'Cormorant Garamond', serif"
    drawWrappedText(ctx, t.cta, sectionX, 1645, width - 208, 48, 3)

    ctx.textAlign = "center"
    ctx.fillStyle = `hsl(${hue}, 55%, 58%)`
    ctx.font = "500 34px Cinzel, serif"
    ctx.fillText("arcana-mystica.vercel.app", width / 2, 1810)

    return canvas
  }

  const handleShare = async () => {
    try {
      const canvas = await buildShareImage()
      const blob = await canvasToBlob(canvas)
      if (!blob) throw new Error("image-generation-failed")

      const file = new File([blob], "arcana-mystica-reading.png", { type: "image/png" })
      const sharePayload = {
        title: t.reading,
        text: `${t.reading} — ${spread?.name}`,
        files: [file],
        url: "https://arcana-mystica.vercel.app",
      }

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(sharePayload)
        setFeedback(t.fallbackSaved)
        return
      }

      const imgUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = imgUrl
      a.download = "arcana-mystica-reading.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(imgUrl)

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("https://arcana-mystica.vercel.app")
      }
      setFeedback(t.copied)
    } catch {
      setFeedback(t.shareError)
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(3,1,13,.95)", backdropFilter: "blur(24px)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "20px", overflowY: "auto",
    }}>
      <style>{`
        @keyframes shareIn{from{opacity:0;transform:scale(.94) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes cardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>

      <div style={{ maxWidth: "420px", width: "100%", animation: "shareIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "22px", fontFamily: "'Cinzel',serif", fontWeight: 400, color: "#ede0ff", marginBottom: "6px" }}>{t.title}</h3>
          <p style={{ fontSize: "12px", color: "rgba(180,140,255,.45)", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>{t.subtitle}</p>
        </div>

        <div style={{
          width: "100%", aspectRatio: "9/16", maxHeight: "60vh",
          background: `radial-gradient(ellipse at 50% 20%, hsl(${hue},60%,12%) 0%, hsl(${hue + 30},50%,6%) 50%, #03010d 100%)`,
          borderRadius: "20px", overflow: "hidden", position: "relative",
          boxShadow: `0 0 60px hsla(${hue},70%,40%,.4), 0 24px 60px rgba(0,0,0,.8)`,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "space-between", padding: "5%",
        }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${5 + (i * 17) % 85}%`, left: `${(i * 23) % 90}%`,
              width: i % 3 === 0 ? "3px" : "2px", height: i % 3 === 0 ? "3px" : "2px",
              borderRadius: "50%",
              background: i % 4 === 0 ? "rgba(252,211,77,.7)" : "rgba(210,190,255,.5)",
              boxShadow: i % 4 === 0 ? "0 0 4px rgba(252,211,77,.4)" : "none",
            }} />
          ))}

          <div style={{ position: "absolute", inset: "5px", borderRadius: "16px", border: `1px solid hsla(${hue},50%,50%,.2)`, pointerEvents: "none" }} />

          <div style={{ zIndex: 1, textAlign: "center" }}>
            <p style={{ fontSize: "clamp(8px,2vw,11px)", letterSpacing: "4px", color: `hsl(${hue},50%,60%)`, textTransform: "uppercase", fontFamily: "'Cinzel',serif", marginBottom: "4px" }}>✦ {t.reading} ✦</p>
            <p style={{ fontSize: "clamp(10px,2.5vw,14px)", fontFamily: "'Cinzel',serif", color: "rgba(200,165,255,.5)", letterSpacing: "2px" }}>{spread.name}</p>
          </div>

          <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: 1, justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "8px" }}>
              {cards.slice(0, Math.min(cards.length, 5)).map((c, i) => {
                const h2 = (c.card.id * 137) % 360
                return (
                  <div key={i} style={{
                    width: i === 0 ? "clamp(70px,16vw,90px)" : "clamp(40px,9vw,54px)",
                    height: i === 0 ? "clamp(117px,26vw,150px)" : "clamp(67px,15vw,90px)",
                    borderRadius: "6px", overflow: "hidden", flexShrink: 0,
                    boxShadow: `0 0 ${i === 0 ? 20 : 8}px hsla(${h2},60%,45%,.4),0 4px 12px rgba(0,0,0,.6)`,
                    transform: `rotate(${(i - Math.floor(cards.length / 2)) * 4}deg) translateY(${i === 0 ? -8 : 0}px)`,
                    border: `1px solid hsla(${h2},50%,40%,.3)`,
                    animation: i === 0 ? "cardFloat 3s ease-in-out infinite" : "none",
                    position: "relative", zIndex: i === 0 ? 2 : 1,
                    alignSelf: "center",
                  }}>
                    <svg viewBox="0 0 120 200" style={{ width: "100%", height: "100%", transform: c.reversed ? "rotate(180deg)" : "none" }}>
                      <defs><radialGradient id={`sg${i}`} cx="50%" cy="35%"><stop offset="0%" stopColor={`hsl(${h2},50%,18%)`} /><stop offset="100%" stopColor={`hsl(${h2},40%,7%)`} /></radialGradient></defs>
                      <rect width="120" height="200" rx="8" fill={`url(#sg${i})`} />
                      <rect x="5" y="5" width="110" height="190" rx="6" fill="none" stroke={`hsl(${h2},50%,45%)`} strokeWidth="1" strokeOpacity=".4" />
                      <text x="60" y="95" textAnchor="middle" dominantBaseline="middle" fontSize="32" fill={`hsl(${h2},70%,68%)`}>{c.card.symbol}</text>
                      <text x="60" y="140" textAnchor="middle" fontSize="6.5" fill={`hsl(${h2},40%,70%)`} fontFamily="serif" letterSpacing="1">
                        {safeCardText(c.card.name, lang).toUpperCase().slice(0, 16)}
                      </text>
                    </svg>
                  </div>
                )
              })}
            </div>

            <div style={{ textAlign: "center", maxWidth: "90%" }}>
              <p style={{ fontSize: "clamp(16px,4vw,22px)", fontFamily: "'Cinzel',serif", fontWeight: 400, color: "#ede0ff", letterSpacing: "1px", marginBottom: "6px" }}>{cardName}</p>
              <p style={{ fontSize: "clamp(10px,2.5vw,13px)", color: `hsl(${hue},40%,65%)`, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", lineHeight: "1.6" }}>
                "{guidanceData.prediction.slice(0, 90)}{guidanceData.prediction.length > 90 ? "..." : ""}"
              </p>
            </div>
          </div>

          <div style={{ zIndex: 1, textAlign: "center", width: "100%" }}>
            {birthData && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>{birthData.zodiac?.symbol}</span>
                <span style={{ fontSize: "clamp(9px,2vw,11px)", color: "rgba(200,165,255,.5)", fontFamily: "'Cinzel',serif", letterSpacing: "2px" }}>
                  {birthData.zodiac?.[lang]} · {t.path} {birthData.lifePathNum}
                </span>
              </div>
            )}
            <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,hsla(${hue},40%,50%,.3),transparent)`, marginBottom: "8px" }} />
            <p style={{ fontSize: "clamp(9px,2vw,11px)", color: `hsl(${hue},35%,45%)`, fontFamily: "'Cinzel',serif", letterSpacing: "3px" }}>
              🔮 arcana-mystica.vercel.app
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(180,140,255,.4)", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", margin: "14px 0 12px" }}>
          {t.saveTip}
        </p>
        {feedback && (
          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(160,245,180,.8)", marginBottom: "12px" }}>{feedback}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={handleShare} style={{
            padding: "16px", background: "linear-gradient(135deg,rgba(120,60,200,.35),rgba(80,30,160,.35))",
            border: "1px solid rgba(180,120,255,.4)", borderRadius: "12px",
            color: "#d4b4ff", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'Cinzel',serif", transition: "all .3s",
          }}>
            🖼️ {t.shareBtn}
          </button>
          <button onClick={onClose} style={{
            padding: "14px", background: "transparent",
            border: "1px solid rgba(160,100,255,.15)", borderRadius: "12px",
            color: "rgba(180,140,255,.4)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'Cinzel',serif", transition: "all .3s",
          }}>
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
