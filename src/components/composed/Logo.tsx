import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center group", className)}>
      <div className="font-sans text-xl font-semibold tracking-tight text-foreground transition-opacity group-hover:opacity-80">
        Rituno.
      </div>
    </div>
  );
}
