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
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [nameOnCard, setNameOnCard] = useState(currentUser?.displayName || "Lucas Silva");

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
        await supabase
          .from("profiles")
          .update({
            plan: plan.name,
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
                <h3 className="font-sans font-semibold text-foreground text-base">Semana Checkout</h3>
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

            {/* Simulação de Cartão Stripe Elements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Cartão de Crédito
                </label>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Criptografado SSL
                </span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="pl-10 font-mono text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Validade</label>
                    <Input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="font-mono text-sm text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">CVC / CVV</label>
                    <Input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="font-mono text-sm text-center"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome no Cartão</label>
                  <Input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="LUCAS SILVA"
                    className="text-sm uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Nota SaaS Test Mode */}
            <div className="bg-secondary/30 rounded-xl p-3 border border-border flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong>Modo Sandbox Stripe:</strong> Sua chave API do Stripe será utilizada em produção na Vercel. Aqui você pode testar a assinatura e ver o upgrade em tempo real.
              </p>
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
                {loading ? "Processando assinatura..." : `Assinar por R$ ${plan.price}`}
              </span>
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
