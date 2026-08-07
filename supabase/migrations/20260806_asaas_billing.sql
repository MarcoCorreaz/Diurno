-- Migração da cobrança Stripe para Asaas.
-- O plano continua sendo atualizado exclusivamente pelo webhook usando service role.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS billing_provider TEXT DEFAULT 'asaas',
  ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT,
  ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS asaas_checkout_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_asaas_customer_id
  ON public.profiles (asaas_customer_id)
  WHERE asaas_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_asaas_subscription_id
  ON public.profiles (asaas_subscription_id)
  WHERE asaas_subscription_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.billing_checkouts (
  checkout_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('Pro', 'Vitalício')),
  cycle TEXT NOT NULL CHECK (cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paid', 'canceled', 'expired', 'failed')),
  external_reference TEXT NOT NULL UNIQUE,
  asaas_customer_id TEXT,
  asaas_subscription_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem consultar seus próprios checkouts"
  ON public.billing_checkouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_billing_checkouts_user_id
  ON public.billing_checkouts(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  checkout_id TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.billing_webhook_events ENABLE ROW LEVEL SECURITY;
-- Sem políticas para clientes: somente a service role acessa esta tabela.

CREATE OR REPLACE TRIGGER update_billing_checkouts_modtime
  BEFORE UPDATE ON public.billing_checkouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Remove o identificador antigo somente depois que a migração dos dados for concluída.
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
