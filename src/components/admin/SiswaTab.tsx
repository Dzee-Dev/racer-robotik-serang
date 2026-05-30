"use client";

import React, { useState } from "react";
import { Search, Filter, Eye, XCircle, CheckCircle2 } from "lucide-react";
import { Siswa } from "@/lib/types";

interface SiswaTabProps {
  siswaList: Siswa[];
  onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}

export default function SiswaTab({ siswaList, onUpdateStatus }: SiswaTabProps) {
  const [siswaSearch, setSiswaSearch] = useState("");
  const [siswaFilterStatus, setSiswaFilterStatus] = useState<string>("all");
  const [siswaFilterJenjang, setSiswaFilterJenjang] = useState<string>("all");

  // Detail Modal State
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [isSiswaDetailOpen, setIsSiswaDetailOpen] = useState(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Filtered List
  const filteredSiswa = siswaList.filter(s => {
    const matchesSearch = s.nama_lengkap.toLowerCase().includes(siswaSearch.toLowerCase()) || 
                          s.email.toLowerCase().includes(siswaSearch.toLowerCase()) ||
                          s.asal_sekolah.toLowerCase().includes(siswaSearch.toLowerCase());
    const matchesStatus = siswaFilterStatus === "all" || s.status === siswaFilterStatus;
    const matchesJenjang = siswaFilterJenjang === "all" || s.jenjang === siswaFilterJenjang;
    return matchesSearch && matchesStatus && matchesJenjang;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-xl font-bold text-white">Kelola Calon Siswa Serang</h3>
        <p className="text-xs text-slate-400 mt-1">Verifikasi bukti transfer bank Muamalat untuk mengesahkan kelas les siswa baru.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari siswa (nama, email, sekolah)..."
            value={siswaSearch}
            onChange={(e) => setSiswaSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-slate-200 text-xs focus:outline-none focus:border-brand-cyan transition-colors"
          />
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={siswaFilterStatus}
            onChange={(e) => setSiswaFilterStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-slate-400 text-xs focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved (Disetujui)</option>
            <option value="rejected">Rejected (Ditolak)</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={siswaFilterJenjang}
            onChange={(e) => setSiswaFilterJenjang(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-slate-400 text-xs focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">Semua Jenjang</option>
            <option value="TK">TK</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>
        </div>
      </div>

      {/* Listing Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Calon Siswa</th>
                <th className="p-4">Jenjang & Sekolah</th>
                <th className="p-4">Modul & Jadwal</th>
                <th className="p-4">Biaya</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((siswa) => (
                <tr key={siswa.id} className="border-b border-white/5 hover:bg-slate-900/30 transition-all">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{siswa.nama_lengkap}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{siswa.email}</div>
                    <div className="text-[10px] text-slate-500">{siswa.no_telp}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-300 block">{siswa.jenjang} - {siswa.kelas}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{siswa.asal_sekolah}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-brand-cyan block uppercase tracking-wider">{siswa.program}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 capitalize">{siswa.durasi_paket}</span>
                    <span className="text-[10px] text-slate-500 block">{siswa.jadwal_les}</span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {formatRupiah(siswa.harga)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      siswa.status === "approved" 
                        ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                        : siswa.status === "rejected"
                          ? "bg-brand-rose/10 border-brand-rose/20 text-brand-rose"
                          : "bg-brand-amber/10 border-brand-amber/20 text-brand-amber animate-pulse"
                    }`}>
                      {siswa.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedSiswa(siswa);
                        setIsSiswaDetailOpen(true);
                      }}
                      className="p-2 bg-slate-900 border border-slate-800 hover:border-brand-cyan/40 text-brand-cyan rounded-xl transition-all"
                      title="Verifikasi Pembayaran"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSiswa.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Tidak ada pendaftaran yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Dialog Overlay */}
      {isSiswaDetailOpen && selectedSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left flex flex-col md:flex-row gap-6">
            
            {/* Details panel */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">Verifikasi Slip Transfer</h3>
                  <span className="text-[9px] text-brand-cyan font-bold block mt-0.5 font-mono">Pendaftaran ID: {selectedSiswa.id}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsSiswaDetailOpen(false);
                    setSelectedSiswa(null);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5">
                  <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Identitas Calon Siswa:</div>
                  <div>Nama Lengkap: <span className="font-bold text-white">{selectedSiswa.nama_lengkap}</span></div>
                  <div>No. Telp / WA: <span className="font-bold text-white">{selectedSiswa.no_telp}</span></div>
                  <div>Jenjang & Sekolah: <span className="font-bold text-white">{selectedSiswa.jenjang} ({selectedSiswa.kelas}) | {selectedSiswa.asal_sekolah}</span></div>
                </div>

                <div className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5">
                  <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Program & Keuangan:</div>
                  <div>Program Modul: <span className="font-bold text-white uppercase">{selectedSiswa.program}</span></div>
                  {selectedSiswa.kelas_tipe && <div>Tipe Kelas: <span className="font-bold text-white uppercase">{selectedSiswa.kelas_tipe} Class</span></div>}
                  <div>Jadwal Terpilih: <span className="font-bold text-brand-cyan">{selectedSiswa.jadwal_les}</span></div>
                  <div>Total Nominal Transfer: <span className="font-extrabold text-brand-emerald">{formatRupiah(selectedSiswa.harga)}</span></div>
                </div>
              </div>

              {/* Verify Actions */}
              {selectedSiswa.status === "pending" ? (
                <div className="flex gap-2 pt-2 text-xs">
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedSiswa.id, "approved");
                      setIsSiswaDetailOpen(false);
                      setSelectedSiswa(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-brand-emerald to-emerald-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-center hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Setujui & Kirim Akses
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedSiswa.id, "rejected");
                      setIsSiswaDetailOpen(false);
                      setSelectedSiswa(null);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-400 font-extrabold px-4 py-2.5 rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 stroke-[2.5]" /> Tolak Pendaftaran
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-950/20 border border-white/5 rounded-xl text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                  <span>Siswa ini telah terverifikasi: </span>
                  <span className={`uppercase tracking-wider ${selectedSiswa.status === "approved" ? "text-brand-emerald" : "text-brand-rose"}`}>{selectedSiswa.status}</span>
                </div>
              )}
            </div>

            {/* Slip image preview panel */}
            <div className="w-full md:w-56 flex flex-col justify-between shrink-0 space-y-3">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Bukti Transfer Fisik:</span>
              <div className="flex-1 min-h-[180px] bg-slate-950/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2 relative group">
                {selectedSiswa.bukti_pembayaran_url ? (
                  <img 
                    src={selectedSiswa.bukti_pembayaran_url} 
                    alt="Siswa Slip Bukti Pembayaran" 
                    className="max-h-56 rounded-xl object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-600 text-center font-medium">Tidak ada gambar slip terunggah.</span>
                )}
              </div>
              <div className="text-[9px] text-slate-500 text-center leading-relaxed">
                Verifikasi dana di mutasi Bank Muamalat Cab Ciledug, No Rek 3280009201 a.n PT Racer Robot Indonesia.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
