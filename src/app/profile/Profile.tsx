import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CreditCard, Crown, Flame, Lock, LogOut, Target } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ProfileState {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  memberSince: string;
  billingStatus: string;
  billingCycle: string;
  hasRecurringSubscription: boolean;
}

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [statsData, setStatsData] = useState({ streak: 0, completions: 0 });
  const [userProfile, setUserProfile] = useState<ProfileState>({
    name: currentUser?.displayName || "Usuário",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://github.com/shadcn.png",
    plan: "free",
    memberSince: "Recente",
    billingStatus: "inactive",
    billingCycle: "",
    hasRecurringSubscription: false,
  });

  useEffect(() => {
    if (!currentUser) return;

    const memberSince = currentUser.raw?.created_at
      ? new Date(currentUser.raw.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      : "Recente";

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, avatar_url, plan, billing_status, billing_cycle, asaas_subscription_id")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        toast.error("Não foi possível carregar os dados de cobrança.");
        return;
      }

      setUserProfile({
        name: data.name || currentUser.displayName || "Usuário",
        email: data.email || currentUser.email || "",
        avatar: data.avatar_url || currentUser.photoURL || "https://github.com/shadcn.png",
        plan: data.plan || "free",
        memberSince,
        billingStatus: data.billing_status || "inactive",
        billingCycle: data.billing_cycle || "",
        hasRecurringSubscription: Boolean(data.asaas_subscription_id),
      });
    };

    const loadStats = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("current_streak, total_completions")
        .eq("user_id", currentUser.id);

      const totals = (data || []).reduce(
        (acc, task: any) => ({
          streak: acc.streak + (task.current_streak || 0),
          completions: acc.completions + (task.total_completions || 0),
        }),
        { streak: 0, completions: 0 },
      );
      setStatsData(totals);
    };

    void loadProfile();
    void loadStats();
  }, [currentUser]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Use uma imagem de até 5 MB.");
      return;
    }

    try {
      setIsUploading(true);
      const extension = file.name.split(".").pop() || "jpg";
      const path = `${currentUser.id}-${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", currentUser.id);
      if (updateError) throw updateError;

      setUserProfile((current) => ({ ...current, avatar: publicUrl }));
      toast.success("Foto de perfil atualizada.");
    } catch (error: any) {
      toast.error("Erro ao atualizar foto", { description: error?.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (userProfile.plan.toLowerCase() === "free" || userProfile.plan.toLowerCase() === "básico") {
      navigate("/planos");
      return;
    }

    if (!userProfile.hasRecurringSubscription) {
      toast.info("Seu plano não possui cobrança recorrente para cancelar.");
      return;
    }

    const confirmed = window.confirm("Deseja cancelar a renovação da sua assinatura Asaas?");
    if (!confirmed) return;

    try {
      setIsManaging(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sessão expirada.");

      const response = await fetch("/api/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Não foi possível cancelar a assinatura.");

      setUserProfile((current) => ({
        ...current,
        plan: "free",
        billingStatus: "canceled",
        hasRecurringSubscription: false,
      }));
      toast.success("Assinatura cancelada com sucesso.");
    } catch (error: any) {
      toast.error("Erro ao gerenciar assinatura", { description: error?.message });
    } finally {
      setIsManaging(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const normalizedPlan = userProfile.plan.toLowerCase();
  const isPremium = normalizedPlan === "pro" || normalizedPlan === "vitalício" || normalizedPlan === "lifetime";
  const stats = [
    { label: "Sequência", value: `${statsData.streak} dias`, icon: Flame, color: "text-orange-500" },
    { label: "Concluídas", value: `${statsData.completions}`, icon: Target, color: "text-foreground" },
    { label: "Conquistas", value: "Em breve", icon: Lock, color: "text-muted-foreground" },
  ];

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 pb-24 md:p-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Conta</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Seu Perfil</h1>
          </header>

          <section className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-start md:p-8">
            {isPremium && <Crown className="absolute right-6 top-6 h-8 w-8 text-amber-500" />}
            <div className="relative shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-full border border-border bg-secondary">
                <img src={userProfile.avatar} alt={userProfile.name} className="h-full w-full object-cover" />
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background shadow-sm" aria-label="Alterar foto de perfil">
                <Camera className="h-4 w-4" />
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} className="hidden" />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Membro desde {userProfile.memberSince}</p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary">
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="font-mono text-xl font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <button onClick={handleManageSubscription} disabled={isManaging} className="flex w-full items-center justify-between border-b border-border p-5 text-left transition-colors hover:bg-secondary/50 disabled:opacity-60">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"><CreditCard className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-medium">Cobrança Asaas</h3>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.hasRecurringSubscription ? "Gerencie ou cancele sua renovação." : "Consulte ou escolha um plano."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile.plan}</p>
                <p className="text-xs text-muted-foreground">{userProfile.billingStatus}{userProfile.billingCycle ? ` · ${userProfile.billingCycle}` : ""}</p>
              </div>
            </button>
            <button onClick={handleLogout} className="flex w-full items-center gap-4 p-5 text-left text-red-500 transition-colors hover:bg-red-500/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background"><LogOut className="h-5 w-5" /></div>
              <div><h3 className="font-medium">Sair da conta</h3><p className="text-sm opacity-80">Encerrar sessão neste dispositivo.</p></div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
