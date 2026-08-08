import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialCarousel({ testimonials, className }: TestimonialCarouselProps) {
  // We duplicate the testimonials to create a seamless infinite loop
  const repeatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={cn("relative flex w-full overflow-hidden bg-background py-10", className)}>
      <div
        className="flex min-w-full shrink-0 animate-marquee items-center gap-6"
        style={{
          // Custom animation utility needed in tailwind config, 
          // or we can just use inline animation style for simplicity
          animation: "marquee 40s linear infinite",
        }}
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
        `}</style>
        {repeatedTestimonials.map((testimonial, i) => (
          <div
            key={i}
            className="w-[320px] md:w-[400px] shrink-0 rounded-xl bg-card border border-border p-6 transition-all duration-200 hover:border-white/20 hover:bg-foreground/5"
          >
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground text-sm font-medium">
                {testimonial.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground font-sans">
                  {testimonial.name}
                </span>
                <span className="text-xs text-zinc-500">{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
