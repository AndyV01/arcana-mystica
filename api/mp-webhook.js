import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const body = req.body;

    if (body.type !== "payment") {
      return res.status(200).send("ignored");
    }

    const paymentId = body.data.id;

    // 🔥 obtener info del pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await response.json();

    if (payment.status === "approved") {
      const { userId, credits } = payment.metadata;

      const key = `credits:paid:${userId}`;
      const current = (await redis.get(key)) || 0;

      await redis.set(key, current + credits);

      console.log("✅ Créditos acreditados:", credits);
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("error");
  }
}