# Diurno Design System — UI / UX Reference

O projeto **Diurno** adota o modelo **Craft · Memory · Consistency** (inspirado no repositório `Dammyjay93/interface-design`) combinado com estética moderna escuro absoluto (Vercel/Linear).

> O arquivo de memória visual contínuo está em: [system.md](file:///c:/Users/marqu/OneDrive/Documentos/Diurno/.interface-design/system.md).

---

## Resumo Rápido de Uso de Componentes

### 1. Cards e Paineis
```tsx
// Card Padrão do Diurno (Elevation Level 1)
<div className="bg-[#101010] border border-white/10 rounded-xl p-4 transition-all duration-200 hover:border-white/20">
  <h3 className="text-zinc-50 font-medium">Título do Card</h3>
  <p className="text-zinc-400 text-sm mt-1">Descrição secundária</p>
</div>
```

### 2. Botões e Ações (Sem Drift Visual)
```tsx
// Botão Primário (CTA - 40px / h-10)
<button className="h-10 px-4 rounded-xl bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors">
  Ação Principal
</button>

// Botão Secundário (Padrão - 36px / h-9)
<button className="h-9 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:bg-white/[0.08] transition-colors">
  Filtro ou Opção
</button>

// Ícone de Ação (Compacto - 32px / h-8)
<button className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors">
  <Icon className="h-4 w-4" />
</button>
```

### 3. Inputs de Formulário e Busca
```tsx
<input
  type="text"
  className="h-9 w-full rounded-xl bg-white/[0.02] border border-white/10 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
  placeholder="Digite algo..."
/>
```

---

## Verificação de Consistência
Antes de adicionar qualquer novo modal ou tela:
1. Verifique se o raio de borda usa `rounded-xl` (`12px`) ou `rounded-2xl` (`16px`).
2. Garanta que o espaçamento obedeça a grade de 4px ou 8px (`p-2`, `p-3`, `p-4`, `p-6`).
3. Nunca utilize cores RGB/Hex fora da escala cinza-zinc escuro ou das 3 cores de período da rotina (Manhã, Tarde, Noite).
