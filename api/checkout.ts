import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any, // Ignorando o erro de tipo da versão do pacote
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { planName, cycle, userId } = req.body;

    if (!planName || !cycle || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const priceId = planName === "Pro" && cycle === "monthly" ? process.env.STRIPE_PRICE_PRO_MONTHLY
                  : planName === "Pro" && cycle === "yearly" ? process.env.STRIPE_PRICE_PRO_YEARLY
                  : planName === "Vitalício" ? process.env.STRIPE_PRICE_LIFETIME : null;

    // Fallback if priceIds are not set (uses dynamic price_data)
    const amount = planName === "Pro" && cycle === "monthly" ? 1700 
                 : planName === "Pro" && cycle === "yearly" ? 16700
                 : planName === "Vitalício" ? 19700 : 0;

    if (!priceId && amount === 0) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const lineItem = priceId 
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Diurno ${planName}`,
            },
            unit_amount: amount,
            recurring: planName === "Vitalício" ? undefined : {
              interval: cycle === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: planName === "Vitalício" ? "payment" : "subscription",
      line_items: [lineItem as any],
      success_url: `${process.env.APP_URL || "http://localhost:5173"}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:5173"}/cancelado`,
      client_reference_id: userId,
      metadata: {
        userId,
        plan: planName.toLowerCase(),
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
