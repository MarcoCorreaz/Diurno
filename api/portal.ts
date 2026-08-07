import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

function asaasBaseUrl(): string {
  return (process.env.ASAAS_API_URL || "https://api-sandbox.asaas.com/v3").replace(/\/$/, "");
}

async function cancelSubscription(subscriptionId: string) {
  const response = await fetch(`${asaasBaseUrl()}/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Diurno/1.0 (Vercel)",
      access_token: process.env.ASAAS_API_KEY || "",
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.errors?.[0]?.description || body?.message || "Não foi possível cancelar a assinatura.");
  }
  return body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "Sessão inválida ou ausente." });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !process.env.ASAAS_API_KEY) {
    return res.status(500).json({ error: "Configuração de cobrança incompleta." });
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Sessão expirada." });

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("plan, billing_status, billing_cycle, asaas_subscription_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return res.status(404).json({ error: "Perfil não encontrado." });

  const action = req.body?.action || "status";
  if (action === "status") {
    return res.status(200).json({
      plan: profile.plan,
      status: profile.billing_status,
      cycle: profile.billing_cycle,
      canCancel: Boolean(profile.asaas_subscription_id),
    });
  }

  if (action !== "cancel") {
    return res.status(400).json({ error: "Ação inválida." });
  }

  if (!profile.asaas_subscription_id) {
    return res.status(409).json({ error: "Este plano não possui assinatura recorrente para cancelar." });
  }

  try {
    await cancelSubscription(profile.asaas_subscription_id);

    const { error: updateError } = await admin.from("profiles").update({
      plan: "free",
      billing_status: "canceled",
      asaas_subscription_id: null,
    }).eq("id", user.id).eq("asaas_subscription_id", profile.asaas_subscription_id);

    if (updateError) throw updateError;
    return res.status(200).json({ canceled: true });
  } catch (error: any) {
    console.error("Asaas subscription management error:", error);
    return res.status(502).json({ error: error?.message || "Não foi possível cancelar a assinatura." });
  }
}
