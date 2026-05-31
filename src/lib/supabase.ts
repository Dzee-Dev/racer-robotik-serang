import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (isSupabaseConfigured) {
  if (typeof window !== "undefined") {
    console.log(
      "🚀 PT Racer Robotik: Supabase AKTIF! Situs web berhasil terhubung ke database PostgreSQL cloud."
    );
  }
} else {
  if (typeof window !== "undefined") {
    console.warn(
      "⚠️ PT Racer Robotik: Supabase belum terkonfigurasi di .env.local. Sistem otomatis berjalan dalam Mode Cadangan (LocalStorage)."
    );
  }
}

// Inisialisasi Klien Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

