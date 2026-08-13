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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao Rituno! Prepare-se para organizar sua rotina.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bem-vindo, {name}! 🎉</Heading>
          <Text style={text}>
            Estamos muito felizes em ter você no Rituno. O primeiro passo para uma vida mais equilibrada 
            começa pela organização da sua rotina.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://rituno.vercel.app/dashboard">
              Acessar Meu Dashboard
            </Button>
          </Section>
          <Text style={footer}>
            Se precisar de qualquer ajuda, basta responder a este e-mail.
            <br />
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

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#18181b",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "48px",
};
