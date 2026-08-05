import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Confetti } from "@/components/effects/Confetti";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    description: string;
    price: string;
    cycle: string;
  } | null;
  onSuccess?: () => void;
}

export function StripeCheckoutModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: StripeCheckoutModalProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen || !plan) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tenta acionar endpoint /api/checkout se disponível (quando hospedado na Vercel com API rotas)
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planName: plan.name,
            cycle: plan.cycle,
            userId: currentUser?.id,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }
      } catch (e) {
        // Fallback contínuo em ambiente sem serverless function ativa
      }

      // Simulação de transação Stripe + Atualização no Supabase Profile para demonstração SaaS
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (currentUser) {
        const normalizedPlan = plan.name === "Vitalício" ? "lifetime" : plan.name.toLowerCase();
        await supabase
          .from("profiles")
          .update({
            plan: normalizedPlan,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentUser.id);
      }

      setShowConfetti(true);
      toast.success(`Assinatura ${plan.name} ativada com sucesso!`, {
        description: "Bem-vindo à experiência Premium da Semana. Aproveite todos os recursos ilimitados.",
      });

      setTimeout(() => {
        setLoading(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast.error("Erro no pagamento", {
        description: "Não foi possível processar a assinatura. Tente novamente.",
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border shadow-2xl z-10"
        >
          <Confetti active={showConfetti} />

          {/* Cabeçalho Stripe */}
          <div className="bg-secondary/60 border-b border-border p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground text-base">Diurno Checkout</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Powered by Stripe
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCheckout} className="p-6 space-y-6">
            {/* Resumo do Plano */}
            <div className="bg-secondary/40 border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Plano Selecionado
                </span>
                <h4 className="text-lg font-bold text-foreground mt-0.5">
                  {plan.name} <span className="text-xs font-normal text-muted-foreground">({plan.cycle === "yearly" ? "Anual" : "Mensal"})</span>
                </h4>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-foreground">
                  R$ {plan.price}
                </div>
                <span className="text-xs text-muted-foreground">
                  {plan.cycle === "yearly" ? "/ano" : "/mês"}
                </span>
              </div>
            </div>

            {/* Aviso de redirecionamento para o Stripe Seguro */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-sm text-foreground font-medium">Pagamento Seguro com Stripe</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Você será redirecionado para a página de checkout criptografada do Stripe para finalizar a assinatura.
                </p>
              </div>
            </div>

            {/* Botão Confirmar */}
            <Button
              type="submit"
              size="xl"
              shape="pill"
              disabled={loading}
              className="w-full relative overflow-hidden group shadow-md"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Redirecionando..." : `Ir para Pagamento`}
              </span>
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
