<div align="center">
  <img src="./public/favicon.ico" alt="Rituno Logo" width="100" />
  <h1>Rituno</h1>
  <p><em>O seu assistente pessoal de produtividade e rotina inteligente.</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  </p>
</div>

---

## 📖 Sobre o Projeto

**Rituno** é um aplicativo completo de produtividade desenhado para ajudar os usuários a criarem e manterem bons hábitos diários. Com uma interface de usuário rica e moderna (Dark Mode nativo, micro-interações, layout responsivo), o Rituno foca em uma experiência fluida para aumentar o engajamento e a disciplina.

O projeto foi construído para atuar tanto como um rastreador de hábitos focado, quanto como um assistente Pessoal — munido de IA nativa (Integração com LLM) para sugerir rotinas personalizadas e um método Pomodoro embutido.

---

## ⚡ Funcionalidades Principais

- **📊 Dashboard de Hábitos Diários**: Acompanhe o que você precisa fazer hoje. Conclua tarefas e observe seu progresso ser atualizado em tempo real com animações gratificantes (Confetti).
- **📅 Planejador Semanal (Rotina)**: Organize sua semana espalhando atividades nos respectivos dias.
- **⏱️ Pomodoro Timer Nativo**: Técnica de Foco direto no aplicativo para potencializar a execução de hábitos.
- **🤖 Assistente de IA Integrado**: Uma interface inteligente em formato de chat que interage com o usuário para sugerir melhores distribuições de rotina.
- **💰 Integração com Stripe**: Assinaturas Premium processadas de forma segura e serverless (Serverless API Functions na Vercel).
- **🔒 Autenticação e Sincronização em Nuvem**: Login rápido e banco de dados real-time utilizando Supabase.

---

## 🛠️ Arquitetura e Stack

A arquitetura frontend segue os melhores padrões para React, organizando componentes baseados em suas responsabilidades (Features x Providers x UI Layouts).

### Principais Tecnologias Utilizadas
- **Frontend Core**: React 18 + TypeScript + Vite.
- **Estilização**: Tailwind CSS com Framer Motion (para animações de Layout e Interações).
- **Gerenciamento de Gráficos**: Recharts.
- **Backend-as-a-Service**: Supabase (Auth, PostgreSQL DB, Realtime Channels).
- **Pagamentos**: Stripe (Integrado via API Routes Serverless).
- **Hospedagem**: Vercel.

### Estrutura de Pastas
```text
rituno/
├── api/                   # Serverless Functions (Vercel) para APIs privadas
├── public/                # Assets estáticos
├── src/
│   ├── app/               # Rotas e Páginas (Feature-Based)
│   ├── components/        # Componentes Reutilizáveis
│   │   ├── effects/       # Componentes de micro-interações e efeitos visuais
│   │   ├── features/      # Componentes de domínio específico (Ex: Pomodoro)
│   │   ├── layout/        # Elementos de arquitetura da UI (Ex: Sidebar)
│   │   ├── modals/        # Componentes sobrepostos
│   │   ├── providers/     # React Context Providers (Theme)
│   │   └── ui/            # UI Elements Atômicos (Botões, Inputs, Toggle)
│   ├── contexts/          # Contextos Globais (AuthContext)
│   ├── hooks/             # Custom Hooks do React
│   ├── lib/               # Clientes e Utilitários (Supabase, Stripe, Tipos)
│   └── main.tsx           # Ponto de Entrada da Aplicação
├── supabase/              # Migrações SQL e scripts do Supabase
└── tsconfig.json          # Configuração TypeScript
```

---

## 🚀 Como Executar Localmente

Siga o passo a passo abaixo para rodar o projeto em seu ambiente local.

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (Versão 18+ recomendada)
- Conta no **Supabase** (para provisionar seu banco de dados)
- Conta no **Stripe** (opcional, para testes de assinaturas)

### 2. Configurando o Ambiente
Crie um arquivo `.env` na raiz do seu projeto. Você precisará preencher as chaves de acordo com o padrão abaixo:

```env
# URL e Chave Pública do seu banco de dados Supabase
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Configuração do Stripe
STRIPE_SECRET_KEY=sua_chave_secreta_stripe_aqui

# Configuração da API do Google Gemini / IA
VITE_GEMINI_API_KEY=sua_api_key_do_gemini
APP_URL=http://localhost:5173
```

### 3. Rodando o Projeto

```bash
# Clone o repositório
git clone https://github.com/MarcoCorreaz/Rituno.git

# Entre na pasta
cd Rituno

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no seu navegador!

---

## 🛡️ Licença e Uso
Esse projeto é uma aplicação proprietária projetada por **Marco Correaz**. Para detalhes sobre permissões de uso ou contribuições, consulte as diretrizes internas da equipe.

Feito com 💙 para transformar rotinas em resultados.
