"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { User, Siswa, Peralatan, PeralatanLog, News } from "@/lib/types";

// Import Modular Components
import LoginView from "@/components/admin/LoginView";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OverviewTab from "@/components/admin/OverviewTab";
import SiswaTab from "@/components/admin/SiswaTab";
import PeralatanTab from "@/components/admin/PeralatanTab";
import NewsTab from "@/components/admin/NewsTab";

// Force Dynamic Rendering for Server-Side Rendering (SSR)
export const dynamic = "force-dynamic";

export default function AdminPage() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<"overview" | "siswa" | "peralatan" | "news">("overview");

  // Database Data Lists
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [peralatanList, setPeralatanList] = useState<Peralatan[]>([]);
  const [logsList, setLogsList] = useState<PeralatanLog[]>([]);
  const [newsList, setNewsList] = useState<News[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedSession = sessionStorage.getItem("racer_admin_session");
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setAdminUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch data upon authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Students
      const resSiswa = await fetch("/api/register");
      const dataSiswa = await resSiswa.json();
      if (dataSiswa.success) setSiswaList(dataSiswa.data);

      // 2. Fetch Equipment
      const resEq = await fetch("/api/equipment");
      const dataEq = await resEq.json();
      if (dataEq.success) setPeralatanList(dataEq.data);

      // 3. Fetch Logs
      const resLogs = await fetch("/api/equipment-logs");
      const dataLogs = await resLogs.json();
      if (dataLogs.success) setLogsList(dataLogs.data);

      // 4. Fetch News
      const resNews = await fetch("/api/news");
      const dataNews = await resNews.json();
      if (dataNews.success) setNewsList(dataNews.data);
    } catch (e) {
      console.error("Error fetching admin dashboard data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const resJson = await res.json();
      if (resJson.success) {
        setAdminUser(resJson.user);
        setIsAuthenticated(true);
        sessionStorage.setItem("racer_admin_session", JSON.stringify(resJson.user));
      } else {
        setLoginError(resJson.message || "Email atau password salah.");
      }
    } catch (e) {
      setLoginError("Koneksi server terputus.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("racer_admin_session");
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  // Student verification status PUT handler
  const handleUpdateSiswaStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      const resJson = await res.json();
      if (resJson.success) {
        // Refresh locally immediately
        setSiswaList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        fetchAllData(); // refresh overview stats
      } else {
        alert(resJson.message || "Gagal memperbarui status pendaftaran.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  // Equipment CRUD Handlers
  const handleAddEquipment = async (eq: any) => {
    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eq)
      });
      const resJson = await res.json();
      if (resJson.success) {
        setPeralatanList(prev => [resJson.data, ...prev]);
        fetchAllData(); // refresh logs
      } else {
        alert(resJson.message || "Gagal menyimpan peralatan baru.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  const handleUpdateEquipment = async (id: string, updated: any) => {
    try {
      const res = await fetch("/api/equipment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setPeralatanList(prev => prev.map(item => item.id === id ? resJson.data : item));
        fetchAllData();
      } else {
        alert(resJson.message || "Gagal mengubah peralatan.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus alat ini dari inventaris?")) return;
    try {
      const res = await fetch(`/api/equipment?id=${id}`, {
        method: "DELETE"
      });
      const resJson = await res.json();
      if (resJson.success) {
        setPeralatanList(prev => prev.filter(item => item.id !== id));
        fetchAllData();
      } else {
        alert(resJson.message || "Gagal menghapus.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  const handleRecordLog = async (log: any) => {
    try {
      const res = await fetch("/api/equipment-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log)
      });
      const resJson = await res.json();
      if (resJson.success) {
        fetchAllData(); // refresh stocks and logs lists
      } else {
        alert(resJson.message || "Gagal mencatatkan log transaksi.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  // News CRUD Handlers (ADMIN EXCLUSIVE)
  const handleAddNews = async (news: any) => {
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(news)
      });
      const resJson = await res.json();
      if (resJson.success) {
        setNewsList(prev => [resJson.data, ...prev]);
      } else {
        alert(resJson.message || "Gagal menerbitkan berita.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  const handleUpdateNews = async (id: string, updated: any) => {
    try {
      const res = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setNewsList(prev => prev.map(item => item.id === id ? resJson.data : item));
      } else {
        alert(resJson.message || "Gagal menyimpan perubahan berita.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini dari mading?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, {
        method: "DELETE"
      });
      const resJson = await res.json();
      if (resJson.success) {
        setNewsList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(resJson.message || "Gagal menghapus.");
      }
    } catch (e) {
      alert("Koneksi gagal.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 antialiased font-sans selection:bg-brand-cyan/30 selection:text-white relative">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. LOGIN OVERLAY VIEW (if not authenticated) */}
      <AnimatePresence>
        {!isAuthenticated && (
          <LoginView 
            email={loginEmail}
            setEmail={setLoginEmail}
            password={loginPassword}
            setPassword={setLoginPassword}
            error={loginError}
            isLoggingIn={isLoggingIn}
            onLoginSubmit={handleLoginSubmit}
          />
        )}
      </AnimatePresence>

      {/* 2. ADMIN CONSOLE VIEW (when authenticated) */}
      {isAuthenticated && (
        <div className="min-h-screen flex flex-col">
          {/* Header Panel (Modular) */}
          <AdminHeader 
            adminUser={adminUser} 
            onRefresh={fetchAllData} 
            onLogout={handleLogout} 
          />

          {/* Main Content Workspace */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
            
            {/* Sidebar navigation tabs (Modular) */}
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* Content Tab Panel */}
            <main className="flex-1 min-w-0">
              {isLoading && (
                <div className="p-8 rounded-2xl glass-card text-center text-sm text-slate-500 flex items-center justify-center gap-2 border border-white/5 mb-6">
                  <div className="w-4 h-4 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
                  Mengsinkronkan database...
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* A. Overview Tab */}
                {activeTab === "overview" && (
                  <OverviewTab 
                    siswaList={siswaList} 
                    peralatanList={peralatanList} 
                    newsCount={newsList.length} 
                    setActiveTab={setActiveTab} 
                  />
                )}

                {/* B. Pendaftaran Siswa Tab */}
                {activeTab === "siswa" && (
                  <SiswaTab 
                    siswaList={siswaList} 
                    onUpdateStatus={handleUpdateSiswaStatus} 
                  />
                )}

                {/* C. Inventaris Alat Tab */}
                {activeTab === "peralatan" && (
                  <PeralatanTab 
                    peralatanList={peralatanList} 
                    logsList={logsList} 
                    onAddEquipment={handleAddEquipment} 
                    onUpdateEquipment={handleUpdateEquipment} 
                    onDeleteEquipment={handleDeleteEquipment} 
                    onRecordLog={handleRecordLog} 
                  />
                )}

                {/* D. Kelola Mading/Berita Tab (ADMIN ONLY ACCESS) */}
                {activeTab === "news" && (
                  <NewsTab 
                    newsList={newsList} 
                    onAddNews={handleAddNews} 
                    onUpdateNews={handleUpdateNews} 
                    onDeleteNews={handleDeleteNews} 
                  />
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
