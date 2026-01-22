-- =============================================
-- SEED DATA SCRIPT (FIXED TYPE CASTING)
-- Populates the database with initial dummy data for testing.
-- Assumes at least one user exists in auth.users
-- =============================================

-- 1. SEED MEMBERS (FIXED)
INSERT INTO public.members (name, nim, email, batch, status, division, position, joined_at, bio, interests, achievements)
VALUES
  ('Rahmat Rafiq', '60200121001', 'rahmat@example.com', '2021', 'active', 'media-information', 'staff', NOW(), 'Mahasiswa Teknik Informatika.', ARRAY['coding', 'design'], ARRAY['Juara 1 Lomba Web Design']),
  ('Siti Aminah', '60200121002', 'siti@example.com', '2021', 'active', 'academic', 'staff', NOW(), 'Suka belajar.', ARRAY['reading', 'research'], ARRAY[]::text[]);

-- 2. SEED LEADERSHIP
INSERT INTO public.leadership (name, position, division, photo, period_start, period_end, "order", bio)
VALUES
  ('Ahmad Fauzi', 'ketua', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '2024-01-01', '2024-12-31', 1, 'Ketua periode 2024');

-- 3. SEED ARTICLES
WITH first_user AS (SELECT id, email FROM auth.users LIMIT 1)
INSERT INTO public.articles (title, slug, excerpt, content, category, status, cover_image, published_at, author_id, author)
SELECT
  'Selamat Datang',
  'selamat-datang',
  'Artikel pertama.',
  'Konten artikel...',
  'info',
  'published',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  NOW(),
  first_user.id,
  jsonb_build_object('name', 'Admin', 'role', 'admin', 'email', first_user.email)
FROM first_user;

-- 4. SEED EVENTS
WITH first_user AS (SELECT id FROM auth.users LIMIT 1)
INSERT INTO public.events (title, slug, description, content, category, status, start_date, end_date, location, cover_image, organizer, creator_id)
SELECT
  'Seminar AI',
  'seminar-ai',
  'Seminar AI.',
  'Konten seminar...',
  'seminar',
  'upcoming',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '3 hours',
  jsonb_build_object('name', 'Aula', 'address', 'Kampus'),
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  jsonb_build_object('name', 'Panitia', 'contact', '08123'),
  first_user.id
FROM first_user;
