"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

// Force Dynamic Rendering for Server-Side Rendering (SSR)
export const dynamic = "force-dynamic";

export default function NewsPage() {
  const [activeSection] = useState("berita");

  // Stub function to satisfy Navbar & Footer API contract since we are on a separate route
  const handleNavClick = (id: string) => {
    // If navigating to home section, redirect to home page with anchor
    if (id !== "berita") {
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

        {/* Full News Section Component */}
        <div className="pb-16">
          <NewsSection />
        </div>
      </main>

      {/* Footer */}
      <Footer scrollToSection={handleNavClick} />
    </div>
  );
}
