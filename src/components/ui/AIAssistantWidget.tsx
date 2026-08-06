import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Olá! Como posso otimizar a sua rotina hoje?",
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ message: textToSend }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erro na resposta do servidor");
      }
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.text,
      };
      
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Dica Diurno IA: Para otimizar seu ritmo diário, separe atividades de foco analítico pela manhã, execução principal à tarde e desconexão à noite.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const aiActions = [
    { label: "Gerar Rotina", icon: <Sparkles className="w-3 h-3" />, prompt: "Crie uma rotina matinal produtiva de 3 hábitos" },
    { label: "Dica de Foco", icon: <Target className="w-3 h-3" />, prompt: "Me dê uma dica avançada para focar por mais tempo" },
    { label: "Energia Rápida", icon: <Zap className="w-3 h-3" />, prompt: "Estou com sono à tarde. O que posso fazer rapidamente para ter energia?" },
  ];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-foreground rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform z-50 group border border-border"
          >
            <div className="absolute inset-0 bg-foreground rounded-full animate-ping opacity-20"></div>
            <Sparkles className="w-6 h-6 text-background group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-8 right-8 w-[380px] h-[600px] z-50 flex flex-col overflow-hidden"
          >
            {/* Elegant Border Effect wrapper */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-border/80 to-transparent p-[1px] pointer-events-none z-0"></div>
            <div className="relative z-10 w-full h-full bg-background/80 backdrop-blur-3xl rounded-[2rem] flex flex-col overflow-hidden shadow-2xl border border-border/50">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow blur-sm opacity-50"></div>
                    <div className="relative w-full h-full bg-card border border-border rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-sans tracking-tight text-foreground">Diurno Intelligence</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex max-w-[85%]",
                      msg.sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.sender === "user"
                          ? "bg-foreground text-background rounded-tr-sm"
                          : "bg-secondary text-foreground border border-border/50 rounded-tl-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex max-w-[85%] mr-auto justify-start">
                    <div className="p-4 rounded-2xl bg-secondary text-foreground border border-border/50 rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border/50 flex flex-col gap-3">
                {/* AI Actions */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
                  {aiActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.prompt)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-foreground hover:bg-secondary hover:border-border transition-colors whitespace-nowrap"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Comande a IA..."
                    className="w-full bg-secondary/50 border border-border/50 rounded-full pl-4 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border focus:ring-1 focus:ring-border transition-all"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background disabled:opacity-50 transition-colors hover:scale-105"
                  >
                    <Send className="w-4 h-4 -ml-0.5" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
