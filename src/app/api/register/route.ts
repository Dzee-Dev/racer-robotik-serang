import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockDb } from "@/lib/mockDb";

export const dynamic = "force-dynamic";
export const preferredRegion = "icn1";

// GET all students (siswa) - used by Admin Dashboard
export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("siswa")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      // Fallback to local mock db
      const data = mockDb.getSiswa();
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    console.error("API GET Register Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

// POST new student registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.nama_lengkap || !body.no_telp || !body.kelas || !body.asal_sekolah) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("siswa")
        .insert([
          {
            nama_lengkap: body.nama_lengkap,
            email: body.email,
            no_telp: body.no_telp,
            jenjang: body.jenjang,
            kelas: body.kelas,
            asal_sekolah: body.asal_sekolah,
            program: body.program,
            kelas_tipe: body.kelas_tipe,
            durasi_paket: body.durasi_paket,
            jadwal_les: body.jadwal_les,
            harga: body.harga,
            bukti_pembayaran_url: body.bukti_pembayaran_url,
            status: "pending"
          }
        ])
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    } else {
      // Fallback to mockDb
      const newSiswa = mockDb.addSiswa(body);
      return NextResponse.json({ success: true, data: newSiswa });
    }
  } catch (error: any) {
    console.error("API POST Register Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit registration" },
      { status: 500 }
    );
  }
}

// PUT update student status (approved/rejected)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing id or status fields" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("siswa")
        .update({ status })
        .eq("id", id)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    } else {
      const success = mockDb.updateSiswaStatus(id, status);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }
      const siswaList = mockDb.getSiswa();
      const updated = siswaList.find(s => s.id === id);
      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error: any) {
    console.error("API PUT Register Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
