import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "../_lib/rate-limit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  const { success } = await checkRateLimit(req, { limit: 5, window: "1m" });
  if (!success) return res.status(429).json({ error: "Too many requests. Tente novamente em 1 minuto." });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized." });
    
    const token = authHeader.split(" ")[1];
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Configuração do Supabase ausente nas variáveis de ambiente." });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized." });

    const { planName, cycle, customerId } = req.body;
    if (!planName || !cycle || !customerId) return res.status(400).json({ error: "Missing required fields" });

    const asaasUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
    const asaasKey = process.env.ASAAS_API_KEY as string;
    let invoiceUrl = "";

    if (planName === "Vitalício") {
      const amount = 197.00;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);

      const asaasRes = await fetch(`${asaasUrl}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "access_token": asaasKey },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: amount,
          dueDate: dueDate.toISOString().split("T")[0],
          description: "Plano Vitalício Rituno"
        })
      });
      const data = await asaasRes.json();
      if (!asaasRes.ok) return res.status(400).json({ error: data });
      invoiceUrl = data.invoiceUrl;
    } else {
      const amount = cycle === "yearly" ? 167.00 : 17.00;
      const asaasRes = await fetch(`${asaasUrl}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "access_token": asaasKey },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: amount,
          nextDueDate: new Date().toISOString().split("T")[0],
          cycle: cycle === "yearly" ? "YEARLY" : "MONTHLY",
          description: `Plano Pro ${cycle === "yearly" ? "Anual" : "Mensal"} Rituno`
        })
      });
      const data = await asaasRes.json();
      if (!asaasRes.ok) return res.status(400).json({ error: data });
      
      // Busca a primeira cobrança da assinatura para obter o link de pagamento
      const subId = data.id;
      const paymentsRes = await fetch(`${asaasUrl}/payments?subscription=${subId}`, {
        method: "GET",
        headers: { "access_token": asaasKey }
      });
      const paymentsData = await paymentsRes.json();
      if (paymentsData.data && paymentsData.data.length > 0) {
        invoiceUrl = paymentsData.data[0].invoiceUrl;
      } else {
        return res.status(500).json({ error: "Não foi possível gerar a fatura da assinatura." });
      }
    }

    return res.status(200).json({ url: invoiceUrl });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
