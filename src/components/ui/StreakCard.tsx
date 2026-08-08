import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  history: boolean[]; // Array of last N days, true if completed
  className?: string;
}

export function StreakCard({ currentStreak, bestStreak, history, className }: StreakCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 md:p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Sequência</h3>
            <p className="text-xs text-muted-foreground">Mantenha o foco</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-foreground">
            {currentStreak}
          </div>
          <p className="text-xs text-muted-foreground">Dias seguidos</p>
        </div>
      </div>

      {/* History Grid */}
      <div className="flex items-center gap-1.5 justify-between">
        {history.slice(-7).map((completed, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-8 rounded-md transition-colors",
              completed ? "bg-foreground" : "bg-white/5 border border-border"
            )}
            title={completed ? "Concluído" : "Pendente"}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>Melhor marca:</span>
        <span className="font-mono font-bold text-foreground">{bestStreak} dias</span>
      </div>
    </div>
  );
}
