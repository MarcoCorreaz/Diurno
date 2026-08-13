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
} from "@react-email/components";

interface ReceiptEmailProps {
  name: string;
  plan: string;
  value: number;
  date: string;
}

export default function ReceiptEmail({ name, plan, value, date }: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Seu recibo de pagamento do Rituno</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pagamento Confirmado! ✅</Heading>
          <Text style={text}>
            Olá, {name}. Seu pagamento foi processado com sucesso.
          </Text>
          
          <Section style={receiptBox}>
            <Text style={receiptRow}>
              <strong>Plano:</strong> {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Text>
            <Text style={receiptRow}>
              <strong>Valor:</strong> R$ {value.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={receiptRow}>
              <strong>Data:</strong> {new Date(date).toLocaleDateString('pt-BR')}
            </Text>
          </Section>

          <Text style={footer}>
            Este é apenas um recibo de pagamento. Para solicitar a nota fiscal, 
            responda a este e-mail com seus dados (CPF/CNPJ e endereço completo).
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

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const h1 = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#52525b",
  fontSize: "16px",
  lineHeight: "24px",
};

const receiptBox = {
  backgroundColor: "#f4f4f5",
  padding: "20px",
  borderRadius: "8px",
  marginTop: "24px",
  marginBottom: "24px",
};

const receiptRow = {
  color: "#3f3f46",
  fontSize: "16px",
  margin: "8px 0",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "48px",
};
