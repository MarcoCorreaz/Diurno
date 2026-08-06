// FIX: Adicionado handler com toast nos botões de plano e link real "mailto" no contato.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Target, Clock, Feather } from "lucide-react";
import { PremiumGoldCard } from "@/components/ui/PremiumGoldCard";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StripeCheckoutModal } from "@/components/modals/StripeCheckoutModal";

export const PLANS = [
  {
    name: "Básico",
    description: "Para quem está começando a organizar a rotina.",
    price: {
      monthly: "0",
      yearly: "0"
    },
    features: [
      "Até 5 hábitos diários",
      "Estatísticas básicas",
      "Notificações simples",
      "Suporte da comunidade"
    ],
    buttonText: "Plano Atual",
    isPopular: false,
    icon: Shield
  },
  {
    name: "Pro",
    description: "Para quem quer dominar o tempo e atingir metas.",
    price: {
      monthly: "17",
      yearly: "167"
    },
    features: [
      "Hábitos ilimitados",
      "Estatísticas avançadas e gráficos",
      "Insights da Rotina",
      "Notificações personalizadas",
      "Sincronização com calendário",
      "Suporte prioritário"
    ],
    buttonText: "Assinar Pro",
    isPopular: true,
    icon: Target
  },
  {
    name: "Vitalício",
    description: "Acesso sem limites para os mais dedicados.",
    price: {
      monthly: "197",
      yearly: "197"
    },
    features: [
      "Tudo do plano Pro",
      "Acesso antecipado a novas features",
      "Sessão de mentoria anual",
      "Badge exclusiva no perfil",
      "Pagamento único"
    ],
    buttonText: "Obter Vitalício",
    isPopular: false,
    icon: Feather
  }
];

export default function Subscription() {
  useLenis();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState<{name: string; description: string; price: string; cycle: string} | null>(null);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden selection:bg-foreground selection:text-background">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto relative pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-12">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mt-6 md:mt-12 mb-10 md:mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-sans text-3xl md:text-5xl font-semibold tracking-tight">
                Invista na sua <span className="underline decoration-border underline-offset-4">evolução</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl text-base md:text-lg">
                Escolha o plano perfeito para transformar sua rotina e alcançar seus objetivos com mais clareza e foco.
              </p>
            </motion.div>

            {/* Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 md:mt-8 flex items-center gap-2 bg-secondary p-1.5 rounded-full border border-border shadow-sm"
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                  billingCycle === "monthly" 
                    ? "bg-background text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                )}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  billingCycle === "yearly" 
                    ? "bg-background text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                )}
              >
                Anual
                <span className="text-[10px] uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded-full">
                  2 meses grátis
                </span>
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-24">
            {PLANS.map((plan, idx) => {
              const Icon = plan.icon;
              const isPro = plan.isPopular;
              const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
              const isLifetime = plan.name === "Vitalício";
              
              const PlanContent = () => (
                <>
                  {isPro && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-semibold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm z-20">
                      Mais Escolhido
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2.5 rounded-full border",
                      isPro ? "bg-background text-foreground border-foreground shadow-sm" : "bg-background text-muted-foreground border-border shadow-sm"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans text-2xl font-semibold text-foreground tracking-tight">{plan.name}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-medium text-muted-foreground">R$</span>
                      <span className="font-mono text-4xl font-bold text-foreground tracking-tight">{price}</span>
                      {!isLifetime && (
                        <span className="text-sm text-muted-foreground ml-1">
                          /{billingCycle === "monthly" ? "mês" : "ano"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && !isLifetime && Number(plan.price.monthly) > 0 && (
                      <p className="text-xs text-foreground mt-2 font-medium bg-secondary inline-block px-2 py-1 rounded border border-border">
                        Economize R$ {(Number(plan.price.monthly) * 12) - Number(plan.price.yearly)} no ano
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (plan.name === "Básico") return;
                      setSelectedPlan({
                        name: plan.name,
                        description: plan.description,
                        price: price,
                        cycle: billingCycle,
                      });
                    }}
                    variant={isPro ? "default" : "outline"}
                    shape="pill"
                    disabled={plan.name === "Básico"}
                    className="w-full h-auto py-3.5 px-4 mb-8 relative overflow-hidden group shadow-sm"
                  >
                    <span className="relative z-10">
                      {plan.name === "Básico" ? "Plano Atual" : plan.buttonText}
                    </span>
                    {isPro && (
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-background/20 to-transparent z-0" />
                    )}
                  </Button>

                  <div className="space-y-4 flex-1">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-sans">O que está incluído</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className={cn(
                          "w-5 h-5 shrink-0",
                          isPro ? "text-foreground" : "text-muted-foreground"
                        )} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              );

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  className={cn("h-full", isPro && "md:scale-105 z-10")}
                >
                  {isPro ? (
                    <PremiumGoldCard className="h-full flex flex-col">
                      <PlanContent />
                    </PremiumGoldCard>
                  ) : (
                    <div className={cn(
                      "relative flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300 h-full",
                      "bg-secondary/50 border border-border hover:border-foreground/20 hover:bg-secondary"
                    )}>
                      <PlanContent />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Enterprise Contact */}
          <div className="text-center pb-12">
            <p className="text-muted-foreground text-sm">
              Precisa de um plano para sua equipe? <a href="mailto:suporte@diurno.com" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-all font-medium">Fale com a gente</a>
            </p>
          </div>
        </div>
      </main>

      <StripeCheckoutModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />
    </div>
  );
}
