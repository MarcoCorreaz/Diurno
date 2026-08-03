# Diurno Engineering & Security Standards
> Diretrizes de Governança, Qualidade e Processo inspiradas em `garrytan/gstack` (Y Combinator CEO) e na metodologia de desenvolvimento com Agentes AI.

---

## 1. Filosofia de Operação ("The Software Factory")
No Diurno, cada alteração e nova funcionalidade deve ser tratada com o rigor de uma equipe completa de engenharia especializada, atuando nos 4 papéis do rito de entrega:

```
[ CEO / Produto ] ──> [ Eng Manager ] ──> [ CSO / Segurança ] ──> [ QA & Release ]
```

---

## 2. Rito de Entrega em 4 Papéis

### I. CEO Review (Desafio de Produto & Escopo)
Antes de programar qualquer funcionalidade, faça as 4 perguntas fundamentais:
1. **Valor Real:** Por que o usuário precisa disso hoje?
2. **Escopo Mínimo (Sharp Knife):** Qual é a menor versão funcional que resolve o problema em 100%?
3. **Sem Atrito:** A funcionalidade adiciona cliques desnecessários ao fluxo de rotina diária?
4. **Consistência Visual:** A UI respeita o nosso `DESIGN_SYSTEM.md`?

---

### II. CSO Review (Chief Security Officer — OWASP & STRIDE)
Toda alteração de backend, regras de banco ou API deve passar pelo audit **STRIDE**:
- **S - Spoofing (Autenticação):** Verifique se o Firebase Authentication está sendo validado em todas as transações e nas regras do Firestore (`request.auth.uid == resource.data.userId`).
- **T - Tampering (Adulteração de Dados):** O input do usuário no chat do Gemini é higienizado e validado antes de enviar ao modelo ou salvar na rotina?
- **R - Repudiation (Rastreabilidade):** Tarefas, Hábitos e Logs possuem timestamps precisos (`createdAt`, `updatedAt`).
- **I - Information Disclosure (Vazamento de Dados):** 
  - Nenhuma chave secreta (`GEMINI_API_KEY`) pode ser vazada para o bundle do Vite.
  - Arquivos do servidor (`.cjs`, `.map`, `.env`, `.env.local`) devem ser bloqueados por middleware contra acesso público (implementado em `server.ts`).
- **D - Denial of Service (DoS):** Rotas pesadas de inteligência artificial possuem tratamento de erro e fallback de sugestão local.
- **E - Elevation of Privilege (Elevação de Privilégio):** Usuários comuns não possuem permissões globais nas coleções do Firestore.

---

### III. Eng Manager Review (Arquitetura & Código)
- **Zero Dívida Técnica Implícita:** Não adicione dependências ao `package.json` sem necessidade explícita.
- **Tipagem Forte (TypeScript):** Evite `any`. Defina interfaces claras em `src/types.ts`.
- **Modo Offline & Resiliência:** Mantenha suporte ao PWA offline e cache local do Firestore (`persistentLocalCache`).

---

### IV. QA Lead & Release (Validação de Produção)
Antes de executar qualquer comando de deploy (`npx firebase-tools deploy` ou `gcloud run deploy`), rode obrigatoriamente:

```bash
npm run qa
```

> O script `npm run qa` executa simultaneamente:
> 1. Auditoria de linting TypeScript (`npm run lint`).
> 2. Teste de build de produção otimizada (`npm run build`).
> 3. Verificação de integridade dos arquivos gerados em `/dist`.
