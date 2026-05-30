"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Users, TrendingUp, Cpu, Calendar } from "lucide-react";
import { Siswa, Peralatan } from "@/lib/types";

interface OverviewTabProps {
  siswaList: Siswa[];
  peralatanList: Peralatan[];
  newsCount: number;
  setActiveTab: (tab: "overview" | "siswa" | "peralatan" | "news") => void;
}

export default function OverviewTab({
  siswaList,
  peralatanList,
  newsCount,
  setActiveTab
}: OverviewTabProps) {
  // 1. Overview Metrik Counts
  const totalSiswaCount = siswaList.length;
  const pendingSiswaCount = siswaList.filter(s => s.status === "pending").length;
  const totalPeralatanCount = peralatanList.reduce((acc, curr) => acc + curr.jumlah, 0);
  const damagedEqCount = peralatanList.filter(e => e.kondisi !== "Baik").length;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // 2. Dynamic SVG Chart Data Processing
  // Group student registrations by date of the last 7 days
  const chartData = useMemo(() => {
    const datesMap: Record<string, number> = {};
    
    // Initialise last 7 days with 0 registrations
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      datesMap[dateStr] = 0;
    }

    // Populate with real data
    siswaList.forEach(s => {
      try {
        const dateStr = new Date(s.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        if (dateStr in datesMap) {
          datesMap[dateStr] += 1;
        }
      } catch (e) {
        // Safe check
      }
    });

    const entries = Object.entries(datesMap);
    const maxVal = Math.max(...entries.map(([, v]) => v), 4); // minimum upper limit of 4 to keep chart nice

    // Compute SVG coordinates (chart is 500x200)
    const points = entries.map(([label, val], idx) => {
      const x = 50 + idx * 70; // 50 to 470
      const y = 170 - (val / maxVal) * 120; // 170 down to 50
      return { label, val, x, y };
    });

    // Generate SVG path line
    let pathD = "";
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        // Curve lines
        const cpX1 = points[i-1].x + 35;
        const cpY1 = points[i-1].y;
        const cpX2 = points[i].x - 35;
        const cpY2 = points[i].y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
      }
    }

    return { points, pathD, maxVal };
  }, [siswaList]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-left"
    >
      <div>
        <h3 className="text-xl font-bold text-white">Ikhtisar Konsol</h3>
        <p className="text-xs text-slate-400 mt-1">Metrik performa pendaftaran les, stok peralatan, dan mading cabang Serang.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Siswa Les", val: totalSiswaCount, unit: "Siswa terdaftar", color: "text-brand-blue border-t-brand-blue" },
          { title: "Verifikasi Tertunda", val: pendingSiswaCount, unit: "Perlu disetujui", color: "text-brand-amber border-t-brand-amber bg-brand-amber/5" },
          { title: "Total Unit Peralatan", val: totalPeralatanCount, unit: "Unit di lab Serang", color: "text-brand-cyan border-t-brand-cyan" },
          { title: "Alat Rusak / Perhatian", val: damagedEqCount, unit: "Perlu perbaikan", color: "text-brand-rose border-t-brand-rose bg-brand-rose/5" }
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-5 rounded-2xl border border-white/5 border-t-4 ${stat.color}`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.title}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block mt-2">{stat.val}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">{stat.unit}</span>
          </div>
        ))}
      </div>

      {/* Analytics Chart & List Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Dynamic SVG Analytics Chart */}
        <div className="xl:col-span-2 glass-card p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-cyan" /> Tren Pendaftaran Siswa Baru
              </h4>
              <span className="text-[9px] text-slate-500 block mt-0.5">Grafik pendaftaran selama 7 hari terakhir</span>
            </div>
            <span className="text-[10px] text-brand-cyan font-bold bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">Dinamis</span>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full overflow-hidden bg-slate-950/40 rounded-xl p-2 relative">
            <svg 
              viewBox="0 0 520 200" 
              className="w-full h-auto filter drop-shadow-[0_0_12px_rgba(0,240,255,0.08)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cyan Neon Glow Effect */}
                <filter id="cyan-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Background Horizontal Lines */}
              <line x1="45" y1="50" x2="480" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="45" y1="110" x2="480" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="45" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Chart Line Path */}
              {chartData.pathD && (
                <path 
                  d={chartData.pathD} 
                  fill="none" 
                  stroke="#00f0ff" 
                  strokeWidth="2.5" 
                  filter="url(#cyan-line-glow)" 
                />
              )}

              {/* Chart Grid dots X-Axis and Labels */}
              {chartData.points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  {/* Point circles */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="4" 
                    fill="#070d19" 
                    stroke="#00f0ff" 
                    strokeWidth="2" 
                  />
                  {/* Glowing background on hover */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="8" 
                    fill="rgba(0, 240, 255, 0.2)" 
                    className="opacity-0 hover:opacity-100 transition-opacity" 
                  />
                  {/* Values text */}
                  <text 
                    x={pt.x} 
                    y={pt.y - 10} 
                    textAnchor="middle" 
                    fill="#00f0ff" 
                    className="text-[9px] font-bold"
                  >
                    {pt.val > 0 ? pt.val : ""}
                  </text>
                  {/* X-axis date labels */}
                  <text 
                    x={pt.x} 
                    y="190" 
                    textAnchor="middle" 
                    fill="#475569" 
                    className="text-[8px] font-semibold"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}

              {/* Y-axis label */}
              <text x="35" y="54" textAnchor="end" fill="#475569" className="text-[8px] font-bold">{chartData.maxVal}</text>
              <text x="35" y="114" textAnchor="end" fill="#475569" className="text-[8px] font-bold">{(chartData.maxVal/2).toFixed(0)}</text>
              <text x="35" y="174" textAnchor="end" fill="#475569" className="text-[8px] font-bold">0</text>
            </svg>
          </div>
        </div>

        {/* Right: Critical stock list */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white inline-flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-amber" /> Inventaris Perhatian
            </h4>
            <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Lab Serang</span>
          </div>

          <div className="space-y-3 h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {peralatanList.filter(e => e.kondisi !== "Baik" || e.jumlah < 5).map((e) => (
              <div key={e.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-950/40 rounded-xl border border-white/5">
                <div>
                  <span className="font-bold text-white block truncate max-w-[140px]">{e.nama}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">{e.kode} | {e.kategori}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold block ${e.kondisi === "Baik" ? "text-brand-cyan" : "text-brand-rose"}`}>{e.kondisi}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Sisa: {e.jumlah} pcs</span>
                </div>
              </div>
            ))}
            {peralatanList.filter(e => e.kondisi !== "Baik" || e.jumlah < 5).length === 0 && (
              <div className="text-center py-12 text-xs text-slate-500">Seluruh stok peralatan aman & berfungsi baik.</div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom recent listings */}
      <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h4 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-cyan" /> Pendaftaran Terbaru
          </h4>
          <button onClick={() => setActiveTab("siswa")} className="text-xs text-brand-cyan hover:underline">
            Kelola Pendaftaran
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siswaList.slice(0, 3).map((s) => (
            <div key={s.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl text-left text-xs space-y-2 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-white block text-sm">{s.nama_lengkap}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">{s.asal_sekolah} ({s.kelas})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                  s.status === "approved" 
                    ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20" 
                    : s.status === "rejected"
                      ? "bg-brand-rose/10 text-brand-rose border border-brand-rose/20"
                      : "bg-brand-amber/10 text-brand-amber border border-brand-amber/20 animate-pulse"
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 flex justify-between">
                <span>{s.program} ({s.durasi_paket})</span>
                <span className="font-bold text-brand-cyan">{formatRupiah(s.harga)}</span>
              </div>
            </div>
          ))}
          {siswaList.length === 0 && (
            <div className="col-span-3 text-center py-6 text-xs text-slate-500">Belum ada siswa les yang terdaftar.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
