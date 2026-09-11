import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const body = req.body;

    // validate type
    if (!body || body.type !== "payment") {
      return res.status(200).send("ignored");
    }

    const paymentId = body.data.id;

    // fetch real payment info
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await response.json();

    // validate that it's approved
    if (payment.status !== "approved") {
      return res.status(200).send("not approved");
    }

    const { userId, credits } = payment.metadata;

    if (!userId || !credits) {
      return res.status(400).send("missing metadata");
    }

    const key = `credits:paid:${userId}`;

    //  avoid duplicates (KEY)
    const alreadyProcessed = await redis.get(`payment:${paymentId}`);
    if (alreadyProcessed) {
      return res.status(200).send("already processed");
    }

    const current = (await redis.get(key)) || 0;

    await redis.set(key, current + credits);

    // mark payment as processed
    await redis.set(`payment:${paymentId}`, 1);

    console.log("✅ Créditos acreditados:", credits);

    return res.status(200).send("ok");

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("error");
  }
}