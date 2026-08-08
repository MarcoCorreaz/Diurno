import React from "react";
import { SunriseGlow } from "@/components/ui/SunriseGlow";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-6 text-foreground">
      {/* Dynamic Animated Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <SunriseGlow />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
