import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  text: string | string[];
  className?: string;
  delay?: number;
  wordSpacing?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: customDelay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
    },
  },
};

/**
 * Componente AnimatedTitle (Framer Motion / motion.dev)
 * Anima títulos com revelação palavra-por-palavra (staggered blur-in),
 * um efeito super moderno visto nas principais plataformas de design atual.
 */
export function AnimatedTitle({
  text,
  className,
  delay = 0,
  wordSpacing = "mr-2.5",
}: AnimatedTitleProps) {
  const lines = Array.isArray(text) ? text : [text];

  return (
    <motion.div
      variants={containerVariants}
      custom={delay}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-col", className)}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <div key={lineIdx} className="flex flex-wrap items-baseline">
            {words.map((word, wordIdx) => (
              <motion.span
                key={`${lineIdx}-${wordIdx}`}
                variants={wordVariants}
                className={cn("inline-block", wordSpacing)}
              >
                {word}
              </motion.span>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}
