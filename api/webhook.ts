import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

type AsaasCheckoutEvent = {
  id?: string;
  event?: "CHECKOUT_CREATED" | "CHECKOUT_PAID" | "CHECKOUT_CANCELED" | "CHECKOUT_EXPIRED" | string;
  checkout?: {
    id?: string;
    status?: string;
    customer?: string | null;
    subscription?: { id?: string } | null;
  };
};

function timingSafeEqualText(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return result === 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedHeader = req.headers["asaas-access-token"];
  const receivedToken = Array.isArray(receivedHeader) ? receivedHeader[0] : receivedHeader;

  if (!expectedToken || !receivedToken || !timingSafeEqualText(receivedToken, expectedToken)) {
    return res.status(401).json({ error: "Webhook não autorizado." });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Configuração do webhook incompleta." });
  }

  const event = req.body as AsaasCheckoutEvent;
  const eventId = event?.id;
  const eventType = event?.event;
  const checkoutId = event?.checkout?.id;

  if (!eventId || !eventType || !checkoutId) {
    return res.status(400).json({ error: "Payload de webhook inválido." });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { error: eventInsertError } = await admin.from("billing_webhook_events").insert({
    event_id: eventId,
    event_type: eventType,
    checkout_id: checkoutId,
  });

  if (eventInsertError?.code === "23505") {
    return res.status(200).json({ received: true, duplicate: true });
  }
  if (eventInsertError) {
    console.error("Erro ao registrar webhook Asaas:", eventInsertError);
    return res.status(500).json({ error: "Falha ao registrar evento." });
  }

  const { data: checkout, error: checkoutError } = await admin
    .from("billing_checkouts")
    .select("user_id, plan, cycle, status")
    .eq("checkout_id", checkoutId)
    .single();

  if (checkoutError || !checkout) {
    console.error("Checkout Asaas não encontrado:", checkoutId, checkoutError);
    return res.status(200).json({ received: true, ignored: true });
  }

  const customerId = event.checkout?.customer || null;
  const subscriptionId = event.checkout?.subscription?.id || null;

  try {
    if (eventType === "CHECKOUT_PAID") {
      const { error: updateCheckoutError } = await admin.from("billing_checkouts").update({
        status: "paid",
        asaas_customer_id: customerId,
        asaas_subscription_id: subscriptionId,
        paid_at: new Date().toISOString(),
      }).eq("checkout_id", checkoutId);
      if (updateCheckoutError) throw updateCheckoutError;

      const { error: updateProfileError } = await admin.from("profiles").update({
        plan: checkout.plan,
        billing_provider: "asaas",
        billing_status: "active",
        billing_cycle: checkout.cycle,
        asaas_checkout_id: checkoutId,
        asaas_customer_id: customerId,
        asaas_subscription_id: subscriptionId,
      }).eq("id", checkout.user_id);
      if (updateProfileError) throw updateProfileError;
    } else if (eventType === "CHECKOUT_CANCELED" || eventType === "CHECKOUT_EXPIRED") {
      const status = eventType === "CHECKOUT_CANCELED" ? "canceled" : "expired";
      const { error: updateCheckoutError } = await admin
        .from("billing_checkouts")
        .update({ status })
        .eq("checkout_id", checkoutId)
        .neq("status", "paid");
      if (updateCheckoutError) throw updateCheckoutError;

      if (checkout.status !== "paid") {
        const { error: updateProfileError } = await admin.from("profiles").update({
          billing_status: status,
        }).eq("id", checkout.user_id).eq("asaas_checkout_id", checkoutId);
        if (updateProfileError) throw updateProfileError;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    await admin.from("billing_webhook_events").delete().eq("event_id", eventId);
    console.error("Erro ao processar webhook Asaas:", error);
    return res.status(500).json({ error: "Falha ao processar evento." });
  }
}
