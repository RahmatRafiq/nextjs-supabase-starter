-- BREAK RECURSION ON PROFILES
-- We temporarily remove the "Super admin can view all" policy which likely causes recursion
-- because it calls is_super_admin() which selects from profiles.

DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can update all profiles" ON public.profiles;

-- Ensure the basic policy exists
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Ensure we can confirm it worked
SELECT 'Policies successfully updated' as status;
