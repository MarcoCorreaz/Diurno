import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AsaasCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    description: string;
    price: string;
    cycle: string;
  } | null;
}

export function AsaasCheckoutModal({ isOpen, onClose, plan }: AsaasCheckoutModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !plan) return null;

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sua sessão expirou. Entre novamente para continuar.");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planName: plan.name, cycle: plan.cycle }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || "Não foi possível abrir o pagamento.");
      window.location.assign(data.url);
    } catch (error: any) {
      setLoading(false);
      toast.error("Erro ao iniciar pagamento", {
        description: error?.message || "Tente novamente em alguns instantes.",
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
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="asaas-checkout-title"
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border bg-secondary/60 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">A</div>
              <div>
                <h3 id="asaas-checkout-title" className="font-sans font-semibold text-foreground">Checkout Diurno</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Pagamento processado pelo Asaas
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Fechar pagamento"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleCheckout} className="space-y-6 p-6">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plano selecionado</span>
                <h4 className="mt-0.5 text-lg font-bold text-foreground">
                  {plan.name}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({plan.name === "Vitalício" ? "pagamento único" : plan.cycle === "yearly" ? "anual" : "mensal"})
                  </span>
                </h4>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-foreground">R$ {plan.price}</div>
                {plan.name !== "Vitalício" && (
                  <span className="text-xs text-muted-foreground">/{plan.cycle === "yearly" ? "ano" : "mês"}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-secondary/30 p-4 text-center">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Checkout hospedado e seguro</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Seus dados de pagamento são informados diretamente no Asaas. O Diurno só ativa o plano após a confirmação autenticada do pagamento.
                </p>
              </div>
            </div>
            <Button type="submit" size="xl" shape="pill" disabled={loading} className="w-full shadow-md">
              {loading ? "Abrindo Asaas..." : "Continuar para o pagamento"}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Mantém o import antigo até que todos os consumidores sejam renomeados.
export { AsaasCheckoutModal as StripeCheckoutModal };
