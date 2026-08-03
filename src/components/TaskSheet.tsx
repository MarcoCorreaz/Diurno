import React, { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task;
}

export function TaskSheet({ isOpen, onClose, onSave, initialData }: TaskSheetProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setCategory(initialData?.category || "");
      setTime(initialData?.time || "");
      setError(false);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!title || !category || !time) {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset shake
      return;
    }
    
    // Convert time to 12h format if needed or just use as is for simplicity
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title,
      category,
      time,
      completed: initialData?.completed || false,
    });
    
    toast.success(initialData ? "Tarefa atualizada com sucesso!" : "Tarefa criada com sucesso!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-border">
                  <CheckSquare className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-sans font-semibold tracking-tight text-foreground">
                  {initialData ? "Editar Tarefa" : "Nova Tarefa"}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <motion.div 
                className="flex flex-col gap-6"
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">O que você quer realizar?</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Ler 20 páginas"
                    className={cn(
                      "bg-card border rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground shadow-sm",
                      error && !title ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-border focus:border-foreground focus:ring-1 focus:ring-foreground"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={cn(
                        "w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none transition-all appearance-none shadow-sm",
                        error && !category ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-border focus:border-foreground focus:ring-1 focus:ring-foreground"
                      )}
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      <option value="Saúde • Diário">Saúde • Diário</option>
                      <option value="Trabalho • Foco">Trabalho • Foco</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Desenvolvimento">Desenvolvimento</option>
                      <option value="Lazer">Lazer</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">Horário</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={cn(
                        "w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none transition-all shadow-sm",
                        error && !time ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-border focus:border-foreground focus:ring-1 focus:ring-foreground"
                      )}
                    />
                  </div>
                </div>
                
                {error && (
                  <p className="text-xs text-red-500 font-medium">Preencha todos os campos obrigatórios.</p>
                )}
              </motion.div>
            </div>

            <div className="p-6 border-t border-border bg-background">
              <button 
                onClick={handleSave}
                className="group relative w-full inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-foreground px-8 font-medium text-background transition-all hover:opacity-90 shadow-sm"
              >
                Salvar Tarefa
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
