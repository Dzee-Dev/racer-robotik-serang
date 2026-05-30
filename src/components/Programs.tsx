"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Laptop, Home, ShieldCheck } from "lucide-react";

interface ProgramsProps {
  scrollToSection: (id: string) => void;
}

export default function Programs({ scrollToSection }: ProgramsProps) {
  const mainPrograms = [
    {
      jenjang: "Kelas TK",
      usia: "Usia 4-6 thn",
      kit: "Kit: MRT New Kicky",
      color: "border-t-brand-blue text-brand-blue",
      desc: "Belajar merakit model mekanik dasar dengan kit robotik MRT New Kicky. Pengenalan bentuk geometris, motor DC sederhana, sensor sentuh, serta melatih motorik halus anak."
    },
    {
      jenjang: "Kelas SD",
      usia: "Usia 7-12 thn",
      kit: "Kit: MRT Sensing & Story",
      color: "border-t-brand-cyan text-brand-cyan",
      desc: "Merakit robot beroda cerdas menggunakan kit MRT Sensing dan MRT Story. Belajar memahami logika sensor infra-red, motor servo, dan logika pemrograman visual (Scratch)."
    },
    {
      jenjang: "Kelas SMP",
      usia: "Usia 13-15 thn",
      kit: "Kit: MRT Duino (C++)",
      color: "border-t-brand-purple text-brand-purple",
      desc: "Mempelajari sirkuit elektronik cerdas berbasis mikrokontroler Arduino Uno dengan kit MRT Duino. Penulisan logika pemrograman teks C++ dan sensor ultrasonic."
    },
    {
      jenjang: "Kelas SMA",
      usia: "Usia 16-18 thn",
      kit: "Kit: IoT & Smart Robotics",
      color: "border-t-brand-amber text-brand-amber",
      desc: "Membangun proyek robotik Internet of Things (IoT) canggih, pemrosesan citra kamera (Computer Vision) dasar, dan robot otonom untuk persiapan olimpiade nasional."
    }
  ];

  return (
    <section id="program" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header text */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">Program Kelas Unggulan</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Kurikulum Robotik Terstruktur MRT Series</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full mt-2" />
          <p className="text-slate-400 text-sm sm:text-base">
            Kami menggunakan modul kit pendidikan resmi internasional **MRT (My Robot Time) Series** dari level dasar hingga tingkat pemrograman mahir.
          </p>
        </div>

        {/* 4 Main Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainPrograms.map((prog, index) => (
            <motion.div
              key={prog.jenjang}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-6 rounded-2xl border border-white/5 border-t-4 ${prog.color} text-left flex flex-col justify-between items-start transition-all duration-300 group hover:-translate-y-2 hover:border-r-brand-cyan/20`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-bold text-white block">{prog.jenjang}</span>
                    <span className="text-[10px] text-brand-cyan font-semibold block mt-0.5">{prog.kit}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-900 rounded-full text-slate-400 border border-slate-800">
                    {prog.usia}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{prog.desc}</p>
              </div>

              <button 
                onClick={() => scrollToSection("pendaftaran")}
                className="flex items-center gap-1 text-xs font-bold text-brand-cyan hover:text-white transition-colors group-hover:translate-x-1 mt-6"
              >
                Daftar Kelas Sekarang <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Sub-Programs Grid: Private & Extracurricular */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          {/* Private Class */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 text-left flex flex-col sm:flex-row gap-6 hover:border-brand-cyan/20 transition-all group"
          >
            <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-brand-cyan shrink-0 h-14 w-14 flex items-center justify-center">
              <Home className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Kelas Privat Eksklusif <span className="text-[10px] font-bold text-brand-amber bg-brand-amber/10 border border-brand-amber/20 px-2 py-0.5 rounded">Di Rumah</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Ingin belajar lebih intensif dan eksklusif? Instruktur bersertifikat kami akan datang langsung ke rumah Anda! Jadwal les sangat fleksibel dan disesuaikan dengan waktu luang putra-putri Anda. Mempercepat pemahaman dan pengerjaan proyek robotik anak.
              </p>
              <button 
                onClick={() => scrollToSection("pendaftaran")}
                className="text-xs font-bold text-brand-cyan inline-flex items-center gap-1 group-hover:translate-x-1 transition-all"
              >
                Daftar Privat Sekarang <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Extracurricular partnership */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 text-left flex flex-col sm:flex-row gap-6 hover:border-brand-cyan/20 transition-all group"
          >
            <div className="p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple shrink-0 h-14 w-14 flex items-center justify-center">
              <Laptop className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Ekstrakurikuler Sekolah <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">Kerjasama Resmi</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kami menyediakan program kemitraan ekstrakurikuler sains & robotik resmi dengan sekolah-sekolah TK, SD, SMP, dan SMA di Kota Serang. Menyediakan silabus kurikulum robotik teruji, instruktur bersertifikat, perlengkapan MRT kit lengkap, serta sertifikat resmi kelulusan siswa.
              </p>
              <a 
                href="https://wa.me/6281230009201" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-purple inline-flex items-center gap-1 group-hover:translate-x-1 transition-all hover:text-white"
              >
                Ajukan Proposal Kerjasama <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
