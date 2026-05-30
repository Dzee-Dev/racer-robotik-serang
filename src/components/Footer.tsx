"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import RumahRobotLogo from "./RumahRobotLogo";

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Footer links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        {/* Brand/Logo col */}
        <div className="md:col-span-2 space-y-4">
          <RumahRobotLogo size="md" />
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
            Rumah Robot Banten (Racer Robotik Cabang Serang) adalah pusat pembelajaran robotika sains terkemuka untuk anak-anak dengan kit MRT Series orisinal berkualitas internasional.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Program Kelas</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
            <li>
              <button onClick={() => scrollToSection("program")} className="hover:text-brand-cyan transition-colors">
                Kelas TK (MRT New Kicky)
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("program")} className="hover:text-brand-cyan transition-colors">
                Kelas SD (MRT Sensing)
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("program")} className="hover:text-brand-cyan transition-colors">
                Kelas SMP (MRT Duino C++)
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("program")} className="hover:text-brand-cyan transition-colors">
                Kelas Privat & Ekskul Sekolah
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Informasi Pro</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
            <li>
              <button onClick={() => scrollToSection("tentang")} className="hover:text-brand-cyan transition-colors">
                Tentang Kami
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("berita")} className="hover:text-brand-cyan transition-colors">
                Berita & Prestasi Mading
              </button>
            </li>
            <li>
              <a href="/admin" className="hover:text-brand-cyan transition-colors">
                Panel Konsol Admin
              </a>
            </li>
            <li>
              <button onClick={() => scrollToSection("kontak")} className="hover:text-brand-cyan transition-colors">
                Kontak Hubung
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyrights & anchors */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyrights */}
        <div className="text-xs text-slate-600 font-medium text-left">
          &copy; {new Date().getFullYear()} Rumah Robot Banten. Cabang Serang Resmi dari PT Racer Robot Indonesia.
        </div>

        {/* Mockup Quick Anchor Links */}
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => scrollToSection("hero")} 
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-brand-cyan px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1"
          >
            Kode Hero Section <ArrowRight className="w-3 h-3 rotate-[-90deg]" />
          </button>
          <button 
            onClick={() => scrollToSection("pendaftaran")} 
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-brand-cyan px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1"
          >
            Kode Pendaftaran <ArrowRight className="w-3 h-3" />
          </button>
          <a 
            href="/admin" 
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-brand-cyan px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1"
          >
            Kode Dashboard Admin <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
