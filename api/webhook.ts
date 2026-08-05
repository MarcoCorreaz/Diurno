import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } else {
      event = req.body;
    }
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id || session.metadata?.userId;
      let plan = session.metadata?.plan || "pro"; 

      if (userId) {
        console.log(`Atualizando plano do usuário ${userId} para ${plan}`);
        
        const { error } = await supabase
          .from("profiles")
          .update({ plan: plan.charAt(0).toUpperCase() + plan.slice(1) })
          .eq("id", userId);

        if (error) {
          console.error("Erro ao atualizar Supabase:", error);
          throw error;
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Internal Webhook Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
