import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  taskName?: string;
}

type TimerMode = "focus" | "break";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function PomodoroTimer({ taskName = "Foco" }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const { showNotification } = useNotifications();

  const handleComplete = useCallback(() => {
    setIsActive(false);
    
    if (mode === "focus") {
      showNotification("Sessão Concluída! 🎉", {
        body: `Você completou 25 minutos de foco em: ${taskName}. Hora de uma pausa!`,
        icon: "/pwa-192x192.png"
      });
      setMode("break");
      setTimeLeft(BREAK_TIME);
    } else {
      showNotification("Pausa Concluída!", {
        body: `Sua pausa terminou. Pronto para voltar ao foco?`,
        icon: "/pwa-192x192.png"
      });
      setMode("focus");
      setTimeLeft(FOCUS_TIME);
    }
  }, [mode, taskName, showNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(FOCUS_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const totalTime = mode === "focus" ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => {
            setMode("focus");
            setTimeLeft(FOCUS_TIME);
            setIsActive(false);
          }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === "focus" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Foco
        </button>
        <button
          onClick={() => {
            setMode("break");
            setTimeLeft(BREAK_TIME);
            setIsActive(false);
          }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
            mode === "break" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Coffee className="w-4 h-4" /> Pausa
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-10">
        <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
            className={mode === "focus" ? "text-primary" : "text-accent"}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-6xl font-semibold tracking-tighter text-foreground mb-2">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
            {mode === "focus" ? "Tempo de Foco" : "Pausa Curta"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 text-white",
            mode === "focus" ? "bg-primary" : "bg-accent text-accent-foreground"
          )}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
