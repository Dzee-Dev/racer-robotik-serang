-- SCRIPT DDL SCHEMA DATABASE PT RACER ROBOTIK
-- Salin dan tempel skrip ini ke dalam SQL Editor Supabase Anda.

-- =========================================================================
-- 1. TABEL: USERS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    password TEXT NOT NULL, -- Diisi dengan hash password di produksi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS untuk keamanan dasar
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow insert for everyone" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for owners" ON public.users FOR UPDATE USING (true);

-- =========================================================================
-- 2. TABEL: SISWA
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    email TEXT NOT NULL,
    no_telp TEXT NOT NULL,
    jenjang TEXT NOT NULL CHECK (jenjang IN ('TK', 'SD', 'SMP', 'SMA')),
    kelas TEXT NOT NULL,
    asal_sekolah TEXT NOT NULL,
    program TEXT NOT NULL CHECK (program IN ('reguler', 'private', 'online')),
    kelas_tipe TEXT CHECK (kelas_tipe IN ('gold', 'silver', 'bronze', NULL)),
    durasi_paket TEXT NOT NULL CHECK (durasi_paket IN ('perbulan', 'persemester')),
    jadwal_les TEXT NOT NULL, -- Format: "Hari, Jam Range" misal "Senin, 09.00 - 10.00"
    harga NUMERIC NOT NULL,
    bukti_pembayaran_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for siswa" ON public.siswa FOR SELECT USING (true);
CREATE POLICY "Allow insert for siswa registration" ON public.siswa FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin to update siswa" ON public.siswa FOR UPDATE USING (true);
CREATE POLICY "Allow admin to delete siswa" ON public.siswa FOR DELETE USING (true);

-- =========================================================================
-- 3. TABEL: PERALATAN
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.peralatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    jumlah INTEGER NOT NULL DEFAULT 0,
    kondisi TEXT NOT NULL DEFAULT 'Baik' CHECK (kondisi IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
    foto_url TEXT,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.peralatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for peralatan" ON public.peralatan FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD for peralatan" ON public.peralatan FOR ALL USING (true);

-- =========================================================================
-- 4. TABEL: PERALATAN LOG
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.peralatan_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    peralatan_id UUID REFERENCES public.peralatan(id) ON DELETE CASCADE NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('masuk', 'keluar', 'rusak')),
    jumlah INTEGER NOT NULL CHECK (jumlah > 0),
    keterangan TEXT NOT NULL,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

ALTER TABLE public.peralatan_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for logs" ON public.peralatan_log FOR SELECT USING (true);
CREATE POLICY "Allow admin select and insert logs" ON public.peralatan_log FOR ALL USING (true);

-- =========================================================================
-- 5. TABEL: NEWS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    foto_url TEXT,
    kategori TEXT NOT NULL CHECK (kategori IN ('Kegiatan', 'Prestasi', 'Pengumuman')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow admin select and write news" ON public.news FOR ALL USING (true);

-- =========================================================================
-- 6. DATA INSIAL (SEED DATA)
-- =========================================================================

-- Tambah User Default Admin (password: adminracer123 - di produksi harus di-hash!)
INSERT INTO public.users (id, name, email, role, password)
VALUES ('7b123456-7890-abcd-ef01-234567890123', 'Admin Racer', 'admin@racer.id', 'admin', 'adminracer123')
ON CONFLICT (email) DO NOTHING;

-- Tambah Data Awal Berita
INSERT INTO public.news (id, judul, slug, konten, kategori, status, author_id, created_at)
VALUES 
('da7a1111-1111-1111-1111-111111111111', 'Siswa raih juara 1 kompetisi robotik nasional 2026', 'siswa-raih-juara-1-kompetisi-robotik-nasional-2026', 'Tim robotik SD PT Racer Robotik berhasil meraih juara pertama dalam ajang National Robotics Competition 2026 untuk kategori Robot Penyelamat (Rescue Robot). Kemenangan luar biasa ini diraih berkat kerja keras para siswa dan bimbingan instruktur profesional kami yang berpengalaman.', 'Prestasi', 'published', '7b123456-7890-abcd-ef01-234567890123', NOW()),
('da7a2222-2222-2222-2222-222222222222', 'Pendaftaran kelas baru periode Juli 2026 dibuka', 'pendaftaran-kelas-baru-periode-juli-2026-dibuka', 'PT Racer Robotik resmi membuka pendaftaran untuk kelas baru periode Juli 2026. Dapatkan diskon khusus 15% untuk pendaftaran program semesteran (semua jenjang TK-SMA) sebelum tanggal 15 Juni 2026. Kuota terbatas untuk memastikan efektivitas belajar kelompok kecil!', 'Pengumuman', 'published', '7b123456-7890-abcd-ef01-234567890123', NOW()),
('da7a3333-3333-3333-3333-333333333333', 'Workshop AI dan machine learning untuk siswa SMA', 'workshop-ai-dan-machine-learning-untuk-siswa-sma', 'Sebagai bagian dari kurikulum lanjutan tingkat SMA, PT Racer Robotik mengadakan workshop intensif Artificial Intelligence dan Machine Learning menggunakan MicroPython dan modul ESP32. Siswa akan belajar mendeteksi objek dan mengendalikan robot menggunakan logika AI sederhana.', 'Kegiatan', 'published', '7b123456-7890-abcd-ef01-234567890123', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Tambah Data Awal Peralatan
INSERT INTO public.peralatan (id, kode, nama, kategori, jumlah, kondisi, keterangan)
VALUES 
('e91a1111-1111-1111-1111-111111111111', 'EQ-001', 'Arduino Uno R3 Starter Kit', 'Mikrokontroler', 25, 'Baik', 'Kit dasar untuk pembelajaran sirkuit, LED, resistor, dan pemrograman dasar.'),
('e91a2222-2222-2222-2222-222222222222', 'EQ-002', 'Raspberry Pi 4 Model B (4GB)', 'Komputasi Mini', 12, 'Baik', 'Modul komputer mini untuk pembelajaran AI, IoT, dan Machine Learning tingkat SMA.'),
('e91a3333-3333-3333-3333-333333333333', 'EQ-003', 'Sensor Ultrasonic HC-SR04', 'Sensor', 45, 'Baik', 'Sensor pengukur jarak untuk proyek robot obstacle avoidance.'),
('e91a4444-4444-4444-4444-444444444444', 'EQ-004', 'Lego Mindstorms EV3 Kit', 'Kit Robotik', 8, 'Baik', 'Kit robotik interaktif modular untuk pembelajaran siswa TK dan SD.')
ON CONFLICT (kode) DO NOTHING;
