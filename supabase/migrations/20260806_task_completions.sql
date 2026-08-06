-- ====================================================================
-- MIGRATION SUPABASE - CRIAÇÃO DO HISTÓRICO DE TAREFAS (TASK COMPLETIONS)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, completed_date)
);

-- Habilitar Row Level Security para task_completions
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para task_completions
CREATE POLICY "Usuários podem ver seus próprios logs de tarefas" 
    ON public.task_completions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios logs de tarefas" 
    ON public.task_completions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios logs de tarefas" 
    ON public.task_completions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios logs de tarefas" 
    ON public.task_completions FOR DELETE 
    USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_task_completions_user_id ON public.task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task_id ON public.task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_date ON public.task_completions(completed_date);
