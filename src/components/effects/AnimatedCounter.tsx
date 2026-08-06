import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  /** Duration of the spring animation in seconds */
  duration?: number;
}

/**
 * AnimatedCounter — Odometer-style animated number display.
 * Each digit rolls vertically like a slot machine when the value changes.
 * Inspired by 21st.dev Animated Counter by @preetsuthar17.
 */
export function AnimatedCounter({
  value,
  className,
  suffix = "",
  prefix = "",
  duration = 0.8,
}: AnimatedCounterProps) {
  const digits = String(Math.abs(Math.round(value))).split("");
  const isNegative = value < 0;

  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)}>
      {prefix && <span>{prefix}</span>}
      {isNegative && <span>-</span>}
      {digits.map((digit, idx) => (
        <SingleDigit key={`${digits.length}-${idx}`} digit={parseInt(digit)} duration={duration} />
      ))}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

const SingleDigit: React.FC<{ digit: number; duration: number }> = ({ digit, duration }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 150,
    damping: 20,
    mass: 0.8,
    duration: duration * 1000,
  });
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    motionValue.set(digit);
    prevDigitRef.current = digit;
  }, [digit, motionValue]);

  return (
    <span className="relative inline-block h-[1em] w-[0.65em] overflow-hidden">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <DigitSlice key={num} num={num} spring={spring} />
      ))}
    </span>
  );
}

const DigitSlice: React.FC<{ num: number; spring: ReturnType<typeof useSpring> }> = ({ num, spring }) => {
  const y = useTransform(spring, (latest: number) => {
    const offset = num - latest;
    // Wrap around for smooth cycling
    let wrappedOffset = ((offset % 10) + 10) % 10;
    if (wrappedOffset > 5) wrappedOffset -= 10;
    return wrappedOffset * 100;
  });

  return (
    <motion.span
      style={{ y: useTransform(y, (v) => `${v}%`) }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {num}
    </motion.span>
  );
}
