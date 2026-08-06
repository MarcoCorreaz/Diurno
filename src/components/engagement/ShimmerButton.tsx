import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export const ShimmerButton = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-sans font-medium text-primary-foreground transition-all hover:bg-primary/90 border border-border shadow-sm",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

