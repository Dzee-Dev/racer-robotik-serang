"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Phone, Clock, ArrowUpRight, Cpu, ClipboardList, CheckCircle, ShieldCheck
} from "lucide-react";
import Link from "next/link";

// Import Modular Components
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import NewsSection from "@/components/NewsSection";
import TentangKami from "@/components/TentangKami";
import Footer from "@/components/Footer";

// Force Dynamic Rendering for Server-Side Rendering (SSR)
export const dynamic = "force-dynamic";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  // Update active anchor link on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "program", "berita", "tentang", "pendaftaran", "kontak"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetHeight = el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "pendaftaran") {
      window.location.href = "/pendaftaran";
      return;
    }
    if (id === "berita") {
      window.location.href = "/news";
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 relative">
      {/* Background Decorative Mesh & Grids */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. Header & Navigation (Modular) */}
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* 2. Hero Section (Modular) */}
      <Hero scrollToSection={scrollToSection} />

      {/* 3. Program Kelas Unggulan (Modular) */}
      <Programs scrollToSection={scrollToSection} />

      {/* 4. Mading Berita (Modular - Teaser Mode) */}
      <NewsSection isTeaser={true} />

      {/* 5. Tentang Kami (Modular) */}
      <TentangKami />

      {/* 6. Intermediate CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gradient-to-r from-slate-950 to-brand-bg relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/5 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Siap Mengembangkan Kreativitas Teknologi Anak?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Dapatkan konsultasi pemetaan minat robotika sains dan uji coba kelas gratis di laboratorium kami di Kota Serang.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button 
              onClick={() => scrollToSection("pendaftaran")}
              className="bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 hover:shadow-glow-cyan font-bold px-8 py-3 rounded-xl transition-all text-xs"
            >
              Daftar Sekarang
            </button>
            <a 
              href="https://wa.me/6281230009201" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-xs"
            >
              Hubungi Cabang Serang
            </a>
          </div>
        </div>
      </section>

      {/* 7. Pendaftaran Teaser Section (Replaced full form) */}
      <section id="pendaftaran" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative bg-gradient-to-b from-brand-bg to-slate-950">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">Pendaftaran Online</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Formulir Penerimaan Siswa Baru</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full mt-2" />
            <p className="text-slate-400 text-xs sm:text-sm">Silakan pilih program les bulanan atau semesteran cabang Serang dan unggah bukti transfer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            {/* Left Box: Step Summary Preview */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between hover:border-brand-cyan/20 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-brand-cyan" /> Alur Pendaftaran Online
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-sm">Isi Informasi Calon Siswa</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Nama, sekolah, kelas, & kontak WhatsApp aktif.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-sm">Pilih Program & Paket Les</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Bulanan/Semesteran (Reguler/Private/Online) dengan kalkulator biaya otomatis.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-sm">Pilih Jadwal Les Terbuka</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Tersedia slot hari Senin s.d Sabtu (pukul 09.00 - 16.00 WIB).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <h4 className="text-white font-bold text-xs sm:text-sm">Instruksi Transfer & Unggah Bukti</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Pembayaran via rekening Bank Muamalat PT Racer Robot Indonesia.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-medium">
                *Proses verifikasi admin memerlukan waktu maksimal 1x24 jam.
              </div>
            </div>

            {/* Right Box: Benefits Checklist */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between hover:border-brand-purple/20 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-purple" /> Keuntungan Belajar di Racer
                </h3>

                <ul className="space-y-3.5">
                  <li className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <span>Kurikulum terstruktur berbasis modul resmi **MRT (My Robot Time) Series** orisinal internasional.</span>
                  </li>
                  <li className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <span>Laboratorium robotik ber-AC modern di pusat Kota Serang dengan ribuan kit sensor siap pakai.</span>
                  </li>
                  <li className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <span>Bimbingan intensif persiapan ajang olimpiade robotika bergengsi nasional & global (IYRC / AYRO).</span>
                  </li>
                  <li className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <span>Instruktur bersertifikat ahli dengan pendekatan belajar ramah anak yang menyenangkan.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
                <span>Free Trial Uji Coba Tersedia!</span>
                <span className="text-brand-cyan">Sertifikasi Kelulusan Resmi</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              href="/pendaftaran"
              className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-slate-950 font-extrabold px-12 py-4 rounded-xl text-sm transition-all shadow-glow-cyan hover:shadow-glow-cyan-lg hover:-translate-y-0.5 transform inline-block"
            >
              Mulai Formulir Pendaftaran Online
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Kontak Section */}
      <section id="kontak" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-950/20 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          
          {/* Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">Kontak Kantor</span>
              <h2 className="text-3xl font-extrabold text-white">Kantor Cabang Serang</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full mt-2" />
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Silakan hubungi kami untuk berkonsultasi seputar ekstrakurikuler sekolah, proposal program, atau pendaftaran kelas privat.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-brand-cyan">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Alamat Lab Rumah Robot Serang</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Jl. Jenderal Sudirman No. 45, Sumurpecung, Kec. Serang, Kota Serang, Banten 42118
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-brand-cyan">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">WhatsApp Kontak Layanan</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    +62 812-3000-9201 (Pendaftaran Cabang Serang)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-brand-cyan">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Jam Layanan Operasional</h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Senin - Sabtu: 09.00 - 17.00 WIB (Minggu Libur)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Lab Location Banner */}
          <div className="rounded-2xl border border-white/5 overflow-hidden glass-card p-6 flex flex-col justify-between relative shadow-2xl min-h-[300px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 blur-xl rounded-full" />
            <div className="space-y-4">
              <span className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase block">Laboratorium Serang</span>
              <h3 className="text-xl font-bold text-white">Rumah Robot Banten</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Laboratorium robotik kami di Kota Serang didesain ramah anak, ber-AC, dan memiliki ribuan kit sensor siap pakai. Siswa dibimbing langsung merakit, menyolder secara aman, menulis kode, hingga menguji robot otonom di sirkuit track lintasan robot beroda.
              </p>
            </div>
            
            <div className="border border-slate-800/80 bg-slate-950/50 rounded-xl p-4 mt-6 text-xs text-slate-400 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Konsol Pengelolaan Admin?</span>
                <span className="text-[10px] block mt-0.5">Kelola verifikasi pembayaran & inventaris lab.</span>
              </div>
              <a 
                href="/admin" 
                className="bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan font-bold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                Login Admin <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer (Modular) */}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
