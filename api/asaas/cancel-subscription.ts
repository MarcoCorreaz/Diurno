import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized." });
    
    const token = authHeader.split(" ")[1];
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY as string;
    const supabaseAuthClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY as string);
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized." });

    const { data: profile } = await supabaseAdmin.from("profiles").select("asaas_customer_id").eq("id", user.id).single();

    if (!profile?.asaas_customer_id) {
      return res.status(400).json({ error: "Cliente não possui ID Asaas." });
    }

    const asaasUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
    const asaasKey = process.env.ASAAS_API_KEY as string;

    // Buscar assinaturas ativas do cliente
    const subRes = await fetch(`${asaasUrl}/subscriptions?customer=${profile.asaas_customer_id}&status=ACTIVE`, {
      method: "GET",
      headers: { "access_token": asaasKey }
    });
    const subData = await subRes.json();

    if (!subData.data || subData.data.length === 0) {
      return res.status(400).json({ error: "Nenhuma assinatura ativa encontrada." });
    }

    // Cancela a primeira assinatura encontrada
    const subscriptionId = subData.data[0].id;

    const cancelRes = await fetch(`${asaasUrl}/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: { "access_token": asaasKey }
    });
    const cancelData = await cancelRes.json();

    if (!cancelRes.ok) {
      return res.status(400).json({ error: cancelData });
    }

    // Downgrade to free explicitly, though webhook also catches this
    await supabaseAdmin.from("profiles").update({ plan: "free" }).eq("id", user.id);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
