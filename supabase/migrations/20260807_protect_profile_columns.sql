-- ====================================================================
-- MIGRATION SUPABASE - PROTECT PROFILE COLUMNS
-- ====================================================================

-- Create trigger function to protect plan and stripe_customer_id from client-side updates
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is an authenticated user (not service_role), prevent changes to protected columns
  IF auth.role() = 'authenticated' THEN
    NEW.plan = OLD.plan;
    NEW.stripe_customer_id = OLD.stripe_customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists to allow idempotency
DROP TRIGGER IF EXISTS update_profiles_protect_columns ON public.profiles;

-- Create the trigger
CREATE TRIGGER update_profiles_protect_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_columns();
