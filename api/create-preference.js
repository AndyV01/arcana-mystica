import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
    try {
        const { userId, pack } = req.body;

        const packs = {
            pack5: { title: "5 Lecturas", price: 2, credits: 5 },
            single: { title: "Lectura individual", price: 0.5, credits: 1 },
        };

        const selected = packs[pack];

        if (!selected) {
            return res.status(400).json({ error: "Invalid pack" });
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

        res.json({
            init_point: response.init_point,
        });

    } catch (error) {
        console.error("MP ERROR:", error);
        res.status(500).json({ error: error.message });
    }
}