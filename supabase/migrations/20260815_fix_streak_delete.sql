-- ====================================================================
-- MIGRATION SUPABASE - CORREÇÃO DA LÓGICA DE STREAK (INSERT E DELETE)
-- ====================================================================

CREATE OR REPLACE FUNCTION update_task_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_completion DATE;
    current_val INT;
    max_val INT;
    t_id UUID;
    
    -- Variáveis para recálculo do zero no caso de DELETE
    rec RECORD;
    prev_date DATE;
    calc_streak INT;
BEGIN
    -- Determina o task_id correto dependendo da operação
    IF TG_OP = 'DELETE' THEN
        t_id := OLD.task_id;
    ELSE
        t_id := NEW.task_id;
    END IF;

    -- Pega os valores atuais da task
    SELECT current_streak, max_streak INTO current_val, max_val
    FROM tasks
    WHERE id = t_id;

    IF TG_OP = 'INSERT' THEN
        -- Obter a última completude ANTERIOR a essa nova
        SELECT completed_date INTO last_completion
        FROM task_completions
        WHERE task_id = t_id
          AND completed_date < NEW.completed_date
        ORDER BY completed_date DESC
        LIMIT 1;

        IF last_completion IS NULL THEN
            current_val := 1;
        ELSIF NEW.completed_date::DATE - last_completion::DATE = 1 THEN
            current_val := current_val + 1;
        ELSIF NEW.completed_date::DATE - last_completion::DATE > 1 THEN
            current_val := 1;
        ELSIF NEW.completed_date::DATE = last_completion::DATE THEN
            current_val := current_val;
        END IF;

        IF current_val > max_val THEN
            max_val := current_val;
        END IF;

        UPDATE tasks
        SET current_streak = current_val,
            max_streak = max_val,
            total_completions = total_completions + 1,
            updated_at = NOW()
        WHERE id = t_id;

    ELSIF TG_OP = 'DELETE' THEN
        -- Recalcular current_streak do zero com base nas completudes restantes
        calc_streak := 0;
        prev_date := NULL;

        -- Percorre todas as completudes da task da mais recente para a mais antiga
        FOR rec IN 
            SELECT completed_date::DATE as cdate 
            FROM task_completions 
            WHERE task_id = t_id 
            ORDER BY completed_date DESC 
        LOOP
            IF prev_date IS NULL THEN
                calc_streak := 1;
                prev_date := rec.cdate;
            ELSE
                IF prev_date - rec.cdate = 1 THEN
                    calc_streak := calc_streak + 1;
                    prev_date := rec.cdate;
                ELSIF prev_date = rec.cdate THEN
                    -- Mesma data, ignora
                ELSE
                    -- Quebrou a sequência
                    EXIT;
                END IF;
            END IF;
        END LOOP;

        UPDATE tasks
        SET current_streak = calc_streak,
            -- max_streak nunca diminui
            total_completions = GREATEST(0, total_completions - 1),
            updated_at = NOW()
        WHERE id = t_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar o trigger para cobrir INSERT OR DELETE
DROP TRIGGER IF EXISTS on_task_completed ON public.task_completions;

CREATE TRIGGER on_task_completed
    AFTER INSERT OR DELETE ON public.task_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_task_streak();
