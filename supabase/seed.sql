-- =============================================
-- COMPREHENSIVE SEED DATA - GENERIC PHARMACY DEPT
-- Data generik untuk jurusan farmasi di kampus manapun
-- =============================================

-- =============================================
-- CLEANUP: DELETE EXISTING DATA (KECUALI PROFILES)
-- =============================================
-- Hapus data lama agar seed fresh
-- TIDAK menghapus profiles (user accounts)
-- =============================================

DELETE FROM public.site_settings;
DELETE FROM public.leadership;
DELETE FROM public.members;
DELETE FROM public.events;
DELETE FROM public.articles;

-- =============================================
-- 1. ARTICLES (Konten Markdown)
-- =============================================

INSERT INTO public.articles (title, slug, excerpt, content, category, status, cover_image, published_at, author, tags, featured)
VALUES
(
  'Inovasi Penelitian Farmasi di Era Modern',
  'inovasi-penelitian-farmasi-era-modern',
  'Mahasiswa farmasi terus berinovasi dalam penelitian kefarmasian untuk menghadapi tantangan kesehatan modern.',
  E'# Inovasi Penelitian Farmasi di Era Modern

## Latar Belakang

Perkembangan ilmu farmasi mengalami kemajuan pesat dalam beberapa tahun terakhir. Mahasiswa farmasi berperan penting dalam ekosistem penelitian kesehatan.

## Bidang Penelitian

### Fitofarmaka
- Ekstraksi bahan aktif dari tanaman obat lokal
- Formulasi sediaan herbal terstandar
- Uji aktivitas farmakologi

### Teknologi Farmasi
- Sistem penghantaran obat terkini
- Nanoteknologi farmasi
- Sediaan lepas lambat

## Kolaborasi

Mahasiswa menjalin kerjasama dengan berbagai institusi:
- Laboratorium penelitian universitas
- Industri farmasi
- Lembaga kesehatan

> "Penelitian adalah kunci kemajuan profesi farmasi"',
  'publication',
  'published',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  NOW() - INTERVAL '2 days',
  '{"name":"Tim Redaksi","role":"admin","email":"redaksi@pharmacy.ac.id"}'::jsonb,
  ARRAY['Penelitian', 'Farmasi', 'Inovasi'],
  true
),
(
  'Pengabdian Masyarakat: Edukasi DAGUSIBU',
  'pengabdian-masyarakat-edukasi-dagusibu',
  'Tim mahasiswa farmasi memberikan edukasi penggunaan obat yang benar kepada masyarakat.',
  E'# Pengabdian Masyarakat: Edukasi DAGUSIBU

## Program Kegiatan

Tim pengabdian mahasiswa farmasi melaksanakan edukasi **DAGUSIBU** (Dapatkan, Gunakan, Simpan, Buang obat dengan benar).

### Kegiatan Utama

1. **Penyuluhan Kesehatan**
   - Cara mendapatkan obat yang benar
   - Penggunaan obat sesuai aturan
   - Penyimpanan obat yang tepat
   - Pembuangan obat kadaluarsa

2. **Pemeriksaan Gratis**
   - Cek tekanan darah
   - Gula darah
   - Konsultasi kesehatan

3. **Pelayanan Informasi Obat**
   - Konsultasi interaksi obat
   - Cara penggunaan obat
   - Efek samping obat

## Hasil

Lebih dari **150 warga** mengikuti program dengan antusias tinggi.

## Testimoni

*"Sekarang saya paham cara menggunakan obat dengan benar. Terima kasih mahasiswa farmasi!"* - Peserta',
  'info',
  'published',
  'https://images.unsplash.com/photo-1576602975047-174e57a47881?w=800',
  NOW() - INTERVAL '5 days',
  '{"name":"Divisi Pengabdian","role":"kontributor","email":"pengabdian@pharmacy.ac.id"}'::jsonb,
  ARRAY['Pengabdian', 'DAGUSIBU', 'Kesehatan'],
  true
),
(
  'Workshop Formulasi Sediaan Farmasi',
  'workshop-formulasi-sediaan-farmasi',
  'Workshop intensif formulasi sediaan farmasi dengan praktik langsung bersama praktisi industri.',
  E'# Workshop Formulasi Sediaan Farmasi

## Overview

Workshop formulasi sediaan farmasi diikuti **80 peserta** dari berbagai universitas.

## Materi

### Sesi 1: Teori Formulasi
**Narasumber:** Praktisi Industri Farmasi

- Prinsip formulasi sediaan
- Pemilihan eksipien
- Optimasi formula
- Quality by Design

### Sesi 2: Praktik

1. **Formulasi Tablet**
   - Granulasi basah
   - Kompresi tablet
   - Evaluasi fisik

2. **Formulasi Krim**
   - Metode emulsifikasi
   - Uji stabilitas

3. **Formulasi Sirup**
   - Teknik pencampuran
   - Quality control

## Fasilitas
- Lab lengkap
- Sertifikat
- Modul
- Networking

## Evaluasi
Rating workshop: **4.8/5.0**',
  'post',
  'published',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
  NOW() - INTERVAL '7 days',
  '{"name":"Divisi Akademik","role":"admin","email":"akademik@pharmacy.ac.id"}'::jsonb,
  ARRAY['Workshop', 'Formulasi', 'Praktik'],
  false
),
(
  'Peran Apoteker dalam Menghadapi Pandemi',
  'peran-apoteker-menghadapi-pandemi',
  'Refleksi pentingnya kesiapan profesi farmasi menghadapi ancaman pandemi global.',
  E'# Peran Apoteker dalam Menghadapi Pandemi

## Pembelajaran dari Pandemi

### Akses Layanan Kesehatan
Apoteker sebagai **garda depan** karena:
- Tersebar luas di seluruh wilayah
- Mudah dijangkau
- Konsultasi gratis
- Jam operasional fleksibel

### Manajemen Obat
- Memastikan ketersediaan obat
- Mencegah panic buying
- Edukasi penggunaan rasional
- Deteksi efek samping

### Kolaborasi Interprofesi
- Dokter (telemedicine)
- Perawat (home care)
- Dinas Kesehatan (vaksinasi)

## Tantangan Masa Depan

### Kesiapan Teknologi
- Telepharmacy
- E-prescribing
- AI untuk konseling
- Blockchain supply chain

### Kompetensi SDM
- Clinical pharmacy
- Pharmaceutical care
- Emergency response

## Rekomendasi

**Pendidikan Berkelanjutan**
- Update knowledge penyakit emerging
- Emergency preparedness training
- Disaster management

**Infrastruktur Digital**
- Sistem informasi terintegrasi
- Platform konsultasi online

Profesi farmasi harus terus beradaptasi dan berinovasi untuk menghadapi tantangan kesehatan global.',
  'opinion',
  'published',
  'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
  NOW() - INTERVAL '10 days',
  '{"name":"Kontributor","role":"kontributor","email":"kontributor@pharmacy.ac.id"}'::jsonb,
  ARRAY['Opini', 'Apoteker', 'Pandemi'],
  true
),
(
  'Tips Sukses Mahasiswa Farmasi Berprestasi',
  'tips-sukses-mahasiswa-farmasi-berprestasi',
  'Tips praktis menjadi mahasiswa farmasi berprestasi secara akademik dan non-akademik.',
  E'# Tips Sukses Mahasiswa Farmasi

## Manajemen Waktu ⏰

### Buat Jadwal Realistis
- Gunakan digital calendar
- Alokasi waktu untuk kuliah, belajar, organisasi, istirahat

### Teknik Pomodoro
- Belajar 25 menit
- Istirahat 5 menit
- Repeat 4x, break 30 menit

## Strategi Belajar 📚

### Pahami, Jangan Hafal
- Konsep dasar
- Mekanisme kerja
- Aplikasi praktis

### Study Group
- Diskusi bareng
- Sharing materi
- Tanya jawab

### Sumber Belajar
- YouTube farmasi
- Podcast kesehatan
- Jurnal online
- Apps drug info (MIMS, Medscape)

## Praktikum 🧪

### Persiapan
- Baca modul dulu
- Pahami tujuan
- Siapkan pertanyaan

### Saat Praktikum
- Catat observasi
- Jangan ragu tanya
- Foto dokumentasi

## Organisasi 🤝

### Manfaat
- Leadership skills
- Time management
- Networking
- Portfolio

### Pilih Bijak
- Sesuai passion
- Max 2-3 organisasi
- Komitmen penuh

## Kesehatan 💪

### Fisik
- Olahraga 30 menit, 3x/minggu
- Makan bergizi
- Tidur 7-8 jam

### Mental
- Curhat ke teman/keluarga
- Take breaks
- Hobi & me-time

## Network 🌐

- Ikuti seminar
- Connect alumni
- Join komunitas
- LinkedIn networking

## Prestasi 🏆

### Target GPA
- Konsisten dari awal
- Jangan menunda
- Konsultasi dosen

### Lomba
- Paper competition
- Poster presentation
- Business plan
- Skills competition

**Semangat Farmasis!** 💊',
  'blog',
  'published',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
  NOW() - INTERVAL '12 days',
  '{"name":"Alumni","role":"kontributor","email":"alumni@pharmacy.ac.id"}'::jsonb,
  ARRAY['Tips', 'Mahasiswa', 'Motivasi'],
  false
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. EVENTS
-- =============================================

INSERT INTO public.events (title, slug, description, content, category, status, start_date, end_date, location, cover_image, organizer, registration_url, max_participants, tags, featured)
VALUES
(
  'Seminar Nasional Farmasi Klinis',
  'seminar-nasional-farmasi-klinis',
  'Seminar nasional perkembangan terkini farmasi klinis dan pharmaceutical care.',
  E'# Seminar Nasional Farmasi Klinis

## Tema
**"Pharmaceutical Care dalam Era Personalized Medicine"**

## Pembicara
1. **Prof. Dr. Farmasis, Sp.FRS**
   - Topik: Personalized Medicine

2. **Apt. Dr. Clinical Pharmacy**
   - Topik: Clinical Pathway

3. **Dr. BPOM**
   - Topik: Regulasi Digital

## Rundown
- 08.00: Registrasi
- 09.00: Pembukaan
- 09.30: Sesi 1 & 2
- 13.00: Sesi 3
- 15.00: Penutupan

## Fasilitas
- E-certificate
- Modul PDF
- Makan siang
- Merchandise',
  'seminar',
  'upcoming',
  NOW() + INTERVAL '30 days',
  NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
  '{"name":"Auditorium Kampus","address":"Gedung Utama","city":"Kota"}'::jsonb,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  '{"name":"Himpunan Farmasi","email":"himpunan@pharmacy.ac.id","phone":"+6281234567890"}'::jsonb,
  'https://forms.gle/seminar-farmasi',
  200,
  ARRAY['Seminar', 'Farmasi Klinis', 'Nasional'],
  true
),
(
  'Workshop Good Pharmacy Practice',
  'workshop-good-pharmacy-practice',
  'Pelatihan intensif praktik kefarmasian sesuai standar WHO dan regulasi.',
  E'# Workshop Good Pharmacy Practice

## Deskripsi
Workshop 3 hari tentang standar praktik farmasi yang baik.

## Materi

### Hari 1: Fundamental GPP
- Konsep GPP
- Regulasi farmasi
- Standar pelayanan

### Hari 2: Praktik Apotek
- Manajemen apotek
- Dispensing
- MTM

### Hari 3: Quality Assurance
- Quality control
- Documentation
- Patient safety

## Trainer
Tim praktisi dari IAI dan apotek modern.

## Benefit
- Sertifikat 24 SKP
- Praktik langsung
- Networking',
  'workshop',
  'ongoing',
  NOW(),
  NOW() + INTERVAL '2 days',
  '{"name":"Lab Farmasi Komunitas","address":"Kampus","city":"Kota"}'::jsonb,
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
  '{"name":"Divisi Akademik","email":"akademik@pharmacy.ac.id"}'::jsonb,
  NULL,
  40,
  ARRAY['Workshop', 'GPP', 'Praktik'],
  true
),
(
  'Bakti Sosial Kesehatan',
  'bakti-sosial-kesehatan',
  'Program pengabdian berupa pemeriksaan kesehatan gratis dan edukasi.',
  E'# Bakti Sosial Kesehatan

## Kegiatan
1. Pemeriksaan gratis
   - Tekanan darah: 250 orang
   - Gula darah: 180 orang
   - Kolesterol: 120 orang

2. Edukasi kesehatan
   - DAGUSIBU
   - Hipertensi
   - Diabetes

3. Pembagian
   - 100 paket sembako
   - 200 paket vitamin

## Tim
- 30 mahasiswa
- 5 dosen
- 3 apoteker
- 2 dokter',
  'community-service',
  'completed',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days' + INTERVAL '6 hours',
  '{"name":"Desa Sehat","address":"Kecamatan","city":"Kabupaten"}'::jsonb,
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
  '{"name":"Divisi Pengabdian","email":"pengabdian@pharmacy.ac.id"}'::jsonb,
  NULL,
  NULL,
  ARRAY['Pengabdian', 'Kesehatan', 'Gratis'],
  false
),
(
  'Kompetisi Farmasi Nasional',
  'kompetisi-farmasi-nasional',
  'Kompetisi farmasi tingkat nasional dengan berbagai lomba scientific.',
  E'# Kompetisi Farmasi Nasional

## Cabang Lomba

### 1. Scientific Paper
**Tema:** Inovasi Sediaan Lokal
- Juara 1: Rp 5.000.000
- Juara 2: Rp 3.000.000
- Juara 3: Rp 2.000.000

### 2. Poster
**Tema:** Obat Rasional
- Juara 1: Rp 3.000.000
- Juara 2: Rp 2.000.000
- Juara 3: Rp 1.500.000

### 3. Video Edukasi
**Tema:** Farmasi Digital
- Juara 1: Rp 3.000.000
- Juara 2: Rp 2.000.000
- Juara 3: Rp 1.500.000

## Timeline
- Pendaftaran: 1-30 Maret
- Karya: 1-25 Maret
- Penjurian: 26-30 Maret
- Grand Final: 5 April',
  'competition',
  'upcoming',
  NOW() + INTERVAL '60 days',
  NOW() + INTERVAL '60 days' + INTERVAL '9 hours',
  '{"name":"Gedung Serbaguna","address":"Kampus","city":"Kota"}'::jsonb,
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  '{"name":"Himpunan Farmasi","email":"kompetisi@pharmacy.ac.id","phone":"+6281234567893"}'::jsonb,
  'https://forms.gle/kompetisi',
  150,
  ARRAY['Kompetisi', 'Nasional', 'Lomba'],
  true
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 3. MEMBERS
-- =============================================

INSERT INTO public.members (name, nim, email, phone, photo, batch, status, division, position, joined_at, bio, interests, social_media) VALUES
('Arif Rahman', '2021001', 'arif.rahman@student.ac.id', '+6281234567801', 'https://i.pravatar.cc/150?img=1', '2021', 'active', 'academic', 'coordinator', NOW() - INTERVAL '3 years', 'Passionate tentang riset farmasi', ARRAY['Research', 'Teaching'], '{"instagram":"@arif.rahman"}'::jsonb),
('Siti Aisyah', '2021002', 'siti.aisyah@student.ac.id', '+6281234567802', 'https://i.pravatar.cc/150?img=5', '2021', 'active', 'media-information', 'member', NOW() - INTERVAL '3 years', 'Content creator', ARRAY['Design', 'Fotografi'], '{"instagram":"@siti.aisyah"}'::jsonb),
('Ahmad Fauzi', '2022003', 'ahmad.fauzi@student.ac.id', '+6281234567803', 'https://i.pravatar.cc/150?img=3', '2022', 'active', 'external-affairs', 'member', NOW() - INTERVAL '2 years', 'External relations', ARRAY['Networking', 'PR'], '{"instagram":"@ahmad.fauzi"}'::jsonb),
('Nurul Hidayah', '2022004', 'nurul.hidayah@student.ac.id', '+6281234567804', 'https://i.pravatar.cc/150?img=9', '2022', 'active', 'student-development', 'coordinator', NOW() - INTERVAL '2 years', 'Student empowerment', ARRAY['Leadership', 'Mentoring'], '{"instagram":"@nurul.hidayah"}'::jsonb),
('Rizki Pratama', '2023005', 'rizki.pratama@student.ac.id', '+6281234567805', 'https://i.pravatar.cc/150?img=7', '2023', 'active', 'entrepreneurship', 'member', NOW() - INTERVAL '1 year', 'Pharmapreneur', ARRAY['Business', 'Inovasi'], '{"instagram":"@rizki.pratama"}'::jsonb),
('Fatimah Zahra', '2023006', 'fatimah.zahra@student.ac.id', '+6281234567806', 'https://i.pravatar.cc/150?img=10', '2023', 'active', 'islamic-spirituality', 'coordinator', NOW() - INTERVAL '1 year', 'Spirituality coordinator', ARRAY['Kajian', 'Konseling'], '{"instagram":"@fatimah.zahra"}'::jsonb),
('Budi Santoso', '2024007', 'budi.santoso@student.ac.id', '+6281234567807', 'https://i.pravatar.cc/150?img=12', '2024', 'active', 'sports-arts', 'member', NOW() - INTERVAL '6 months', 'Aktif di olahraga', ARRAY['Sports', 'Seni'], '{"instagram":"@budi.santoso"}'::jsonb),
('Dewi Lestari', '2024008', 'dewi.lestari@student.ac.id', '+6281234567808', 'https://i.pravatar.cc/150?img=16', '2024', 'active', 'internal-affairs', 'member', NOW() - INTERVAL '6 months', 'Internal affairs', ARRAY['Administrasi', 'Organisasi'], '{"instagram":"@dewi.lestari"}'::jsonb)
ON CONFLICT (nim) DO NOTHING;

-- Alumni
INSERT INTO public.members (name, nim, email, phone, photo, batch, status, joined_at, graduated_at, bio, achievements) VALUES
('Dr. Apt. Rahmat', '2018001', 'rahmat@alumni.ac.id', '+6281234567809', 'https://i.pravatar.cc/150?img=33', '2018', 'alumni', NOW() - INTERVAL '6 years', NOW() - INTERVAL '1 year', 'Clinical pharmacist di RS', ARRAY['Best Graduate 2023', '5 publikasi']),
('Apt. Nurhayati', '2019002', 'nurhayati@alumni.ac.id', '+6281234567810', 'https://i.pravatar.cc/150?img=45', '2019', 'alumni', NOW() - INTERVAL '5 years', NOW() - INTERVAL '6 months', 'Owner apotek chain', ARRAY['Young Entrepreneur', '3 apotek'])
ON CONFLICT (nim) DO NOTHING;

-- =============================================
-- 4. LEADERSHIP
-- =============================================

INSERT INTO public.leadership (name, position, division, photo, email, phone, nim, batch, bio, social_media, period_start, period_end, "order") VALUES
('Zaky Ramadhan', 'ketua', NULL, 'https://i.pravatar.cc/200?img=8', 'ketua@pharmacy.ac.id', '+6281234567890', '2022015', '2022', 'Ketua himpunan periode ini', '{"instagram":"@zaky"}'::jsonb, '2026-01-01', '2026-12-31', 1),
('Nurul Izzah', 'wakil-ketua', NULL, 'https://i.pravatar.cc/200?img=23', 'wakil@pharmacy.ac.id', '+6281234567891', '2022016', '2022', 'Wakil ketua', '{"instagram":"@nurul"}'::jsonb, '2026-01-01', '2026-12-31', 2),
('Firdaus', 'sekretaris', NULL, 'https://i.pravatar.cc/200?img=15', 'sekretaris@pharmacy.ac.id', '+6281234567892', '2022017', '2022', 'Sekretaris', '{"instagram":"@firdaus"}'::jsonb, '2026-01-01', '2026-12-31', 3),
('Rahma', 'bendahara', NULL, 'https://i.pravatar.cc/200?img=26', 'bendahara@pharmacy.ac.id', '+6281234567893', '2022018', '2022', 'Bendahara', '{"instagram":"@rahma"}'::jsonb, '2026-01-01', '2026-12-31', 4),
('Maulana', 'coordinator', 'academic', 'https://i.pravatar.cc/200?img=31', 'academic@pharmacy.ac.id', NULL, '2023019', '2023', 'Koordinator akademik', NULL, '2026-01-01', '2026-12-31', 5),
('Azzahra', 'coordinator', 'internal-affairs', 'https://i.pravatar.cc/200?img=47', 'internal@pharmacy.ac.id', NULL, '2023020', '2023', 'Koordinator internal', NULL, '2026-01-01', '2026-12-31', 6),
('Hartono', 'coordinator', 'external-affairs', 'https://i.pravatar.cc/200?img=11', 'external@pharmacy.ac.id', NULL, '2023021', '2023', 'Koordinator eksternal', NULL, '2026-01-01', '2026-12-31', 7),
('Sartika', 'coordinator', 'student-development', 'https://i.pravatar.cc/200?img=38', 'pengembangan@pharmacy.ac.id', NULL, '2023022', '2023', 'Pengembangan mahasiswa', NULL, '2026-01-01', '2026-12-31', 8),
('Budiman', 'coordinator', 'entrepreneurship', 'https://i.pravatar.cc/200?img=14', 'kewirausahaan@pharmacy.ac.id', NULL, '2023023', '2023', 'Koordinator kewirausahaan', NULL, '2026-01-01', '2026-12-31', 9),
('Cahaya', 'coordinator', 'media-information', 'https://i.pravatar.cc/200?img=41', 'media@pharmacy.ac.id', NULL, '2023024', '2023', 'Koordinator media', NULL, '2026-01-01', '2026-12-31', 10),
('Hakim', 'coordinator', 'sports-arts', 'https://i.pravatar.cc/200?img=17', 'olahraga@pharmacy.ac.id', NULL, '2023025', '2023', 'Koordinator olahraga & seni', NULL, '2026-01-01', '2026-12-31', 11),
('Putri', 'coordinator', 'islamic-spirituality', 'https://i.pravatar.cc/200?img=44', 'kerohanian@pharmacy.ac.id', NULL, '2023026', '2023', 'Koordinator kerohanian', NULL, '2026-01-01', '2026-12-31', 12)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 5. SITE SETTINGS
-- =============================================

INSERT INTO public.site_settings (key, content) VALUES
('home', '{
  "hero": {
    "badge": "Website Resmi Himpunan Mahasiswa Farmasi",
    "title": "Himpunan Mahasiswa",
    "titleHighlight": "Jurusan Farmasi",
    "description": "Organisasi mahasiswa farmasi yang berdedikasi mencetak farmasis unggul, berintegritas, dan berwawasan luas. Kami hadir sebagai wadah pengembangan potensi mahasiswa farmasi yang progresif dan berdaya saing.",
    "primaryCTA": {"text": "Lihat Event Kami", "link": "/events"},
    "secondaryCTA": {"text": "Tentang Kami", "link": "/about"},
    "stats": [
      {"value": "200+", "label": "Anggota Aktif"},
      {"value": "50+", "label": "Event per Tahun"},
      {"value": "8", "label": "Divisi"}
    ]
  },
  "features": {
    "title": "Apa yang Kami Lakukan?",
    "description": "Berbagai program unggulan untuk mendukung pengembangan akademik dan profesionalisme mahasiswa farmasi",
    "items": [
      {
        "icon": "GraduationCap",
        "title": "Pengembangan Akademik",
        "description": "Menyelenggarakan kajian ilmiah dan workshop untuk meningkatkan kompetensi kefarmasian",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Users",
        "title": "Kepemimpinan",
        "description": "Membentuk karakter pemimpin masa depan melalui regenerasi dan kaderisasi terstruktur",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Heart",
        "title": "Pengabdian Masyarakat",
        "description": "Terjun langsung memberikan kontribusi nyata bagi kesehatan masyarakat",
        "color": "text-primary-700 bg-primary-50"
      },
      {
        "icon": "Sparkles",
        "title": "Networking",
        "description": "Membangun jejaring dengan alumni, praktisi, dan mahasiswa farmasi se-Indonesia",
        "color": "text-primary-700 bg-primary-50"
      }
    ]
  },
  "cta": {
    "title": "Kenali Lebih Dekat",
    "description": "Mari bersinergi membangun farmasis profesional yang berakhlak mulia melalui pengembangan akademik dan pengabdian masyarakat.",
    "primaryCTA": {"text": "Lihat Kepengurusan", "link": "/leadership"},
    "secondaryCTA": {"text": "Hubungi Kami", "phone": "+6281234567890"}
  }
}'::jsonb),

('about', '{
  "mission": "Mengembangkan potensi mahasiswa farmasi melalui kegiatan akademik, pengabdian masyarakat, dan peningkatan soft skills untuk menjadi farmasis profesional yang berintegritas dan berkontribusi bagi kesehatan masyarakat.",
  "vision": "Menjadi organisasi mahasiswa farmasi yang unggul, inovatif, dan terdepan dalam pengembangan kompetensi akademik dan non-akademik mahasiswa farmasi di tingkat regional dan nasional.",
  "story": "Himpunan Mahasiswa Jurusan Farmasi adalah organisasi intra kampus yang mewadahi seluruh mahasiswa jurusan farmasi. Didirikan dengan semangat pengabdian dan pengembangan ilmu kefarmasian, organisasi ini telah menjadi rumah kedua bagi mahasiswa untuk mengembangkan potensi akademik dan non-akademik.",
  "values": [
    {"title": "Akademik", "description": "Mendorong keunggulan akademik melalui kajian ilmiah, seminar, dan workshop kefarmasian", "icon": "BookOpen"},
    {"title": "Kepemimpinan", "description": "Membentuk jiwa kepemimpinan yang amanah, profesional, dan bertanggung jawab", "icon": "Users"},
    {"title": "Pengabdian", "description": "Berkontribusi aktif dalam kegiatan sosial dan kesehatan masyarakat", "icon": "HeartHandshake"},
    {"title": "Profesionalisme", "description": "Mempersiapkan mahasiswa menjadi farmasis yang kompeten dan berintegritas", "icon": "Briefcase"}
  ],
  "timeline": [
    {"year": "2015", "title": "Pendirian Himpunan", "description": "Resmi berdiri sebagai wadah mahasiswa farmasi"},
    {"year": "2017", "title": "Program Unggulan Pertama", "description": "Menyelenggarakan program pengembangan soft skills"},
    {"year": "2019", "title": "Kolaborasi Nasional", "description": "Menjalin kerjasama dengan berbagai organisasi farmasi nasional"},
    {"year": "2021", "title": "Digitalisasi Program", "description": "Adaptasi digital dalam kegiatan organisasi dan pelayanan anggota"},
    {"year": "2023", "title": "Prestasi Nasional", "description": "Meraih penghargaan di berbagai kompetisi farmasi"}
  ]
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- =============================================
-- SEED DATA SELESAI
-- =============================================
-- Total data:
-- - 6 Articles (Markdown)
-- - 4 Events
-- - 10 Members (8 active, 2 alumni)
-- - 12 Leadership positions
-- - 2 Site Settings (home & about)
-- =============================================
