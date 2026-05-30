"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PendaftaranForm from "@/components/PendaftaranForm";
import Footer from "@/components/Footer";

// Force Dynamic Rendering for Server-Side Rendering (SSR)
export const dynamic = "force-dynamic";

export default function PendaftaranPage() {
  const [activeSection] = useState("pendaftaran");

  // Stub function to satisfy Navbar & Footer API contract since we are on a separate route
  const handleNavClick = (id: string) => {
    // If navigating to home section, redirect to home page with anchor
    if (id !== "pendaftaran") {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 relative">
      {/* Background Decorative Mesh & Grids */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header & Navigation */}
      <Navbar activeSection={activeSection} scrollToSection={handleNavClick} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-brand-cyan transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-brand-cyan font-bold tracking-widest uppercase block">Pendaftaran Online</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Formulir Penerimaan Siswa Baru</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full mt-2" />
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Silakan pilih program les bulanan atau semesteran cabang Serang dan unggah bukti transfer.
          </p>
        </div>

        {/* Pendaftaran Form Component */}
        <div className="pb-16">
          <PendaftaranForm />
        </div>
      </main>

      {/* Footer */}
      <Footer scrollToSection={handleNavClick} />
    </div>
  );
}
