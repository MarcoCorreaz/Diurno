import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Logo } from "@/components/composed/Logo";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password
      });

      if (resetError) throw resetError;

      toast.success("Senha atualizada com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full mb-10 mt-8 relative z-20">
        <Logo />
        <div className="text-center mt-8">
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-foreground mb-2">Criar Nova Senha</h1>
          <p className="text-muted-foreground text-sm">Digite a sua nova senha abaixo.</p>
        </div>
      </div>

      <form 
        onSubmit={handleReset}
        className="w-full bg-card border border-border p-8 rounded-3xl flex flex-col gap-5 shadow-sm relative z-20"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Nova Senha</label>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            error={error}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="mt-2 group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-foreground px-8 font-medium text-background transition-all hover:opacity-90 shadow-sm disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? "Atualizando..." : "Atualizar Senha"}
          </span>
          {!loading && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-background/20 to-transparent z-0" />
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
