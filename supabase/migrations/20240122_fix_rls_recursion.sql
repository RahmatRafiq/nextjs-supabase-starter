-- Migration to fix RLS Recursion
-- 1. Create a function to sync role changes from `public.profiles` to `auth.users.raw_app_meta_data`
-- 2. Create a trigger to run this function on profile insert/update
-- 3. Update `is_admin` and `is_super_admin` to use JWT claims instead of querying `profiles` table

-- Function to sync role from profiles to auth.users metadata
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's metadata in auth.users
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync role on profile update/insert
DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_role();

-- Sync existing users (Backfill)
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT * FROM public.profiles LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', profile_record.role)
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Update `is_admin` to use JWT claims (No DB lookup = No Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  requested_role text;
BEGIN
  -- Check if the role in the JWT is 'admin' or 'super_admin'
  -- current_setting('request.jwt.claims', true) returns the JWT claims as a JSON string
  -- We extract app_metadata -> role
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') INTO requested_role;
  
  RETURN requested_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update `is_super_admin` to use JWT claims
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  requested_role text;
BEGIN
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') INTO requested_role;
  RETURN requested_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
