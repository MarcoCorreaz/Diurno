import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface PaymentFailedEmailProps {
  name: string;
}

export default function PaymentFailedEmail({ name }: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Aviso: Problema com seu pagamento no Rituno</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Falha no Pagamento ⚠️</Heading>
          <Text style={text}>
            Olá, {name}. Identificamos um problema ao processar a cobrança da sua 
            assinatura do Rituno.
          </Text>
          <Text style={text}>
            Para não perder acesso aos seus hábitos e estatísticas Pro, por favor, atualize 
            sua forma de pagamento o mais breve possível.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://rituno.vercel.app/planos">
              Atualizar Pagamento
            </Button>
          </Section>
          <Text style={footer}>
            Se você já atualizou ou acredita que seja um engano, por favor 
            desconsidere este e-mail.
            <br /><br />
            Equipe Rituno
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = { margin: "0 auto", padding: "20px 0 48px", maxWidth: "580px" };
const h1 = { color: "#18181b", fontSize: "24px", fontWeight: "600", lineHeight: "40px", margin: "0 0 20px" };
const text = { color: "#52525b", fontSize: "16px", lineHeight: "24px", marginBottom: "16px" };
const btnContainer = { textAlign: "center" as const, marginTop: "32px", marginBottom: "32px" };
const button = { backgroundColor: "#18181b", borderRadius: "8px", color: "#fff", fontSize: "16px", fontWeight: "600", textDecoration: "none", textAlign: "center" as const, display: "inline-block", padding: "12px 24px" };
const footer = { color: "#a1a1aa", fontSize: "14px", lineHeight: "24px", marginTop: "48px" };
