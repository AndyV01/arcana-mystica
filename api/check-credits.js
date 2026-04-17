import { Redis } from "@upstash/redis";

let redis;

try {
  redis = Redis.fromEnv();
} catch (err) {
  console.warn("Redis not available:", err.message);
}

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (!redis) {
    return res.status(200).json({
      hasCredits: true,
      hasFree: true,
      paidCredits: 0,
    });
  }

  try {
    const freeKey = `credits:free:${userId}`;
    const paidKey = `credits:paid:${userId}`;

    const [freeUsed, paidCredits] = await Promise.all([
      redis.get(freeKey),
      redis.get(paidKey),
    ]);

    const hasFree = freeUsed === null;
    const hasPaid = (paidCredits || 0) > 0;

    return res.status(200).json({
      hasCredits: hasFree || hasPaid,
      hasFree,
      paidCredits: paidCredits || 0,
    });

  } catch (error) {
    console.error("Redis error:", error);

    return res.status(200).json({
      hasCredits: true,
      hasFree: true,
      paidCredits: 0,
    });
  }
}