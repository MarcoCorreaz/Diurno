import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  /** Only animate when element is visible in viewport */
  onlyInView?: boolean;
}

/**
 * TextShimmer — Metallic shimmer reflection that sweeps across text.
 * Uses CSS background-clip: text with an animated gradient.
 * Inspired by 21st.dev Text Shimmer by @ibelick.
 */
export function TextShimmer({
  children,
  as: Tag = "h2",
  className,
  onlyInView = true,
}: TextShimmerProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(!onlyInView);

  useEffect(() => {
    if (!onlyInView || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onlyInView]);

  return (
    <Tag
      ref={ref as any}
      className={cn(
        isVisible ? "animate-shimmer" : "",
        className
      )}
    >
      {children}
    </Tag>
  );
}
