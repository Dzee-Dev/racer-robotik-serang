import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: false, message: "Supabase not configured. File upload requires cloud storage." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "bukti-transfer";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Generate unique file name
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, message: "Failed to generate public URL for uploaded file." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        fileName: fileName,
        bucket: bucket,
      },
    });
  } catch (error: any) {
    console.error("API Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
