import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * ShineButton — CTA button with a cursor-following radial shine effect.
 * Uses CSS custom properties + onMouseMove for a lightweight shine that tracks the cursor.
 * Inspired by 21st.dev Interactive Hover Button by @dillionverma.
 */
export function ShineButton({
  children,
  className,
  ...props
}: ShineButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty("--shine-x", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--shine-y", `${e.clientY - rect.top}px`);
  }

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden cursor-pointer",
        "before:pointer-events-none before:absolute before:inset-0",
        "before:bg-[radial-gradient(200px_circle_at_var(--shine-x,50%)_var(--shine-y,50%),rgba(255,255,255,0.20),transparent_60%)]",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
