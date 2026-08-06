import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  progress: number; // 0 to 100
  title: string;
  subtitle?: string;
  className?: string;
}

export const ProgressCard = ({
  progress,
  title,
  subtitle,
  className,
}: ProgressCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay slightly for dramatic effect
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const strokeWidth = 8;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Ensure progress stays within 0-100 bounds
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={cn(
        "flex items-center p-6 bg-card rounded-3xl border border-border shadow-sm gap-6",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            className="text-foreground"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: mounted ? offset : circumference }}
            transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.1 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-bold tabular-nums">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
