import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  try {
    await redis.ping()
    return res.status(200).json({ ok: true, ts: new Date().toISOString() })
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message })
  }
}