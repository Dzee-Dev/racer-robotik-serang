"use client";

import React, { useState } from "react";
import { Plus, Edit3, Trash2, XCircle } from "lucide-react";
import { News } from "@/lib/types";

interface NewsTabProps {
  newsList: News[];
  onAddNews: (news: any) => void;
  onUpdateNews: (id: string, updated: any) => void;
  onDeleteNews: (id: string) => void;
}

export default function NewsTab({
  newsList,
  onAddNews,
  onUpdateNews,
  onDeleteNews
}: NewsTabProps) {
  // Modal states
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [newsFormData, setNewsFormData] = useState({
    id: "",
    judul: "",
    konten: "",
    kategori: "Kegiatan" as "Kegiatan" | "Prestasi" | "Pengumuman",
    status: "published" as "draft" | "published"
  });

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingNews) {
      onUpdateNews(newsFormData.id, newsFormData);
    } else {
      onAddNews(newsFormData);
    }
    setIsNewsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Kelola Mading & Pengumuman</h3>
          <p className="text-xs text-slate-400 mt-1">Hanya administrator terautentikasi yang diizinkan untuk menulis mading berita baru.</p>
        </div>
        <button
          onClick={() => {
            setIsEditingNews(false);
            setNewsFormData({
              id: "",
              judul: "",
              konten: "",
              kategori: "Kegiatan",
              status: "published"
            });
            setIsNewsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
        >
          <Plus className="w-4 h-4" /> Tulis Berita Baru
        </button>
      </div>

      {/* News Listings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsList.map((news) => (
          <div key={news.id} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between items-start text-left group hover:border-brand-cyan/25 transition-all">
            <div className="space-y-3.5 w-full">
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  news.kategori === "Prestasi" 
                    ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                    : news.kategori === "Pengumuman"
                      ? "bg-brand-rose/10 border-brand-rose/20 text-brand-rose"
                      : "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
                }`}>
                  {news.kategori}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">{formatTanggal(news.created_at)}</span>
              </div>
              
              <h4 className="text-base font-bold text-white leading-snug group-hover:text-brand-cyan transition-colors">{news.judul}</h4>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{news.konten}</p>
            </div>

            <div className="w-full border-t border-white/5 mt-4 pt-3.5 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Status: <span className={news.status === "published" ? "text-brand-emerald font-bold" : "text-slate-500"}>{news.status.toUpperCase()}</span></span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewsFormData({
                      id: news.id,
                      judul: news.judul,
                      konten: news.konten,
                      kategori: news.kategori,
                      status: news.status
                    });
                    setIsEditingNews(true);
                    setIsNewsModalOpen(true);
                  }}
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-cyan/40 text-brand-cyan rounded-lg transition-all"
                  title="Edit Berita"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteNews(news.id)}
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-rose/40 text-brand-rose rounded-lg transition-all"
                  title="Hapus Berita"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {newsList.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
            Belum ada berita mading yang ditulis.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MODAL NEWS FORM OVERLAY */}
      {/* ========================================================================= */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">{isEditingNews ? "Edit Berita Mading" : "Tulis Berita Baru"}</h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Kategori</label>
                  <select
                    value={newsFormData.kategori}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, kategori: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Status Publikasi</label>
                  <select
                    value={newsFormData.status}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  >
                    <option value="published">Langsung Publikasi (Published)</option>
                    <option value="draft">Simpan Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Judul Berita</label>
                <input 
                  type="text"
                  value={newsFormData.judul}
                  onChange={(e) => setNewsFormData(prev => ({ ...prev, judul: e.target.value }))}
                  placeholder="Contoh: Siswa PT Racer Robotik Juara Harapan Kompetisi Arduino"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Konten / Isi Berita</label>
                <textarea 
                  value={newsFormData.konten}
                  onChange={(e) => setNewsFormData(prev => ({ ...prev, konten: e.target.value }))}
                  placeholder="Tuliskan berita lengkap di sini..."
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                {isEditingNews ? "Simpan Perubahan Berita" : "Terbitkan Berita Baru"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
