import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  try {
    
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    const { userId, pack } = body;

    if (!userId || !pack) {
      return res.status(400).json({ error: "Missing data", body });
    }

    const packs = {
      pack5: { title: "5 Lecturas", price: 1000, credits: 5 },
      single: { title: "Lectura individual", price: 500, credits: 1 },
    };

    const selected = packs[pack];

    if (!selected) {
      return res.status(400).json({ error: "Invalid pack", pack });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: selected.title,
            unit_price: selected.price,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          credits: selected.credits,
        },
        back_urls: {
          success: `${process.env.APP_URL}?payment=success&pack=${pack}`,
          failure: `${process.env.APP_URL}?payment=fail`,
          pending: `${process.env.APP_URL}?payment=pending`,
        },
      },
    });

    const url = response.init_point || response.sandbox_init_point;

    if (!url) {
      console.error("MP BAD RESPONSE:", response);
      return res.status(500).json({ error: "No init_point" });
    }

    return res.status(200).json({ init_point: url });

  } catch (error) {
    console.error("MP ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}