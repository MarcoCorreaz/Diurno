import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, Clock, Flame, Sparkles, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Refs para os cards de cada etapa
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Refs para os indicadores dos números (01, 02, 03)
  const ind1Ref = useRef<HTMLDivElement>(null);
  const ind2Ref = useRef<HTMLDivElement>(null);
  const ind3Ref = useRef<HTMLDivElement>(null);

  // Barra de progresso geral do scroll
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        pinType: "transform",
        start: "top top",
        end: "+=250%",
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Animação da barra de progresso (0% -> 100%)
    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });
      tl.to(progressBarRef.current, { scaleX: 1, ease: "none", duration: 3 }, 0);
    }

    // Estado inicial: Card 1 visível, Card 2 e Card 3 escondidos e abaixo
    gsap.set(card1Ref.current, { opacity: 1, y: 0, scale: 1 });
    gsap.set(card2Ref.current, { opacity: 0, y: 80, scale: 0.92 });
    gsap.set(card3Ref.current, { opacity: 0, y: 80, scale: 0.92 });

    gsap.set(ind1Ref.current, { opacity: 1, scale: 1.1 });
    gsap.set(ind2Ref.current, { opacity: 0.3, scale: 1 });
    gsap.set(ind3Ref.current, { opacity: 0.3, scale: 1 });

    // Transição: Card 1 -> Card 2 (entre 0.8s e 1.6s da timeline)
    tl.to(card1Ref.current, { opacity: 0, y: -60, scale: 0.95, ease: "power2.inOut", duration: 0.8 }, 0.8)
      .to(card2Ref.current, { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.8 }, 0.8)
      .to(ind1Ref.current, { opacity: 0.3, scale: 1, duration: 0.4 }, 0.8)
      .to(ind2Ref.current, { opacity: 1, scale: 1.1, duration: 0.4 }, 0.9);

    // Transição: Card 2 -> Card 3 (entre 1.8s e 2.6s da timeline)
    tl.to(card2Ref.current, { opacity: 0, y: -60, scale: 0.95, ease: "power2.inOut", duration: 0.8 }, 1.8)
      .to(card3Ref.current, { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.8 }, 1.8)
      .to(ind2Ref.current, { opacity: 0.3, scale: 1, duration: 0.4 }, 1.8)
      .to(ind3Ref.current, { opacity: 1, scale: 1.1, duration: 0.4 }, 1.9);

    // Final suave segurando na tela
    tl.to({}, { duration: 0.4 });

    // Recalcular ScrollTrigger em redimensionamentos para evitar quebra em telas móveis/desktop
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => window.removeEventListener("resize", handleResize);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative border-t border-border">
      {/* Container Pinado */}
      <div
        ref={triggerRef}
        className="h-screen w-full max-w-6xl mx-auto px-6 flex flex-col justify-center relative select-none"
      >
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            Experiência interativa
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Como o Diurno transforma o seu dia
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl mx-auto">
            Role a página para acompanhar as 3 etapas de uma rotina equilibrada e sem estresse.
          </p>
        </div>

        {/* Indicadores numéricos 01 - 02 - 03 + Barra de Progresso do Scroll */}
        <div className="max-w-2xl mx-auto w-full mb-8">
          <div className="flex items-center justify-between text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground mb-3 px-4">
            <div ref={ind1Ref} className="flex items-center gap-2 transition-all">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                01
              </span>
              <span>Clareza Matinal</span>
            </div>
            <div ref={ind2Ref} className="flex items-center gap-2 transition-all">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                02
              </span>
              <span>Ajuste Real</span>
            </div>
            <div ref={ind3Ref} className="flex items-center gap-2 transition-all">
              <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-sans">
                03
              </span>
              <span>Sequência</span>
            </div>
          </div>

          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full w-full bg-foreground rounded-full"
            />
          </div>
        </div>

        {/* Cards das 3 Etapas - Empilhados um sobre o outro no centro */}
        <div className="relative w-full max-w-3xl mx-auto h-[320px] md:h-[340px]">
          {/* Card 1: Clareza Matinal */}
          <div
            ref={card1Ref}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-morning uppercase tracking-widest mb-2 block">
                08:00 AM • Início do dia
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
                Apenas 3 metas essenciais
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Nada de listas intermináveis com 30 itens. O Diurno ajuda você a isolar o trabalho profundo pela manhã, garantindo que o mais importante seja concluído primeiro.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/80 px-3 py-1.5 rounded-full w-fit border border-border">
                <Target className="w-3.5 h-3.5 text-morning" />
                Foco protegido sem distrações
              </div>
            </div>
            {/* Visualização de Mini Interface */}
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
          </div>

          {/* Card 2: Ajuste Real */}
          <div
            ref={card2Ref}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8"
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
            {/* Visualização de Mini Interface */}
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
          </div>

          {/* Card 3: Sequência */}
          <div
            ref={card3Ref}
            className="absolute inset-0 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg flex flex-col md:flex-row items-center gap-8"
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
            {/* Visualização de Mini Interface */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
