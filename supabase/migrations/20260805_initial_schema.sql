-- ====================================================================
-- MIGRATION SUPABASE - SCHEMA INICIAL DO DIURNO
-- ====================================================================
-- Este arquivo deve ser executado no SQL Editor do painel do Supabase.
-- Cria tabelas 'profiles' e 'tasks', índices e políticas de Row Level Security (RLS).
-- ====================================================================

-- 1. Criação da tabela de perfis de usuário (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    goal TEXT DEFAULT '',
    energy TEXT DEFAULT '',
    routine_details TEXT DEFAULT '',
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem criar seu próprio perfil" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem deletar seu próprio perfil" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = id);


-- 2. Criação da tabela de tarefas/hábitos (tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    time TEXT DEFAULT '',
    category TEXT DEFAULT '',
    day_of_week TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security para tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para tasks
CREATE POLICY "Usuários podem ver suas próprias tarefas" 
    ON public.tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias tarefas" 
    ON public.tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias tarefas" 
    ON public.tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias tarefas" 
    ON public.tasks FOR DELETE 
    USING (auth.uid() = user_id);


-- 3. Índices para performance em pesquisas
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_day_of_week ON public.tasks(day_of_week);


-- 4. Função e Trigger para atualizar automaticamente a coluna updated_at
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_modified_column();

CREATE OR REPLACE TRIGGER update_tasks_modtime
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_modified_column();
