import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Clock, Flame, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // O container tem 300vh para permitir rolagem, enquanto o conteúdo é "sticky top-0 h-screen"
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mapeamento de progresso (0 a 1) para simular as antigas transições GSAP.
  // Fases:
  // 0.00 -> 0.25 : Card 1 estático
  // 0.25 -> 0.45 : Card 1 sai, Card 2 entra
  // 0.45 -> 0.55 : Card 2 estático
  // 0.55 -> 0.75 : Card 2 sai, Card 3 entra
  // 0.75 -> 1.00 : Card 3 estático

  const scaleX = scrollYProgress; // Barra de progresso geral

  // Indicadores Numéricos
  const ind1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0.3]);
  const ind1Scale = useTransform(scrollYProgress, [0, 0.25, 0.3], [1.1, 1.1, 1]);

  const ind2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.55, 0.6], [0.3, 1, 1, 0.3]);
  const ind2Scale = useTransform(scrollYProgress, [0.25, 0.3, 0.55, 0.6], [1, 1.1, 1.1, 1]);

  const ind3Opacity = useTransform(scrollYProgress, [0.55, 0.6], [0.3, 1]);
  const ind3Scale = useTransform(scrollYProgress, [0.55, 0.6], [1, 1.1]);

  // Card 1
  const card1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 1, 0]);
  const card1Y = useTransform(scrollYProgress, [0, 0.25, 0.45], [0, 0, -60]);
  const card1Scale = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 1, 0.95]);

  // Card 2
  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.45, 0.55, 0.75], [0, 1, 1, 0]);
  const card2Y = useTransform(scrollYProgress, [0.25, 0.45, 0.55, 0.75], [80, 0, 0, -60]);
  const card2Scale = useTransform(scrollYProgress, [0.25, 0.45, 0.55, 0.75], [0.92, 1, 1, 0.95]);

  // Card 3
  const card3Opacity = useTransform(scrollYProgress, [0.55, 0.75, 1], [0, 1, 1]);
  const card3Y = useTransform(scrollYProgress, [0.55, 0.75, 1], [80, 0, 0]);
  const card3Scale = useTransform(scrollYProgress, [0.55, 0.75, 1], [0.92, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] border-t border-border">
      {/* Container Sticky em vez de Pin do GSAP */}
      <div className="sticky top-0 h-screen w-full max-w-6xl mx-auto px-6 flex flex-col justify-center overflow-hidden select-none">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            Experiência interativa
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Como o Rituno transforma o seu dia
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl mx-auto">
            Role a página para acompanhar as 3 etapas de uma rotina equilibrada e sem estresse.
          </p>
        </div>

        {/* Indicadores numéricos 01 - 02 - 03 + Barra de Progresso do Scroll */}
        <div className="max-w-2xl mx-auto w-full mb-8">
          <div className="flex items-center justify-between text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground mb-3 px-4">
            <motion.div style={{ opacity: ind1Opacity, scale: ind1Scale }} className="flex items-center gap-2 origin-left">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                01
              </span>
              <span>Clareza Matinal</span>
            </motion.div>
            <motion.div style={{ opacity: ind2Opacity, scale: ind2Scale }} className="flex items-center gap-2 origin-center">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                02
              </span>
              <span>Ajuste Real</span>
            </motion.div>
            <motion.div style={{ opacity: ind3Opacity, scale: ind3Scale }} className="flex items-center gap-2 origin-right">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                03
              </span>
              <span>Sequência</span>
            </motion.div>
          </div>

          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden relative">
            <motion.div
              style={{ scaleX, transformOrigin: "left center" }}
              className="absolute top-0 left-0 h-full w-full bg-foreground rounded-full"
            />
          </div>
        </div>

        {/* Cards das 3 Etapas - Empilhados um sobre o outro no centro */}
        <div className="relative w-full max-w-3xl mx-auto h-[320px] md:h-[340px]">
          {/* Card 1: Clareza Matinal */}
          <motion.div
            style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8 pointer-events-auto"
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-morning uppercase tracking-widest mb-2 block">
                08:00 AM • Início do dia
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
                Apenas 3 metas essenciais
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Nada de listas intermináveis com 30 itens. O Rituno ajuda você a isolar o trabalho profundo pela manhã, garantindo que o mais importante seja concluído primeiro.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/80 px-3 py-1.5 rounded-full w-fit border border-border">
                <Target className="w-3.5 h-3.5 text-morning" />
                Foco protegido sem distrações
              </div>
            </div>
            <div className="w-full md:w-64 bg-background border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-medium text-muted-foreground">Progresso</span>
                <span className="text-xs font-bold font-mono text-foreground">33%</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-foreground line-through opacity-70">
                  Beber 500ml de água
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary border border-border">
                <div className="w-4 h-4 rounded-full border-2 border-foreground shrink-0" />
                <span className="text-xs font-medium text-foreground">
                  Trabalho Denso / OKRs
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-card/50 border border-border/50 opacity-60">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">Leitura 20 págs</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Ajuste Real */}
          <motion.div
            style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8 pointer-events-auto"
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-afternoon uppercase tracking-widest mb-2 block">
                14:30 PM • Adaptação
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
                O dia mudou? Realoque em 1 clique
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Reunião extra apareceu? Em vez de acumular culpa por uma tarefa atrasada, remaneje horários suavemente sem perder o ritmo de execução.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/80 px-3 py-1.5 rounded-full w-fit border border-border">
                <Clock className="w-3.5 h-3.5 text-afternoon" />
                Cronograma dinâmico e flexível
              </div>
            </div>
            <div className="w-full md:w-64 bg-background border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-medium text-muted-foreground">Progresso</span>
                <span className="text-xs font-bold font-mono text-foreground">66%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-afternoon" />
                  <span className="text-xs font-medium text-foreground">Treino Mobilidade</span>
                </div>
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                  18:00
                </span>
              </div>
              <div className="text-[11px] text-center text-muted-foreground bg-secondary/50 py-1 rounded-lg">
                ✨ Horário ajustado sem conflito
              </div>
            </div>
          </motion.div>

          {/* Card 3: Sequência */}
          <motion.div
            style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8 pointer-events-auto"
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">
                21:00 PM • Consistência
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
                Sua sequência de vitórias
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Acompanhe dias seguidos de dedicação. Cada dia concluído fortalece seus hábitos, construindo uma disciplina inabalável sem esforço.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/80 px-3 py-1.5 rounded-full w-fit border border-border">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Hábito fortalecido todo dia
              </div>
            </div>
            <div className="w-full md:w-64 bg-background border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-medium text-muted-foreground">Status do Dia</span>
                <span className="text-xs font-bold font-mono text-emerald-500">100%</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-1.5">
                  <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <span className="text-sm font-bold text-foreground">14 Dias Seguidos!</span>
                <span className="text-[11px] text-muted-foreground">
                  Seu novo recorde pessoal
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
