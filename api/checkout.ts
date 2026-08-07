import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const PLANS = {
  Pro: {
    monthly: { value: 17, cycle: "MONTHLY" },
    yearly: { value: 167, cycle: "YEARLY" },
  },
  "Vitalício": {
    monthly: { value: 197, cycle: null },
    yearly: { value: 197, cycle: null },
  },
} as const;

type PlanName = keyof typeof PLANS;
type BillingCycle = "monthly" | "yearly";

function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

function asaasBaseUrl(): string {
  return (process.env.ASAAS_API_URL || "https://api-sandbox.asaas.com/v3").replace(/\/$/, "");
}

function asaasCheckoutUrl(checkoutId: string): string {
  const configured = process.env.ASAAS_CHECKOUT_URL?.replace(/\/$/, "");
  if (configured) return `${configured}?id=${encodeURIComponent(checkoutId)}`;

  const host = asaasBaseUrl().includes("api-sandbox")
    ? "https://sandbox.asaas.com"
    : "https://asaas.com";
  return `${host}/checkoutSession/show?id=${encodeURIComponent(checkoutId)}`;
}

function formatAsaasDateTime(date: Date): string {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

async function asaasRequest(path: string, init: RequestInit = {}) {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("ASAAS_API_KEY não configurada.");

  const response = await fetch(`${asaasBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Diurno/1.0 (Vercel)",
      access_token: apiKey,
      ...(init.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description = body?.errors?.[0]?.description || body?.message || "Erro na API do Asaas.";
    throw new Error(description);
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
  const appUrl = process.env.APP_URL;

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !appUrl || !process.env.ASAAS_API_KEY) {
    return res.status(500).json({ error: "Configuração de cobrança incompleta no servidor." });
  }

  const { planName, cycle } = req.body as { planName?: PlanName; cycle?: BillingCycle };
  if (!planName || !cycle || !PLANS[planName]?.[cycle]) {
    return res.status(400).json({ error: "Plano ou ciclo de cobrança inválido." });
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: "Sessão expirada." });

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return res.status(409).json({ error: "Finalize seu perfil antes de assinar um plano." });
  }

  const plan = PLANS[planName][cycle];
  const orderReference = `${user.id}:${planName}:${cycle}:${randomUUID()}`;
  const isLifetime = planName === "Vitalício";
  const now = new Date();

  const payload: Record<string, unknown> = {
    billingTypes: isLifetime ? ["PIX", "CREDIT_CARD"] : ["CREDIT_CARD"],
    chargeTypes: [isLifetime ? "DETACHED" : "RECURRENT"],
    minutesToExpire: 60,
    externalReference: orderReference,
    callback: {
      successUrl: `${appUrl.replace(/\/$/, "")}/sucesso`,
      cancelUrl: `${appUrl.replace(/\/$/, "")}/cancelado`,
      expiredUrl: `${appUrl.replace(/\/$/, "")}/cancelado?motivo=expirado`,
    },
    items: [{
      name: `Diurno ${planName}`,
      description: isLifetime
        ? "Acesso vitalício ao Diurno"
        : `Assinatura ${cycle === "yearly" ? "anual" : "mensal"} do Diurno Pro`,
      quantity: 1,
      value: plan.value,
    }],
    customerData: {
      name: profile.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Cliente Diurno",
      email: profile.email || user.email,
    },
  };

  if (!isLifetime) {
    payload.subscription = {
      cycle: plan.cycle,
      nextDueDate: formatAsaasDateTime(now),
    };
  }

  try {
    const checkout = await asaasRequest("/checkouts", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!checkout?.id) throw new Error("O Asaas não retornou o identificador do checkout.");

    const { error: checkoutError } = await admin.from("billing_checkouts").insert({
      checkout_id: checkout.id,
      user_id: user.id,
      plan: planName,
      cycle,
      status: "active",
      external_reference: orderReference,
    });

    if (checkoutError) {
      await asaasRequest(`/checkouts/${checkout.id}/cancel`, { method: "POST", body: "{}" }).catch(() => undefined);
      throw new Error("Não foi possível registrar o checkout com segurança.");
    }

    await admin.from("profiles").update({
      asaas_checkout_id: checkout.id,
      billing_provider: "asaas",
      billing_status: "pending",
      billing_cycle: cycle,
    }).eq("id", user.id);

    return res.status(200).json({
      checkoutId: checkout.id,
      url: checkout.link || asaasCheckoutUrl(checkout.id),
    });
  } catch (error: any) {
    console.error("Asaas checkout error:", error);
    return res.status(502).json({ error: error?.message || "Não foi possível iniciar o pagamento." });
  }
}
