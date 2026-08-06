-- ====================================================================
-- MIGRATION SUPABASE - FASE 2: GATILHO DE PERFIL E STORAGE
-- ====================================================================
-- Instruções:
-- 1. Copie todo o conteúdo deste arquivo.
-- 2. Vá até o painel do Supabase -> SQL Editor -> New query.
-- 3. Cole o código e clique em "Run".
-- ====================================================================

-- 1. Adicionar novas colunas na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"push_notifications": false, "email_notifications": false, "smart_insights": true}'::jsonb;

-- 2. Função para criar perfil automaticamente após signup no auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'displayName', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar Trigger na tabela auth.users
-- (Remove se já existir para evitar erros em múltiplas execuções)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Criação do Bucket de Avatares no Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de Acesso para o Bucket 'avatars'
-- Permitir que usuários leiam qualquer avatar (Público)
CREATE POLICY "Avatares são públicos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Permitir que o usuário insira sua própria imagem
CREATE POLICY "Usuários podem fazer upload do próprio avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
);

-- Permitir que o usuário atualize sua própria imagem
CREATE POLICY "Usuários podem atualizar o próprio avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
);

-- Permitir que o usuário delete sua própria imagem
CREATE POLICY "Usuários podem deletar o próprio avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
);
