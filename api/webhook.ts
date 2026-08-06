import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Vercel config to disable body parsing so we can read the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseServiceRole) {
  console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Webhooks will fail RLS.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRole || process.env.VITE_SUPABASE_ANON_KEY as string);

// Helper to get raw body
async function getRawBody(req: VercelRequest): Promise<string> {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }
  return body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        endpointSecret
      );
    } else {
      // Fallback if no secret is provided (not recommended for production)
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error("Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id || session.metadata?.userId;
      const plan = session.metadata?.plan || "pro"; 
      const customerId = session.customer as string;

      if (userId) {
        console.log(`Atualizando plano do usuário ${userId} para ${plan} com cliente ${customerId}`);
        
        const { error } = await supabase
          .from("profiles")
          .update({ 
            plan: plan.charAt(0).toUpperCase() + plan.slice(1),
            stripe_customer_id: customerId
          })
          .eq("id", userId);

        if (error) {
          console.error("Erro ao atualizar Supabase:", error);
          throw error;
        }
      }
    } 
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      if (customerId) {
        console.log(`Assinatura cancelada/expirada para cliente ${customerId}. Voltando para plano Free.`);
        
        const { error } = await supabase
          .from("profiles")
          .update({ plan: "Free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Erro ao atualizar Supabase no downgrade:", error);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Internal Webhook Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

