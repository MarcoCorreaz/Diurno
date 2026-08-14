<div align="center">
  <img src="./public/favicon.ico" alt="Rituno Logo" width="80" />
  <h1>Rituno</h1>
  <p><em>Rastreador de hábitos diários focado em experiência do usuário, streaks e gamificação leve.</em></p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite_6-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite 6" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>

  <p>
    <a href="https://rituno.vercel.app" target="_blank"><strong>→ Acessar o App</strong></a>
    &nbsp;•&nbsp;
    <a href="#-como-executar-localmente">Rodar Localmente</a>
    &nbsp;•&nbsp;
    <a href="#️-arquitetura">Arquitetura</a>
  </p>
</div>

---

## 📖 Sobre o Projeto

O **Rituno** nasceu de uma insatisfação pessoal com os apps de hábitos disponíveis: cheios de notificações agressivas, paywalls confusos e interfaces poluídas. Queria um app que fosse **bonito de usar todos os dias**, com feedback visual real e que não atrapalhasse a rotina.

O desafio técnico foi construir uma experiência que parecesse nativa — animações fluidas, respostas instantâneas, sistema de streak consistente — em cima de uma stack 100% serverless e gratuita.

> Este é um projeto pessoal em validação. Está 100% gratuito e aberto para uso.

---

## ✨ Funcionalidades

| Feature | Detalhe |
|---|---|
| 📊 **Dashboard Diário** | Visão dos hábitos de hoje com conclusão em um toque e animação de confete ao bater a meta |
| 🔥 **Sistema de Streak** | Sequências calculadas via trigger PostgreSQL (`AFTER INSERT OR DELETE`) com recálculo retroativo |
| 📅 **Planejador Semanal** | Distribua hábitos em dias específicos da semana com drag-free UX |
| 🤖 **Assistente de IA** | Chat contextual com Gemini para sugestão de melhores distribuições de rotina |
| ⏱️ **Pomodoro Integrado** | Timer de foco nativo, sem sair do app |
| 🌙 **Dark Mode Nativo** | Tema claro/escuro/sistema persistido sem flash no carregamento |
| 📱 **PWA Instalável** | Funciona como app nativo no Android e no iOS via `vite-plugin-pwa` |
| 🔐 **Auth Completa** | Email/senha + Google OAuth, fluxo de onboarding guiado e reset de senha |
| 🗑️ **Exclusão de Conta** | Endpoint serverless com `service_role`, cascade delete em PostgreSQL (conformidade LGPD) |

---

## 🏗️ Arquitetura

A aplicação segue um modelo **BFF Serverless** — o frontend React comunica diretamente com o Supabase para operações de dados, enquanto lógica sensível (envio de e-mail, exclusão de conta) roda em **API Functions Node.js na Vercel**.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                       │
│              React 19 + Vite 6 + TailwindCSS 4                  │
│   GSAP (onboarding) • Framer Motion (UI) • Lenis (scroll)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────────┐
          │              │                  │
          ▼              ▼                  ▼
   Supabase Auth   Supabase DB         Vercel Edge
   (Google OAuth   (PostgreSQL +       API Functions
    + Email/Pass)   Row Level           /api/send-email
                    Security)           /api/account/delete
                         │
                         ▼
                   Google Gemini API
                   (chat de sugestão
                    de rotina)
```

### Decisões de Design Notáveis

**Streak via Database Trigger** — Em vez de calcular o streak no frontend (propenso a race conditions), toda atualização dispara um trigger PostgreSQL `AFTER INSERT OR DELETE ON task_completions` que recalcula atomicamente `current_streak`, `max_streak` e `total_completions` na tabela `tasks`. Garante consistência mesmo com múltiplos dispositivos.

**`VITE_FREE_FOR_ALL` Feature Flag** — O sistema de cobrança está implementado e pronto, mas desativado via env var. Isso permite ligar e desligar o paywall sem nenhuma alteração de código — reverter para o modo pago é questão de mudar uma variável na Vercel.

**Serverless para operações privilegiadas** — Envio de e-mail transacional (Resend) e exclusão de conta (Supabase Admin API) rodam em funções Node.js na Vercel com `service_role`, nunca expondo chaves privilegiadas ao browser.

---

## 🛠️ Stack Completa

**Frontend**
- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** com design system próprio (tokens de cor, tipografia Geist)
- **GSAP 3** (animações de onboarding com `ScrollTrigger` e `useGSAP`)
- **Framer Motion** (transições de página e micro-interações)
- **Lenis** (scroll inercial suave)
- **Recharts** (gráficos de progresso no perfil)
- **Sonner** (toast notifications)
- **shadcn/ui** + **Base UI** (primitivas acessíveis)

**Backend & Infraestrutura**
- **Supabase** — Auth, PostgreSQL (RLS + Triggers), Storage (avatares)
- **Vercel** — Hospedagem + API Functions (Node.js / TypeScript)
- **Resend + React Email** — Templates de e-mail transacional
- **Google Gemini API** — LLM para o assistente de rotina
- **PostHog** — Product analytics (eventos de engajamento)
- **Sentry** — Error monitoring em produção

---

## 📁 Estrutura de Pastas

```
rituno/
├── api/                        # Vercel Serverless Functions (Node.js)
│   ├── account/
│   │   └── delete.ts           # Endpoint de exclusão de conta (service_role)
│   ├── send-email.ts           # Hook de e-mail transacional (Resend)
│   └── _lib/
│       ├── resend.ts           # Cliente Resend
│       └── email-templates/    # Templates React Email
├── public/                     # Assets estáticos e manifesto PWA
├── src/
│   ├── app/                    # Páginas por rota (Feature-Based)
│   │   ├── auth/               # Login, Register, ForgotPassword
│   │   ├── dashboard/          # Dashboard principal de hábitos
│   │   ├── onboarding/         # Fluxo inicial com GSAP
│   │   ├── profile/            # Perfil do usuário
│   │   ├── rotina/             # Planejador semanal
│   │   ├── settings/           # Configurações e Zona de Perigo
│   │   └── subscription/       # Tela de planos (pronta, desativada por flag)
│   ├── components/
│   │   ├── effects/            # Componentes de efeito visual (Confetti, etc.)
│   │   ├── layout/             # Sidebar, AuthLayout
│   │   ├── modals/             # Sheets e modais globais
│   │   └── ui/                 # Primitivas de design system
│   ├── contexts/
│   │   └── AuthContext.tsx     # Estado global de autenticação + PostHog identify
│   ├── hooks/                  # Custom hooks (useLenis, useNotifications, etc.)
│   └── lib/                    # Clientes externos (supabase.ts, utils.ts)
└── supabase/
    └── migrations/             # Histórico de migrations SQL versionado
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- **Node.js** 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Resend](https://resend.com) (gratuita para até 3.000 e-mails/mês)

### 1. Clone e instale as dependências

```bash
git clone https://github.com/MarcoCorreaz/Rituno.git
cd Rituno
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas chaves:

```bash
cp .env.example .env
```

```env
# Supabase (obrigatório)
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend - envio de e-mail (obrigatório para e-mails de boas-vindas)
RESEND_API_KEY=re_xxxxxxxxxxxx
SEND_EMAIL_HOOK_SECRET=um-segredo-aleatorio-forte

# Google Gemini - assistente de IA (obrigatório para o chat)
VITE_GEMINI_API_KEY=AIzaSy...

# Modo gratuito: desativa todos os paywalls (opcional, padrão: false)
VITE_FREE_FOR_ALL=true

# PostHog - analytics (opcional)
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxx
```

### 3. Execute as migrations no Supabase

No **SQL Editor** do seu projeto Supabase, execute os arquivos em `supabase/migrations/` na ordem numérica (do mais antigo para o mais novo).

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## 🔑 Variáveis de Ambiente — Referência Completa

| Variável | Onde Obter | Obrigatório |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | ✅ (server-side only) |
| `RESEND_API_KEY` | resend.com → API Keys | ✅ |
| `SEND_EMAIL_HOOK_SECRET` | Qualquer string aleatória segura | ✅ |
| `VITE_GEMINI_API_KEY` | aistudio.google.com | ✅ |
| `VITE_FREE_FOR_ALL` | `"true"` ou `"false"` | ❌ |
| `VITE_POSTHOG_KEY` | posthog.com → Project Settings | ❌ |

---

## 📄 Licença

MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  <p>Feito com 💙 por <a href="https://github.com/MarcoCorreaz">Marco Correaz</a></p>
  <p><a href="https://rituno.vercel.app">rituno.vercel.app</a></p>
</div>
