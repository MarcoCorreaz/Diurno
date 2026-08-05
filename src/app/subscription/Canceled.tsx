import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Canceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl text-center flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-4 flex items-center gap-2 justify-center">
          Pagamento Cancelado
        </h1>
        
        <p className="text-muted-foreground mb-8">
          O processo de pagamento foi interrompido e nenhuma cobrança foi feita. Quando estiver pronto, você pode tentar novamente.
        </p>

        <div className="flex gap-4 w-full">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline"
            size="lg" 
            shape="pill" 
            className="w-full"
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate("/planos")} 
            size="lg" 
            shape="pill" 
            className="w-full"
          >
            Ver Planos
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
