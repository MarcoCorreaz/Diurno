import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/composed/Logo";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function TermsOfUse() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || "suporte@rituno.com.br";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center h-16 px-6 gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mr-auto">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Logo />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Termos de Uso — {BRAND.name}</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 12 de agosto de 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Aceitação</h2>
            <p>Bem-vindo ao <strong>{BRAND.name}</strong>, operado por Marco Antônio Lopes Corrêa, domiciliado em Cuiabá/MT. Ao criar uma conta e utilizar o {BRAND.name}, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Elegibilidade</h2>
            <p>O {BRAND.name} destina-se a pessoas com 18 anos ou mais. Ao utilizar o serviço, você declara ter a capacidade jurídica necessária para aceitar estes termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. A Conta</h2>
            <p>Você é responsável por manter a confidencialidade das credenciais de acesso à sua conta e por todas as atividades que nela ocorrerem. O uso não autorizado de sua conta deve ser notificado imediatamente.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Assinaturas e Pagamentos</h2>
            <p>Os pagamentos são processados pela plataforma parceira Asaas. Ao assinar um plano, você concorda com o faturamento recorrente (ou vitalício, conforme o caso). Você pode cancelar a qualquer momento sem custos adicionais, mantendo acesso até o final do ciclo de faturamento atual.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Cancelamento e Exclusão de Dados</h2>
            <p>O cancelamento da assinatura suspende cobranças futuras. Caso deseje excluir definitivamente seus dados pessoais e sua conta do {BRAND.name}, você pode solicitar através das configurações do seu perfil ou contatando o nosso suporte.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Propriedade Intelectual</h2>
            <p>O design, funcionalidades, e a marca {BRAND.name} são protegidos por direitos de propriedade intelectual. É proibida a reprodução ou cópia não autorizada do serviço.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Modificações dos Termos</h2>
            <p>Podemos atualizar estes Termos ocasionalmente. Notificaremos os usuários sobre mudanças significativas, e a continuação do uso implicará na aceitação das novas regras.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Contato</h2>
            <p>Para dúvidas ou suporte, entre em contato através de: <a href={`mailto:${supportEmail}`} className="text-foreground hover:underline">{supportEmail}</a>.</p>
          </section>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>&copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
