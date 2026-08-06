import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Task, toTask } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Check, Clock, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/hooks/use-lenis";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskSheet } from "@/components/features/TaskSheet";
import { AIChatWidget } from "@/components/features/AIChatWidget";
import Sidebar from "@/components/layout/Sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { Confetti } from "@/components/effects/Confetti";
import { SummaryWidget } from "@/components/features/SummaryWidget";
import { AnimatedCounter } from "@/components/effects/AnimatedCounter";
import { TutorialTour } from "@/components/features/TutorialTour";


export default function Dashboard() {
  useLenis(); 
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [userPlan, setUserPlan] = useState("free");
  
  const { currentUser } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hideInsight, setHideInsight] = useState(false);
  const [generatingRoutine, setGeneratingRoutine] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      const daysMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
      const todayId = daysMap[new Date().getDay()];

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("day_of_week", todayId);

      if (!error && data) {
        const parsedTasks = data.map((d: any) => toTask(d.id, d));
        
        // Verifica reset diário
        const todayStr = new Date().toISOString().split('T')[0];
        const tasksToUpdate = parsedTasks.filter(t => t.completed && (!t.completedAt || !t.completedAt.startsWith(todayStr)));
        
        if (tasksToUpdate.length > 0) {
          await Promise.all(tasksToUpdate.map(t => 
            supabase.from("tasks").update({ completed: false }).eq("id", t.id)
          ));
          // Os tasks atualizados serão recebidos via subscription realtime
        } else {
          setTasks(parsedTasks);
        }
      }
      setLoadingTasks(false);
    };

    const fetchPlan = async () => {
      const { data, error } = await supabase.from("profiles").select("plan").eq("id", currentUser.id).single();
      if (error && error.code === 'PGRST116') {
        navigate("/onboarding");
        return;
      }
      if (data) setUserPlan(data.plan.toLowerCase());
    };

    fetchTasks();
    fetchPlan();

    const channel = supabase
      .channel("tasks_channel")
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

  const generateAIRoutine = async () => {
    if (!currentUser) return;
    setGeneratingRoutine(true);
    try {
      const defaultTasks = [
        {
          id: crypto.randomUUID(),
          title: "Foco e Clareza Matinal (Meditação ou Leitura)",
          time: "07:30",
          category: "Manhã",
          completed: false,
          userId: currentUser.uid,
          currentStreak: 0,
          maxStreak: 0,
          totalCompletions: 0,
        },
        {
          id: crypto.randomUUID(),
          title: "Bloco de Execução Principal",
          time: "14:00",
          category: "Tarde",
          completed: false,
          userId: currentUser.uid,
          currentStreak: 0,
          maxStreak: 0,
          totalCompletions: 0,
        },
        {
          id: crypto.randomUUID(),
          title: "Revisão e Desconexão Digital",
          time: "21:00",
          category: "Noite",
          completed: false,
          userId: currentUser.uid,
          currentStreak: 0,
          maxStreak: 0,
          totalCompletions: 0,
        },
      ];

      let smartTasks: any[] = [];
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Gere exatamente 3 hábitos diários para produtividade e bem-estar (um para Manhã, um para Tarde e um para Noite). Responda APENAS com um JSON Array válido assim: [{\"title\":\"Meditação Matinal\",\"time\":\"07:30\",\"category\":\"Manhã\"},{\"title\":\"Foco no Projeto Principal\",\"time\":\"14:00\",\"category\":\"Tarde\"},{\"title\":\"Revisão do Dia\",\"time\":\"20:30\",\"category\":\"Noite\"}] sem texto extra."
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const cleanJson = data.text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            smartTasks = parsed.slice(0, 3).map((item: any) => ({
              id: crypto.randomUUID(),
              title: item.title || "Hábito IA",
              time: item.time || "08:00",
              category: item.category || "Manhã",
              completed: false,
              userId: currentUser.uid,
              currentStreak: 0,
              maxStreak: 0,
              totalCompletions: 0,
            }));
          }
        }
      } catch (e) {
        console.log("Usando sugestões offline inteligentes da IA", e);
      }

      const tasksToCreate = smartTasks.length >= 3 ? smartTasks : defaultTasks;

      for (const t of tasksToCreate) {
        await supabase.from("tasks").upsert({
          id: t.id,
          title: t.title,
          time: t.time,
          category: t.category,
          completed: t.completed,
          user_id: currentUser.id,
          current_streak: 0,
          max_streak: 0,
          total_completions: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (t.time) {
          scheduleTaskReminder(t.title, t.time, t.id);
        }
      }

      setShowConfetti(true);
      toast.success("Rotina IA Gerada com Sucesso!", {
        description: "3 hábitos estratégicos de Manhã, Tarde e Noite foram criados para o seu dia.",
      });
    } catch (error) {
      console.error("Erro ao gerar rotina IA:", error);
      toast.error("Erro ao gerar rotina IA.");
    } finally {
      setGeneratingRoutine(false);
    }
  };
  const { scheduleTaskReminder } = useNotifications();

  const { summaryText, tipText } = useMemo(() => {
    const pending = tasks.filter(t => !t.completed);
    const done = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    let summary: string;
    let tip: string;

    if (total === 0) {
      summary = "Você ainda não tem hábitos cadastrados. Crie seu primeiro hábito para começar a acompanhar seu progresso.";
      tip = "Comece pequeno: um único hábito consistente vale mais que dez abandonados.";
    } else if (done === total) {
      summary = `Todos os ${total} hábitos do dia foram concluídos. Parabéns!`;
      tip = "Missão cumprida. Aproveite para descansar e recarregar para amanhã.";
    } else {
      summary = `Você tem ${pending.length} de ${total} hábito(s) pendente(s) hoje.`;
      tip = pending.length <= 2
        ? "Quase lá — finalize os últimos itens para fechar o dia completo."
        : "Escolha o hábito mais rápido e comece por ele para ganhar impulso.";
    }

    return { summaryText: summary, tipText: tip };
  }, [tasks]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const handleSaveTask = async (newTask: Task) => {
    if (!currentUser) return;
    try {
      const taskData = {
        id: newTask.id,
        title: newTask.title,
        time: newTask.time,
        category: newTask.category,
        day_of_week: newTask.dayOfWeek,
        completed: newTask.completed,
        user_id: currentUser.id,
        current_streak: newTask.currentStreak || 0,
        max_streak: newTask.maxStreak || 0,
        total_completions: newTask.totalCompletions || 0,
        created_at: newTask.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("tasks").upsert(taskData);
      if (error) throw error;
      if (newTask.time) {
        scheduleTaskReminder(newTask.title, newTask.time, newTask.id);
      }
    } catch (error) {
      console.error("Erro ao salvar hábito:", error);
      toast.error("Erro ao salvar hábito.");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
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
      }).eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar hábito:", error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length || 1; 
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const handleOpenTaskSheet = () => {
    if ((userPlan === "free" || userPlan === "básico") && tasks.length >= 5) {
      toast.error("Limite de hábitos atingido", {
        description: "Assine o plano Pro para adicionar hábitos ilimitados."
      });
      navigate("/planos");
      return;
    }
    setTaskToEdit(null);
    setIsSheetOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden selection:bg-foreground selection:text-background">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto pb-24 md:pb-10">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] mb-2 font-medium">Hoje</p>
            <h1 className="font-sans text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              {greeting}{currentUser?.displayName ? `, ${currentUser.displayName}` : "."}
            </h1>
          </div>
          <SummaryWidget tasks={tasks} />
        </header>

        {/* Status Card — dados reais */}
        {!hideInsight && (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative mb-8 md:mb-12">
              <div className="relative flex flex-col bg-secondary/50 border border-border p-6 md:p-8 rounded-3xl overflow-hidden shadow-sm">
                
                <div className="flex items-center gap-3 mb-4 md:mb-6 relative z-10">
                  <div className="bg-background text-foreground px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center shadow-sm border border-border">
                    <Lightbulb className="w-3 h-3 mr-2" />
                    Resumo do Dia
                  </div>
                </div>
                <p className="font-sans text-xl md:text-2xl font-medium leading-relaxed max-w-lg relative z-10 text-foreground">
                  {summaryText}
                </p>
                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                  <Button 
                    onClick={handleOpenTaskSheet}
                    className="w-full sm:w-auto" shape="pill" size="lg"
                  >
                    Novo Hábito
                  </Button>
                  <Button 
                    onClick={generateAIRoutine}
                    disabled={generatingRoutine}
                    variant="outline"
                    shape="pill" 
                    size="lg"
                    className="w-full sm:w-auto flex items-center gap-2 border-primary/40 hover:bg-primary/5"
                  >
                    {generatingRoutine ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#FF4500]" />
                    )}
                    {generatingRoutine ? "Gerando com IA..." : "Gerar Rotina com IA"}
                  </Button>
                  <Button 
                    onClick={() => {
                      setHideInsight(true);
                    }}
                    className="w-full sm:w-auto text-center text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Lista de Tarefas */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-medium tracking-tight text-foreground font-sans">
              Prioridades de Hoje
            </h2>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs md:text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                {tasks.filter(t => !t.completed).length} Pendentes
              </span>
              <Button 
                onClick={handleOpenTaskSheet}
                shape="pill" className="flex items-center gap-2 text-xs md:text-sm font-medium"
              >
                Novo Hábito
              </Button>
            </div>
          </div>
          
          
          {loadingTasks ? (
            <div className="flex justify-center p-8">
               <div className="w-8 h-8 rounded-full border-4 border-muted border-t-foreground animate-spin"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-muted-foreground border border-dashed border-border rounded-3xl bg-secondary/20 flex flex-col items-center justify-center gap-4">
              <p className="text-base font-medium text-foreground">Nenhum hábito programado para hoje.</p>
              <p className="text-xs text-muted-foreground max-w-md">Que tal deixar nossa Inteligência Artificial estruturar uma rotina inicial equilibrada para a sua Manhã, Tarde e Noite?</p>
              <Button 
                onClick={generateAIRoutine}
                disabled={generatingRoutine}
                shape="pill" 
                size="lg"
                className="mt-2 flex items-center gap-2 bg-foreground text-background hover:opacity-90"
              >
                {generatingRoutine ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#EAB308]" />
                )}
                {generatingRoutine ? "Criando hábitos..." : "Gerar Minha Rotina com IA"}
              </Button>
            </div>
          ) : (
            <motion.ul 
              initial="hidden"
              animate="show"
              className="space-y-3.5"
            >
              {tasks.map((task) => (
                <motion.li 
                  key={task.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm",
                    task.completed 
                      ? "bg-transparent border-muted opacity-50" 
                      : "bg-background border-border hover:border-foreground/30 hover:shadow-md"
                  )}
                  onClick={() => navigate(`/habito/${task.id}`)}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.75 }}
                      animate={task.completed ? { scale: [1, 1.25, 1] } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={cn(
                        "flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                        task.completed 
                          ? "bg-foreground border-foreground text-background" 
                          : "border-border group-hover:border-foreground"
                      )}
                    >
                      {task.completed && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                          <Check className="w-3 h-3 md:w-4 md:h-4 stroke-[3px] icon-beat" />
                        </motion.div>
                      )}
                    </motion.button>
                  
                  <div className="relative flex flex-col items-start gap-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h3 className={cn(
                        "font-medium transition-colors text-sm md:text-[15px]",
                        task.completed ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {task.title}
                      </h3>
                      {task.category && (
                        <span className={cn(
                          "text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-medium border self-start sm:self-auto mt-1 sm:mt-0",
                          task.completed ? "border-transparent bg-transparent text-muted-foreground" : "border-border bg-secondary text-foreground"
                        )}>
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono text-muted-foreground uppercase tracking-tighter sm:ml-auto">
                  {task.time}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          )}
        </section>
      </main>

      {/* Right Sidebar - Statistics */}
      <aside className="w-80 border-l border-border p-8 flex flex-col gap-10 bg-secondary/30 overflow-y-auto hidden lg:flex">
        <div className="bg-background border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">Progresso de Hoje</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-4xl font-bold tracking-tight text-gradient transition-all"><AnimatedCounter value={completionRate} suffix="%" /></div>
            <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-foreground transition-all" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {completedCount} de {tasks.length} hábito(s) concluído(s)
          </p>
        </div>

        <div className="mt-auto">
          <div className="bg-secondary rounded-3xl p-6 border border-border shadow-sm">
            <div className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center mb-4">
              <Clock className="w-4 h-4 text-foreground" />
            </div>
            <h5 className="font-sans text-lg font-semibold mb-1 text-foreground">Dica</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tipText}
            </p>
          </div>
        </div>
      </aside>
      
      <TaskSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSaveTask}
        initialData={taskToEdit}
      />
      
      <AIChatWidget />
      
      {currentUser && <TutorialTour userId={currentUser.id} />}
      
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
