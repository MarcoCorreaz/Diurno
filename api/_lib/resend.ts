import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "Rituno <noreply@rituno.com.br>";

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY não configurada. E-mail não enviado para", to, "com assunto:", subject);
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("[Email Error] Falha ao enviar email via Resend:", error);
    throw error;
  }
}
