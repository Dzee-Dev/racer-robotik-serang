import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockDb } from "@/lib/mockDb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("peralatan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      const data = mockDb.getPeralatan();
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    console.error("API GET Equipment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.kode || !body.nama || !body.kategori || body.jumlah === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("peralatan")
        .insert([
          {
            kode: body.kode,
            nama: body.nama,
            kategori: body.kategori,
            jumlah: body.jumlah,
            kondisi: body.kondisi || "Baik",
            foto_url: body.foto_url,
            keterangan: body.keterangan
          }
        ])
        .select();

      if (error) throw error;

      // Auto generate logs in Supabase
      await supabase
        .from("peralatan_log")
        .insert([
          {
            peralatan_id: data[0].id,
            jenis: "masuk",
            jumlah: data[0].jumlah,
            keterangan: `Stok awal input peralatan baru: ${data[0].nama}`,
            user_id: "7b123456-7890-abcd-ef01-234567890123"
          }
        ]);

      return NextResponse.json({ success: true, data: data[0] });
    } else {
      const newPeralatan = mockDb.addPeralatan(body);
      return NextResponse.json({ success: true, data: newPeralatan });
    }
  } catch (error: any) {
    console.error("API POST Equipment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add equipment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing equipment id" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("peralatan")
        .update(updatedFields)
        .eq("id", id)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    } else {
      const success = mockDb.updatePeralatan(id, updatedFields);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "Equipment not found" },
          { status: 404 }
        );
      }
      const item = mockDb.getPeralatan().find(e => e.id === id);
      return NextResponse.json({ success: true, data: item });
    }
  } catch (error: any) {
    console.error("API PUT Equipment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update equipment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing equipment id" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("peralatan")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Equipment deleted successfully" });
    } else {
      const success = mockDb.deletePeralatan(id);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "Equipment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: "Equipment deleted successfully" });
    }
  } catch (error: any) {
    console.error("API DELETE Equipment Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete equipment" },
      { status: 500 }
    );
  }
}
