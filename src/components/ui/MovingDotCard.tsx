import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingDotCardProps {
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  duration?: number;
}

export const MovingDotCard = ({
  children,
  className,
  beamColor = "rgba(255, 255, 255, 0.8)",
  duration = 4,
}: MovingDotCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-[1px] bg-border/50",
        className
      )}
    >
      {/* Beam effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 -ml-[1000%] -mt-[1000%] h-[2000%] w-[2000%] origin-center"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 60%, ${beamColor} 100%)`,
        }}
      />
      {/* Inner card */}
      <div className="relative z-10 flex h-full w-full flex-col rounded-[calc(1.5rem-1px)] bg-card overflow-hidden">
        {children}
      </div>
    </div>
  );
};
