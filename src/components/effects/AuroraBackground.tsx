import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const AuroraBackground = ({
  children,
  className,
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full min-h-screen bg-[#0A0A0A] text-zinc-50 overflow-hidden",
        className
      )}
    >
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

