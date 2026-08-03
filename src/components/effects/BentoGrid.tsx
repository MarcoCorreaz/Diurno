import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

interface BentoCardProps {
  className?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Componente BentoGrid & BentoCard (inspirado em ui.aceternity.com)
 * Apresenta funcionalidades ou métricas em uma grade moderna tipo Bento
 * com animações de hover estéticas e espaçamento imersivo.
 */
export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-sm p-8 border border-border bg-card flex flex-col justify-between overflow-hidden relative cursor-pointer",
        className
      )}
    >
      {/* Header visual opcional do card */}
      <div className="w-full mb-4 flex-1 overflow-hidden rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center">
        {header}
      </div>

      {/* Conteúdo de Título e Descrição */}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="mb-2 text-foreground font-sans font-semibold text-xl tracking-tight flex items-center gap-2">
          {icon}
          {title}
        </div>
        <div className="font-sans text-sm text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
}
