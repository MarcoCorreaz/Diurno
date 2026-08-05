import React from "react";
import { motion } from "framer-motion";

interface Task {
  completed: boolean;
}

interface SummaryWidgetProps {
  tasks: Task[];
}

export function SummaryWidget({ tasks }: SummaryWidgetProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
      <div className="relative flex items-center justify-center w-16 h-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-muted"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-foreground"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-foreground">
          <span className="text-sm font-semibold">{percentage}%</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground font-medium text-sm">Progresso de hoje</span>
        <span className="text-muted-foreground text-xs">
          {completed} de {total} tarefas
        </span>
      </div>
    </div>
  );
}
