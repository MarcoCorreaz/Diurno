import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ShineButton } from "@/components/effects/ShineButton";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionText, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("w-full flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-border/50 bg-secondary/10 text-center", className)}>
      <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center shadow-sm mb-4">
        <Plus className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-sans font-semibold text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      <ShineButton onClick={onAction} className="bg-white/5 text-zinc-100 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
        {actionText}
      </ShineButton>
    </div>
  );
}
