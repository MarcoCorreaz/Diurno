import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/composed/Logo";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function PrivacyPolicy() {
  const privacyEmail = import.meta.env.VITE_PRIVACY_EMAIL || "privacidade@rituno.com.br";

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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Política de Privacidade — {BRAND.name}</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 12 de agosto de 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Identificação</h2>
            <p>O <strong>{BRAND.name}</strong> é operado por Marco Antônio Lopes Corrêa, pessoa física, domiciliado em Cuiabá/MT.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Coleta de Dados</h2>
            <p>Coletamos dados necessários para a prestação do serviço, incluindo:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Cadastro e Autenticação (Nome, E-mail);</li>
              <li>Perfil e Preferências de Usuário;</li>
              <li>Conteúdo inserido (Onboarding, Tarefas, Hábitos);</li>
              <li>Dados Técnicos, de Navegação e Logs essenciais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Inteligência Artificial (Gemini)</h2>
            <p>
              O conteúdo enviado aos recursos de inteligência artificial é processado pela Google através da Gemini API. As condições de utilização desses dados dependem da modalidade do serviço. Em modalidades pagas elegíveis, a Google informa que prompts e respostas não são utilizados para melhorar seus produtos. Em modalidades gratuitas, o conteúdo pode ser utilizado para melhoria dos serviços conforme os termos aplicáveis.
            </p>
            <p className="mt-2 text-foreground font-medium border-l-2 border-primary pl-4">
              <strong>Importante:</strong> Recomendamos expressamente que você não envie dados pessoais sensíveis desnecessários, prontuários, senhas, documentos confidenciais ou informações médicas detalhadas em suas interações com a IA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Pagamentos (Asaas)</h2>
            <p>Os pagamentos são processados pelo Asaas. Dados financeiros sensíveis (como números completos de cartão de crédito) não são armazenados em nossos servidores.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Bases Legais e Compartilhamento</h2>
            <p>Seus dados são tratados mediante seu consentimento, para a execução do contrato (Termos de Uso), ou para o cumprimento de obrigações legais. Compartilhamos dados apenas com operadores estritamente necessários para o funcionamento da plataforma (provedores de infraestrutura, IA e pagamentos).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Transferências Internacionais</h2>
            <p>Utilizamos serviços de infraestrutura globais. Informamos que transferências internacionais serão realizadas de acordo com os mecanismos legalmente aplicáveis previstos na LGPD e regulamentação da ANPD.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Direitos dos Titulares (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso, correção, atualização ou portabilidade dos dados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados tratados em desconformidade com a lei;</li>
              <li>Eliminação de dados tratados com seu consentimento;</li>
              <li>Informação sobre o compartilhamento de dados;</li>
              <li>Revogação do consentimento e oposição ao tratamento;</li>
              <li>Revisão de decisões automatizadas nos casos previstos em lei.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Cookies e Segurança</h2>
            <p>Utilizamos cookies e tecnologias semelhantes unicamente essenciais para autenticação, segurança e preferências locais para o funcionamento do serviço. Empregamos medidas de segurança técnicas para proteger seus dados contra acessos não autorizados ou incidentes.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Menores de Idade</h2>
            <p>O {BRAND.name} é um serviço destinado a pessoas com 18 anos ou mais. Não coletamos intencionalmente dados de menores de idade.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Contato e Retenção</h2>
            <p>Mantemos seus dados pelo tempo necessário à prestação dos serviços. Para exercer seus direitos, entre em contato através do nosso Canal de Privacidade: <a href={`mailto:${privacyEmail}`} className="text-foreground hover:underline">{privacyEmail}</a>.</p>
          </section>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>&copy; {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
