-- ====================================================================
-- MIGRATION SUPABASE - FASE 3: GATILHO DE STREAKS (OFENSIVAS)
-- ====================================================================
-- Instruções:
-- 1. Copie todo o conteúdo deste arquivo.
-- 2. Vá até o painel do Supabase -> SQL Editor -> New query.
-- 3. Cole o código e clique em "Run".
-- ====================================================================

-- Função que atualiza as estatísticas da tarefa (Streaks e Completions)
CREATE OR REPLACE FUNCTION public.handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Ao completar a tarefa (inserir log)
        UPDATE public.tasks
        SET total_completions = total_completions + 1,
            current_streak = current_streak + 1,
            max_streak = GREATEST(max_streak, current_streak + 1),
            updated_at = NOW()
        WHERE id = NEW.task_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Ao desmarcar a tarefa (deletar log)
        UPDATE public.tasks
        SET total_completions = GREATEST(0, total_completions - 1),
            current_streak = GREATEST(0, current_streak - 1),
            updated_at = NOW()
        WHERE id = OLD.task_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cria o Trigger na tabela task_completions
DROP TRIGGER IF EXISTS on_task_completed ON public.task_completions;

CREATE TRIGGER on_task_completed
    AFTER INSERT OR DELETE ON public.task_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_task_completion();
