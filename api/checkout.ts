import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
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

    // Map plans to actual Stripe Prices or hardcode amounts for demo
    const amount = planName === "Pro" && cycle === "monthly" ? 2900 
                 : planName === "Pro" && cycle === "yearly" ? 29000
                 : planName === "Vitalício" ? 49900 : 0;

    if (amount === 0) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: cycle === "yearly" && planName === "Vitalício" ? "payment" : "subscription",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Diurno ${planName}`,
            },
            unit_amount: amount,
            recurring: cycle === "yearly" && planName === "Vitalício" ? undefined : {
              interval: cycle === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL || "http://localhost:5173"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:5173"}/planos`,
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
