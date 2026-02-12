// ─── Card Back ────────────────────────────────────────────────────────────────
export function CardBackSVG() {
  return (
    <svg viewBox="0 0 120 200" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="cardBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="100%" stopColor="#0a0415" />
        </radialGradient>
        <pattern id="weavePattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0,5 L5,0 L10,5 L5,10 Z" fill="none" stroke="rgba(160,120,255,0.14)" strokeWidth="0.5" />
        </pattern>
        <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.4" fill="rgba(180,140,255,0.08)" />
        </pattern>
      </defs>
      <rect width="120" height="200" rx="9" fill="url(#cardBg)" />
      <rect width="120" height="200" rx="9" fill="url(#weavePattern)" />
      <rect width="120" height="200" rx="9" fill="url(#dots)" />
      {/* Border frames */}
      <rect x="5" y="5" width="110" height="190" rx="7" fill="none" stroke="rgba(160,120,255,0.35)" strokeWidth="1" />
      <rect x="9" y="9" width="102" height="182" rx="5" fill="none" stroke="rgba(160,120,255,0.18)" strokeWidth="0.6" />
      {/* Center orb */}
      <circle cx="60" cy="100" r="34" fill="none" stroke="rgba(180,140,255,0.18)" strokeWidth="1" />
      <circle cx="60" cy="100" r="24" fill="none" stroke="rgba(180,140,255,0.12)" strokeWidth="0.6" />
      <circle cx="60" cy="100" r="12" fill="rgba(120,60,200,0.12)" />
      {/* Star */}
      <path
        d="M60,68 L63.5,78.5 L75,78.5 L66,85 L69.5,95.5 L60,89 L50.5,95.5 L54,85 L45,78.5 L56.5,78.5 Z"
        fill="rgba(200,170,255,0.45)"
        stroke="rgba(200,170,255,0.2)"
        strokeWidth="0.5"
      />
      {/* Corner ornaments */}
      {[[14,18],[106,18],[14,182],[106,182]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="none" stroke="rgba(180,140,255,0.3)" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="1.2" fill="rgba(180,140,255,0.3)" />
        </g>
      ))}
      {/* Radial lines */}
      {[0,60,120,180,240,300].map(a => {
        const rad = a * Math.PI / 180
        return (
          <line key={a}
            x1={60 + 12 * Math.cos(rad)} y1={100 + 12 * Math.sin(rad)}
            x2={60 + 33 * Math.cos(rad)} y2={100 + 33 * Math.sin(rad)}
            stroke="rgba(180,140,255,0.1)" strokeWidth="0.5"
          />
        )
      })}
    </svg>
  )
}

// ─── Card Face ────────────────────────────────────────────────────────────────
export function CardFaceSVG({ card, reversed, lang = "en" }) {
  const hue = (card.id * 137) % 360
  const sat = 55 + (card.id % 15)
  const cardName = typeof card.name === "object" ? card.name[lang] : card.name
  const cardElement = typeof card.element === "object" ? card.element[lang] : card.element

  // Roman numerals for Major Arcana
  const roman = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"]

  return (
    <svg viewBox="0 0 120 200" style={{ width: "100%", height: "100%", transform: reversed ? "rotate(180deg)" : "none" }}>
      <defs>
        <radialGradient id={`faceBg_${card.id}`} cx="50%" cy="35%">
          <stop offset="0%" stopColor={`hsl(${hue},${sat}%,18%)`} />
          <stop offset="70%" stopColor={`hsl(${hue + 30},${sat - 10}%,10%)`} />
          <stop offset="100%" stopColor={`hsl(${hue + 50},40%,6%)`} />
        </radialGradient>
        <filter id={`glow_${card.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id={`shimmer_${card.id}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.3" fill={`hsla(${hue},60%,80%,0.04)`} />
        </pattern>
      </defs>
      <rect width="120" height="200" rx="9" fill={`url(#faceBg_${card.id})`} />
      <rect width="120" height="200" rx="9" fill={`url(#shimmer_${card.id})`} />
      {/* Outer border */}
      <rect x="5" y="5" width="110" height="190" rx="7" fill="none" stroke={`hsl(${hue},${sat + 10}%,55%)`} strokeWidth="1" strokeOpacity="0.55" />
      <rect x="8" y="8" width="104" height="184" rx="5" fill="none" stroke={`hsl(${hue},${sat}%,45%)`} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Corner gems */}
      {[[13,20],[107,20],[13,180],[107,180]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={`hsl(${hue},${sat}%,30%)`} />
          <circle cx={x} cy={y} r="2.5" fill={`hsl(${hue},${sat + 20}%,60%)`} fillOpacity="0.6" />
        </g>
      ))}
      {/* Decorative top arc */}
      <path d={`M 20 35 Q 60 20 100 35`} fill="none" stroke={`hsl(${hue},40%,45%)`} strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Roman numeral (major arcana) */}
      {card.id < 22 && (
        <text x="60" y="32" textAnchor="middle" fontSize="8" fill={`hsl(${hue},50%,65%)`} fontFamily="Georgia,serif" letterSpacing="3" opacity="0.8">
          {roman[card.id]}
        </text>
      )}
      {/* Big symbol */}
      <text x="60" y="95" textAnchor="middle" dominantBaseline="middle" fontSize="30"
        filter={`url(#glow_${card.id})`} fill={`hsl(${hue},80%,78%)`}>
        {card.symbol}
      </text>
      {/* Decorative circle */}
      <circle cx="60" cy="95" r="26" fill="none" stroke={`hsl(${hue},40%,45%)`} strokeWidth="0.6" strokeOpacity="0.3" />
      {/* Horizontal divider */}
      <line x1="18" y1="122" x2="102" y2="122" stroke={`hsl(${hue},40%,45%)`} strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="28" y1="125" x2="92" y2="125" stroke={`hsl(${hue},35%,40%)`} strokeWidth="0.4" strokeOpacity="0.3" />
      {/* Card name — split long names */}
      {(() => {
        const words = cardName.split(" ")
        if (words.length <= 2) {
          return (
            <text x="60" y="136" textAnchor="middle" fontSize="7.2" fill={`hsl(${hue},40%,80%)`} fontFamily="Georgia,serif" letterSpacing="1.2">
              {cardName.toUpperCase()}
            </text>
          )
        }
        const mid = Math.ceil(words.length / 2)
        const line1 = words.slice(0, mid).join(" ")
        const line2 = words.slice(mid).join(" ")
        return (
          <>
            <text x="60" y="132" textAnchor="middle" fontSize="6.5" fill={`hsl(${hue},40%,80%)`} fontFamily="Georgia,serif" letterSpacing="1.2">{line1.toUpperCase()}</text>
            <text x="60" y="141" textAnchor="middle" fontSize="6.5" fill={`hsl(${hue},40%,80%)`} fontFamily="Georgia,serif" letterSpacing="1.2">{line2.toUpperCase()}</text>
          </>
        )
      })()}
      {/* Element */}
      <text x="60" y="153" textAnchor="middle" fontSize="5.5" fill={`hsl(${hue},35%,55%)`} fontFamily="sans-serif" letterSpacing="1">
        {cardElement?.toUpperCase()}
      </text>
      {/* Reversed watermark */}
      {reversed && (
        <text x="60" y="185" textAnchor="middle" fontSize="5" fill="rgba(255,100,100,0.65)" fontFamily="serif" letterSpacing="1">
          ▼ REVERSED ▼
        </text>
      )}
    </svg>
  )
}
