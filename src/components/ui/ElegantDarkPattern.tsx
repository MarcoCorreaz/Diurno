import React from "react";
import { cn } from "@/lib/utils";

export const ElegantDarkPattern = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("relative w-full h-full bg-background overflow-hidden", className)}>
      <div className="absolute inset-0 pointer-events-none">
        {/* Base Radial Glow */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background: 'radial-gradient(100% 100% at 0% 0%, hsl(var(--foreground) / 0.05) 0%, transparent 100%)',
            mask: 'radial-gradient(125% 100% at 0% 0%, #000 0%, rgba(0, 0, 0, 0.224) 88.2883%, transparent 100%)',
            WebkitMask: 'radial-gradient(125% 100% at 0% 0%, #000 0%, rgba(0, 0, 0, 0.224) 88.2883%, transparent 100%)'
          }}
        >
          {/* Skewed fading streaks */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              background: 'linear-gradient(hsl(var(--foreground)) 0%, transparent 100%)',
              mask: 'linear-gradient(90deg, transparent 0%, #000 20%, transparent 36%, #000 55%, rgba(0, 0, 0, 0.13) 67%, #000 78%, transparent 97%)',
              WebkitMask: 'linear-gradient(90deg, transparent 0%, #000 20%, transparent 36%, #000 55%, rgba(0, 0, 0, 0.13) 67%, #000 78%, transparent 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              background: 'linear-gradient(hsl(var(--foreground)) 0%, transparent 100%)',
              mask: 'linear-gradient(90deg, transparent 11%, #000 25%, rgba(0, 0, 0, 0.55) 41%, rgba(0, 0, 0, 0.13) 67%, #000 78%, transparent 97%)',
              WebkitMask: 'linear-gradient(90deg, transparent 11%, #000 25%, rgba(0, 0, 0, 0.55) 41%, rgba(0, 0, 0, 0.13) 67%, #000 78%, transparent 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              background: 'linear-gradient(hsl(var(--foreground)) 0%, transparent 100%)',
              mask: 'linear-gradient(90deg, transparent 9%, #000 20%, rgba(0, 0, 0, 0.55) 28%, rgba(0, 0, 0, 0.424) 40%, #000 48%, rgba(0, 0, 0, 0.267) 54%, rgba(0, 0, 0, 0.13) 78%, #000 88%, transparent 97%)',
              WebkitMask: 'linear-gradient(90deg, transparent 9%, #000 20%, rgba(0, 0, 0, 0.55) 28%, rgba(0, 0, 0, 0.424) 40%, #000 48%, rgba(0, 0, 0, 0.267) 54%, rgba(0, 0, 0, 0.13) 78%, #000 88%, transparent 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              background: 'linear-gradient(hsl(var(--foreground)) 0%, transparent 100%)',
              mask: 'linear-gradient(90deg, transparent 0%, #000 17%, rgba(0, 0, 0, 0.55) 26%, #000 35%, transparent 47%, rgba(0, 0, 0, 0.13) 69%, #000 79%, transparent 97%)',
              WebkitMask: 'linear-gradient(90deg, transparent 0%, #000 17%, rgba(0, 0, 0, 0.55) 26%, #000 35%, transparent 47%, rgba(0, 0, 0, 0.13) 69%, #000 79%, transparent 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
            style={{
              background: 'linear-gradient(hsl(var(--foreground)) 0%, transparent 100%)',
              mask: 'linear-gradient(90deg, transparent 0%, #000 20%, rgba(0, 0, 0, 0.55) 27%, #000 42%, transparent 48%, rgba(0, 0, 0, 0.13) 67%, #000 74%, #000 82%, rgba(0, 0, 0, 0.47) 88%, transparent 97%)',
              WebkitMask: 'linear-gradient(90deg, transparent 0%, #000 20%, rgba(0, 0, 0, 0.55) 27%, #000 42%, transparent 48%, rgba(0, 0, 0, 0.13) 67%, #000 74%, #000 82%, rgba(0, 0, 0, 0.47) 88%, transparent 97%)',
              transform: 'skewX(45deg)'
            }}
          />
        </div>

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.10] dark:opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.5) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Radial highlight in corner */}
        <div className="absolute left-[-100px] top-[-100px] -z-10 h-[500px] w-[500px] rounded-full bg-foreground/5 opacity-50 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
