import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Logo } from "@/components/composed/Logo";

export default function RecoverPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;

      toast.success("E-mail de recuperação enviado!", {
        description: "Se o e-mail existir, você receberá um link na sua caixa de entrada."
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      if (err.message?.includes('invalid')) {
         setError("E-mail com formato inválido.");
      } else {
         toast.success("E-mail de recuperação enviado!", {
           description: "Se o e-mail existir, você receberá um link na sua caixa de entrada."
         });
         setTimeout(() => {
           navigate("/login");
         }, 2000);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full mb-10 mt-8 relative z-20">
        <Link to="/" className="mb-8 hover:scale-105 transition-transform">
          <Logo />
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-foreground mb-2">Recuperar Senha</h1>
          <p className="text-muted-foreground text-sm">Enviaremos um link de recuperação para você.</p>
        </div>
      </div>

      <form 
        onSubmit={handleRecover}
        className="w-full bg-card border border-border p-8 rounded-3xl flex flex-col gap-5 shadow-sm relative z-20"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">E-mail</label>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lucas@exemplo.com"
            error={error}
          />
        </div>

        <button 
          type="submit"
          className="mt-2 group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-foreground px-8 font-medium text-background transition-all hover:opacity-90 shadow-sm"
        >
          <span className="relative z-10 flex items-center gap-2">
            Enviar Link
          </span>
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-background/20 to-transparent z-0" />
        </button>

        <div className="text-center mt-2">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar para o Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
