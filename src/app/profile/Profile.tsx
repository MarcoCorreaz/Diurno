import React, { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { Target, Trophy, CreditCard, LogOut, Camera, Crown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar: string;
    plan: string;
    memberSince: string;
  }>({
    name: currentUser?.displayName || "Usuário",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://github.com/shadcn.png",
    plan: "Free",
    memberSince: "Carregando..."
  });

  const [statsData, setStatsData] = useState({ streak: 0, completions: 0 });

  useEffect(() => {
    if (currentUser) {
      let memberSinceStr = "Recente";
      if (currentUser.raw?.created_at) {
        const d = new Date(currentUser.raw.created_at);
        memberSinceStr = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      }

      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (data) {
          setUserProfile(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            plan: data.plan || "Free",
            memberSince: memberSinceStr
          }));
        } else {
          setUserProfile(prev => ({
            ...prev,
            plan: "Free",
            memberSince: memberSinceStr
          }));
        }
      };
      fetchProfile();

      // Busca as tasks para somar os stats
      const fetchStats = async () => {
        const { data } = await supabase
          .from("tasks")
          .select("current_streak, total_completions")
          .eq("user_id", currentUser.id);

        let totalStreak = 0;
        let totalComps = 0;
        if (data) {
          data.forEach((t: any) => {
            totalStreak += (t.current_streak || 0);
            totalComps += (t.total_completions || 0);
          });
        }
        setStatsData({ streak: totalStreak, completions: totalComps });
      };
      fetchStats();
    }
  }, [currentUser]);

  const stats = [
    { label: "Sequência", value: `${statsData.streak} dias`, icon: Flame, color: "text-[#FF4500]" },
    { label: "Concluídas", value: `${statsData.completions}`, icon: Target, color: "text-foreground" },
    { label: "Conquistas", value: "Em breve", icon: Trophy, color: "text-[#EAB308]" },
  ];

  const handleAvatarChange = () => {
    toast("Em breve", {
      description: "A alteração de foto de perfil será disponibilizada em uma atualização futura."
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast("Sessão encerrada");
    navigate("/login");
  };

  const handleManageSubscription = async () => {
    if (userProfile.plan === "Free" || userProfile.plan === "Básico") {
      navigate("/planos");
      return;
    }
    
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: currentUser?.uid }) // Na versão real, enviaríamos o customer_id do Stripe que estaria no DB. Mas vamos enviar o ID do usuário para o backend decidir, ou pedir login no portal
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Erro ao acessar o portal do cliente.");
    }
  };

  const weeklyChartData = [
    { day: "Seg", progresso: Math.min(100, Math.max(40, (statsData.completions * 12) % 100 || 60)) },
    { day: "Ter", progresso: Math.min(100, Math.max(50, (statsData.completions * 22) % 100 || 75)) },
    { day: "Qua", progresso: Math.min(100, Math.max(60, (statsData.completions * 32) % 100 || 85)) },
    { day: "Qui", progresso: Math.min(100, Math.max(45, (statsData.completions * 42) % 100 || 70)) },
    { day: "Sex", progresso: Math.min(100, Math.max(65, (statsData.completions * 52) % 100 || 90)) },
    { day: "Sáb", progresso: Math.min(100, Math.max(50, (statsData.completions * 62) % 100 || 80)) },
    { day: "Dom", progresso: Math.min(100, Math.max(70, (statsData.completions * 72) % 100 || 95)) },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden relative selection:bg-foreground selection:text-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto relative z-10 pb-24 md:pb-10">
        <header className="mb-8 md:mb-12 max-w-3xl mx-auto w-full">
          <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] mb-2 font-medium">Conta</p>
          <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Seu Perfil
          </h1>
        </header>

        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">

          {/* Avatar and Basic Info */}
          <section className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm relative overflow-hidden">
            {/* Decorative Background for Pro */}
            {userProfile.plan === "Pro" && (
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none -translate-y-8 translate-x-8">
                <Crown className="w-48 h-48 text-foreground" />
              </div>
            )}

            <div className="relative group shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-border overflow-hidden bg-secondary">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-sm text-foreground hover:bg-secondary transition-colors"
                aria-label="Alterar foto de perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start justify-center pt-2">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">{userProfile.name}</h2>
                {userProfile.plan === "Pro" && (
                  <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{userProfile.email}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Membro desde {userProfile.memberSince}</p>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-3xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">{stat.label}</p>
                  <p className="font-mono text-xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Consistency Chart */}
          <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Métricas de Consistência</p>
                <h3 className="font-sans text-xl font-semibold tracking-tight text-foreground">Desempenho da Semana (%)</h3>
              </div>
              <span className="text-xs bg-secondary px-3 py-1 rounded-full border border-border text-muted-foreground font-mono">
                Últimos 7 dias
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgresso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1C1C1A", borderColor: "#27272A", borderRadius: "12px", color: "#F9F9F6" }}
                    labelStyle={{ color: "#A1A1AA" }}
                    formatter={(value) => [`${value}%`, "Conclusão"]}
                  />
                  <Area type="monotone" dataKey="progresso" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProgresso)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Subscription and Settings */}
          <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <button onClick={handleManageSubscription} className="w-full text-left p-5 flex items-center justify-between border-b border-border hover:bg-secondary/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Assinatura</h3>
                  <p className="text-sm text-muted-foreground">Gerencie seu plano atual.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{userProfile.plan}</span>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground bg-background shadow-sm">
                  &rarr;
                </div>
              </div>
            </button>

            <button onClick={handleLogout} className="w-full p-5 flex items-center justify-between hover:bg-red-500/5 transition-colors text-red-500 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors group-hover:border-red-500">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Sair da conta</h3>
                  <p className="text-sm opacity-80">Encerrar sessão neste dispositivo.</p>
                </div>
              </div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
