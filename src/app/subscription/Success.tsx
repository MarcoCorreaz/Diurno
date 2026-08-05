import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/effects/Confetti";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Aqui você pode adicionar lógica opcional para verificar
    // no banco de dados se a assinatura já foi ativada pelo webhook.
    // O webhook do Stripe já deve ter lidado com isso.
  }, [sessionId]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground p-6">
      <Confetti isActive={true} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl text-center flex flex-col items-center"
      >
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
    </div>
  );
}
