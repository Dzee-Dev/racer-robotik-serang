"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, School, BookOpen, Clock, 
  CreditCard, Upload, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft 
} from "lucide-react";
import { mockDb } from "@/lib/mockDb";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatRegistrationId } from "@/lib/types";

export default function PendaftaranForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_telp: "",
    jenjang: "TK" as "TK" | "SD" | "SMP" | "SMA",
    kelas: "",
    asal_sekolah: "",
    program: "reguler" as "reguler" | "private" | "online",
    kelas_tipe: "gold" as "gold" | "silver" | "bronze",
    durasi_paket: "perbulan" as "perbulan" | "persemester",
    hari_les: "Senin",
    jam_les: "09.00 - 10.00",
    bukti_pembayaran: null as File | null,
    bukti_pembayaran_preview: ""
  });

  const [price, setPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const timeSlots = [
    "09.00 - 10.00",
    "10.00 - 11.00",
    "11.00 - 12.00",
    "13.00 - 14.00",
    "14.00 - 15.00",
    "15.00 - 16.00"
  ];

  // Calculate pricing based on program, duration, and class type
  useEffect(() => {
    let calculatedPrice = 0;

    if (formData.program === "reguler") {
      if (formData.durasi_paket === "perbulan") {
        if (formData.kelas_tipe === "gold") calculatedPrice = 550000;
        else if (formData.kelas_tipe === "silver") calculatedPrice = 450000;
        else if (formData.kelas_tipe === "bronze") calculatedPrice = 350000;
      } else {
        // persemester
        if (formData.kelas_tipe === "gold") calculatedPrice = 160000; // wait, let's look at user requirements:
        // Rp 1.600.000 for gold, 1.500.000 for silver, 1.400.000 for bronze
        if (formData.kelas_tipe === "gold") calculatedPrice = 1600000;
        else if (formData.kelas_tipe === "silver") calculatedPrice = 1500000;
        else if (formData.kelas_tipe === "bronze") calculatedPrice = 1400000;
      }
    } else if (formData.program === "private") {
      if (formData.durasi_paket === "perbulan") {
        calculatedPrice = 650000;
      } else {
        calculatedPrice = 2400000;
      }
    } else if (formData.program === "online") {
      if (formData.durasi_paket === "perbulan") {
        calculatedPrice = 350000;
      } else {
        calculatedPrice = 1200000;
      }
    }

    setPrice(calculatedPrice);
  }, [formData.program, formData.durasi_paket, formData.kelas_tipe]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        bukti_pembayaran: file,
        bukti_pembayaran_preview: URL.createObjectURL(file)
      }));
    }
  };

  const validateStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!formData.nama_lengkap.trim()) return "Nama lengkap wajib diisi.";
      if (!formData.no_telp.trim()) return "Nomor telepon wajib diisi.";
      if (!formData.kelas.trim()) return "Kelas saat ini wajib diisi.";
      if (!formData.asal_sekolah.trim()) return "Asal sekolah wajib diisi.";
      if (!formData.email.trim()) return "Email wajib diisi.";
      // Email format check
      if (!/\S+@\S+\.\S+/.test(formData.email)) return "Format email tidak valid.";
    } else if (step === 4) {
      if (!formData.bukti_pembayaran) return "Silakan unggah bukti transfer pembayaran Anda.";
    }
    return "";
  };

  const nextStep = () => {
    const error = validateStep();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let finalBuktiUrl = formData.bukti_pembayaran_preview;

      // 1. Upload to Supabase Storage if configured and file exists
      if (isSupabaseConfigured && formData.bukti_pembayaran) {
        try {
          const file = formData.bukti_pembayaran;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("bukti-transfer")
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error("Storage upload error, falling back to data URL:", uploadError);
          } else {
            const { data } = supabase.storage
              .from("bukti-transfer")
              .getPublicUrl(filePath);
            
            if (data?.publicUrl) {
              finalBuktiUrl = data.publicUrl;
            }
          }
        } catch (storageErr) {
          console.error("Supabase Storage upload failed:", storageErr);
        }
      } 
      
      // 2. Base64 conversion if running offline fallback (so it persists in LocalStorage)
      if (!isSupabaseConfigured && formData.bukti_pembayaran) {
        try {
          const fileReaderPromise = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            });
          };
          
          const base64Url = await fileReaderPromise(formData.bukti_pembayaran);
          finalBuktiUrl = base64Url;
        } catch (base64Err) {
          console.error("Failed to convert image to Base64:", base64Err);
        }
      }

      // Create Siswa Object
      const newSiswaData = {
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_telp: formData.no_telp,
        jenjang: formData.jenjang,
        kelas: formData.kelas,
        asal_sekolah: formData.asal_sekolah,
        program: formData.program,
        kelas_tipe: formData.program === "reguler" ? formData.kelas_tipe : undefined,
        durasi_paket: formData.durasi_paket,
        jadwal_les: `${formData.hari_les}, ${formData.jam_les}`,
        harga: price,
        bukti_pembayaran_url: finalBuktiUrl
      };

      // Send registration to API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSiswaData)
      });

      let savedData;
      if (response.ok) {
        const resJson = await response.json();
        savedData = resJson.data;
      } else {
        // Fallback to mockDb directly
        savedData = mockDb.addSiswa(newSiswaData);
      }

      setSuccessData(savedData);
      setStep(5);
    } catch (err) {
      console.error(err);
      
      // Fallback in case of server offline
      let finalBuktiUrl = formData.bukti_pembayaran_preview;
      if (formData.bukti_pembayaran) {
        try {
          const fileReaderPromise = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            });
          };
          finalBuktiUrl = await fileReaderPromise(formData.bukti_pembayaran);
        } catch (e) {}
      }

      const savedData = mockDb.addSiswa({
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_telp: formData.no_telp,
        jenjang: formData.jenjang,
        kelas: formData.kelas,
        asal_sekolah: formData.asal_sekolah,
        program: formData.program,
        kelas_tipe: formData.program === "reguler" ? formData.kelas_tipe : undefined,
        durasi_paket: formData.durasi_paket,
        jadwal_les: `${formData.hari_les}, ${formData.jam_les}`,
        harga: price,
        bukti_pembayaran_url: finalBuktiUrl
      });
      setSuccessData(savedData);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const getProgramLabel = () => {
    if (formData.program === "private") return "Private Class";
    if (formData.program === "online") return "Online Class";
    return `Reguler (${formData.kelas_tipe.toUpperCase()} Class)`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background glow effects inside card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-purple/10 blur-3xl rounded-full pointer-events-none" />

      {/* Steps Indicator */}
      {step <= 4 && (
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-slate-400">
            <span className={step === 1 ? "text-brand-cyan font-bold" : ""}>1. Data Diri</span>
            <span className={step === 2 ? "text-brand-cyan font-bold" : ""}>2. Program & Paket</span>
            <span className={step === 3 ? "text-brand-cyan font-bold" : ""}>3. Jadwal Les</span>
            <span className={step === 4 ? "text-brand-cyan font-bold" : ""}>4. Pembayaran</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-brand-cyan to-brand-blue h-full rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${step * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-200 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Data Diri */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Informasi Calon Siswa</h3>
                <p className="text-slate-400 text-sm">Lengkapi formulir di bawah ini dengan data pribadi calon siswa secara benar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Nama Lengkap Siswa</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      name="nama_lengkap"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      placeholder="Contoh: Muhammad Rian"
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Email Utama</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Contoh: rian@email.com"
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">No. Telepon / WhatsApp (Aktif)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="tel"
                      name="no_telp"
                      value={formData.no_telp}
                      onChange={handleInputChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Asal Sekolah</label>
                  <div className="relative">
                    <School className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      name="asal_sekolah"
                      value={formData.asal_sekolah}
                      onChange={handleInputChange}
                      placeholder="Contoh: SDN Ciledug 02"
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Jenjang Pendidikan</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <select
                      name="jenjang"
                      value={formData.jenjang}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-brand-cyan transition-colors appearance-none cursor-pointer"
                    >
                      <option value="TK">Taman Kanak-kanak (TK)</option>
                      <option value="SD">Sekolah Dasar (SD)</option>
                      <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                      <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Kelas / Tingkat Saat Ini</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      name="kelas"
                      value={formData.kelas}
                      onChange={handleInputChange}
                      placeholder="Contoh: Kelas 4, Kelas 10"
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Lanjutkan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Program & Paket */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pilihan Program & Durasi</h3>
                <p className="text-slate-400 text-sm">Sesuaikan pilihan kelas robotik dan masa aktif paket les Anda.</p>
              </div>

              <div className="space-y-4">
                {/* Program Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Jenis Program</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["reguler", "private", "online"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, program: p as any }))}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${
                          formData.program === p 
                            ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow-cyan" 
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suboptions for Reguler Class Type */}
                {formData.program === "reguler" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-slate-300">Tipe Kelas Reguler</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "gold", name: "Gold Class", desc: "1 Class 1 Student" },
                        { id: "silver", name: "Silver Class", desc: "1 Class 2 Student" },
                        { id: "bronze", name: "Bronze Class", desc: "1 Class 3 Student" }
                      ].map((tipe) => (
                        <button
                          key={tipe.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, kelas_tipe: tipe.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.kelas_tipe === tipe.id 
                              ? "bg-brand-cyan/10 border-brand-cyan shadow-glow-cyan" 
                              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className={`text-xs font-bold ${formData.kelas_tipe === tipe.id ? "text-brand-cyan" : "text-slate-300"}`}>{tipe.name}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{tipe.desc}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Duration / Package Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Durasi Paket</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "perbulan", name: "Bulanan (Perbulan)" },
                      { id: "persemester", name: "Semesteran (Persemester)" }
                    ].map((dur) => (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, durasi_paket: dur.id as any }))}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                          formData.durasi_paket === dur.id 
                            ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow-cyan" 
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {dur.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Cost Calculation Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-dark to-slate-900/90 border border-brand-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Biaya Pendaftaran</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-brand-cyan mt-1 neon-text-glow">{formatRupiah(price)}</div>
                  </div>
                  <div className="bg-slate-800/80 rounded-xl px-4 py-2 border border-slate-700 text-xs text-slate-300">
                    <div className="font-semibold text-slate-400">Detail Pilihan:</div>
                    <div className="mt-1 font-bold">{getProgramLabel()}</div>
                    <div className="capitalize">{formData.durasi_paket}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Lanjutkan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Jadwal Les */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Penjadwalan Kelas</h3>
                <p className="text-slate-400 text-sm">Pilih hari les (Senin-Sabtu) dan jam pertemuan les robotik berdurasi 1 jam.</p>
              </div>

              <div className="space-y-5">
                {/* Day Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Pilih Hari Les</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hari_les: day }))}
                        className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                          formData.hari_les === day 
                            ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow-cyan" 
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Pilih Jam Pertemuan (Durasi 1 Jam)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => {
                      const isLunch = slot.includes("12.00");
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isLunch}
                          onClick={() => setFormData(prev => ({ ...prev, jam_les: slot }))}
                          className={`py-3 px-4 rounded-xl border text-sm font-bold text-center transition-all ${
                            isLunch 
                              ? "bg-slate-900/10 border-slate-900 text-slate-600 cursor-not-allowed"
                              : formData.jam_les === slot 
                                ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-glow-cyan" 
                                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <Clock className="w-4 h-4 inline mr-2 text-slate-500" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">*Tersedia slot operasional pukul 09.00 s.d 16.00 WIB.</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-glow-cyan text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Lanjutkan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Pembayaran */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Instruksi Pembayaran & Bukti</h3>
                <p className="text-slate-400 text-sm">Lakukan pembayaran sesuai detail di bawah dan upload bukti transfer Anda.</p>
              </div>

              <div className="space-y-4">
                {/* Bank Details Card */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-brand-cyan opacity-20">
                    <CreditCard className="w-16 h-16" />
                  </div>
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Rekening Tujuan Transfer:</div>
                  <div className="text-white font-bold text-lg mt-2">Bank Muamalat Cabang Ciledug</div>
                  <div className="text-brand-cyan font-extrabold text-2xl mt-1 tracking-wider neon-text-glow">3280009201</div>
                  <div className="text-slate-300 text-sm mt-1">A.n : <span className="font-bold">PT Racer Robot Indonesia</span></div>
                  
                  <div className="border-t border-slate-800/80 mt-4 pt-3 flex justify-between text-xs text-slate-500 font-bold">
                    <span>*Syarat pendaftaran: No refund</span>
                    <span className="text-brand-cyan">{formatRupiah(price)}</span>
                  </div>
                </div>

                {/* Proof of payment drag-drop / file selector */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Upload Bukti Transfer Pembayaran (Foto)</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-6 bg-slate-900/30 hover:border-brand-cyan/50 hover:bg-slate-900/50 transition-colors relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    
                    {formData.bukti_pembayaran_preview ? (
                      <div className="space-y-3 w-full text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={formData.bukti_pembayaran_preview} 
                          alt="Bukti Transfer Preview" 
                          className="max-h-48 mx-auto rounded-xl border border-slate-800 shadow-md object-contain"
                        />
                        <div className="text-xs text-slate-400 font-medium">
                          {formData.bukti_pembayaran?.name} ({(formData.bukti_pembayaran!.size / 1024).toFixed(1)} KB)
                        </div>
                        <span className="inline-block text-xs font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-3 py-1 rounded-full group-hover:bg-brand-cyan/20">
                          Ganti File
                        </span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="p-3 bg-slate-800/50 rounded-full inline-block mb-1 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-brand-cyan" />
                        </div>
                        <div className="text-sm text-slate-300 font-bold">Klik untuk Pilih File Bukti Transfer</div>
                        <div className="text-xs text-slate-500">Mendukung format PNG, JPG, JPEG (Max 5MB)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-slate-950 font-extrabold px-8 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Sukses screen */}
          {step === 5 && successData && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="p-4 bg-brand-emerald/10 border border-brand-emerald/30 rounded-full text-brand-emerald shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="w-16 h-16" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white">Pendaftaran Berhasil Dikirim!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Terima kasih, data pendaftaran <span className="text-brand-cyan font-bold">{successData.nama_lengkap}</span> telah kami terima. Admin kami akan segera melakukan verifikasi pembayaran.
                </p>
              </div>

              {/* Registration Summary Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ID Pendaftaran</span>
                  <span className="font-bold text-brand-cyan">{formatRegistrationId(successData.id, successData.created_at)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Siswa</span>
                  <span className="text-white font-bold">{successData.nama_lengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Program & Paket</span>
                  <span className="text-white font-bold capitalize">{successData.program} ({successData.durasi_paket})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jadwal Terpilih</span>
                  <span className="text-white font-bold">{successData.jadwal_les}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="text-amber-500 uppercase tracking-wide">Menunggu Verifikasi</span>
                </div>
              </div>

              <div className="pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      nama_lengkap: "",
                      email: "",
                      no_telp: "",
                      jenjang: "TK",
                      kelas: "",
                      asal_sekolah: "",
                      program: "reguler",
                      kelas_tipe: "gold",
                      durasi_paket: "perbulan",
                      hari_les: "Senin",
                      jam_les: "09.00 - 10.00",
                      bukti_pembayaran: null,
                      bukti_pembayaran_preview: ""
                    });
                    setStep(1);
                    setSuccessData(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Daftar Siswa Lain
                </button>
                <a
                  href="/"
                  className="bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 font-bold px-6 py-2.5 rounded-xl inline-block hover:shadow-glow-cyan transition-all"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
