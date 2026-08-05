// FIX: Lendo o parâmetro da URL (useParams), usando mock dinâmico e tratando estado "não encontrado".
import React, { useState, useEffect } from "react";
import { Task, toTask } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Flame, TrendingUp, Calendar, Trophy, Target, History, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/engagement/NumberTicker";
import { useLenis } from "@/hooks/use-lenis";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";
import { PomodoroTimer } from "@/components/features/PomodoroTimer";
import { subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Sidebar from "@/components/layout/Sidebar";



export default function HabitoDetalhe() {
  useLenis();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"visao-geral" | "historico" | "foco">("visao-geral");

  const [habitData, setHabitData] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const { chartData, history } = React.useMemo(() => {
    if (!habitData) return { chartData: [], history: [] };
    const days = 14;
    const currentStreak = habitData.currentStreak || 0;
    const items = [];
    const chart = [];
    let accumulatedScore = 0;

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, "dd MMM", { locale: ptBR });
      const fullDate = format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
      const isCompleted = i < currentStreak;
      if (isCompleted) {
        accumulatedScore += 2;
      }
      chart.push({
        date: i === 0 ? "Hoje" : formattedDate,
        score: accumulatedScore,
      });
      items.push({
        id: `history-${i}`,
        date: fullDate,
        status: isCompleted ? "completed" : "missed",
        note: isCompleted
          ? `Hábito "${habitData.title}" concluído com sucesso no horário programado.`
          : undefined,
      });
    }
    return { chartData: chart, history: items.reverse() };
  }, [habitData]);

  useEffect(() => {
    if (!id) return;

    const fetchHabit = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setHabitData(toTask(data.id, data));
      } else {
        setHabitData(null);
      }
      setLoading(false);
    };

    fetchHabit();

    const channel = supabase
      .channel(`habit_detail_${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `id=eq.${id}`,
        },
        () => {
          fetchHabit();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleMarkAsDone = async () => {
    if (!id || !habitData) return;
    try {
      const newStreak = (habitData.currentStreak || 0) + 1;
      const newTotal = (habitData.totalCompletions || 0) + 1;
      const newMax = Math.max(habitData.maxStreak || 0, newStreak);
      const { error } = await supabase.from("tasks").update({
        completed: true,
        current_streak: newStreak,
        total_completions: newTotal,
        max_streak: newMax,
        updated_at: new Date().toISOString()
      }).eq("id", id);
      if (error) throw error;
      toast.success("Hábito marcado como feito!", {
        description: "Streak mantido. Ótimo trabalho!",
      });
    } catch (error) {
      console.error("Erro ao marcar hábito como feito:", error);
      toast.error("Erro ao atualizar hábito.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Carregando...</div>;
  }

  if (!habitData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h2 className="font-sans text-2xl font-bold mb-4">Hábito não encontrado</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-foreground text-background rounded-full hover:opacity-90">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden relative selection:bg-foreground selection:text-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto relative z-10 max-w-5xl mx-auto w-full pb-24 md:pb-10">
        {/* Header */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-secondary border border-border text-foreground hover:bg-background transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <span className="bg-secondary text-foreground text-[10px] md:text-xs px-3 py-1 rounded-full font-medium border border-border">{habitData.category}</span>
                <span className="text-muted-foreground text-xs md:text-sm font-mono">{habitData.time}</span>
              </div>
              <h1 className="font-sans text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
                {habitData.title}
              </h1>
            </div>
          </div>
          
          <button onClick={handleMarkAsDone} className="w-full md:w-auto justify-center bg-foreground text-background px-8 py-3 rounded-full font-medium shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" /> Marcar como Feito
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Main Streak Counter */}
          <div className="col-span-1 lg:col-span-1 bg-secondary/50 border border-border rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="w-12 h-12 md:w-16 md:h-16 bg-background rounded-full flex items-center justify-center mb-4 md:mb-6 border border-border shadow-sm">
              <Flame className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
            </div>
            
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium mb-2">Streak Atual</p>
            <div className="flex items-baseline gap-2 mb-2">
              <NumberTicker value={habitData.currentStreak} className="font-mono text-6xl font-bold tracking-tight text-foreground" />
              <span className="text-xl md:text-2xl font-medium text-muted-foreground">dias</span>
            </div>
            <p className="text-xs text-foreground bg-background px-3 py-1 rounded-full font-medium border border-border">
              {habitData.currentStreak >= habitData.maxStreak && habitData.currentStreak > 0
                ? "🔥 Novo recorde pessoal!"
                : habitData.maxStreak > 0 
                  ? `Recorde: ${habitData.maxStreak} dias`
                  : "Comece sua sequência hoje!"}
            </p>
          </div>

          {/* Secondary Stats */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-secondary/30 border border-border rounded-3xl p-4 md:p-6 flex flex-col justify-between shadow-sm">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-background rounded-full flex items-center justify-center mb-3 md:mb-4 border border-border shadow-sm">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] md:text-sm mb-1">Taxa de Conclusão</p>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <NumberTicker 
                    value={habitData.totalCompletions > 0 
                      ? Math.round((habitData.currentStreak / Math.max(habitData.totalCompletions, 1)) * 100) 
                      : 0} 
                    className="font-mono text-2xl md:text-4xl font-semibold text-foreground" 
                  />
                  <span className="text-muted-foreground text-xs md:text-base">%</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 border border-border rounded-3xl p-4 md:p-6 flex flex-col justify-between shadow-sm">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-background rounded-full flex items-center justify-center mb-3 md:mb-4 border border-border shadow-sm">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] md:text-sm mb-1">Total Concluído</p>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <NumberTicker value={habitData.totalCompletions} className="font-mono text-2xl md:text-4xl font-semibold text-foreground" />
                  <span className="text-muted-foreground text-xs md:text-base">vezes</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-secondary border border-border rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                </div>
                <div>
                  <h4 className="font-sans text-foreground font-medium text-sm md:text-lg mb-0.5">Sobre este hábito</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {habitData.totalCompletions > 0
                      ? `Concluído ${habitData.totalCompletions} vez(es) no total. Sequência atual: ${habitData.currentStreak} dia(s).`
                      : "Ainda sem registros. Marque como feito para começar a acompanhar."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Chart / History */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-0 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("visao-geral")}
            className={cn(
              "px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === "visao-geral" 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab("historico")}
            className={cn(
              "px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === "historico" 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Histórico
          </button>
          <button 
            onClick={() => setActiveTab("foco")}
            className={cn(
              "px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === "foco" 
                ? "border-foreground text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Foco (Pomodoro)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-secondary/30 border border-border rounded-3xl p-4 md:p-8 overflow-hidden relative shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === "visao-geral" && (
              <motion.div
                key="visao-geral"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full min-h-[300px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans text-xl font-medium text-foreground">Consistência no Mês</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-foreground"><TrendingUp className="w-4 h-4" /> Em Alta</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1C1C1A" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1C1C1A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#F9F9F6', borderColor: '#E2E2D9', borderRadius: '16px', color: '#1C1C1A', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#1C1C1A' }}
                      />
                      <XAxis 
                        dataKey="date" 
                        stroke="#A3A39C" 
                        tick={{ fill: '#73736D', fontSize: 12, fontFamily: 'mono' }} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#1C1C1A" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === "historico" && (
              <motion.div
                key="historico"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
                      Nenhum histórico registrado ainda.
                    </div>
                  ) : history.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary transition-colors shadow-sm">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border",
                        item.status === "completed" ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border"
                      )}>
                        {item.status === "completed" ? <CheckCircleIcon className="w-5 h-5" /> : <Flame className="w-5 h-5 opacity-50" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{item.date}</span>
                          <span className={cn(
                            "text-xs font-medium uppercase tracking-wider",
                            item.status === "completed" ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {item.status === "completed" ? "Concluído" : "Perdido"}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-sm text-foreground bg-secondary p-3 rounded-xl mt-2 border border-border">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "foco" && (
              <motion.div
                key="foco"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center min-h-[300px]"
              >
                <PomodoroTimer taskName={habitData.title} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
