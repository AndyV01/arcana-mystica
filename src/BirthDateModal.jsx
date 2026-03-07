import { useState, useEffect, useRef } from "react"

// ─── Numerology helpers ───────────────────────────────────────────────────────
function reduceToSingleDigit(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((a, d) => a + Number(d), 0)
  }
  return n
}

export function calcNumerology(day, month, year) {
  const sum = [...String(day), ...String(month), ...String(year)]
    .reduce((a, d) => a + Number(d), 0)
  return reduceToSingleDigit(sum)
}

export function getZodiacSign(day, month) {
  const signs = [
    { en: "Capricorn",   es: "Capricornio",  symbol: "♑", end: [19, 1]  },
    { en: "Aquarius",    es: "Acuario",       symbol: "♒", end: [18, 2]  },
    { en: "Pisces",      es: "Piscis",        symbol: "♓", end: [20, 3]  },
    { en: "Aries",       es: "Aries",         symbol: "♈", end: [19, 4]  },
    { en: "Taurus",      es: "Tauro",         symbol: "♉", end: [20, 5]  },
    { en: "Gemini",      es: "Géminis",       symbol: "♊", end: [20, 6]  },
    { en: "Cancer",      es: "Cáncer",        symbol: "♋", end: [22, 7]  },
    { en: "Leo",         es: "Leo",           symbol: "♌", end: [22, 8]  },
    { en: "Virgo",       es: "Virgo",         symbol: "♍", end: [22, 9]  },
    { en: "Libra",       es: "Libra",         symbol: "♎", end: [22, 10] },
    { en: "Scorpio",     es: "Escorpio",      symbol: "♏", end: [21, 11] },
    { en: "Sagittarius", es: "Sagitario",     symbol: "♐", end: [21, 12] },
    { en: "Capricorn",   es: "Capricornio",   symbol: "♑", end: [31, 12] },
  ]
  return signs.find(s => month < s.end[1] || (month === s.end[1] && day <= s.end[0]))
}

export function getLifePathMeaning(num, lang) {
  const meanings = {
    1:  { en: "The Leader — independent, pioneering, self-reliant",            es: "El Líder — independiente, pionero, autosuficiente" },
    2:  { en: "The Peacemaker — cooperative, sensitive, diplomatic",            es: "El Pacificador — cooperativo, sensible, diplomático" },
    3:  { en: "The Creator — expressive, imaginative, joyful",                  es: "El Creador — expresivo, imaginativo, alegre" },
    4:  { en: "The Builder — practical, disciplined, trustworthy",              es: "El Constructor — práctico, disciplinado, confiable" },
    5:  { en: "The Freedom Seeker — adventurous, curious, versatile",           es: "El Buscador — aventurero, curioso, versátil" },
    6:  { en: "The Nurturer — caring, responsible, harmonious",                 es: "El Protector — cuidadoso, responsable, armonioso" },
    7:  { en: "The Seeker — introspective, analytical, spiritual",              es: "El Sabio — introspectivo, analítico, espiritual" },
    8:  { en: "The Powerhouse — ambitious, authoritative, material mastery",    es: "El Poderoso — ambicioso, autoritario, maestría material" },
    9:  { en: "The Humanitarian — compassionate, generous, selfless",           es: "El Humanitario — compasivo, generoso, altruista" },
    11: { en: "The Illuminator — intuitive, visionary, spiritually gifted",     es: "El Iluminador — intuitivo, visionario, dotado espiritualmente" },
    22: { en: "The Master Builder — visionary, practical, transformative",      es: "El Gran Constructor — visionario, práctico, transformador" },
    33: { en: "The Master Teacher — selfless, loving, spiritually evolved",     es: "El Gran Maestro — altruista, amoroso, espiritualmente evolucionado" },
  }
  return meanings[num]?.[lang] ?? meanings[num]?.en ?? "Mysterious path"
}

export function getSeedFromBirthdate(day, month, year) {
  return (day * 31 + month * 12 + year) % 10000
}

// ─── Seeded shuffle to personalise card order ─────────────────────────────────
export function seededShuffle(array, seed) {
  const arr = [...array]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Translations for this component ─────────────────────────────────────────
const T = {
  en: {
    title:        "Before We Begin",
    subtitle:     "The stars need to know when you were born to guide your reading",
    dailyNote:    "Your personalized reading stays stable for today and renews with a new card tomorrow.",
    dayLabel:     "Day",
    monthLabel:   "Month",
    yearLabel:    "Year",
    cta:          "Reveal My Destiny",
    skip:         "Continue without personalisation",
    dayPH:        "DD",
    yearPH:       "YYYY",
    lifePath:     "Life Path",
    zodiac:       "Zodiac Sign",
    personalNote: "Your reading has been attuned to your cosmic blueprint",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    errors: {
      day:   "Enter a day between 1 and 31",
      month: "Select a month",
      year:  "Enter a valid year (1900–2025)",
      future:"You cannot be born in the future!",
    },
  },
  es: {
    title:        "Antes de Comenzar",
    subtitle:     "Las estrellas necesitan saber cuándo naciste para guiar tu lectura",
    dailyNote:    "Tu lectura personalizada se mantiene igual durante hoy y se renueva con otra carta mañana.",
    dayLabel:     "Día",
    monthLabel:   "Mes",
    yearLabel:    "Año",
    cta:          "Revelar Mi Destino",
    skip:         "Continuar sin personalización",
    dayPH:        "DD",
    yearPH:       "AAAA",
    lifePath:     "Camino de Vida",
    zodiac:       "Signo Zodiacal",
    personalNote: "Tu lectura ha sido sintonizada con tu mapa cósmico",
    months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    errors: {
      day:   "Ingresa un día entre 1 y 31",
      month: "Selecciona un mes",
      year:  "Ingresa un año válido (1900–2025)",
      future:"¡No puedes haber nacido en el futuro!",
    },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BirthDateModal({ lang, spreadName, onConfirm, onSkip }) {
  const t = T[lang]
  const [day, setDay]     = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear]   = useState("")
  const [errors, setErrors] = useState({})
  const [revealed, setRevealed] = useState(false)   // show numerology preview
  const [entered, setEntered]   = useState(false)
  const dayRef  = useRef()
  const yearRef = useRef()

  useEffect(() => {
    setTimeout(() => setEntered(true), 50)
    dayRef.current?.focus()
  }, [])

  const validate = () => {
    const errs = {}
    const d = parseInt(day),  m = parseInt(month), y = parseInt(year)
    if (!day   || d < 1 || d > 31)         errs.day   = t.errors.day
    if (!month)                              errs.month = t.errors.month
    if (!year  || y < 1900 || y > 2025)    errs.year  = t.errors.year
    if (y > new Date().getFullYear())       errs.year  = t.errors.future
    return errs
  }

  const handlePreview = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setRevealed(true)
  }

  const handleConfirm = () => {
    const d = parseInt(day), m = parseInt(month), y = parseInt(year)
    const lifePathNum = calcNumerology(d, m, y)
    const zodiac      = getZodiacSign(d, m)
    const seed        = getSeedFromBirthdate(d, m, y)
    onConfirm({ day: d, month: m, year: y, lifePathNum, zodiac, seed })
  }

  const d = parseInt(day), m = parseInt(month), y = parseInt(year)
  const lifePathNum = (day && month && year && !Object.keys(errors).length)
    ? calcNumerology(d, m, y) : null
  const zodiac = (day && month) ? getZodiacSign(d, m) : null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(4,1,14,0.92)",
      backdropFilter: "blur(24px)",
      padding: "20px",
      opacity: entered ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:translateY(30px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes orb2    { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes shimmerBorder { 0%,100%{box-shadow:0 0 30px rgba(160,100,255,.25)} 50%{box-shadow:0 0 60px rgba(200,140,255,.5)} }
        .bd-input { background:rgba(255,255,255,0.04) !important; border:1px solid rgba(140,80,255,0.25) !important; color:#e8d5ff !important; outline:none !important; transition:border-color .3s, box-shadow .3s !important; }
        .bd-input:focus { border-color:rgba(200,140,255,0.6) !important; box-shadow:0 0 0 3px rgba(160,100,255,0.12) !important; }
        .bd-input.error { border-color:rgba(255,100,100,0.5) !important; }
        .bd-select option { background:#0f0620; color:#e8d5ff; }
        .bd-cta:hover { background:linear-gradient(135deg,rgba(160,80,255,0.5),rgba(100,50,200,0.5)) !important; transform:translateY(-2px) !important; box-shadow:0 12px 40px rgba(140,80,255,0.4) !important; }
        .bd-skip:hover { color:rgba(200,160,255,0.7) !important; }
        .num-card { transition: all 0.5s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      <div style={{
        maxWidth: "480px", width: "100%",
        background: "linear-gradient(135deg,rgba(22,8,45,0.95),rgba(12,4,25,0.98))",
        border: "1px solid rgba(160,100,255,0.25)",
        borderRadius: "20px",
        padding: "clamp(28px,5vw,48px)",
        textAlign: "center",
        animation: "modalIn 0.6s cubic-bezier(.34,1.56,.64,1) forwards, shimmerBorder 4s ease-in-out infinite",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{ position:"absolute",top:"-60px",left:"50%",transform:"translateX(-50%)",width:"300px",height:"200px",background:"radial-gradient(ellipse,rgba(140,80,255,0.12),transparent 70%)",pointerEvents:"none",animation:"orb2 3s ease-in-out infinite" }} />

        {/* Header */}
        <div style={{ fontSize:"40px", marginBottom:"14px", filter:"drop-shadow(0 0 16px rgba(200,150,255,.6))" }}>🌟</div>
        <p style={{ fontSize:"9px",letterSpacing:"5px",color:"rgba(200,160,255,.45)",textTransform:"uppercase",fontFamily:"'Cinzel','Georgia',serif",marginBottom:"10px" }}>
          ✦ {spreadName} ✦
        </p>
        <h2 style={{ fontSize:"clamp(20px,4vw,28px)",fontFamily:"'Cinzel','Georgia',serif",fontWeight:400,color:"#ede0ff",marginBottom:"10px",letterSpacing:"1px" }}>
          {t.title}
        </h2>
        <p style={{ fontSize:"13px",color:"rgba(190,160,240,.55)",fontFamily:"'Cormorant Garamond','Georgia',serif",fontStyle:"italic",marginBottom:"32px",lineHeight:1.6 }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize:"11px",color:"rgba(210,185,245,.58)",fontFamily:"'Cormorant Garamond','Georgia',serif",fontStyle:"italic",marginTop:"-18px",marginBottom:"24px",lineHeight:1.5 }}>
          {t.dailyNote}
        </p>

        {/* ── Input group ── */}
        <div style={{ display:"flex",gap:"12px",marginBottom:"8px",justifyContent:"center" }}>

          {/* Day */}
          <div style={{ flex:"0 0 72px" }}>
            <label style={{ display:"block",fontSize:"9px",letterSpacing:"2px",color:"rgba(180,140,255,.45)",textTransform:"uppercase",fontFamily:"'Cinzel','Georgia',serif",marginBottom:"6px" }}>{t.dayLabel}</label>
            <input
              ref={dayRef}
              type="number" min="1" max="31" placeholder={t.dayPH}
              value={day}
              onChange={e => { setDay(e.target.value); setErrors({}); setRevealed(false) }}
              onKeyDown={e => e.key === "Tab" && !e.shiftKey && (e.preventDefault(), document.getElementById("bd-month")?.focus())}
              className={`bd-input${errors.day ? " error" : ""}`}
              style={{ width:"100%",padding:"12px 10px",borderRadius:"10px",fontSize:"18px",fontFamily:"'Cinzel','Georgia',serif",textAlign:"center" }}
            />
            {errors.day && <p style={{ fontSize:"9px",color:"rgba(255,100,100,.8)",marginTop:"4px",lineHeight:1.4 }}>{errors.day}</p>}
          </div>

          {/* Month */}
          <div style={{ flex:"1" }}>
            <label style={{ display:"block",fontSize:"9px",letterSpacing:"2px",color:"rgba(180,140,255,.45)",textTransform:"uppercase",fontFamily:"'Cinzel','Georgia',serif",marginBottom:"6px" }}>{t.monthLabel}</label>
            <select
              id="bd-month"
              value={month}
              onChange={e => { setMonth(e.target.value); setErrors({}); setRevealed(false) }}
              className={`bd-input bd-select${errors.month ? " error" : ""}`}
              style={{ width:"100%",padding:"12px 10px",borderRadius:"10px",fontSize:"13px",fontFamily:"'Cormorant Garamond','Georgia',serif",cursor:"pointer",appearance:"none" }}
            >
              <option value="">—</option>
              {t.months.map((mn, i) => (
                <option key={i} value={i + 1}>{mn}</option>
              ))}
            </select>
            {errors.month && <p style={{ fontSize:"9px",color:"rgba(255,100,100,.8)",marginTop:"4px" }}>{errors.month}</p>}
          </div>

          {/* Year */}
          <div style={{ flex:"0 0 90px" }}>
            <label style={{ display:"block",fontSize:"9px",letterSpacing:"2px",color:"rgba(180,140,255,.45)",textTransform:"uppercase",fontFamily:"'Cinzel','Georgia',serif",marginBottom:"6px" }}>{t.yearLabel}</label>
            <input
              ref={yearRef}
              type="number" min="1900" max="2025" placeholder={t.yearPH}
              value={year}
              onChange={e => { setYear(e.target.value); setErrors({}); setRevealed(false) }}
              className={`bd-input${errors.year ? " error" : ""}`}
              style={{ width:"100%",padding:"12px 8px",borderRadius:"10px",fontSize:"16px",fontFamily:"'Cinzel','Georgia',serif",textAlign:"center" }}
            />
            {errors.year && <p style={{ fontSize:"9px",color:"rgba(255,100,100,.8)",marginTop:"4px",lineHeight:1.4 }}>{errors.year}</p>}
          </div>
        </div>

        {/* ── Numerology preview ── */}
        {zodiac && lifePathNum && (
          <div style={{
            display:"flex",gap:"10px",justifyContent:"center",marginBottom:"24px",marginTop:"18px",
            opacity: revealed ? 1 : 0.35,
            transform: revealed ? "scale(1)" : "scale(0.95)",
            transition:"all 0.55s cubic-bezier(.34,1.56,.64,1)",
          }}>
            {/* Life Path */}
            <div className="num-card" style={{ flex:1,padding:"14px 10px",background:"linear-gradient(135deg,rgba(100,50,200,.25),rgba(60,20,120,.2))",border:"1px solid rgba(160,100,255,.22)",borderRadius:"12px" }}>
              <div style={{ fontSize:"24px",fontWeight:"bold",color:"#d4a8ff",fontFamily:"'Cinzel','Georgia',serif",lineHeight:1 }}>{lifePathNum}</div>
              <div style={{ fontSize:"8px",letterSpacing:"2px",color:"rgba(180,140,255,.5)",textTransform:"uppercase",marginTop:"4px",fontFamily:"'Cinzel','Georgia',serif" }}>{t.lifePath}</div>
              <div style={{ fontSize:"10px",color:"rgba(200,170,240,.6)",marginTop:"6px",fontFamily:"'Cormorant Garamond','Georgia',serif",fontStyle:"italic",lineHeight:1.4 }}>
                {getLifePathMeaning(lifePathNum, lang)}
              </div>
            </div>
            {/* Zodiac */}
            <div className="num-card" style={{ flex:1,padding:"14px 10px",background:"linear-gradient(135deg,rgba(60,20,120,.25),rgba(100,50,200,.2))",border:"1px solid rgba(160,100,255,.22)",borderRadius:"12px" }}>
              <div style={{ fontSize:"28px",lineHeight:1 }}>{zodiac?.symbol}</div>
              <div style={{ fontSize:"8px",letterSpacing:"2px",color:"rgba(180,140,255,.5)",textTransform:"uppercase",marginTop:"4px",fontFamily:"'Cinzel','Georgia',serif" }}>{t.zodiac}</div>
              <div style={{ fontSize:"12px",color:"#d4b4ff",marginTop:"6px",fontFamily:"'Cinzel','Georgia',serif",letterSpacing:"1px" }}>
                {zodiac?.[lang]}
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        {!revealed ? (
          <button className="bd-cta" onClick={handlePreview} style={{
            width:"100%",padding:"15px",
            background:"linear-gradient(135deg,rgba(120,60,200,.35),rgba(80,30,160,.35))",
            border:"1px solid rgba(180,120,255,.4)",
            borderRadius:"10px",color:"#e8d5ff",fontSize:"12px",
            letterSpacing:"3px",textTransform:"uppercase",
            cursor:"pointer",fontFamily:"'Cinzel','Georgia',serif",
            transition:"all .35s",marginBottom:"14px",
          }}>
            ✦ {t.cta} ✦
          </button>
        ) : (
          <button className="bd-cta" onClick={handleConfirm} style={{
            width:"100%",padding:"15px",
            background:"linear-gradient(135deg,rgba(140,70,220,.5),rgba(90,40,180,.5))",
            border:"1px solid rgba(200,150,255,.5)",
            borderRadius:"10px",color:"#f0e4ff",fontSize:"12px",
            letterSpacing:"3px",textTransform:"uppercase",
            cursor:"pointer",fontFamily:"'Cinzel','Georgia',serif",
            transition:"all .35s",marginBottom:"14px",
            boxShadow:"0 0 30px rgba(160,100,255,.3)",
          }}>
            🔮 {t.cta} 🔮
          </button>
        )}

        <button className="bd-skip" onClick={onSkip} style={{
          background:"none",border:"none",
          color:"rgba(180,140,255,.3)",fontSize:"11px",
          letterSpacing:"1.5px",cursor:"pointer",
          fontFamily:"'Cormorant Garamond','Georgia',serif",
          fontStyle:"italic",transition:"color .3s",
        }}>
          {t.skip}
        </button>
      </div>
    </div>
  )
}
