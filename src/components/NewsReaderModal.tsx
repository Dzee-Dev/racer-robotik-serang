"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, BookOpen } from "lucide-react";
import { News } from "@/lib/types";

interface NewsReaderModalProps {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsReaderModal({ news, isOpen, onClose }: NewsReaderModalProps) {
  if (!isOpen || !news) return null;

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left max-h-[85vh] flex flex-col justify-between"
        >
          {/* Decorative glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-purple/5 blur-3xl rounded-full pointer-events-none" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Content Scrollable Area */}
          <div className="overflow-y-auto pr-2 space-y-6 flex-1 scrollbar-thin">
            {/* Tag Category & Date */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
                news.kategori === "Prestasi" 
                  ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                  : news.kategori === "Pengumuman"
                    ? "bg-brand-rose/10 border-brand-rose/20 text-brand-rose"
                    : "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan"
              }`}>
                {news.kategori}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatTanggal(news.created_at)}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
              {news.judul}
            </h2>

            {/* Author Info */}
            <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-white/5 pb-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-brand-cyan font-bold">
                {news.author_name ? news.author_name.charAt(0) : "A"}
              </div>
              <div>
                <span className="font-bold text-slate-300 block">{news.author_name || "Admin Racer"}</span>
                <span className="text-[10px] text-slate-500 block">Penulis Mading</span>
              </div>
            </div>

            {/* Body Content */}
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap space-y-4">
              <p>{news.konten}</p>
            </div>
          </div>

          {/* Footer inside modal */}
          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Mading Resmi Cabang Serang</span>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2 rounded-xl transition-all"
            >
              Tutup Bacaan
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
