"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import RumahRobotLogo from "./RumahRobotLogo";

interface NavbarProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function Navbar({ activeSection, scrollToSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", id: "hero" },
    { name: "Program Kelas", id: "program" },
    { name: "Berita & Mading", id: "berita" },
    { name: "Tentang Kami", id: "tentang" },
    { name: "Pendaftaran", id: "pendaftaran" },
    { name: "Kontak", id: "kontak" }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-bg/85 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="cursor-pointer" 
            onClick={() => scrollToSection("hero")}
          >
            <RumahRobotLogo size="md" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-semibold hover:text-brand-cyan transition-colors text-slate-300"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("kontak")}
              className="text-sm font-semibold hover:text-brand-cyan transition-colors text-slate-300"
            >
              Kontak
            </button>
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection("pendaftaran")}
              className="bg-slate-950 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-slate-950 font-bold px-6 py-2 rounded-xl transition-all shadow-glow-cyan/10 hover:shadow-glow-cyan text-sm"
            >
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-brand-cyan p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-b border-white/5 bg-slate-950/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-brand-cyan hover:bg-slate-900/50 font-medium transition-all text-sm"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                scrollToSection("pendaftaran");
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 font-bold py-2.5 rounded-xl text-center shadow-glow-cyan block mt-4 text-sm"
            >
              Daftar Sekarang
            </button>
          </motion.div>
        )}
      </header>

      {/* Anchor Navigation Bar */}
      <div className="hidden md:block bg-slate-950/40 border-b border-white/5 sticky top-20 z-40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`pb-1 border-b-2 transition-all ${
                activeSection === item.id 
                  ? "text-brand-cyan border-brand-cyan font-bold" 
                  : "border-transparent hover:text-slate-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
