/**
 * Lógica de negocio para créditos de lecturas.
 * Maneja verificación y consumo de créditos via API.
 */

// ─── API ──────────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// ─── Credit Operations ───────────────────────────────────────────────────────

/**
 * Verifica créditos del usuario
 */
export async function checkCredits(userId) {
  try {
    return await apiFetch(`/api/check-credits?userId=${userId}`);
  } catch (err) {
    console.error("checkCredits failed", err);
    return { hasCredits: false, hasFree: false, paidCredits: 0 };
  }
}

/**
 * Consume un crédito (free o pago)
 */
export async function consumeCredit(userId) {
  return apiFetch("/api/use-credit", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

// ─── Aliases (compatibilidad) ────────────────────────────────────────────────

export const canGenerateReading = checkCredits;
export const useCredit = consumeCredit;
