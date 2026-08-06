import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/effects/Confetti";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { currentUser } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 10;

    const checkPlan = async () => {
      try {
        const { data } = await supabase.from('profiles').select('plan').eq('id', currentUser.id).single();
        if (data && (data.plan === 'Pro' || data.plan === 'Premium' || data.plan === 'Vitalício')) {
          setIsPro(true);
          setIsVerifying(false);
          return;
        }
      } catch (err) {
        console.error("Erro ao verificar plano", err);
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        timeoutId = setTimeout(checkPlan, 2000); // Poll every 2 seconds
      } else {
        setIsVerifying(false); // Give up polling, maybe show a warning
      }
    };

    checkPlan();

    return () => clearTimeout(timeoutId);
  }, [currentUser, sessionId]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground p-6">
      <AnimatePresence>
        {isVerifying ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center max-w-sm"
          >
            <Loader2 className="w-10 h-10 animate-spin text-foreground/50" />
            <h2 className="text-xl font-semibold">Confirmando seu pagamento...</h2>
            <p className="text-muted-foreground text-sm">Aguardando a resposta da operadora do cartão. Isso pode levar alguns segundos.</p>
          </motion.div>
        ) : isPro ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl text-center flex flex-col items-center relative overflow-hidden"
          >
            <Confetti isActive={true} />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold font-sans tracking-tight mb-4 flex items-center gap-2 justify-center">
              Bem-vindo ao Pro <Sparkles className="w-6 h-6 text-yellow-500" />
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Sua assinatura foi confirmada com sucesso. Agora você tem acesso a todos os recursos premium do Diurno. Prepare-se para decolar a sua rotina!
            </p>

            <Button 
              onClick={() => navigate("/dashboard")} 
              size="lg" 
              shape="pill" 
              className="w-full"
            >
              Ir para o Dashboard
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="timeout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-orange-500" />
            </div>
            
            <h1 className="text-2xl font-bold font-sans tracking-tight mb-4">
              Pagamento em Processamento
            </h1>
            
            <p className="text-muted-foreground mb-8 text-sm">
              Seu pagamento ainda está sendo processado pela operadora. Você será atualizado para o plano Pro assim que for confirmado (geralmente em alguns minutos).
            </p>

            <Button 
              onClick={() => navigate("/dashboard")} 
              size="lg" 
              shape="pill" 
              variant="outline"
              className="w-full"
            >
              Ir para o Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
