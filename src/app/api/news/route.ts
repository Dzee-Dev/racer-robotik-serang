import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockDb } from "@/lib/mockDb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const parsedLimit = limit ? parseInt(limit, 10) : null;

    let responseData;

    if (isSupabaseConfigured) {
      let query = supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (parsedLimit && !isNaN(parsedLimit)) {
        query = query.limit(parsedLimit);
      }

      const { data, error } = await query;
      if (error) throw error;
      responseData = data;
    } else {
      let data = mockDb.getNews();
      if (parsedLimit && !isNaN(parsedLimit)) {
        data = data.slice(0, parsedLimit);
      }
      responseData = data;
    }

    // High performance CDN caching: 30 seconds fresh, 5 minutes stale-while-revalidate
    return NextResponse.json(
      { success: true, data: responseData },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("API GET News Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.judul || !body.konten || !body.kategori) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const slug = body.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase
        .from("news")
        .insert([
          {
            judul: body.judul,
            slug,
            konten: body.konten,
            foto_url: body.foto_url,
            kategori: body.kategori,
            status: body.status || "published",
            author_id: "7b123456-7890-abcd-ef01-234567890123"
          }
        ])
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    } else {
      const newNews = mockDb.addNews(body);
      return NextResponse.json({ success: true, data: newNews });
    }
  } catch (error: any) {
    console.error("API POST News Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add news" },
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
        { success: false, message: "Missing news id" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      if (updatedFields.judul) {
        updatedFields.slug = updatedFields.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      const { data, error } = await supabase
        .from("news")
        .update(updatedFields)
        .eq("id", id)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    } else {
      const success = mockDb.updateNews(id, updatedFields);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "News not found" },
          { status: 404 }
        );
      }
      const newsItem = mockDb.getNews().find(n => n.id === id);
      return NextResponse.json({ success: true, data: newsItem });
    }
  } catch (error: any) {
    console.error("API PUT News Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update news" },
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
        { success: false, message: "Missing news id" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "News deleted successfully" });
    } else {
      const success = mockDb.deleteNews(id);
      if (!success) {
        return NextResponse.json(
          { success: false, message: "News not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: "News deleted successfully" });
    }
  } catch (error: any) {
    console.error("API DELETE News Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete news" },
      { status: 500 }
    );
  }
}
