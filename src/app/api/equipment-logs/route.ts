import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      // In real Supabase, we can perform a joined query to pull items details
      const { data, error } = await supabase
        .from("peralatan_log")
        .select(`
          id,
          peralatan_id,
          jenis,
          jumlah,
          keterangan,
          tanggal,
          user_id,
          peralatan (kode, nama)
        `)
        .order("tanggal", { ascending: false });

      if (error) throw error;
      
      // Hydrate to match types
      const hydratedData = data.map((item: any) => ({
        id: item.id,
        peralatan_id: item.peralatan_id,
        jenis: item.jenis,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
        tanggal: item.tanggal,
        user_id: item.user_id,
        peralatan_nama: item.peralatan?.nama,
        peralatan_kode: item.peralatan?.kode,
        user_name: "Admin Racer"
      }));

      return NextResponse.json({ success: true, data: hydratedData });
    } else {
      const data = mockDb.getLogs();
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    console.error("API GET Logs Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.peralatan_id || !body.jenis || !body.jumlah || !body.keterangan) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      // Fetch current equipment to update stock
      const { data: itemData, error: fetchErr } = await supabase
        .from("peralatan")
        .select("jumlah, kondisi, nama, kode")
        .eq("id", body.peralatan_id)
        .single();

      if (fetchErr) throw fetchErr;

      let newQty = itemData.jumlah;
      let newCondition = itemData.kondisi;

      if (body.jenis === "masuk") {
        newQty += body.jumlah;
      } else if (body.jenis === "keluar") {
        newQty = Math.max(0, newQty - body.jumlah);
      } else if (body.jenis === "rusak") {
        newQty = Math.max(0, newQty - body.jumlah);
        if (body.jumlah >= itemData.jumlah && itemData.jumlah > 0) {
          newCondition = "Rusak Berat";
        } else if (body.jumlah > 0 && itemData.kondisi === "Baik") {
          newCondition = "Rusak Ringan";
        }
      }

      // 1. Update stock
      const { error: updateErr } = await supabase
        .from("peralatan")
        .update({ jumlah: newQty, kondisi: newCondition })
        .eq("id", body.peralatan_id);

      if (updateErr) throw updateErr;

      // 2. Insert log
      const { data: logData, error: logErr } = await supabase
        .from("peralatan_log")
        .insert([
          {
            peralatan_id: body.peralatan_id,
            jenis: body.jenis,
            jumlah: body.jumlah,
            keterangan: body.keterangan,
            user_id: body.user_id || "7b123456-7890-abcd-ef01-234567890123"
          }
        ])
        .select();

      if (logErr) throw logErr;

      const result = {
        ...logData[0],
        peralatan_nama: itemData.nama,
        peralatan_kode: itemData.kode,
        user_name: "Admin Racer"
      };

      return NextResponse.json({ success: true, data: result });
    } else {
      const newLog = mockDb.addLog(body);
      if (!newLog) {
        return NextResponse.json(
          { success: false, message: "Equipment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: newLog });
    }
  } catch (error: any) {
    console.error("API POST Logs Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to record log" },
      { status: 500 }
    );
  }
}
