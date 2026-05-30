"use client";

import React from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { User } from "@/lib/types";
import RumahRobotLogo from "../RumahRobotLogo";

interface AdminHeaderProps {
  adminUser: User | null;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function AdminHeader({ adminUser, onRefresh, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-slate-950/90 border-b border-white/5 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo with Serang branch title */}
        <RumahRobotLogo size="md" />

        {/* User profile & controls */}
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="hidden sm:block text-right">
            <div className="text-white font-bold">{adminUser?.name || "Admin Serang"}</div>
            <div className="text-[9px] text-brand-cyan font-bold uppercase tracking-wider mt-0.5">Administrator</div>
          </div>
          
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all hover:text-white"
            title="Segarkan Seluruh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-900 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400 font-bold px-4 py-2 rounded-xl transition-all text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
