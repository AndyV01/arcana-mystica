import { useEffect, useState } from "react"
import { loadProfile } from "./profile.store.js"

const T = {
  en: {
    badge: "Profile Memory",
    title: "Your Arcana Profile",
    subtitle: "The patterns your readings have started to reveal",
    empty: "Your profile is still blank.",
    emptySub: "Complete a few readings and this memory space will begin to map your recurring symbols, themes and next action.",
    readings: "readings",
    favoriteSpreads: "Favorite spreads",
    recurringCards: "Recurring cards",
    activeThemes: "Active themes",
    nextAction: "Suggested next action",
    tryIt: "Start suggested spread"
  },
  es: {
    badge: "Memoria del Perfil",
    title: "Tu Perfil Arcano",
    subtitle: "Los patrones que tus lecturas ya empezaron a revelar",
    empty: "Tu perfil todavia esta en blanco.",
    emptySub: "Completa algunas lecturas y esta memoria empezara a mapear tus simbolos recurrentes, temas y siguiente accion.",
    readings: "lecturas",
    favoriteSpreads: "Tiradas favoritas",
    recurringCards: "Cartas recurrentes",
    activeThemes: "Temas activos",
    nextAction: "Siguiente accion sugerida",
    tryIt: "Iniciar tirada sugerida"
  }
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(210,180,245,.62)",fontFamily:"'Cinzel',serif",marginBottom:"12px" }}>
      {children}
    </p>
  )
}

export default function ProfileInsights({ lang, onStartSuggested }) {
  const t = T[lang] ?? T.en
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    loadProfile().then(setProfile)
  }, [])

  const hasProfile = profile?.readingCount > 0

  return (
    <div style={{ padding:"0 16px 60px",maxWidth:"860px",margin:"0 auto",width:"100%" }}>
      <div style={{ textAlign:"center",marginBottom:"28px" }}>
        <p style={{ fontSize:"10px",letterSpacing:"5px",color:"rgba(200,160,255,.4)",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>
          {t.badge}
        </p>
        <h2 style={{ fontSize:"clamp(22px,5vw,34px)",fontFamily:"'Cinzel',serif",fontWeight:400,color:"#ede0ff",marginBottom:"6px" }}>
          {t.title}
        </h2>
        <p style={{ fontSize:"13px",color:"rgba(180,140,255,.45)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
          {t.subtitle}
        </p>
      </div>

      {!hasProfile && (
        <div style={{ textAlign:"center",padding:"56px 20px",background:"rgba(255,255,255,.02)",border:"1px dashed rgba(160,100,255,.2)",borderRadius:"16px" }}>
          <p style={{ fontSize:"16px",color:"rgba(220,190,255,.62)",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>{t.empty}</p>
          <p style={{ fontSize:"13px",color:"rgba(180,140,255,.38)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",maxWidth:"540px",margin:"0 auto" }}>
            {t.emptySub}
          </p>
        </div>
      )}

      {hasProfile && (
        <div style={{ display:"grid",gap:"16px" }}>
          <div style={{ padding:"20px 22px",background:"linear-gradient(135deg,rgba(58,24,100,.34),rgba(18,7,40,.42))",border:"1px solid rgba(180,140,255,.16)",borderRadius:"18px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",gap:"12px",flexWrap:"wrap",marginBottom:"12px" }}>
              <p style={{ fontSize:"14px",color:"#f0e2ff",fontFamily:"'Cinzel',serif" }}>
                {profile.readingCount} {t.readings}
              </p>
              <p style={{ fontSize:"11px",color:"rgba(190,160,235,.52)",fontFamily:"'Cinzel',serif",letterSpacing:"1px" }}>
                {profile.lastReadingAt ? new Date(profile.lastReadingAt).toLocaleDateString(lang === "es" ? "es-AR" : "en-US") : ""}
              </p>
            </div>
            <p style={{ fontSize:"15px",lineHeight:"1.7",color:"rgba(228,214,248,.78)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
              {profile.profileSummary}
            </p>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"16px" }}>
            <div style={{ padding:"18px",background:"rgba(255,255,255,.025)",border:"1px solid rgba(180,140,255,.12)",borderRadius:"16px" }}>
              <SectionTitle>{t.favoriteSpreads}</SectionTitle>
              {profile.spreadUsage?.slice(0, 3).map(item => (
                <p key={item.id} style={{ fontSize:"14px",color:"rgba(230,210,248,.82)",fontFamily:"'Cormorant Garamond',serif",marginBottom:"8px" }}>
                  {item.name} · {item.count}
                </p>
              ))}
            </div>

            <div style={{ padding:"18px",background:"rgba(255,255,255,.025)",border:"1px solid rgba(180,140,255,.12)",borderRadius:"16px" }}>
              <SectionTitle>{t.recurringCards}</SectionTitle>
              {profile.recurringCards?.slice(0, 3).map(item => (
                <p key={item.id} style={{ fontSize:"14px",color:"rgba(230,210,248,.82)",fontFamily:"'Cormorant Garamond',serif",marginBottom:"8px" }}>
                  {item.name} · {item.count}
                </p>
              ))}
            </div>

            <div style={{ padding:"18px",background:"rgba(255,255,255,.025)",border:"1px solid rgba(180,140,255,.12)",borderRadius:"16px" }}>
              <SectionTitle>{t.activeThemes}</SectionTitle>
              {profile.themeUsage?.slice(0, 4).map(item => (
                <p key={item.id} style={{ fontSize:"14px",color:"rgba(230,210,248,.82)",fontFamily:"'Cormorant Garamond',serif",marginBottom:"8px" }}>
                  {item.name} · {item.count}
                </p>
              ))}
            </div>
          </div>

          {profile.nextAction && (
            <div style={{ padding:"20px 22px",background:"linear-gradient(135deg,rgba(78,38,128,.34),rgba(18,7,40,.42))",border:"1px solid rgba(180,140,255,.18)",borderRadius:"18px" }}>
              <SectionTitle>{t.nextAction}</SectionTitle>
              <p style={{ fontSize:"18px",color:"#f0e2ff",fontFamily:"'Cinzel',serif",marginBottom:"8px" }}>
                {profile.nextAction.title}
              </p>
              <p style={{ fontSize:"15px",lineHeight:"1.7",color:"rgba(228,214,248,.78)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",marginBottom:"14px" }}>
                {profile.nextAction.message}
              </p>
              {onStartSuggested && (
                <button
                  onClick={() => onStartSuggested(profile.nextAction.spreadId)}
                  style={{ padding:"12px 22px",background:"linear-gradient(135deg,rgba(120,60,200,.34),rgba(80,40,160,.34))",border:"1px solid rgba(180,140,255,.3)",borderRadius:"8px",color:"#e8d5ff",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Cinzel',serif" }}
                >
                  {profile.nextAction.cta || t.tryIt}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
