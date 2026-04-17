import { getUserId } from "./credits.js";

export default function PaywallModal({ onClose }) {

  const handleBuy = async () => {
      console.log("CLICK BUY"); 
  const userId = getUserId();

  const res = await fetch("/api/create-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      pack: "pack5",
    }),
  });

  const data = await res.json();

  window.location.href = data.init_point;
};

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0d0618 100%)",
        border: "1px solid rgba(180,130,255,0.3)",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "420px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 0 60px rgba(140,80,255,0.3)"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔮</div>

        <h2 style={{
          color: "#e8d5ff",
          fontSize: "28px",
          marginBottom: "12px",
        }}>
          Tu energía de hoy ya fue revelada
        </h2>

        <p style={{
          color: "rgba(220,200,255,0.8)",
          fontSize: "15px",
          marginBottom: "24px",
          lineHeight: "1.6"
        }}>
          Ya utilizaste tu lectura gratuita del día. <br />
          Puedes continuar ahora con nuevas interpretaciones más profundas.
        </p>

        {/* OPCIONES (clave para conversión) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>

          <button
            onClick={handleBuy}
            style={btnPrimary}
          >
            5 Lecturas — $2 💎
          </button>

          <button
            onClick={() => window.open("https://buy.stripe.com/your-single", "_blank")}
            style={btnSecondary}
          >
            1 Lectura — $0.50
          </button>

        </div>

        <button onClick={onClose} style={btnGhost}>
          Volver mañana
        </button>
      </div>
    </div>
  );
}

const btnPrimary = {
  background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const btnSecondary = {
  background: "transparent",
  color: "#c4b5fd",
  border: "1px solid rgba(180,130,255,0.3)",
  borderRadius: "12px",
  padding: "12px",
  fontSize: "14px",
  cursor: "pointer"
};

const btnGhost = {
  marginTop: "10px",
  background: "transparent",
  color: "rgba(220,200,255,0.6)",
  border: "none",
  fontSize: "13px",
  cursor: "pointer"
};