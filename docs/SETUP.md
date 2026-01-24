# Setup Guide - Next.js + Supabase Starterkit

Panduan lengkap untuk setup project dari nol hingga running di local development.

---

## 📋 Prerequisites

Pastikan Anda sudah install:

- **Node.js 18+** ([Download](https://nodejs.org/))
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- **npm atau yarn**
  ```bash
  npm --version   # Should show 9.x.x or higher
  ```

- **Git**
  ```bash
  git --version
  ```

- **Akun Supabase** (gratis di [supabase.com](https://supabase.com))

---

## 🚀 Step 1: Clone & Install

### 1.1 Clone Repository

```bash
git clone https://github.com/efisiendev/nextjs-supabase-starterkit.git
cd nextjs-supabase-starterkit
```

### 1.2 Install Dependencies

```bash
npm install
```

Ini akan menginstall semua dependencies yang diperlukan:
- Next.js 14
- React 18
- Supabase Client
- TipTap Editor
- Tailwind CSS
- Framer Motion
- Dan lainnya (lihat `package.json`)

**Troubleshooting:**
- Jika error `ERESOLVE`, coba: `npm install --legacy-peer-deps`
- Jika lambat, coba pakai yarn: `yarn install`

---

## 🔐 Step 2: Setup Supabase Project

### 2.1 Create New Supabase Project

1. Buka [supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Click **"New Project"**
4. Fill in project details:
   - **Name:** Contoh: "My Starterkit"
   - **Database Password:** Generate strong password (SAVE THIS!)
   - **Region:** Pilih terdekat (e.g., Southeast Asia)
   - **Pricing Plan:** Free tier (cukup untuk development)
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

### 2.2 Get API Credentials

1. Di Supabase Dashboard, klik **Project Settings** (icon gear)
2. Klik **API** di sidebar
3. Copy credentials berikut:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public (Anonymous Key):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
   ```

   **service_role secret (Service Role Key):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
   ```

⚠️ **IMPORTANT:**
- `anon public` aman untuk client-side (dilindungi RLS)
- `service_role` adalah SECRET - jangan expose di browser!

---

## 📝 Step 3: Setup Environment Variables

### 3.1 Copy .env.example

```bash
cp .env.example .env.local
```

### 3.2 Edit .env.local

Buka `.env.local` dan isi dengan credentials dari Step 2.2:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Organization Name"

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=628123456789

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Feature Flags - KEEP ALL FALSE for now
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=false
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=false
NEXT_PUBLIC_USE_SUPABASE_EVENTS=false
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=false
NEXT_PUBLIC_USE_SUPABASE_SETTINGS=false
```

**Customization:**
- `NEXT_PUBLIC_SITE_NAME`: Ganti dengan nama organisasi Anda
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Format `628123456789` (tanpa +, spasi, atau dash)

⚠️ **NEVER commit .env.local to git!** (sudah ada di `.gitignore`)

---

## 🗃️ Step 4: Run Database Migration

### 4.1 Open SQL Editor

1. Di Supabase Dashboard, klik **SQL Editor** di sidebar kiri
2. Klik **"New query"**

### 4.2 Copy Migration SQL

1. Buka file `supabase/migrations/20240122000000_initial_schema.sql` di project Anda
2. Copy **SELURUH ISI FILE** (Ctrl+A, Ctrl+C)
3. Paste ke SQL Editor di Supabase

### 4.3 Run Migration

1. Click **"Run"** button (atau Ctrl+Enter)
2. Wait for success message
3. Verify no errors in output panel

**What This Creates:**
- ✅ Tables: `profiles`, `articles`, `events`, `members`, `leadership`, `site_settings`
- ✅ RLS Policies untuk semua tables
- ✅ Helper functions: `is_admin()`, `is_super_admin()`
- ✅ Trigger: Auto-create profile on user signup
- ✅ Indexes untuk query performance

### 4.4 Verify Tables Created

1. Klik **Table Editor** di sidebar
2. Anda harus lihat 6 tables:
   - `profiles`
   - `articles`
   - `events`
   - `members`
   - `leadership`
   - `site_settings`

---

## 👤 Step 5: Create First Admin User

### 5.1 Run Development Server (First Time)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5.2 Sign Up

1. Klik **Login** di header atau buka [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Klik **"Sign up"** tab
3. Fill in:
   - Email: `admin@example.com`
   - Password: (minimal 6 karakter)
4. Click **"Sign up"**
5. Check email untuk verification link (jika email confirmation enabled)

### 5.3 Set User Role to super_admin

**CRITICAL:** By default, user baru tidak punya role. Kita perlu set manual di Supabase.

1. Di Supabase Dashboard, klik **Authentication** di sidebar
2. Klik **Users**
3. Lihat user yang baru Anda buat → Click pada user tersebut
4. Click **"Edit user"** button atau icon pensil
5. Scroll ke **Raw User Meta Data** section
6. Click **"Edit"** atau **"Add field"**
7. Tambahkan JSON berikut:

   ```json
   {
     "role": "super_admin"
   }
   ```

   **IMPORTANT:**
   - Jika sudah ada field lain, tambahkan `"role": "super_admin"` ke dalam object
   - Pastikan syntax JSON benar (koma, quotes, dll)
   - Field `role` harus di `raw_app_meta_data`, BUKAN di `raw_user_meta_data`

8. Click **"Save"**

### 5.4 Re-login

1. Logout dari aplikasi (klik user menu → Logout)
2. Login kembali dengan credentials yang sama
3. Anda sekarang sudah jadi super_admin!
4. Verify dengan mengakses [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ✅ Step 6: Enable Feature Flags

Sekarang kita akan enable Supabase data fetching satu per satu.

### 6.1 Test dengan Mock Data Dulu

Default, semua flag masih `false`, jadi app menggunakan mock data.

1. Buka [http://localhost:3000](http://localhost:3000)
2. Browse articles, events, members, leadership
3. Semua data dari mock files (bukan database)

### 6.2 Enable Members First (Simplest)

Edit `.env.local`:

```env
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
```

Restart dev server:
```bash
# Ctrl+C to stop
npm run dev
```

Buka [http://localhost:3000/members](http://localhost:3000/members)
- Seharusnya kosong (belum ada data di database)
- Masuk ke admin: [http://localhost:3000/admin/members](http://localhost:3000/admin/members)
- Create beberapa members untuk testing

### 6.3 Enable Leadership

```env
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=true
```

Restart → test → create data via admin panel

### 6.4 Enable Articles

```env
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
```

Restart → test → create articles via admin panel

**Note:** Articles punya RLS policies yang strict:
- Admin/super_admin bisa lihat semua
- Kontributor hanya bisa lihat draft sendiri
- Public hanya bisa lihat yang `status='published'`

### 6.5 Enable Events

```env
NEXT_PUBLIC_USE_SUPABASE_EVENTS=true
```

Restart → test → create events via admin panel

### 6.6 Enable Settings (Optional)

```env
NEXT_PUBLIC_USE_SUPABASE_SETTINGS=true
```

Ini untuk dynamic site settings. Jika false, menggunakan constants dari `config/index.ts`.

### 6.7 Final .env.local

Setelah semua enabled:

```env
# Feature Flags - All enabled for production
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
NEXT_PUBLIC_USE_SUPABASE_EVENTS=true
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=true
NEXT_PUBLIC_USE_SUPABASE_SETTINGS=true
```

---

## 🧪 Step 7: Test All Features

### 7.1 Test Public Pages

- [http://localhost:3000](http://localhost:3000) - Homepage
- [http://localhost:3000/articles](http://localhost:3000/articles) - Articles
- [http://localhost:3000/events](http://localhost:3000/events) - Events
- [http://localhost:3000/members](http://localhost:3000/members) - Members
- [http://localhost:3000/leadership](http://localhost:3000/leadership) - Leadership

### 7.2 Test Admin Panel

Login sebagai super_admin, lalu test:

- [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) - Dashboard with stats
- [http://localhost:3000/admin/articles](http://localhost:3000/admin/articles) - Article CRUD
- [http://localhost:3000/admin/events](http://localhost:3000/admin/events) - Event CRUD
- [http://localhost:3000/admin/members](http://localhost:3000/admin/members) - Member CRUD
- [http://localhost:3000/admin/leadership](http://localhost:3000/admin/leadership) - Leadership CRUD
- [http://localhost:3000/admin/users](http://localhost:3000/admin/users) - User management
- [http://localhost:3000/admin/settings](http://localhost:3000/admin/settings) - Site settings

### 7.3 Test Permissions

Create 3 users dengan role berbeda:

**Super Admin** (sudah dibuat):
- ✅ Access semua pages
- ✅ Manage users
- ✅ Publish articles

**Admin**:
1. Sign up user baru
2. Set role: `{"role": "admin"}` di Supabase Dashboard
3. Login → test permissions:
   - ✅ Access articles, events, members, leadership, settings
   - ❌ TIDAK bisa manage users
   - ✅ Bisa publish articles

**Kontributor**:
1. Sign up user baru
2. Set role: `{"role": "kontributor"}` di Supabase Dashboard
3. Login → test permissions:
   - ✅ Bisa create articles/events (status draft)
   - ✅ Bisa edit draft sendiri
   - ❌ TIDAK bisa publish (need admin approval)
   - ❌ TIDAK bisa edit article orang lain
   - ❌ TIDAK bisa access members, leadership, users, settings

---

## 🐛 Troubleshooting

### Error: "User has no role"

**Problem:** Profile tidak ter-create atau role tidak ter-set.

**Solution:**
1. Check `profiles` table di Supabase → ada entry untuk user Anda?
2. Jika tidak ada, trigger failed. Check migration ran successfully.
3. Manually insert profile:
   ```sql
   INSERT INTO profiles (id, email, role)
   VALUES (
     'your-user-id-from-auth-users-table',
     'admin@example.com',
     'super_admin'
   );
   ```
4. Atau set role via Auth Users:
   - Dashboard → Authentication → Users
   - Edit user → `raw_app_meta_data` → add `{"role": "super_admin"}`

### Error: "RLS policy violation"

**Problem:** Row Level Security blocking your request.

**Solution:**
1. Verify user role is set correctly
2. Check if JWT token has role in claims (logout → login)
3. Verify RLS policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'articles';
   ```
4. Test with service role key (bypasses RLS) to isolate issue

### Error: "Cannot read properties of null (reading 'role')"

**Problem:** `profile` is null in AuthContext.

**Solution:**
1. Check browser console for auth errors
2. Verify Supabase credentials in `.env.local`
3. Check network tab → is `/profiles` query returning data?
4. Try manual profile fetch:
   ```typescript
   const { data } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', user.id)
     .single();
   console.log(data);
   ```

### Dev server won't start

**Problem:** Port 3000 already in use.

**Solution:**
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Module not found errors

**Problem:** Missing dependencies.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or try:
npm install --legacy-peer-deps
```

---

## 🚢 Next Steps

Setelah setup selesai:

1. **Customize Configuration**
   - Edit `config/index.ts` - site info, categories, divisions, menu items

2. **Add Your Own Data**
   - Create articles via admin panel
   - Add members and leadership
   - Create events
   - Upload images (Supabase Storage)

3. **Extend Features**
   - Copy existing patterns (articles, events, members) untuk add entity baru
   - Read README.md section "Tambah Entity Baru" untuk step-by-step guide

4. **Deploy to Production**
   - Read README.md section "Deployment"
   - Setup Vercel or Docker
   - Set environment variables di hosting

---

## 📚 Additional Resources

- **[README.md](../README.md)** - Overview & features
- **[MASTER_PLAN.md](MASTER_PLAN.md)** - Development roadmap and phases
- **GitHub Issues** - For questions and support

---

**Selamat! 🎉 Starterkit Anda sudah ready untuk development.**

Jika ada masalah, check [GitHub Issues](https://github.com/your-repo/issues) atau baca troubleshooting guide di atas.
