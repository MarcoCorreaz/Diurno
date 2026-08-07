-- ====================================================================
-- MIGRATION SUPABASE - CORREÇÃO DA LÓGICA DE STREAK
-- ====================================================================
-- Resolve o problema da trigger atual que muitas vezes apenas incrementava
-- indefinidamente, ou não levava em conta as completudes sequenciais do hábito

CREATE OR REPLACE FUNCTION update_task_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_completion DATE;
    current_val INT;
    max_val INT;
BEGIN
    -- Obter a última completude ANTERIOR a essa nova
    SELECT completed_date INTO last_completion
    FROM task_completions
    WHERE task_id = NEW.task_id
      AND completed_date < NEW.completed_date
    ORDER BY completed_date DESC
    LIMIT 1;

    -- Pega os valores atuais da task
    SELECT current_streak, max_streak INTO current_val, max_val
    FROM tasks
    WHERE id = NEW.task_id;

    -- Se não tem last_completion, o streak passa a ser 1
    -- Se tem last_completion, vamos calcular a diferença em dias
    -- NOTA: O campo completed_date é armazenado como string YYYY-MM-DD
    -- então convertemos para DATE para subtrair
    IF last_completion IS NULL THEN
        current_val := 1;
    ELSIF NEW.completed_date::DATE - last_completion::DATE = 1 THEN
        current_val := current_val + 1;
    ELSIF NEW.completed_date::DATE - last_completion::DATE > 1 THEN
        -- Houve falha no dia anterior
        current_val := 1;
    ELSIF NEW.completed_date::DATE = last_completion::DATE THEN
        -- Mesma data, não incrementa (não deveria acontecer por causa do unique, mas previne erro)
        current_val := current_val;
    END IF;

    IF current_val > max_val THEN
        max_val := current_val;
    END IF;

    -- Atualiza a tarefa
    UPDATE tasks
    SET current_streak = current_val,
        max_streak = max_val,
        total_completions = total_completions + 1,
        updated_at = NOW()
    WHERE id = NEW.task_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (Trigger já existe, o create or replace function acima sobrescreve a lógica dela)
