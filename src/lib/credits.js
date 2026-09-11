/**
 * Business logic for reading credits.
 * Handles credit verification and consumption via API.
 */

// ─── API 

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

// ─── Credit Operations 

/**
 * Verify user credits
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
 * Consume a credit (free or paid)
 */
export async function consumeCredit(userId) {
  return apiFetch("/api/use-credit", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

// ─── Aliases (compatibility) ────────────────────────────────────────────────

export const canGenerateReading = checkCredits;
export const useCredit = consumeCredit;
