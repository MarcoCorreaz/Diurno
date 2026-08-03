import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  radius?: number;
}

/**
 * Componente SpotlightCard (Framer Motion / motion.dev)
 * Projeta um feixe de luz radial (spotlight) que segue a coordenada (X, Y)
 * do cursor do mouse sobre o card, criando um efeito magnético e premium.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.12)",
  radius = 380,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-3xl border border-border bg-card p-10 overflow-hidden transition-all duration-300 hover:border-foreground/30 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {/* Camada de Spotlight contínua (borda animada + reflexo de luz) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
        style={{
          background,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Conteúdo do Cartão em camada superior z-10 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
