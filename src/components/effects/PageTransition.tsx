import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key for each route (usually location.pathname) */
  routeKey: string;
}

/**
 * PageTransition — Wraps route content with a smooth fade + blur entrance.
 * Uses Framer Motion's AnimatePresence for cross-route transitions.
 * Inspired by 21st.dev View Transition patterns.
 */
export function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
