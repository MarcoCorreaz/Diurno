import type { VercelRequest, VercelResponse } from "@vercel/node";
import { render } from "@react-email/render";
import { sendEmail } from "./_lib/resend";
import WelcomeEmail from "./_lib/email-templates/welcome";
import React from "react";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  // Basic authentication using a shared secret configured in Supabase Webhooks
  const secret = process.env.SEND_EMAIL_HOOK_SECRET;
  
  if (!secret) {
    return res.status(500).json({ error: "SEND_EMAIL_HOOK_SECRET não configurada" });
  }

  const authHeader = req.headers["authorization"] || req.headers["x-supabase-signature"];
  
  if (authHeader !== `Bearer ${secret}` && authHeader !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = req.body;
    // Payload for Supabase Auth Custom Email Hook
    const { user, email_data } = payload;
    
    if (!user || !user.email) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const type = email_data?.email_action_type;
    const name = user.user_metadata?.full_name || user.user_metadata?.displayName || user.email.split("@")[0];

    if (type === "signup") {
      const html = await render(React.createElement(WelcomeEmail, { name }));
      await sendEmail({
        to: user.email,
        subject: "Bem-vindo ao Rituno! 🎉",
        html
      });
      return res.status(200).json({ success: true });
    }
    
    // For other types (like recovery), you would implement other templates here.
    // For now, we return 200 so the hook doesn't fail, but note that the email might not be sent
    // if Supabase is configured to rely entirely on this hook.
    console.log("[Send Email Hook] Unhandled email type:", type);
    return res.status(200).json({ success: true, warning: "Email type not handled" });

  } catch (error) {
    console.error("[Send Email Hook] Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
