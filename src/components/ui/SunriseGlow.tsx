import React from "react";
import { cn } from "@/lib/utils";

interface SunriseGlowProps {
  className?: string;
}

/**
 * SunriseGlow
 * -----------
 * Glow único, ancorado no topo — padrão Launch UI / Vercel / Linear em heroes:
 * duas elipses radiais empilhadas (uma larga e suave, outra menor e mais
 * intensa), 100% CSS, sem JS de mouse-tracking, sem hard-light.
 *
 * Cor: --color-morning (#FDBA74) — "Rituno" remete ao nascer do dia, então um
 * glow quente no topo da hero é o próprio conceito do produto, não decoração
 * genérica. Reaproveita o keyframe .animate-glow-pulse que já existe no
 * index.css, então não adiciona CSS novo.
 */
export const SunriseGlow = ({ className }: SunriseGlowProps) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden="true">
      {/* Camada externa — larga, suave, define o clima geral da hero */}
      <div
        className="animate-glow-pulse absolute left-1/2 top-0 h-[380px] w-[70%] max-w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-[50%] blur-[100px] opacity-40"
        style={{ background: "radial-gradient(ellipse at center, var(--color-morning) 0%, transparent 65%)" }}
      />
      {/* Camada interna — menor e mais concentrada, dá o "brilho" perto do texto */}
      <div
        className="absolute left-1/2 top-0 h-[220px] w-[40%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px] opacity-30"
        style={{ background: "radial-gradient(ellipse at center, var(--color-morning) 0%, transparent 60%)" }}
      />
      {/* Vinheta — reancora o glow ao preto absoluto (#0A0A0A) nas bordas e embaixo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background))_70%)]" />
    </div>
  );
};
