import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const PremiumGoldCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 50, y: 50 })}
      className={cn(
        "relative overflow-hidden rounded-[2rem] p-[2px] shadow-2xl transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      style={{
        background: `conic-gradient(from 180deg at ${position.x}% ${position.y}%, 
          #735F30 0deg, 
          #F2D780 45deg, 
          #B59A54 90deg, 
          #F9E9A9 135deg, 
          #8A733B 180deg, 
          #F2D780 225deg, 
          #735F30 270deg, 
          #F9E9A9 315deg, 
          #735F30 360deg
        )`,
      }}
    >
      <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>
      <div className="relative h-full w-full rounded-[calc(2rem-2px)] bg-card/90 backdrop-blur-md z-10 flex flex-col p-8 overflow-hidden">
        {/* Subtle inner gold glow */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${position.x}% ${position.y}%, #F9E9A9 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
