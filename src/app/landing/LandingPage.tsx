import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar, CheckCircle2, Check } from "lucide-react";
import { useLenis } from "@/hooks/use-lenis";
import { PLANS } from "@/app/subscription/Subscription";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollExperienceSection } from "@/components/landing/ScrollExperienceSection";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { AnimatedTitle } from "@/components/effects/AnimatedTitle";
import { BorderBeam } from "@/components/effects/BorderBeam";
import { TextRotate } from "@/components/effects/TextRotate";
import { TextShimmer } from "@/components/effects/TextShimmer";
import { SunriseGlow } from "@/components/ui/SunriseGlow";
import { ShineButton } from "@/components/effects/ShineButton";
import { NumberFlow } from "@/components/effects/NumberFlow";
import { FAQAccordion } from "@/components/effects/FAQAccordion";
import { TestimonialCarousel } from "@/components/effects/TestimonialCarousel";

export default function LandingPage() {
  useLenis();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-clip font-sans relative">
      
      {/* Absolute container that spans the full page height, with a sticky child to simulate a fixed background without pushing content down or being broken by Framer Motion. */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-auto">
        <div className="sticky top-0 w-full h-screen">
          <SunriseGlow />
        </div>
      </div>

      {/* Floating Navbar (Pill Header) */}
      <div className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between transition-all duration-300 rounded-full",
            scrolled
              ? "bg-background/80 backdrop-blur-xl border border-border shadow-sm py-3 px-6 w-full max-w-3xl"
              : "bg-transparent border border-transparent py-4 px-6 w-full max-w-6xl"
          )}
        >
          <div className="font-sans text-xl font-semibold tracking-tight">Rituno.</div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">Entrar</Link>
            <Link to="/register" className={cn(buttonVariants({ size: "sm", shape: "pill" }))}>
              Começar
            </Link>
          </div>
        </motion.header>
      </div>

      {/* Hero — with TextRotate & ShineButton */}
      <section className="relative w-full overflow-hidden flex items-center min-h-[90vh] pt-32 pb-20">
        <div className="relative z-10 w-full px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-16">
          <div className="flex-1 lg:pt-16">
          <AnimatedTitle 
            text={["Seu dia,"]} 
            className="font-sans text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-2 text-foreground" 
          />
          <div className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-8 text-foreground flex items-baseline gap-3 flex-wrap">
            <span className="font-sans">no seu</span>
            <TextRotate
              words={["ritmo.", "controle.", "fluxo.", "foco."]}
              className="font-display italic text-foreground"
            />
          </div>
          <motion.p 
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-md mb-12 leading-relaxed"
          >
            Pare de perder o controle das suas tarefas. Uma rotina clara que se adapta ao seu tempo real, sem promessas mágicas.
          </motion.p>
          <motion.div 
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <ShineButton className={cn(buttonVariants({ size: "xl", shape: "pill", className: "gap-3" }))}>
              <Link to="/register" className="flex items-center gap-3">
                Organizar meu dia <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ShineButton>
          </motion.div>
        </div>

        {/* Signature Element: Analog Timeline */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-md flex justify-center lg:justify-end lg:pt-8"
        >
          <div className="relative w-full max-w-sm border border-border rounded-3xl p-8 bg-card shadow-sm">
            <div className="flex flex-col gap-8">
              {/* Morning Block */}
              <div className="flex gap-6 h-24">
                <div className="w-[3px] bg-secondary h-full relative rounded-full overflow-hidden flex-shrink-0">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '40%' }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute top-0 left-0 w-full bg-morning" 
                  />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs font-bold text-morning uppercase tracking-widest mb-1.5 font-sans">Manhã</span>
                  <span className="text-base font-medium text-foreground">Foco e Clareza</span>
                  <span className="text-sm text-muted-foreground mt-1">O trabalho denso.</span>
                </div>
              </div>
              {/* Midday Block */}
              <div className="flex gap-6 h-24">
                <div className="w-[3px] bg-secondary h-full relative rounded-full overflow-hidden flex-shrink-0">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '70%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute top-0 left-0 w-full bg-afternoon" 
                  />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs font-bold text-afternoon uppercase tracking-widest mb-1.5 font-sans">Tarde</span>
                  <span className="text-base font-medium text-foreground">Execução Ativa</span>
                  <span className="text-sm text-muted-foreground mt-1">Reuniões e alinhamentos.</span>
                </div>
              </div>
              {/* Evening Block */}
              <div className="flex gap-6 h-24">
                <div className="w-[3px] bg-secondary h-full relative rounded-full overflow-hidden flex-shrink-0">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1, delay: 1.0 }}
                    className="absolute top-0 left-0 w-full bg-muted-foreground" 
                  />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 font-sans">Noite</span>
                  <span className="text-base font-medium text-foreground">Revisão e Pausa</span>
                  <span className="text-sm text-muted-foreground mt-1">Desligando os motores.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </section>

      {/* Interactive GSAP Scroll Experience Section */}
      <ScrollExperienceSection />

      {/* Features */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="mb-20"
          >
            <TextShimmer className="font-sans text-4xl md:text-5xl font-semibold mb-6 text-foreground tracking-tight">Construído para a realidade.</TextShimmer>
            <p className="text-muted-foreground text-lg max-w-xl">Nada de dashboards poluídos. Apenas o que importa para o seu progresso diário, sem promessas mágicas.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto auto-rows-[280px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-2 relative flex flex-col justify-end bg-card border border-border rounded-2xl p-6 overflow-hidden transition-all duration-200 hover:border-white/20 group"
            >
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-background border border-border shadow-sm group-hover:text-morning transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-2xl font-semibold mb-2 text-foreground tracking-tight z-10">Organização tangível</h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md z-10">
                Veja suas tarefas em uma linha do tempo clara, com blocos bem definidos. Chega de listas infinitas e ansiedade.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-1 relative flex flex-col justify-end bg-card border border-border rounded-2xl p-6 overflow-hidden transition-all duration-200 hover:border-white/20 group"
            >
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-background border border-border shadow-sm group-hover:text-afternoon transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-2xl font-semibold mb-2 text-foreground tracking-tight z-10">Ajuste dinâmico</h3>
              <p className="text-base text-muted-foreground leading-relaxed z-10">
                Imprevistos acontecem. Realoque blocos de tempo com um clique sem frustração.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-3 relative flex flex-col md:flex-row md:items-center justify-between bg-card border border-border rounded-2xl p-8 overflow-hidden transition-all duration-200 hover:border-white/20 group"
            >
              <div className="max-w-xl z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-background border border-border shadow-sm mb-6 group-hover:text-evening transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-2xl font-semibold mb-2 text-foreground tracking-tight">Foco no agora</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Apenas o que importa no momento está visível. Sem notificações inúteis e distrações que roubam sua atenção, para que você possa desligar no fim do dia em paz.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="py-24 px-6 bg-secondary/10 border-t border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-border/50">
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-gradient mb-2 tracking-tight">
              <NumberFlow value={15200} />+
            </span>
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Rotinas geradas</span>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-gradient mb-2 tracking-tight">
              <NumberFlow value={89} />%
            </span>
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Mais foco relatado</span>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-gradient mb-2 tracking-tight">
              <NumberFlow value={42} delay={0.2} />h
            </span>
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Economizadas/mês</span>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-4xl md:text-5xl font-mono font-bold text-gradient mb-2 tracking-tight flex items-end justify-center">
              <NumberFlow value={5} delay={0.4} />.<NumberFlow value={0} delay={0.4} />
            </span>
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avaliação média</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="mb-16 text-center"
          >
            <TextShimmer className="font-sans text-4xl md:text-5xl font-semibold mb-6 text-foreground tracking-tight">Invista na sua evolução.</TextShimmer>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">Domine sua rotina por menos de um café por mês. Comece de graça e evolua no seu ritmo.</p>
            
            <div className="flex items-center justify-center gap-2 bg-secondary p-1.5 rounded-full border border-border shadow-sm inline-flex mx-auto">
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
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, idx) => {
              const Icon = plan.icon;
              const isPro = plan.isPopular;
              const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
              const isLifetime = plan.name === "Vitalício";
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  className={cn(
                    "relative flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300",
                    isPro ? "bg-background border-2 border-foreground md:scale-105 shadow-md z-10" : "bg-secondary/50 border border-border",
                    !isPro && "hover:border-foreground/20 hover:bg-secondary"
                  )}
                >
                  {isPro && (
                    <>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-semibold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm z-20">
                        Mais Escolhido
                      </div>
                      <BorderBeam size={300} duration={10} borderWidth={2} colorFrom="#ffffff" colorTo="#71717a" />
                    </>
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
                  
                  <Link to="/onboarding" className={cn(buttonVariants({ variant: isPro ? "default" : "outline", shape: "pill", className: "w-full h-auto py-3.5 px-4 mb-8 relative overflow-hidden group" }))}>
                    <span className="relative z-10">{plan.name === 'Básico' ? 'Começar Grátis' : 'Escolher ' + plan.name}</span>
                  </Link>

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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pt-24 pb-12 overflow-hidden border-t border-border">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <TextShimmer className="font-sans text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">O que dizem sobre nós</TextShimmer>
          <p className="text-muted-foreground text-lg">Pessoas reais recuperando seu tempo.</p>
        </div>
        <TestimonialCarousel 
          testimonials={[
            { name: "Lucas M.", role: "Desenvolvedor", initials: "LM", content: "A linha do tempo do Rituno mudou como eu encaro o meu dia. Não é mais uma lista infinita, é o que cabe no meu tempo real." },
            { name: "Marina S.", role: "Designer", initials: "MS", content: "Minimalista, sem notificações chatas e direto ao ponto. Exatamente o que eu precisava para focar nas minhas entregas." },
            { name: "Thiago C.", role: "Empreendedor", initials: "TC", content: "O fato de poder ajustar blocos facilmente quando imprevistos acontecem é o maior diferencial. Adeus ansiedade de lista atrasada." },
            { name: "Ana P.", role: "Estudante", initials: "AP", content: "A divisão de Manhã, Tarde e Noite com as cores me ajuda a entrar no 'modo certo' para cada parte do dia. Incrível." }
          ]} 
        />
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-border bg-secondary/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">Perguntas Frequentes</h2>
            <p className="text-muted-foreground text-lg">Tudo o que você precisa saber antes de começar.</p>
          </div>
          <FAQAccordion 
            items={[
              { question: "O Rituno funciona sem internet?", answer: "Sim. Toda a sua rotina é sincronizada localmente primeiro, garantindo que você tenha acesso rápido às suas tarefas mesmo offline. Assim que reconectar, ele sincroniza com a nuvem." },
              { question: "Posso integrar com o Google Calendar?", answer: "Estamos trabalhando nessa integração. No momento, o Rituno foca em ser sua ferramenta principal de execução e blocos de tempo, separado das reuniões externas." },
              { question: "Como funciona a divisão do dia?", answer: "O Rituno separa seu dia em três grandes blocos: Manhã (Foco/Trabalho profundo), Tarde (Execução/Reuniões) e Noite (Pausa). Acreditamos que não somos a mesma pessoa nas diferentes partes do dia." },
              { question: "Posso cancelar minha assinatura quando quiser?", answer: "Sim, você pode cancelar a qualquer momento sem amarras. O plano gratuito continuará disponível para uso básico." }
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-border bg-secondary/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <TextShimmer className="font-sans text-5xl font-semibold mb-8 text-foreground tracking-tight">Recupere o controle.</TextShimmer>
          <p className="text-muted-foreground text-xl mb-12">Crie sua primeira rotina realista em menos de 2 minutos.</p>
          <ShineButton className={cn(buttonVariants({ size: "xl", shape: "pill", className: "px-10 py-5 text-lg" }))}>
            <Link to="/onboarding">Começar Gratuitamente</Link>
          </ShineButton>
        </motion.div>
      </section>
      
      <footer className="py-12 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; 2026 Rituno. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
