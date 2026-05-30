"use client";

import React, { useState } from "react";
import { Search, Plus, RefreshCw, Edit3, Trash2, XCircle } from "lucide-react";
import { Peralatan, PeralatanLog } from "@/lib/types";

interface PeralatanTabProps {
  peralatanList: Peralatan[];
  logsList: PeralatanLog[];
  onAddEquipment: (eq: any) => void;
  onUpdateEquipment: (id: string, updated: any) => void;
  onDeleteEquipment: (id: string) => void;
  onRecordLog: (log: any) => void;
}

export default function PeralatanTab({
  peralatanList,
  logsList,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onRecordLog
}: PeralatanTabProps) {
  const [peralatanSearch, setPeralatanSearch] = useState("");

  // Modals forms states
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isEditingEq, setIsEditingEq] = useState(false);
  const [eqFormData, setEqFormData] = useState({
    id: "",
    kode: "",
    nama: "",
    kategori: "Mikrokontroler",
    jumlah: 1,
    kondisi: "Baik" as "Baik" | "Rusak Ringan" | "Rusak Berat",
    keterangan: ""
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logFormData, setLogFormData] = useState({
    peralatan_id: "",
    jenis: "masuk" as "masuk" | "keluar" | "rusak",
    jumlah: 1,
    keterangan: ""
  });

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleEqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingEq) {
      onUpdateEquipment(eqFormData.id, eqFormData);
    } else {
      onAddEquipment(eqFormData);
    }
    setIsEqModalOpen(false);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordLog(logFormData);
    setIsLogModalOpen(false);
    setLogFormData({
      peralatan_id: "",
      jenis: "masuk",
      jumlah: 1,
      keterangan: ""
    });
  };

  // Filtered list
  const filteredPeralatan = peralatanList.filter(e => {
    return e.nama.toLowerCase().includes(peralatanSearch.toLowerCase()) || 
           e.kode.toLowerCase().includes(peralatanSearch.toLowerCase()) ||
           e.kategori.toLowerCase().includes(peralatanSearch.toLowerCase());
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Inventaris Peralatan & Log Lab</h3>
          <p className="text-xs text-slate-400 mt-1">Kelola stok mikrokontroler, kit robotik MRT, sensor, dan catat transaksi keluar-masuk.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => {
              setIsEditingEq(false);
              setEqFormData({
                id: "",
                kode: "",
                nama: "",
                kategori: "Mikrokontroler",
                jumlah: 1,
                kondisi: "Baik",
                keterangan: ""
              });
              setIsEqModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Alat Baru
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Catat Mutasi Barang
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari peralatan (kode, nama, kategori)..."
            value={peralatanSearch}
            onChange={(e) => setPeralatanSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-slate-200 text-xs focus:outline-none focus:border-brand-cyan transition-colors"
          />
        </div>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left equipment table listing */}
        <div className="xl:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Kode & Nama</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Stok</th>
                    <th className="p-4">Kondisi</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeralatan.map((eq) => (
                    <tr key={eq.id} className="border-b border-white/5 hover:bg-slate-900/30 transition-all">
                      <td className="p-4">
                        <div className="font-bold text-white">{eq.nama}</div>
                        <div className="text-[10px] text-brand-cyan mt-0.5">{eq.kode}</div>
                        {eq.keterangan && <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] truncate">{eq.keterangan}</div>}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{eq.kategori}</td>
                      <td className="p-4 font-bold text-white text-sm">{eq.jumlah} pcs</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          eq.kondisi === "Baik" 
                            ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" 
                            : eq.kondisi === "Rusak Ringan"
                              ? "bg-brand-amber/10 border-brand-amber/20 text-brand-amber"
                              : "bg-brand-rose/10 border-brand-rose/20 text-brand-rose"
                        }`}>
                          {eq.kondisi}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setEqFormData({
                                id: eq.id,
                                kode: eq.kode,
                                nama: eq.nama,
                                kategori: eq.kategori,
                                jumlah: eq.jumlah,
                                kondisi: eq.kondisi,
                                keterangan: eq.keterangan || ""
                              });
                              setIsEditingEq(true);
                              setIsEqModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-cyan/40 text-brand-cyan rounded-lg transition-all"
                            title="Edit Data"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEquipment(eq.id)}
                            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-rose/40 text-brand-rose rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPeralatan.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data inventaris.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Logs Timeline sidebar */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4 h-[500px] flex flex-col justify-between">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-cyan" /> Riwayat Mutasi Barang
            </h4>
            <span className="text-[9px] text-slate-500 block mt-1">Histori perpindahan stok inventaris.</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {logsList.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    log.jenis === "masuk" 
                      ? "bg-brand-emerald/10 text-brand-emerald" 
                      : log.jenis === "keluar"
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "bg-brand-rose/10 text-brand-rose"
                  }`}>
                    {log.jenis}
                  </span>
                  <span className="text-[8px] text-slate-500 font-medium">{formatTanggal(log.tanggal)}</span>
                </div>
                <div>
                  <span className="font-bold text-white block truncate">{log.peralatan_nama || "Alat"}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Kuantitas: <span className="font-bold text-brand-cyan">{log.jumlah} pcs</span></span>
                </div>
                <p className="text-slate-500 text-[10px] border-t border-white/5 pt-1.5 max-w-full">
                  Keterangan: {log.keterangan}
                </p>
              </div>
            ))}
            {logsList.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-500">Belum ada riwayat transaksi log.</div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MODAL FORM OVERLAYS */}
      {/* ========================================================================= */}

      {/* MODAL 2A: Tambah/Edit Peralatan */}
      {isEqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">{isEditingEq ? "Edit Data Peralatan" : "Tambah Peralatan Baru"}</h3>
              <button onClick={() => setIsEqModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEqSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Kode Alat</label>
                  <input 
                    type="text"
                    value={eqFormData.kode}
                    onChange={(e) => setEqFormData(prev => ({ ...prev, kode: e.target.value }))}
                    placeholder="Contoh: EQ-005"
                    disabled={isEditingEq}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors disabled:opacity-50 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Kategori</label>
                  <select
                    value={eqFormData.kategori}
                    onChange={(e) => setEqFormData(prev => ({ ...prev, kategori: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  >
                    <option value="Mikrokontroler">Mikrokontroler</option>
                    <option value="Kit Robotik">Kit Robotik</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Komputasi Mini">Komputasi Mini</option>
                    <option value="Aksesori Sirkuit">Aksesori Sirkuit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Nama Peralatan</label>
                <input 
                  type="text"
                  value={eqFormData.nama}
                  onChange={(e) => setEqFormData(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Contoh: Sensor Ultrasonic"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Jumlah (Unit)</label>
                  <input 
                    type="number"
                    min="0"
                    value={eqFormData.jumlah}
                    disabled={isEditingEq}
                    onChange={(e) => setEqFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))}
                    placeholder="1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors disabled:opacity-50 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Kondisi Barang</label>
                  <select
                    value={eqFormData.kondisi}
                    onChange={(e) => setEqFormData(prev => ({ ...prev, kondisi: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  >
                    <option value="Baik">Baik (Prima)</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Keterangan Tambahan</label>
                <textarea 
                  value={eqFormData.keterangan}
                  onChange={(e) => setEqFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Keterangan penyimpanan lab..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                {isEditingEq ? "Simpan Perubahan" : "Masukkan Inventaris Baru"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2B: Catat Mutasi Barang */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Catat Log Transaksi Mutasi</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Pilih Peralatan</label>
                <select
                  value={logFormData.peralatan_id}
                  onChange={(e) => setLogFormData(prev => ({ ...prev, peralatan_id: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  required
                >
                  <option value="">-- Pilih Alat Lab --</option>
                  {peralatanList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} ({item.kode}) - Stok: {item.jumlah} pcs
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Jenis Mutasi</label>
                  <select
                    value={logFormData.jenis}
                    onChange={(e) => setLogFormData(prev => ({ ...prev, jenis: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 focus:outline-none focus:border-brand-cyan cursor-pointer text-xs"
                  >
                    <option value="masuk">Barang Masuk (Tambah Stok)</option>
                    <option value="keluar">Barang Keluar (Peminjaman)</option>
                    <option value="rusak">Barang Rusak (Kurang Stok)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Jumlah (Pcs)</label>
                  <input 
                    type="number"
                    min="1"
                    value={logFormData.jumlah}
                    onChange={(e) => setLogFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Alasan / Rincian Log</label>
                <textarea 
                  value={logFormData.keterangan}
                  onChange={(e) => setLogFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Contoh: Modul baru beli, Dipakai praktik SD, Sensor kebakar di Arduino."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold py-2.5 rounded-xl transition-all text-xs"
              >
                Catat Log Mutasi & Update Stok
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
