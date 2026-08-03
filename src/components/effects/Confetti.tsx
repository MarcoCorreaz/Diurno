import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; size: number; rotation: number }[]
  >([]);

  useEffect(() => {
    if (isActive) {
      const colors = ["#FAFAFA", "#E4E4E7", "#A1A1AA", "#71717A", "#52525B", "#38BDF8"];
      const newParticles = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        // spread from center
        x: (Math.random() - 0.5) * (window.innerWidth * 0.8),
        // tend to fall down or spread up
        y: (Math.random() - 0.5) * (window.innerHeight * 0.8) + (Math.random() * 100),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360 + 180,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 50, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1, 0.8],
              x: p.x,
              y: p.y + 200, // add a gravity effect
              rotate: p.rotation,
            }}
            transition={{ 
              duration: 1.5 + Math.random() * 0.5, 
              ease: "easeOut",
              times: [0, 0.2, 1]
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
