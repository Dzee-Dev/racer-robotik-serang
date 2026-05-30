"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Users, Award } from "lucide-react";

export default function TentangKami() {
  const benefits = [
    "Instruktur bersertifikasi resmi yang sabar dan berpengalaman.",
    "Modul Kit Internasional MRT Series (My Robot Time) orisinal lengkap.",
    "Metode belajar interaktif berbasis proyek (Project-based learning STEM).",
    "Persiapan matang untuk keikutsertaan kompetisi IYRC & AYRO resmi."
  ];

  return (
    <section id="tentang" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Grid */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">Tentang Kami</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Mengapa Memilih Rumah Robot Banten?</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full mt-2" />
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            **Rumah Robot Banten** (Racer Robotik Cabang Serang) hadir sebagai pusat pendidikan robotika terdepan di wilayah Provinsi Banten. Kami memiliki misi mengenalkan teknologi robotik sejak usia dini guna melatih cara berpikir sistematis, pemecahan masalah kreatif (*problem solving*), serta mempersiapkan mental siswa menghadapi era otomasi cerdas (AI) masa kini.
          </p>

          <ul className="space-y-4 pt-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan shrink-0 mt-0.5 shadow-glow-cyan/10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-6 space-y-4">
          {[
            {
              icon: Cpu,
              color: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20",
              title: "Kurikulum & Peralatan MRT Resmi",
              desc: "Menggunakan kit orisinal modular berskala internasional dari My Robot Time (MRT) yang sangat aman dan mendukung kreativitas tanpa batas."
            },
            {
              icon: Users,
              color: "text-brand-purple bg-brand-purple/10 border-brand-purple/20",
              title: "Kelas Terbatas & Nyaman",
              desc: "Satu kelompok belajar dibatasi maksimal 10 siswa untuk menjamin interaksi instruktur yang fokus, bimbingan eksklusif, serta diskusi seru."
            },
            {
              icon: Award,
              color: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20",
              title: "Prestasi & Sertifikat Resmi",
              desc: "Didorong mengikuti olimpiade IYRC & AYRO. Setiap kenaikan tingkat disertai sertifikat kelulusan kompetensi yang diakui secara nasional."
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-5 rounded-2xl border border-white/5 flex gap-4 text-left items-start hover:border-brand-cyan/20 hover:bg-slate-950/30 transition-all duration-300"
            >
              <div className={`p-3 rounded-xl border shrink-0 ${feat.color}`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">{feat.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
