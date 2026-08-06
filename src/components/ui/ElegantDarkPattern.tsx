import { cn } from "@/lib/utils";

export const ElegantDarkPattern = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("relative w-full h-full bg-background overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/10 opacity-30 blur-[120px]"></div>
      </div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
