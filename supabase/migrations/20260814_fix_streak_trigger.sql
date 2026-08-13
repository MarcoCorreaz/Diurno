-- ====================================================================
-- CORREÇÃO: Reconectar o trigger de streak à função correta
-- ====================================================================
-- O trigger 'on_task_completed' foi criado apontando para handle_task_completion()
-- (lógica simples de +1/-1), mas a função com lógica sequencial real é
-- update_task_streak(). Esta migration reconecta o trigger.
-- ====================================================================

-- Remove o trigger antigo que chamava a função errada
DROP TRIGGER IF EXISTS on_task_completed ON public.task_completions;

-- Recria o trigger apontando para a função correta
CREATE TRIGGER on_task_completed
    AFTER INSERT ON public.task_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_task_streak();

-- A função handle_task_completion() ainda existe mas não é mais chamada pelo trigger.
-- Ela pode ser dropada em uma janela de manutenção futura.
