import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Default seeded admin credentials
    const defaultAdminEmail = "";
    const defaultAdminPassword = "";

    if (isSupabaseConfigured) {
      // Direct Supabase Signin
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback check for the seeded SQL admin in case Supabase Auth isn't synced with users table
        if (email === defaultAdminEmail && password === defaultAdminPassword) {
          return NextResponse.json({
            success: true,
            user: {
              id: "7b123456-7890-abcd-ef01-234567890123",
              name: "Admin Racer",
              email: defaultAdminEmail,
              role: "admin"
            }
          });
        }
        throw error;
      }

      // Read profile
      const { data: profile, error: profileErr } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      return NextResponse.json({
        success: true,
        user: profile || {
          id: data.user?.id,
          name: data.user?.email?.split("@")[0] || "Admin",
          email: data.user?.email,
          role: "admin"
        }
      });
    } else {
      // Mock Auth Fallback
      if (email === defaultAdminEmail && password === defaultAdminPassword) {
        return NextResponse.json({
          success: true,
          user: {
            id: "admin-1",
            name: "Admin Racer",
            email: defaultAdminEmail,
            role: "admin"
          }
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Kredensial login admin tidak valid!" },
          { status: 401 }
        );
      }
    }
  } catch (error: any) {
    console.error("API POST Login Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
