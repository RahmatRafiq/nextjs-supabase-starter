# Admin Panel Setup Guide

## Current Issue
The admin panel login is not working because the `profiles` table is missing from the database.

## Fix Steps

### Step 1: Run Migration 003

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (`kjpfhtsnowkjervwuaii`)
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the contents of `/supabase/migrations/003_create_profiles_table.sql`
6. Paste into the editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. You should see: "Success. No rows returned"

### Step 2: Verify Profiles Table Exists

Run this query in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

Expected result: Should return 1 row with `table_name = 'profiles'`

### Step 3: Create Your First Super Admin User

**Option A: If you already have a user in auth.users**

Check existing users:
```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

If you see your email, create a profile for it:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '[YOUR_USER_ID_FROM_ABOVE]',
  '[YOUR_EMAIL]',
  'Super Administrator',
  'super_admin'
);
```

**Option B: Create a new user via Supabase Dashboard**

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **Add user** → **Create new user**
3. Fill in:
   - Email: your email
   - Password: strong password (save it!)
   - Auto Confirm User: ✅ Check this
4. Click **Create user**
5. Copy the new user's ID
6. Go back to **SQL Editor** and run:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '[PASTE_USER_ID_HERE]',
  '[YOUR_EMAIL]',
  'Super Administrator',
  'super_admin'
);
```

### Step 4: Verify Profile Created

```sql
SELECT p.id, p.email, p.full_name, p.role, u.email as auth_email
FROM profiles p
JOIN auth.users u ON u.id = p.id;
```

Expected: Should show your user with role = 'super_admin'

### Step 5: Test Login

1. Clear browser cache and cookies (important!)
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Or use Incognito/Private window
2. Navigate to: http://localhost:3000/admin/login
3. Enter your email and password
4. Should redirect to: http://localhost:3000/admin/dashboard
5. Check browser console (F12) for any errors

## Expected Behavior After Fix

✅ Login page loads without errors
✅ After entering credentials, redirects to dashboard
✅ Dashboard shows stats (member count, article count, etc.)
✅ Sidebar shows navigation items based on role
✅ User info shows in sidebar (name/email + role badge)
✅ Can navigate to Members, Articles, Events pages
✅ No errors in browser console

## Troubleshooting

### Issue: "Profile not found" after login
**Solution:** Run this to check if profile exists:
```sql
SELECT * FROM profiles WHERE email = '[YOUR_EMAIL]';
```
If empty, manually insert profile (see Step 3).

### Issue: "Invalid email or password"
**Possible causes:**
1. User not confirmed in auth.users
2. Wrong password
3. Email typo

**Solution:** Check auth.users:
```sql
SELECT id, email, confirmed_at, email_confirmed_at 
FROM auth.users 
WHERE email = '[YOUR_EMAIL]';
```

If `confirmed_at` is NULL, update:
```sql
UPDATE auth.users 
SET confirmed_at = NOW(), 
    email_confirmed_at = NOW() 
WHERE email = '[YOUR_EMAIL]';
```

### Issue: Infinite redirect to /admin/login
**Possible causes:**
1. Profile not found
2. Cookie issues

**Solution:**
1. Check browser DevTools → Application → Cookies
2. Look for cookies starting with `sb-` or `supabase-`
3. If missing, clear all cookies and try login again
4. Check middleware logs in terminal

### Issue: "relation 'profiles' does not exist"
**Solution:** Migration 003 not run. Go back to Step 1.

## Next Steps After Login Works

Once login is confirmed working:

1. ✅ Update database types: `npx supabase gen types typescript > src/lib/supabase/database.types.ts`
2. ✅ Fix cookie configuration in Supabase client
3. ✅ Test all CRUD pages (Members, Articles, Events)
4. ✅ Test role-based permissions (create test users with admin/kontributor roles)
5. ✅ Implement Leadership CRUD (not yet done)
6. ✅ Implement Users management (super_admin only)

## Verification Checklist

- [ ] Migration 003 executed successfully
- [ ] Profiles table exists in database
- [ ] Super admin user created with profile
- [ ] Can login at /admin/login
- [ ] Redirects to /admin/dashboard after login
- [ ] Dashboard shows correct stats
- [ ] Sidebar shows all menu items (super_admin sees all 6 items)
- [ ] Can navigate to Members page
- [ ] Can navigate to Articles page
- [ ] Can navigate to Events page
- [ ] No errors in browser console
- [ ] No errors in terminal logs

## Contact/Debug Info

If issues persist, check:
1. Terminal running `npm run dev` for errors
2. Browser console (F12) for JavaScript errors
3. Supabase Dashboard → Logs → Postgres Logs for database errors
4. Network tab (F12) to see failed API requests
