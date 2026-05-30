import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  if (typeof window !== "undefined") {
    console.warn(
      "PT Racer Robotik: Supabase URL/Key belum dikonfigurasi di file .env. Menggunakan database lokal (Mock LocalStorage)."
    );
  }
}

// Inisialisasi Klien Supabase (jika dikonfigurasi, jika tidak gunakan client dummy agar tidak crash saat di-import)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
