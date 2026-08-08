import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/engagement/ShimmerButton";
import { Brain, Target, Zap, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/hooks/use-lenis";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function Onboarding() {
  useLenis();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form states
  const [goal, setGoal] = useState("");
  const [energy, setEnergy] = useState("");
  const [routineDetails, setRoutineDetails] = useState("");

  useEffect(() => {
    if (step === 0 && containerRef.current) {
      const ctx = gsap.context(() => {
        const sections = gsap.utils.toArray(".story-section");
        
        sections.forEach((section: any, i) => {
          gsap.fromTo(
            section.querySelectorAll(".story-element"),
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Parallax floating elements
        gsap.to(".floating-bg-1", {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [step]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(1);
  };

  const finishOnboarding = async () => {
    if (currentUser) {
      try {
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
            goal: goal,
            energy: energy,
            routine_details: routineDetails,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) throw error;
        toast.success("Perfil configurado com sucesso!");
        navigate("/dashboard");
      } catch (err) {
        toast.error("Erro ao salvar as preferências.");
      }
    }
  };

  return (
    <AuroraBackground className="min-h-screen">
      <AnimatePresence mode="wait" custom={1}>
        {step === 0 && (
          <motion.div 
            key="story"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
            ref={containerRef}
          >
            {/* Decorative background elements for parallax */}
            <div className="fixed top-1/4 left-10 w-32 h-32 bg-morning/10 rounded-full blur-2xl floating-bg-1 pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-10 text-center px-6 story-section">
              <div className="w-16 h-16 bg-morning/20 border border-morning/30 rounded-2xl flex items-center justify-center mb-8 story-element mx-auto">
                <Brain className="w-8 h-8 text-morning" />
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6 story-element">
                Nós aprendemos<br />como você funciona.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto story-element">
                Role para baixo para entender como a Diurno personaliza cada minuto do seu dia.
              </p>
              <div className="mt-16 animate-bounce story-element">
                <div className="w-8 h-12 rounded-full border-2 border-border flex items-start justify-center p-1 mx-auto">
                  <div className="w-1.5 h-3 bg-morning rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 story-section">
              <div className="w-16 h-16 bg-afternoon/20 border border-afternoon/30 rounded-2xl flex items-center justify-center mb-8 story-element mx-auto">
                <Target className="w-8 h-8 text-afternoon" />
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 story-element">
                Foco no que importa.
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto story-element">
                Eliminamos o ruído. A IA organiza suas prioridades baseando-se nos seus picos naturais de energia.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 story-section">
              <div className="w-16 h-16 bg-[evening]/20 border border-[evening]/30 rounded-2xl flex items-center justify-center mb-8 story-element mx-auto">
                <Zap className="w-8 h-8 text-[evening]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 story-element">
                Pronto para começar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto story-element mb-10">
                Vamos configurar seu perfil em 2 passos simples.
              </p>
              <div className="story-element">
                <ShimmerButton onClick={nextStep} className="px-10">
                  Configurar meu perfil <ArrowRight className="w-4 h-4 ml-2" />
                </ShimmerButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full min-h-screen flex items-center justify-center p-6 relative z-10"
          >
            <div className="max-w-xl w-full bg-card border border-border rounded-[32px] p-10 shadow-2xl">
              <div className="mb-10 text-center">
                <div className="text-morning text-sm font-medium mb-2">Passo 1 de 3</div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-3">Qual seu principal objetivo?</h2>
                <p className="text-muted-foreground text-sm">Isso nos ajuda a priorizar suas tarefas automaticamente.</p>
              </div>

              <div className="grid gap-4 mb-10">
                {[
                  { id: "produtividade", title: "Máxima Produtividade", desc: "Foco em trabalho e entregas" },
                  { id: "saude", title: "Saúde e Bem-estar", desc: "Foco em hábitos saudáveis e exercícios" },
                  { id: "equilibrio", title: "Equilíbrio", desc: "Balanço entre trabalho e vida pessoal" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all w-full text-left",
                      goal === item.id 
                        ? "bg-morning/10 border-morning" 
                        : "bg-muted border-border hover:border-[#3F3F46]"
                    )}
                  >
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      goal === item.id ? "border-morning bg-morning" : "border-[#3F3F46]"
                    )}>
                      {goal === item.id && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(0)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Voltar</button>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!goal}
                  size="lg"
                  className="flex items-center gap-2 px-6"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full min-h-screen flex items-center justify-center p-6 relative z-10"
          >
            <div className="max-w-xl w-full bg-card border border-border rounded-[32px] p-10 shadow-2xl">
              <div className="mb-10 text-center">
                <div className="text-afternoon text-sm font-medium mb-2">Passo 2 de 3</div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-3">Seu pico de energia</h2>
                <p className="text-muted-foreground text-sm">Quando você se sente mais produtivo no dia?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { id: "manha", title: "Manhã", time: "06:00 - 12:00" },
                  { id: "tarde", title: "Tarde", time: "12:00 - 18:00" },
                  { id: "noite", title: "Noite", time: "18:00 - 00:00" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEnergy(item.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border cursor-pointer transition-all text-center w-full",
                      energy === item.id 
                        ? "bg-afternoon/10 border-afternoon" 
                        : "bg-muted border-border hover:border-[#3F3F46]"
                    )}
                  >
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Voltar</button>
                <ShimmerButton 
                  onClick={() => setStep(3)} 
                  className={cn("px-6", !energy && "opacity-50 pointer-events-none")}
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </ShimmerButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full min-h-screen flex items-center justify-center p-6 relative z-10"
          >
            <div className="max-w-xl w-full bg-card border border-border rounded-[32px] p-10 shadow-2xl">
              <div className="mb-8 text-center">
                <div className="text-[evening] text-sm font-medium mb-2">Passo 3 de 3</div>
                <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground mb-3">Detalhes da sua rotina</h2>
                <p className="text-muted-foreground text-sm">Conte o que você faz no dia e o que gostaria de fazer no seu tempo livre. A IA usará isso para organizar seu cronograma.</p>
              </div>

              <div className="flex flex-col gap-4 mb-10">
                <textarea
                  value={routineDetails}
                  onChange={(e) => setRoutineDetails(e.target.value)}
                  placeholder="Ex: Acordo às 7h, trabalho das 9h às 18h com 1h de almoço. Quero incluir 30min de leitura e ir à academia 3x na semana..."
                  className="w-full min-h-[160px] bg-background border-2 border-border p-4 rounded-2xl text-base focus:outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/60 shadow-sm"
                  autoFocus
                />
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Voltar</button>
                <ShimmerButton 
                  onClick={finishOnboarding} 
                  className={cn("px-6", !routineDetails.trim() && "opacity-50 pointer-events-none")}
                >
                  Criar minha rotina <ArrowRight className="w-4 h-4 ml-2" />
                </ShimmerButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
}
