"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight } from "lucide-react";
import { mockDb } from "@/lib/mockDb";
import { News } from "@/lib/types";
import NewsReaderModal from "./NewsReaderModal";
import Link from "next/link";

interface NewsSectionProps {
  isTeaser?: boolean;
  className?: string;
}

export default function NewsSection({ isTeaser = false, className = "" }: NewsSectionProps) {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Load news on mount
  useEffect(() => {
    // Read only published news
    setNewsList(mockDb.getNews().filter(n => n.status === "published"));
  }, []);

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleOpenReader = (news: News) => {
    setSelectedNews(news);
    setIsReaderOpen(true);
  };

  const activeNews = isTeaser ? newsList.slice(0, 3) : newsList;

  return (
    <section id="berita" className={`py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/20 relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header text */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">
            {isTeaser ? "Mading & Berita Terkini" : "Mading & Berita Cabang Lengkap"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {isTeaser ? "Kabar Terbaru Rumah Robot" : "Seluruh Kegiatan & Pengumuman"}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full mt-2" />
          <p className="text-slate-400 text-sm sm:text-base">
            {isTeaser 
              ? "Ikuti cuplikan prestasi olimpiade IYRC/AYRO, dan agenda terbaru Cabang Serang." 
              : "Telusuri katalog lengkap prestasi olimpiade, kemitraan sekolah, agenda workshop, dan pengumuman resmi Rumah Robot Banten."}
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeNews.length > 0 ? (
            activeNews.map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between text-left group hover:border-brand-cyan/20 transition-all duration-300 shadow-lg cursor-pointer"
                onClick={() => handleOpenReader(news)}
              >
                <div className="p-6 space-y-4">
                  {/* Category Label */}
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
                      news.kategori === "Prestasi" 
                        ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                        : news.kategori === "Pengumuman"
                          ? "bg-brand-rose/10 border-brand-rose/20 text-brand-rose"
                          : "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
                    }`}>
                      {news.kategori}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatTanggal(news.created_at)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-brand-cyan transition-colors">
                    {news.judul}
                  </h3>
                  
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {news.konten}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Oleh: {news.author_name || "Admin Racer"}</span>
                  <span className="text-brand-cyan inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    Baca Selengkapnya <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
              Belum ada berita mading terbaru saat ini.
            </div>
          )}
        </div>

        {/* See All Button (Only for teaser mode) */}
        {isTeaser && newsList.length > 3 && (
          <div className="text-center mt-12">
            <Link 
              href="/news"
              className="bg-slate-900 border border-slate-800 text-slate-300 hover:border-brand-cyan/35 hover:text-brand-cyan hover:shadow-glow-cyan/15 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-xs"
            >
              Lihat Seluruh Berita Mading <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Embedded High-Fidelity Modal News Reader */}
      <NewsReaderModal 
        news={selectedNews}
        isOpen={isReaderOpen}
        onClose={() => {
          setIsReaderOpen(false);
          setSelectedNews(null);
        }}
      />
    </section>
  );
}
