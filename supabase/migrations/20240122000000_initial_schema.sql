-- =============================================
-- HMJF UIN Alauddin Makassar - Database Schema
-- =============================================
-- Initial schema matching production state
-- RLS with JWT-based authorization (no recursion)
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. HELPER FUNCTIONS (JWT-based, no recursion)
-- =============================================

-- Function to sync role from profiles to auth.users metadata
-- This ensures role is always in JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin (uses JWT claims - NO DB QUERY)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from JWT claims (no database query = no recursion)
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') INTO user_role;
  RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super_admin (uses JWT claims)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role text;
BEGIN
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') INTO user_role;
  RETURN user_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup (auto creates profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'kontributor')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'kontributor' CHECK (role IN ('super_admin', 'admin', 'kontributor')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Production State - No recursive super admin policies)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Cannot change own role
  );

CREATE POLICY "System can insert profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_role();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. MEMBERS TABLE
-- =============================================
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  photo TEXT,
  batch TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'alumni')),
  division TEXT,
  position TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL,
  graduated_at TIMESTAMP WITH TIME ZONE,
  bio TEXT,
  interests TEXT[],
  achievements TEXT[],
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_batch ON members(batch);
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_members_search ON members USING GIN (to_tsvector('indonesian', name || ' ' || nim));

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active members"
  ON members FOR SELECT
  USING (true);

CREATE POLICY "Admin full access members"
  ON members FOR ALL
  USING (is_admin());

-- Trigger
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. ARTICLES TABLE
-- =============================================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('post', 'blog', 'opinion', 'publication', 'info')),
  author JSONB NOT NULL,
  author_id UUID REFERENCES auth.users,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  cover_image TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_search ON articles USING GIN (to_tsvector('indonesian', title || ' ' || excerpt || ' ' || content));

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Kontributor view own"
  ON articles FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Kontributor create"
  ON articles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kontributor')
  );

CREATE POLICY "Kontributor update own draft"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id AND status IN ('draft', 'pending'));

CREATE POLICY "Admin view all"
  ON articles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin insert all"
  ON articles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update all"
  ON articles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin delete all"
  ON articles FOR DELETE
  USING (is_admin());

-- Trigger
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 5. EVENTS TABLE
-- =============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('seminar', 'workshop', 'community-service', 'competition', 'training', 'other')),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB NOT NULL,
  cover_image TEXT NOT NULL,
  images TEXT[],
  organizer JSONB NOT NULL,
  registration_url TEXT,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_creator_id ON events(creator_id);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Kontributor create events"
  ON events FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kontributor')
  );

CREATE POLICY "Kontributor update own events"
  ON events FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Admin full access events"
  ON events FOR ALL
  USING (is_admin());

-- Trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. LEADERSHIP TABLE
-- =============================================
CREATE TABLE public.leadership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('ketua', 'wakil-ketua', 'sekretaris', 'bendahara', 'coordinator', 'member')),
  division TEXT CHECK (division IN ('internal-affairs', 'external-affairs', 'academic', 'student-development', 'entrepreneurship', 'media-information', 'sports-arts', 'islamic-spirituality')),
  photo TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  nim TEXT,
  batch TEXT,
  bio TEXT,
  social_media JSONB,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leadership_period ON leadership(period_start, period_end);
CREATE INDEX idx_leadership_order ON leadership("order");

-- Enable RLS
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view leadership"
  ON leadership FOR SELECT
  USING (true);

CREATE POLICY "Admin full access leadership"
  ON leadership FOR ALL
  USING (is_admin());

-- Trigger
CREATE TRIGGER update_leadership_updated_at
  BEFORE UPDATE ON leadership
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
