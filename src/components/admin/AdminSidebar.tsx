"use client";

import React from "react";
import { TrendingUp, Users, Package, FileText } from "lucide-react";

interface AdminSidebarProps {
  activeTab: "overview" | "siswa" | "peralatan" | "news";
  setActiveTab: (tab: "overview" | "siswa" | "peralatan" | "news") => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const tabs = [
    { id: "overview", name: "Ikhtisar", desc: "Ringkasan data", icon: TrendingUp },
    { id: "siswa", name: "Pendaftaran Siswa", desc: "Verifikasi les", icon: Users },
    { id: "peralatan", name: "Inventaris Alat", desc: "Stok & log lab", icon: Package },
    { id: "news", name: "Kelola Mading", desc: "CRUD berita", icon: FileText }
  ] as const;

  return (
    <aside className="md:w-60 shrink-0">
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-3 md:pb-0 md:sticky md:top-24 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all w-48 md:w-full shrink-0 ${
                isActive 
                  ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow-cyan/5" 
                  : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-brand-cyan" : "text-slate-500"}`} />
              <div>
                <div className="text-xs sm:text-sm font-bold block">{tab.name}</div>
                <div className="text-[10px] text-slate-500 font-medium block mt-0.5 md:hidden lg:block">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
