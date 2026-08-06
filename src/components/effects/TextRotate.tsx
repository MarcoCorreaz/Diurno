import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRotateProps {
  words: string[];
  className?: string;
  /** Time between word changes in ms */
  interval?: number;
}

/**
 * TextRotate — Animated word cycler with spring physics.
 * Rotates through an array of words with smooth vertical slide + blur transition.
 * Inspired by 21st.dev Text Rotate by @danielpetho and the 21st.dev hero "living" effect.
 */
export function TextRotate({
  words,
  className,
  interval = 3000,
}: TextRotateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const timer = setInterval(rotate, interval);
    return () => clearInterval(timer);
  }, [rotate, interval]);

  return (
    <span className={cn("relative inline-flex overflow-hidden align-baseline", className)}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[currentIndex]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
            mass: 1,
          }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
