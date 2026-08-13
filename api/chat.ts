import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "./_lib/rate-limit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para chamadas na Vercel
  const allowedOrigin = process.env.APP_URL || process.env.VITE_APP_URL || "https://rituno.vercel.app";
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { success } = await checkRateLimit(req, { limit: 10, window: "1m" });
  if (!success) {
    return res.status(429).json({ error: "Too many requests. Tente novamente em 1 minuto." });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Missing token." });
    }
    const token = authHeader.split(" ")[1];

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
       return res.status(500).json({ error: "Missing Supabase configuration." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return res.status(500).json({ error: "GEMINI_API_KEY não está configurada no ambiente da Vercel." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(502).json({ error: "Erro ao se comunicar com a IA. Tente novamente." });
  }
}
