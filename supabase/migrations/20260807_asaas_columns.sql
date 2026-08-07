-- ====================================================================
-- MIGRATION SUPABASE - ADD ASAAS CUSTOMER ID
-- ====================================================================

-- Adiciona a coluna asaas_customer_id na tabela profiles se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'asaas_customer_id'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN asaas_customer_id TEXT;
    END IF;
END $$;
