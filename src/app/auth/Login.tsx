import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLenis } from "@/hooks/use-lenis";
import { Logo } from "@/components/composed/Logo";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
  useLenis();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorFields, setErrorFields] = useState<{email?: boolean; password?: boolean}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {email?: boolean; password?: boolean} = {};
    if (!email) errors.email = true;
    if (!password) errors.password = true;

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/dashboard");
    } catch (error: any) {
      setErrorFields({ email: true, password: true });
      
      let message = "E-mail ou senha inválidos.";
      if (error?.message?.includes("Invalid login credentials")) {
        message = "E-mail ou senha inválidos.";
      } else if (error?.status === 429) {
        message = "Muitas tentativas. Tente novamente mais tarde.";
      }
      
      toast.error("Erro ao fazer login", {
        description: message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error("Erro ao entrar com Google", {
        description: error.message,
      });
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Logo className="mb-8" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm">Insira suas credenciais para acessar sua rotina.</p>
        </div>

        <form 
          onSubmit={handleLogin}
          className="w-full bg-card border border-border p-8 rounded-3xl flex flex-col gap-5 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorFields(prev => ({...prev, email: false})); }}
              placeholder="lucas@exemplo.com"
              error={errorFields.email}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <Link to="/recuperar-senha" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Esqueceu a senha?</Link>
            </div>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorFields(prev => ({...prev, password: false})); }}
              placeholder="••••••••"
              error={errorFields.password}
            />
          </div>

          {(errorFields.email || errorFields.password) && (
            <p className="text-xs text-red-500 font-medium text-center">Credenciais inválidas.</p>
          )}

          <Button type="submit" size="xl" shape="pill" className="mt-2 w-full group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">Entrar <ArrowRight className="w-4 h-4" /></span>
          </Button>

          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">ou</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button type="button" variant="outline" size="xl" shape="pill" className="w-full" onClick={handleGoogleLogin}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Não tem uma conta? <Link to="/register" className="text-foreground font-medium hover:underline transition-all">Cadastre-se</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
