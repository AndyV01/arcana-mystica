import { Redis } from "@upstash/redis";

let redis;

try {
  redis = Redis.fromEnv();
} catch (err) {
  console.warn("Redis not available:", err.message);
}

export default async function handler(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Fallback DEV (igual que en check-credits)
  if (!redis) {
    return res.status(200).json({ used: "free" });
  }

  try {
    const freeKey = `credits:free:${userId}`;
    const paidKey = `credits:paid:${userId}`;

    const freeUsed = await redis.get(freeKey);

    // Caso 1: usar free del día
    if (freeUsed === null) {
      await redis.set(freeKey, 1, { ex: 60 * 60 * 24 });
      return res.status(200).json({ used: "free" });
    }

    // Caso 2: usar créditos pagos
    const paidCredits = await redis.get(paidKey);

    if ((paidCredits || 0) > 0) {
      await redis.decr(paidKey);
      return res.status(200).json({ used: "paid" });
    }

    // Caso 3: sin créditos
    return res.status(403).json({ error: "No credits available" });

  } catch (error) {
    console.error("Redis error:", error);

    // fallback seguro (no romper UX)
    return res.status(200).json({ used: "free" });
  }
}