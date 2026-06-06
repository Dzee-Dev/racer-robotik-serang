import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const preferredRegion = "icn1";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const urlConfigured = Boolean(supabaseUrl);
    const keyConfigured = Boolean(supabaseAnonKey);

    let supabasePing = "Not Configured";
    let pingError = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("id")
          .limit(1);

        if (error) {
          supabasePing = "Failed";
          pingError = error.message;
        } else {
          supabasePing = "Success";
        }
      } catch (err: any) {
        supabasePing = "Failed";
        pingError = err.message || err;
      }
    }

    return NextResponse.json({
      success: true,
      environment: {
        isSupabaseConfigured,
        urlConfigured,
        keyConfigured,
        maskedUrl: supabaseUrl ? `${supabaseUrl.substring(0, 12)}...` : "empty",
        keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
        nodeEnv: process.env.NODE_ENV
      },
      connection: {
        status: supabasePing,
        error: pingError
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to run diagnostics" },
      { status: 500 }
    );
  }
}
