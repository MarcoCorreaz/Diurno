-- ====================================================================
-- MIGRATION SUPABASE - CRIT-03: RLS DELETE em task_completions
-- ====================================================================
-- Garante que apenas o dono dos logs pode deletá-los.
-- Isso impede que um usuário autenticado malicioso delete completions
-- de outros usuários se adivinhar task_ids.
-- ====================================================================

-- Remover política antiga (provavelmente ausente ou incompleta)
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios logs de tarefas" ON public.task_completions;

-- Criar política segura com verificação dupla de user_id e task ownership
CREATE POLICY "Usuários podem deletar seus próprios logs de tarefas"
    ON public.task_completions FOR DELETE
    USING (
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND user_id = auth.uid())
    );
