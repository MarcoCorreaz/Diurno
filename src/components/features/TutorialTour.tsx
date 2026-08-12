import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOUR_STEPS = [
  {
    title: "Bem-vindo ao Rituno! 👋",
    description: "Vamos fazer um tour rápido de 1 minuto para você dominar sua nova rotina.",
    target: null,
  },
  {
    title: "Sua Linha do Tempo",
    description: "Aqui ficam suas tarefas divididas por períodos (Manhã, Tarde, Noite). O foco é no que você precisa fazer agora.",
    target: "timeline-section",
  },
  {
    title: "Adicionar Hábitos",
    description: "Clique aqui ou pressione N para adicionar uma nova tarefa ou hábito à sua rotina.",
    target: "add-task-btn",
  },
  {
    title: "Assistente de IA",
    description: "Sempre que precisar de ajuda para organizar seu dia ou criar novos hábitos, converse com a nossa inteligência artificial.",
    target: "ai-chat-btn",
  },
  {
    title: "Tudo Pronto! 🚀",
    description: "Você está no controle. Comece adicionando sua primeira tarefa do dia.",
    target: null,
  }
];

export function TutorialTour({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Migrate legacy key if present
    const legacyKey = `diurno_tutorial_${userId}`;
    const newKey = `rituno_tutorial_${userId}`;
    const legacyData = localStorage.getItem(legacyKey);
    if (legacyData && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, legacyData);
    }

    // Check if user has already seen the tutorial
    const hasSeenTutorial = localStorage.getItem(newKey);
    if (!hasSeenTutorial) {
      // Small delay to let the dashboard render first
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const closeTour = () => {
    setIsOpen(false);
    localStorage.setItem(`rituno_tutorial_${userId}`, "completed");
  };

  const nextStep = () => {
    if (currentStep === TOUR_STEPS.length - 1) {
      closeTour();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  const stepInfo = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6 overflow-hidden pointer-events-auto"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-secondary w-full">
            <motion.div 
              className="h-full bg-foreground"
              initial={{ width: `${(currentStep / TOUR_STEPS.length) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-start mb-4 mt-2">
            <h3 className="text-xl font-semibold text-foreground font-sans tracking-tight">
              {stepInfo.title}
            </h3>
            <button 
              onClick={closeTour}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
            {stepInfo.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Passo {currentStep + 1} de {TOUR_STEPS.length}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={closeTour}>
                Pular
              </Button>
              <Button size="sm" className="gap-1.5" onClick={nextStep}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Concluir <Check className="w-4 h-4" /></>
                ) : (
                  <>Próximo <ChevronRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
