-- ====================================================================
-- MIGRATION SUPABASE - FASE 4: INTEGRAÇÃO STRIPE
-- ====================================================================
-- Instruções:
-- 1. Copie todo o conteúdo deste arquivo.
-- 2. Vá até o painel do Supabase -> SQL Editor -> New query.
-- 3. Cole o código e clique em "Run".
-- ====================================================================

-- 1. Adicionar a coluna stripe_customer_id na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
