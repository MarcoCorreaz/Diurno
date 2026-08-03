import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar as CalendarIcon, Settings as SettingsIcon, Sparkles, Bell, Moon, Sun, Monitor, CalendarDays, Check, Mail, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "next-themes";
import { useNotifications } from "@/hooks/use-notifications";

export default function Settings() {
  useLenis();
  const location = useLocation();
  const { permission, requestPermission } = useNotifications();

  // Settings State
  const [notifications, setNotifications] = useState({
    push: permission === 'granted',
    email: false,
    smartInsights: true,
  });

  // Atualiza o toggle baseado na permissão real quando a página carrega
  useEffect(() => {
    setNotifications(prev => ({ ...prev, push: permission === 'granted' }));
  }, [permission]);

  const { theme, setTheme } = useTheme();
  
  const [integrations, setIntegrations] = useState({
    google: true,
    apple: false,
  });

  const toggleNotification = async (key: keyof typeof notifications) => {
    if (key === 'push' && !notifications.push) {
      const granted = await requestPermission();
      if (!granted) return; // Se negou, não liga o switch
    }
    
    setNotifications(prev => {
      const newState = !prev[key];
      toast.success(`Notificação ${String(key)} ${newState ? 'ativada' : 'desativada'}`);
      return { ...prev, [key]: newState };
    });
  };

  const toggleIntegration = (key: keyof typeof integrations) => {
    setIntegrations(prev => {
      const newState = !prev[key];
      if(newState) {
        toast.success(`Integração com ${String(key)} conectada (Demonstração)!`);
      } else {
         toast.info(`Integração com ${String(key)} desconectada.`);
      }
      return { ...prev, [key]: newState };
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden relative selection:bg-foreground selection:text-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto relative z-10 pb-24 md:pb-10">
        <header className="mb-8 md:mb-12 max-w-3xl mx-auto w-full">
          <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] mb-2 font-medium">Preferências</p>
          <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Configurações
          </h1>
        </header>

        <div className="max-w-3xl mx-auto w-full space-y-8 md:space-y-10">
          
          {/* Section: Notifications */}
          <section>
            <h2 className="font-sans text-xl font-medium tracking-tight text-foreground mb-4">Notificações</h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              
              <div className="p-4 md:p-5 flex items-center justify-between border-b border-border hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 md:gap-4 pr-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                    <Bell className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base text-foreground">Notificações Push</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Lembretes de hábitos e tarefas.</p>
                  </div>
                </div>
                <Switch checked={notifications.push} onChange={() => toggleNotification('push')} />
              </div>

              <div className="p-4 md:p-5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3 md:gap-4 pr-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm opacity-50">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm md:text-base text-muted-foreground">Resumo Semanal</h3>
                      <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider font-semibold">Em breve</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">E-mail com estatísticas e progresso.</p>
                  </div>
                </div>
                <Switch checked={false} onChange={() => toast("Em breve", { description: "Resumo semanal por email será disponibilizado em uma atualização futura." })} />
              </div>

              <div className="p-4 md:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 pr-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm opacity-50">
                    <Brain className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm md:text-base text-muted-foreground">Insights de IA</h3>
                      <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider font-semibold">Em breve</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">Sugestões proativas baseadas nos seus dados reais.</p>
                  </div>
                </div>
                <Switch checked={false} onChange={() => toast("Em breve", { description: "Insights de IA personalizados serão disponibilizados em uma atualização futura." })} />
              </div>
            </div>
          </section>

          {/* Section: Appearance */}
          <section>
            <h2 className="font-sans text-xl font-medium tracking-tight text-foreground mb-4">Aparência</h2>
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all shadow-sm",
                    theme === "light" ? "border-foreground bg-secondary" : "border-border hover:border-foreground/50 hover:bg-secondary/50 bg-background"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <Sun className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-sm font-medium">Claro</span>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all shadow-sm",
                    theme === "dark" ? "border-foreground bg-secondary" : "border-border hover:border-foreground/50 hover:bg-secondary/50 bg-background"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <Moon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-sm font-medium">Escuro</span>
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all shadow-sm",
                    theme === "system" ? "border-foreground bg-secondary" : "border-border hover:border-foreground/50 hover:bg-secondary/50 bg-background"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <Monitor className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-sm font-medium">Sistema</span>
                </button>

              </div>
            </div>
          </section>

          {/* Section: Integrations */}
          <section>
            <h2 className="font-sans text-xl font-medium tracking-tight text-foreground mb-4">Integrações de Calendário</h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              
              <div className="p-5 flex items-center justify-between border-b border-border hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-border">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#fff"/>
                      <path d="M12.28 7.37c-1.39 0-2.61.54-3.52 1.41l2.58 2.58c.24-.23.6-.37 1.05-.37 1.15 0 2.12.8 2.45 1.88h3.55c-.39-2.68-2.67-4.78-5.46-5.4z" fill="#EA4335"/>
                      <path d="M7.18 10.45A5.023 5.023 0 0 0 6.64 12c0 .54.1 1.06.28 1.55l3.22-2.5-2.96-3.6z" fill="#FBBC05"/>
                      <path d="M12.28 16.63c-1.12 0-2.11-.6-2.65-1.5l-3.23 2.5c1.37 2.06 3.65 3.42 6.27 3.42 2.76 0 5.02-2.07 5.46-4.73h-3.55c-.38 1.11-1.38 1.93-2.62 1.93z" fill="#34A853"/>
                      <path d="M17.74 11.53c.03.3.06.62.06.94 0 .52-.05 1.03-.13 1.53h-5.39v-2.47h5.46z" fill="#4285F4"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">Google Calendar</h3>
                      <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider font-semibold">Demo</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Sincronize eventos bidirecionalmente.</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleIntegration('google')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm",
                    integrations.google 
                      ? "bg-secondary border-border text-foreground hover:bg-background" 
                      : "bg-foreground border-transparent text-background hover:opacity-90"
                  )}
                >
                  {integrations.google ? "Desconectar" : "Conectar"}
                </button>
              </div>

              <div className="p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm border border-border">
                    <CalendarDays className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Apple Calendar</h3>
                    <p className="text-sm text-muted-foreground">Sincronize com seu ecossistema Apple.</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleIntegration('apple')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm",
                    integrations.apple 
                      ? "bg-secondary border-border text-foreground hover:bg-background" 
                      : "bg-foreground border-transparent text-background hover:opacity-90"
                  )}
                >
                  {integrations.apple ? "Desconectar" : "Conectar"}
                </button>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// Simple custom toggle switch component
function Switch({ checked, onChange, activeColor = "bg-foreground" }: { checked: boolean; onChange: () => void; activeColor?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? activeColor : "bg-secondary border-border",
        "focus-visible:ring-foreground"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
          !checked && "border border-border"
        )}
      />
    </button>
  );
}
