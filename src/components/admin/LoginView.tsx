"use client";

import React from "react";
import { Mail, Key, XCircle } from "lucide-react";
import RumahRobotLogo from "../RumahRobotLogo";

interface LoginViewProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
  isLoggingIn: boolean;
  onLoginSubmit: (e: React.FormEvent) => void;
}

export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoggingIn,
  onLoginSubmit
}: LoginViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
      >
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-cyan/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-purple/20 blur-2xl rounded-full" />

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <RumahRobotLogo size="md" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Login Konsol Admin</h2>
          <p className="text-slate-400 text-xs mt-1">Gunakan kredensial admin untuk verifikasi pembayaran dan mutasi barang lab.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onLoginSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Admin</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@racer.id"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold py-2.5 rounded-xl transition-all block text-center mt-6 disabled:opacity-50 text-xs sm:text-sm"
          >
            {isLoggingIn ? "Memproses..." : "Masuk ke Konsol Admin"}
          </button>
        </form>

        {/* Developer credentials warning box */}
        <div className="mt-6 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[10px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-400">🔑 Kredensial Uji Coba (Seed Data):</div>
          <div>Email: <span className="text-brand-cyan select-all font-mono">admin@racer.id</span></div>
          <div>Sandi: <span className="text-brand-cyan select-all font-mono">adminracer123</span></div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors underline">
            Kembali ke Beranda Web
          </a>
        </div>
      </div>
    </div>
  );
}
