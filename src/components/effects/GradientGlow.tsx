import { cn } from "@/lib/utils";

/**
 * GradientGlow — Radial gradient background that pulses gently.
 * Creates an ambient glow behind the hero section, inspired by 21st.dev homepage.
 * Uses the Diurno color palette: morning (amber), afternoon (sky), zinc.
 */
export function GradientGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-glow-enter pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="animate-glow-pulse absolute left-1/2 top-[60%]"
        style={{
          transform: "translate(-50%, -50%)",
          width: "140vw",
          height: "160vh",
          background: [
            "radial-gradient(45% 45% at 50% 50%, rgba(253, 186, 116, 0.18), transparent 70%)",
            "radial-gradient(35% 40% at 60% 55%, rgba(125, 211, 252, 0.12), transparent 70%)",
            "radial-gradient(30% 35% at 40% 55%, rgba(148, 163, 184, 0.10), transparent 70%)",
          ].join(", "),
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
