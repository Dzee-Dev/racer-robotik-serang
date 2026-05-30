"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Cpu } from "lucide-react";
import RumahRobotLogo from "./RumahRobotLogo";

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export default function Hero({ scrollToSection }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-140px)] flex items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.05)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Rumah Robot Banten | Cabang Serang
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            Belajar <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent neon-text-glow">Robotik</span> Lebih Seru Bersama Rumah Robot
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Pusat pendidikan teknologi robotik orisinal untuk anak-anak TK hingga SMA di Kota Serang. Menggunakan kurikulum internasional terstruktur dengan perlengkapan modern.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button 
              onClick={() => scrollToSection("pendaftaran")}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Daftar Kelas Baru <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToSection("program")}
              className="bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 font-bold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Lihat Program Kelas
            </button>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-lg"
          >
            <div>
              <div className="text-3xl font-extrabold text-white">500+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Siswa Aktif Banten</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">12+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Instruktur Profesional</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">8</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Tahun Berdiri</div>
            </div>
          </motion.div>
        </div>

        {/* Hero Right Content: Autonomous Robot Panel */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/5 bg-slate-950/20 glass-card p-6 flex flex-col justify-between items-center overflow-hidden shadow-2xl animate-float group"
          >
            {/* Outer Neon Ring */}
            <div className="absolute inset-0 border border-brand-cyan/20 rounded-3xl group-hover:border-brand-cyan/40 transition-colors pointer-events-none" />
            
            {/* Top Banner */}
            <div className="text-center w-full pb-2 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase">Rumah Robot Serang</span>
              <span className="text-[8px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">Active Node</span>
            </div>

            {/* SVG Robotics Assembly */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-56 h-56 my-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <line x1="20" y1="140" x2="180" y2="140" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" strokeDasharray="3,3" />
              <ellipse cx="100" cy="150" rx="60" ry="10" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="5,5" filter="url(#glow-cyan)" />

              {/* Floating mechanical components */}
              <rect x="35" y="110" width="10" height="30" rx="4" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
              <rect x="155" y="110" width="10" height="30" rx="4" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
              
              <path d="M45,125 L70,125" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="2,2" />
              <path d="M155,125 L130,125" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="2,2" />

              {/* Main robot body with custom chest gear */}
              <rect x="70" y="80" width="60" height="50" rx="10" fill="url(#bodyGrad)" stroke="#00f0ff" strokeWidth="2" filter="url(#glow-cyan)" />
              <circle cx="100" cy="105" r="10" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4,2" />
              <circle cx="100" cy="105" r="5" fill="#facc15" />

              {/* Neck */}
              <rect x="92" y="70" width="16" height="10" fill="#1e293b" stroke="#00f0ff" strokeWidth="1.5" />

              {/* Head */}
              <rect x="75" y="42" width="50" height="30" rx="8" fill="url(#bodyGrad)" stroke="#00f0ff" strokeWidth="2" />
              <circle cx="90" cy="57" r="4" fill="#00f0ff" filter="url(#glow-cyan)">
                <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="110" cy="57" r="4" fill="#00f0ff" filter="url(#glow-cyan)">
                <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Antenna */}
              <line x1="100" y1="42" x2="100" y2="28" stroke="#00f0ff" strokeWidth="2" />
              <circle cx="100" cy="26" r="3.5" fill="#facc15" filter="url(#glow-cyan)" />
            </svg>

            {/* Bottom details including Rhino Badge */}
            <div className="w-full border-t border-white/5 pt-3.5 flex justify-center">
              <RumahRobotLogo size="sm" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
