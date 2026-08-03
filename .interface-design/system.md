# Diurno Interface Design System — Craft · Memory · Consistency
> Memória e Tokens Visuais Oficiais do Diurno (Inspirado em `interface-design` & Vercel/Linear Aesthetics).

## 1. Filosofia & Princípios (Craft)
- **Hierarquia Visual Intencional:** Toda interface deve guiar o olhar do usuário com clareza. Elementos primários possuem alto contraste (`text-zinc-50`), secundários (`text-zinc-400`), terciários (`text-zinc-500`).
- **Profundidade (Depth & Elevation):** Sistema escuro absoluto focado na imersão e contraste sutil.
- **Micro-animações Com Propósito:** Animações sutis (como tachado progressivo, brilho de borda e transições de hover em 150ms-200ms) que valorizam a interação.

---

## 2. Paleta Oficial (Dark Mode Absoluto - HSL & Hex)
- **Base (Nível 0 - Fundo):** `#0A0A0A` (`--background: 0 0% 3.9%`)
- **Card (Nível 1 - Superfície):** `#101010` (`--card: 0 0% 6.5%`)
- **Hover/Popovers (Nível 2):** `#141414` / `rgba(255, 255, 255, 0.04)`
- **Bordas (Borders):** `#262626` / `border-white/10` (`--border: 0 0% 14.9%`)
- **Texto Principal:** `#FAFAFA` (`--foreground: 0 0% 98%`)
- **Texto Muted:** `#A1A1AA` (`--muted-foreground: 0 0% 63.9%`)

### Cores Temáticas de Rotina:
- **Manhã (Morning):** `#FDBA74` (Orange-300 / Âmbar Quente)
- **Tarde (Afternoon):** `#7DD3FC` (Sky-300 / Azul Célere)
- **Noite (Evening):** `#94A3B8` (Slate-400 / Prata Sereno)

---

## 3. Grade de Espaçamento (4px / 8px Spatial Grid)
Toda margem, padding e gap deve ser múltiplo de 4px ou 8px:
- `4px` (`p-1`, `gap-1`, `space-y-1`) — Espaçamento mínimo interno (badges, ícones compactos)
- `8px` (`p-2`, `gap-2`, `space-y-2`) — Alinhamento de controles relacionados (botão e label)
- `12px` (`p-3`, `gap-3`) — Espaçamento padrão de listas de tarefas/hábitos
- `16px` (`p-4`, `gap-4`, `space-y-4`) — Padding interno de Cards padrão
- `24px` (`p-6`, `gap-6`) — Padding de modais, containers principais e painéis de KPI

---

## 4. Alturas Padronizadas de Botões e Controles (No Drift)
Para evitar "Drift Visual" entre sessões, obedeça estritamente estas alturas:
- **Compacto / Ícone:** `h-8` (`32px`) — Para ações secundárias em linhas de lista (ex: excluir, checar)
- **Padrão:** `h-9` (`36px`) — Para botões secundários, filtros e modais
- **Ação Principal / CTA:** `h-10` (`40px`) — Para botões primários (ex: "Gerar Rotina com IA", "Salvar")
- **Inputs de Texto:** `h-9` (`36px`) ou `h-10` (`40px`), com borda `border-white/10` e foco `ring-2 ring-white/20`

---

## 5. Raio de Borda (Border Radius - Scale)
- **Padrão (Cards, Modais):** `12px` (`rounded-xl` / `--radius`)
- **Grande (Containers, Headers):** `16px` (`rounded-2xl` / `--radius-lg`)
- **Pequeno (Badges, Ícones):** `8px` (`rounded-lg` / `--radius-sm`)
- **Pílula (Pills/Tags):** `9999px` (`rounded-full`)

---

## 6. Checklist de Consistência Visual (Para Agentes de IA e Desenvolvedores)
- [ ] O componente usa a variável oficial de cor em vez de cores hexadecimais hardcoded não-padrão?
- [ ] Os botões respeitam a escala `h-8`, `h-9` ou `h-10`?
- [ ] Os cards usam `bg-[#101010]` ou `bg-white/[0.02]` com `border border-white/10`?
- [ ] As interações de hover possuem transição suave (`transition-all duration-150` ou `duration-200`)?
