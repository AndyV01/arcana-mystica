import { useState } from "react"
import { WEEKLY_HOROSCOPE } from "./dailyContent.js"

const SIGNS_EN = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
const SIGNS_ES = ["Aries","Tauro","Géminis","Cancer","Leo","Virgo","Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"]
const SIGN_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"]
const SIGN_ELEMENTS = {
  en: ["Fire","Earth","Air","Water","Fire","Earth","Air","Water","Fire","Earth","Air","Water"],
  es: ["Fuego","Tierra","Aire","Agua","Fuego","Tierra","Aire","Agua","Fuego","Tierra","Aire","Agua"],
}
const ELEMENT_COLORS = ["#ef4444","#84cc16","#67e8f9","#60a5fa"]
const ELEMENT_IDX = [0,1,2,3,0,1,2,3,0,1,2,3]

const T = {
  en: {
    badge:    "✦ Weekly Horoscope ✦",
    subtitle: "What the cosmos holds for your sign this week",
    theme:    "Theme of the week",
    element:  "Element",
    pick:     "Choose your sign",
  },
  es: {
    badge:    "✦ Horóscopo Semanal ✦",
    subtitle: "Lo que el cosmos tiene para tu signo esta semana",
    theme:    "Tema de la semana",
    element:  "Elemento",
    pick:     "Elegí tu signo",
  },
}

export default function WeeklyHoroscope({ lang, birthData }) {
  // Auto-select sign from birthData if available
  const autoIdx = birthData?.zodiac
    ? SIGNS_EN.findIndex(s => s.toLowerCase() === (birthData.zodiac.en ?? "").toLowerCase())
    : -1

  const [selectedIdx, setSelectedIdx] = useState(autoIdx >= 0 ? autoIdx : -1)
  const [visible, setVisible] = useState(false)
  const t = T[lang] ?? T.en

  // ensure visible on mount
  useState(() => { setTimeout(() => setVisible(true), 100) })

  const signs    = lang === "es" ? SIGNS_ES : SIGNS_EN
  const horoData = WEEKLY_HOROSCOPE[lang] ?? WEEKLY_HOROSCOPE.en

  // selected sign key (always EN for data lookup)
  const selectedKey = selectedIdx >= 0 ? SIGNS_EN[selectedIdx] : null
  const selected = selectedKey ? horoData[selectedKey] : null
  const elColor = selectedIdx >= 0 ? ELEMENT_COLORS[ELEMENT_IDX[selectedIdx]] : "#a855f7"

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
      padding: "0 16px 60px",
      maxWidth: "800px", margin: "0 auto", width: "100%",
    }}>

      {/* Header */}
      <div style={{ textAlign:"center",marginBottom:"28px" }}>
        <p style={{ fontSize:"10px",letterSpacing:"5px",color:"rgba(200,160,255,.4)",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>🌙</p>
        <h2 style={{ fontSize:"clamp(22px,5vw,34px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",marginBottom:"6px" }}>{t.badge}</h2>
        <p style={{ fontSize:"13px",color:"rgba(180,140,255,.45)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>{t.subtitle}</p>
      </div>

      {/* Sign grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px",marginBottom:"28px" }}>
        {signs.map((sign, i) => {
          const elC = ELEMENT_COLORS[ELEMENT_IDX[i]]
          const isSelected = selectedIdx === i
          return (
            <button key={i} onClick={() => setSelectedIdx(i)} style={{
              padding:"10px 4px",borderRadius:"12px",cursor:"pointer",border:"none",
              background: isSelected ? `hsla(${i*30},50%,18%,.6)` : "rgba(255,255,255,.03)",
              outline: isSelected ? `1px solid ${elC}55` : "1px solid rgba(160,100,255,.1)",
              transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
              transform: isSelected ? "scale(1.08)" : "scale(1)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",
            }}>
              <span style={{ fontSize:"clamp(16px,4vw,22px)",filter:isSelected?`drop-shadow(0 0 8px ${elC}88)`:"none",transition:"filter .3s" }}>
                {SIGN_SYMBOLS[i]}
              </span>
              <span style={{ fontSize:"clamp(7px,1.5vw,9px)",letterSpacing:"0.5px",color:isSelected?elC:"rgba(180,140,255,.45)",fontFamily:"'Cinzel',serif",textAlign:"center",lineHeight:"1.2" }}>
                {sign}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pick prompt */}
      {selectedIdx < 0 && (
        <div style={{ textAlign:"center",padding:"40px 20px",background:"rgba(255,255,255,.02)",border:"1px dashed rgba(160,100,255,.2)",borderRadius:"16px" }}>
          <p style={{ fontSize:"16px",color:"rgba(200,165,255,.4)",fontFamily:"'Cinzel',serif",letterSpacing:"2px" }}>{t.pick}</p>
        </div>
      )}

      {/* Horoscope content */}
      {selected && (
        <div style={{
          background:`linear-gradient(135deg,hsla(${selectedIdx*30},45%,12%,.5),hsla(${selectedIdx*30+40},35%,8%,.5))`,
          border:`1px solid ${elColor}33`,
          borderRadius:"20px",padding:"28px 28px",
          animation:"horoIn .5s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <style>{`@keyframes horoIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}`}</style>

          {/* Sign header */}
          <div style={{ display:"flex",alignItems:"center",gap:"16px",marginBottom:"20px",flexWrap:"wrap" }}>
            <div style={{ fontSize:"52px",filter:`drop-shadow(0 0 16px ${elColor}88)` }}>
              {SIGN_SYMBOLS[selectedIdx]}
            </div>
            <div>
              <h3 style={{ fontSize:"clamp(20px,5vw,30px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",letterSpacing:"2px" }}>
                {signs[selectedIdx]}
              </h3>
              <div style={{ display:"flex",gap:"10px",marginTop:"4px",flexWrap:"wrap" }}>
                <span style={{ fontSize:"10px",padding:"3px 12px",background:`${elColor}18`,border:`1px solid ${elColor}44`,borderRadius:"20px",color:elColor,fontFamily:"sans-serif",letterSpacing:"1px" }}>
                  {SIGN_ELEMENTS[lang][selectedIdx]}
                </span>
                <span style={{ fontSize:"10px",padding:"3px 12px",background:"rgba(160,100,255,.12)",border:"1px solid rgba(160,100,255,.22)",borderRadius:"20px",color:"rgba(200,165,255,.7)",fontFamily:"'Cinzel',serif",letterSpacing:"1px" }}>
                  {t.theme}: {selected.theme}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:"1px",background:`linear-gradient(90deg,transparent,${elColor}44,transparent)`,marginBottom:"20px" }}/>

          {/* Text */}
          <p style={{ fontSize:"clamp(14px,3.5vw,17px)",color:"rgba(220,200,255,.8)",fontFamily:"'Cormorant Garamond',serif",lineHeight:"1.85",fontStyle:"italic" }}>
            {selected.text}
          </p>

          {/* Birth data match badge */}
          {birthData?.zodiac && SIGNS_EN[selectedIdx].toLowerCase() === (birthData.zodiac.en ?? "").toLowerCase() && (
            <div style={{ marginTop:"20px",padding:"12px 16px",background:"rgba(100,200,100,.06)",border:"1px solid rgba(100,200,100,.2)",borderRadius:"12px",display:"flex",alignItems:"center",gap:"10px" }}>
              <span style={{ fontSize:"16px" }}>✨</span>
              <p style={{ fontSize:"12px",color:"rgba(150,250,150,.7)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
                {lang === "es" ? "Este es tu signo — la lectura está personalizada para vos." : "This is your sign — the reading is personalized for you."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
