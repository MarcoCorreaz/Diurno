import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Calendar, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/composed/Logo";

export default function Sidebar() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const path = location.pathname;

  return (
    <nav className="fixed md:static bottom-0 left-0 z-50 w-full md:w-64 md:h-full md:border-r border-t md:border-t-0 border-border flex flex-row md:flex-col items-center md:items-start py-3 md:py-8 md:px-6 justify-around md:justify-start shrink-0 bg-background text-foreground pb-safe">
      <div className="hidden md:block w-full mb-10 px-2">
        <Link to="/dashboard" className="block hover:opacity-80 transition-opacity">
          <div className="font-sans text-xl font-semibold tracking-tight">Diurno.</div>
        </Link>
      </div>
      
      <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full md:w-auto justify-around md:justify-start flex-1">
        <Link 
          to="/dashboard" 
          className={cn(
            "p-2 md:px-4 md:py-3 rounded-lg md:rounded-xl cursor-pointer transition-all flex items-center md:gap-4 md:w-full",
            path === "/dashboard" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <Home className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
          <span className="hidden md:block">Dashboard</span>
        </Link>
        <Link 
          to="/rotina" 
          className={cn(
            "p-2 md:px-4 md:py-3 rounded-lg md:rounded-xl cursor-pointer transition-all flex items-center md:gap-4 md:w-full",
            path === "/rotina" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <Calendar className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
          <span className="hidden md:block">Semana</span>
        </Link>
        <Link 
          to="/planos" 
          className={cn(
            "p-2 md:px-4 md:py-3 rounded-lg md:rounded-xl cursor-pointer transition-all flex items-center md:gap-4 md:w-full",
            path === "/planos" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <CreditCard className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
          <span className="hidden md:block">Planos</span>
        </Link>
        <Link 
          to="/perfil" 
          className={cn(
            "p-2 rounded-lg cursor-pointer transition-all flex items-center md:hidden",
            path === "/perfil" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <div className="w-6 h-6 shrink-0 rounded-full border border-border p-0.5">
            <img src={currentUser?.photoURL || "https://github.com/shadcn.png"} className="w-full h-full rounded-full bg-muted object-cover" alt="Profile" />
          </div>
        </Link>
        <Link 
          to="/settings" 
          className={cn(
            "p-2 rounded-lg cursor-pointer transition-all flex items-center md:hidden",
            path === "/settings" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <Settings className="w-6 h-6 shrink-0" />
        </Link>
      </div>
      
      <div className="hidden md:flex flex-col w-full gap-4 mt-auto">
        <Link 
          to="/settings" 
          className={cn(
            "p-2 md:px-4 md:py-3 rounded-lg md:rounded-xl cursor-pointer transition-all flex items-center md:gap-4 md:w-full mb-4",
            path === "/settings" ? "text-foreground bg-secondary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <Settings className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
          <span className="hidden md:block">Configurações</span>
        </Link>
        
        <Link to="/perfil" className="flex items-center gap-4 w-full p-2 md:p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border cursor-pointer">
          <div className="w-10 h-10 shrink-0 rounded-full border border-border p-0.5">
            <img src={currentUser?.photoURL || "https://github.com/shadcn.png"} className="w-full h-full rounded-full bg-muted object-cover" alt="Profile" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">{currentUser?.displayName || "Usuário"}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.email || ""}</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
