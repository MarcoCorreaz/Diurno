import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useLenis } from "@/hooks/use-lenis";
import { Logo } from "@/components/composed/Logo";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/lib/firebase-errors";
import { toast } from "sonner";

export default function Register() {
  useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorFields, setErrorFields] = useState<{name?: boolean; email?: boolean; password?: boolean; confirmPassword?: boolean; mismatch?: boolean; weak?: boolean}>({});

  const saveUserToFirestore = async (user: any) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || name,
        email: user.email || email,
        goal: location.state?.goal || "",
        energy: location.state?.energy || "",
        routineDetails: location.state?.routineDetails || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (dbError) {
      handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {name?: boolean; email?: boolean; password?: boolean; confirmPassword?: boolean; mismatch?: boolean; weak?: boolean} = {};
    if (!name) errors.name = true;
    if (!email) errors.email = true;
    if (!password) errors.password = true;
    if (!confirmPassword) errors.confirmPassword = true;
    
    if (password && password.length < 8) {
      errors.weak = true;
      errors.password = true;
    }
    
    if (password && confirmPassword && password !== confirmPassword) {
      errors.mismatch = true;
      errors.password = true;
      errors.confirmPassword = true;
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
       
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await updateProfile(user, { displayName: name });
      
      await saveUserToFirestore(user);
      
      navigate("/dashboard");
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha é muito fraca.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      }

      toast.error("Erro ao criar conta", {
        description: message,
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      await saveUserToFirestore(result.user);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Erro ao criar conta com Google", {
        description: error.message,
      });
    }
  };

  const passwordStrength = password.length;

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <Logo className="mb-8" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-sans font-semibold tracking-tight text-foreground mb-2">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm">O primeiro passo para dominar o seu tempo.</p>
        </div>

        <form 
          onSubmit={handleRegister}
          className="w-full bg-card border border-border p-8 rounded-3xl flex flex-col gap-5 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Nome</label>
            <Input 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorFields(prev => ({...prev, name: false})); }}
              placeholder="Lucas"
              error={errorFields.name}
            />
          </div>

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
            <label className="text-sm font-medium text-foreground">Senha</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorFields(prev => ({...prev, password: false})); }}
              placeholder="••••••••"
              error={errorFields.password}
            />
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={cn(
                  "h-full transition-all duration-300",
                  passwordStrength === 0 ? "w-0" : 
                  passwordStrength < 4 ? "w-1/3 bg-red-500" :
                  passwordStrength < 8 ? "w-2/3 bg-yellow-500" :
                  "w-full bg-green-500"
                )} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground min-w-16 text-right">
                {passwordStrength >= 8 ? 'Forte' : passwordStrength >= 4 ? 'Média' : 'Fraca'}
              </span>
            </div>
            <p className={cn("text-[10px] flex items-center gap-1", passwordStrength >= 8 ? "text-green-500" : "text-muted-foreground")}>
              <Check className="w-3 h-3" /> Mínimo de 8 caracteres
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Confirmar Senha</label>
            <Input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={errorFields.confirmPassword}
            />
          </div>

          {(errorFields.name || errorFields.email || errorFields.password || errorFields.confirmPassword) && (
            <p className="text-xs text-red-500 font-medium text-center">
              {errorFields.mismatch ? "As senhas não coincidem." : 
               errorFields.weak ? "A senha precisa ter no mínimo 8 caracteres." :
               "Preencha todos os campos para continuar."}
            </p>
          )}

          <Button type="submit" size="xl" shape="pill" className="mt-2 w-full group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">Criar conta <ArrowRight className="w-4 h-4" /></span>
          </Button>

          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">ou</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button type="button" variant="outline" size="xl" shape="pill" className="w-full" onClick={handleGoogleRegister}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Criar com Google
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Já tem uma conta? <Link to="/login" className="text-foreground font-medium hover:underline transition-all">Faça login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
