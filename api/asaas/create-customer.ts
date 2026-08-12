import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Missing token." });
    }
    const token = authHeader.split(" ")[1];

    const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY as string;
    const supabaseAuthClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY as string);
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey); // To bypass RLS on update

    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized. Invalid token." });

    const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", user.id).single();

    if (profile?.asaas_customer_id) {
      return res.status(200).json({ customerId: profile.asaas_customer_id });
    }

    const asaasUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
    const asaasKey = process.env.ASAAS_API_KEY as string;

    const asaasRes = await fetch(`${asaasUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": asaasKey
      },
      body: JSON.stringify({
        name: profile?.name || user.email?.split("@")[0] || "Usuário Rituno",
        email: user.email,
        externalReference: user.id
      })
    });

    const asaasData = await asaasRes.json();
    if (!asaasRes.ok) {
      return res.status(asaasRes.status).json({ error: asaasData });
    }

    // Grava com Service Role
    await supabaseAdmin.from("profiles").update({ asaas_customer_id: asaasData.id }).eq("id", user.id);

    return res.status(200).json({ customerId: asaasData.id });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
