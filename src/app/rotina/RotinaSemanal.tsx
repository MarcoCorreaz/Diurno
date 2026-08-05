// FIX: Semanas fora da atual (weekOffset !== 0) mostram estado vazio em vez de repetir os dados.
import React, { useState, useEffect } from "react";
import { Task, toTask } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskSheet } from "@/components/TaskSheet";
import { getCategoryColor } from "@/lib/categories";
import Sidebar from "@/components/layout/Sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { Confetti } from "@/components/effects/Confetti";

import { startOfWeek, addDays, addWeeks, format } from "date-fns";
import { ptBR } from "date-fns/locale";

const DAY_CONFIG = [
  { id: "seg", label: "SEG", full: "Segunda-feira", color: "from-morning/10" },
  { id: "ter", label: "TER", full: "Terça-feira", color: "from-afternoon/10" },
  { id: "qua", label: "QUA", full: "Quarta-feira", color: "from-morning/10" },
  { id: "qui", label: "QUI", full: "Quinta-feira", color: "from-afternoon/10" },
  { id: "sex", label: "SEX", full: "Sexta-feira", color: "from-morning/10" },
  { id: "sab", label: "SAB", full: "Sábado", color: "from-afternoon/10" },
  { id: "dom", label: "DOM", full: "Domingo", color: "from-morning/10" },
];


export default function RotinaSemanal() {
  useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("seg");
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(0);
  const [localRoutine, setLocalRoutine] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id);

      if (!error && data) {
        const newRoutine: Record<string, Task[]> = { seg: [], ter: [], qua: [], qui: [], sex: [], sab: [], dom: [] };
        data.forEach((d: any) => {
          const task = toTask(d.id, d);
          if (task.dayOfWeek && newRoutine[task.dayOfWeek]) {
            newRoutine[task.dayOfWeek].push(task);
          }
        });
        setLocalRoutine(newRoutine);
      }
      setLoading(false);
    };

    fetchTasks();

    const channel = supabase
      .channel("rotina_tasks_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, navigate]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { scheduleTaskReminder } = useNotifications();

  const handleSaveTask = async (newTask: Partial<Task> & { id: string }) => {
    if (!currentUser) return;
    try {
      const taskData = {
        id: newTask.id,
        title: newTask.title || "",
        time: newTask.time || "",
        category: newTask.category,
        day_of_week: activeDay,
        completed: newTask.completed ?? false,
        user_id: currentUser.id,
        current_streak: newTask.currentStreak || 0,
        max_streak: newTask.maxStreak || 0,
        total_completions: newTask.totalCompletions || 0,
        created_at: newTask.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("tasks").upsert(taskData);
      if (error) throw error;

      if (newTask.time) {
        scheduleTaskReminder(newTask.title || "", newTask.time, newTask.id);
      }
    } catch (error) {
      console.error("Erro ao salvar hábito na rotina:", error);
      toast.error("Erro ao salvar hábito na rotina.");
    }
  };

  const weekDays = React.useMemo(() => {
    const now = new Date();
    const start = addWeeks(startOfWeek(now, { weekStartsOn: 1 }), weekOffset);
    return DAY_CONFIG.map((config, index) => {
      const dayDate = addDays(start, index);
      return {
        ...config,
        date: format(dayDate, "dd"),
        full: `${config.full} (${format(dayDate, "dd 'de' MMMM", { locale: ptBR })})`,
      };
    });
  }, [weekOffset]);

  const activeDayData = weekDays.find(d => d.id === activeDay) || weekDays[0];
  const tasks = localRoutine[activeDay] || [];

  const changeWeek = (newDirection: number) => {
    setDirection(newDirection);
    setWeekOffset(prev => prev + newDirection);
  };

  const toggleTask = async (taskId: string) => {
    const dayTasks = localRoutine[activeDay] || [];
    const task = dayTasks.find((t: Task) => t.id === taskId);
    if (!task) return;
    const isCompleted = !task.completed;
    
    if (isCompleted) {
        setShowConfetti(true);
        toast.success("Hábito concluído!", {
            description: "Você está no caminho certo. Continue assim!"
        });
    } else {
        toast.info("Hábito desmarcado.");
    }
    
    try {
      const { error } = await supabase.from("tasks").update({
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq("id", taskId);
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar hábito:", error);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden relative selection:bg-foreground selection:text-background">
      {/* Dynamic Background Gradient per Day */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b to-transparent opacity-20 blur-3xl",
              activeDayData.color
            )}
          />
        </AnimatePresence>
      </div>

      <Sidebar />

      <main className="flex-1 p-4 md:p-10 flex flex-col overflow-y-auto relative z-10 pb-24 md:pb-10">
        <header className="mb-8 md:mb-12 max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] mb-2 font-medium">Visão Geral</p>
              <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Rotina Semanal
              </h1>
            </div>
            
            {/* Week Navigation */}
            <div className="flex items-center justify-between md:justify-center gap-4 bg-card border border-border rounded-full p-1 w-full md:w-auto shadow-sm">
              <button 
                onClick={() => changeWeek(-1)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs md:text-sm font-medium w-full md:w-32 text-center truncate">
                {weekOffset === 0 ? "Esta Semana" : weekOffset === -1 ? "Semana Passada" : weekOffset === 1 ? "Próxima Semana" : `Semana ${weekOffset}`}
              </span>
              <button 
                onClick={() => changeWeek(1)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Week Days Tabs */}
          <div className="flex items-center gap-1 md:gap-2 p-1 bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl relative overflow-x-auto no-scrollbar shadow-sm">
            {weekDays.map((day) => {
              const isActive = activeDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={cn(
                    "relative flex-1 min-w-[60px] flex flex-col items-center justify-center py-2 md:py-3 rounded-xl transition-colors z-10",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDayTab"
                      className="absolute inset-0 bg-background border border-border rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider mb-1">{day.label}</span>
                  <span className={cn("font-mono text-base md:text-lg font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {day.date}
                  </span>
                </button>
              );

            })}
          </div>
        </header>

        {/* Routine Grid / Tasks */}
        <div className="flex-1 max-w-4xl mx-auto w-full overflow-hidden relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium tracking-tight text-foreground font-sans">
              {activeDayData.full}
            </h2>
            <button 
              onClick={() => { setTaskToEdit(null); setIsSheetOpen(true); }}
              className="flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> Nova Tarefa
            </button>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${weekOffset}-${activeDay}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-3.5"
            >
              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 350, damping: 25 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "group flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm",
                      task.completed 
                        ? "bg-transparent border-muted opacity-50" 
                        : "bg-background border-border hover:border-foreground/30 hover:shadow-md"
                    )}
                    onClick={() => navigate(`/habito/${task.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        animate={task.completed ? { scale: [1, 1.25, 1] } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                          task.completed 
                            ? "bg-foreground border-foreground text-background" 
                            : "border-border group-hover:border-foreground"
                        )}
                      >
                        {task.completed && (
                          <Check className="w-4 h-4 stroke-[3px]" />
                        )}
                      </motion.button>
                      
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-medium transition-colors text-[15px]",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          )}>
                            {task.title}
                          </h3>
                          {task.category && (
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                              task.completed ? "border-transparent bg-transparent text-muted-foreground" : "border-border bg-secondary text-foreground"
                            )}>
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-tighter">
                      {task.time}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-3xl bg-secondary/30">
                  <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-foreground font-medium mb-1">Nenhuma tarefa planejada ainda</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Aproveite para descansar ou adicione algo novo ao seu cronograma.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <TaskSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSaveTask}
        initialData={taskToEdit}
      />
      
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
