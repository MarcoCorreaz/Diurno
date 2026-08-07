-- ====================================================================
-- MIGRATION SUPABASE - CORREÇÃO RLS TASK COMPLETIONS
-- ====================================================================

-- Substituir a política de INSERT para impedir que um usuário insira logs para a task de outro
DROP POLICY IF EXISTS "Usuários podem criar seus próprios logs de tarefas" ON public.task_completions;

CREATE POLICY "Usuários podem criar seus próprios logs de tarefas" 
    ON public.task_completions FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND user_id = auth.uid())
    );
