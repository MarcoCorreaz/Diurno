import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  const authToken = req.headers["asaas-access-token"] as string;
  const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET as string;

  if (!webhookSecret) {
    console.error("ASAAS_WEBHOOK_SECRET is not configured.");
    return res.status(500).json({ error: "Webhook Secret is missing" });
  }

  if (!authToken) {
    return res.status(401).json({ error: "Missing authToken" });
  }

  // Prevents timing attacks
  const isAuthorized = authToken.length === webhookSecret.length && 
                       crypto.timingSafeEqual(Buffer.from(authToken), Buffer.from(webhookSecret));

  if (!isAuthorized) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const { event, payment } = req.body;
    
    if (!event || !payment) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseServiceRole || process.env.VITE_SUPABASE_ANON_KEY as string);

    const customerId = payment.customer;

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      // payment.description might have the plan, or we check subscription
      const plan = payment.description?.toLowerCase().includes("vitalício") ? "lifetime" : "pro";
      
      console.log(`Atualizando plano para ${plan} com cliente ${customerId}`);
      await supabase
        .from("profiles")
        .update({ plan })
        .eq("asaas_customer_id", customerId);
    } 
    else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_DELETED" || event === "PAYMENT_REFUNDED") {
      console.log(`Assinatura cancelada/expirada para cliente ${customerId}. Voltando para plano Free.`);
      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("asaas_customer_id", customerId);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Internal Webhook Error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
