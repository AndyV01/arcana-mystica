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

  // Fallback DEV (same as check-credits)
  if (!redis) {
    return res.status(200).json({ used: "free" });
  }

  try {
    const freeKey = `credits:free:${userId}`;
    const paidKey = `credits:paid:${userId}`;

    const freeUsed = await redis.get(freeKey);

    //Case 1: Use the day's free option.
    if (freeUsed === null) {
      await redis.set(freeKey, 1, { ex: 60 * 60 * 24 });
      return res.status(200).json({ used: "free" });
    }

    //Case 2: Use paid credits
    const paidCredits = await redis.get(paidKey);

    if ((paidCredits || 0) > 0) {
      await redis.decr(paidKey);
      return res.status(200).json({ used: "paid" });
    }

    //Case 3: No credits available
    return res.status(403).json({ error: "No credits available" });

  } catch (error) {
    console.error("Redis error:", error);

    // Safe fallback (do not break UX)
    return res.status(200).json({ used: "free" });
  }
}