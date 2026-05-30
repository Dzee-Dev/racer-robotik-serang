import { Siswa, Peralatan, PeralatanLog, News, User } from "./types";

// Seed Data
const defaultNews: News[] = [
  {
    id: "news-1",
    judul: "Siswa raih juara 1 kompetisi robotik nasional 2026",
    slug: "siswa-raih-juara-1-kompetisi-robotik-nasional-2026",
    konten: "Tim robotik SD PT Racer Robotik berhasil meraih juara pertama dalam ajang National Robotics Competition 2026 untuk kategori Robot Penyelamat (Rescue Robot). Kemenangan luar biasa ini diraih berkat kerja keras para siswa dan bimbingan instruktur profesional kami yang berpengalaman.",
    kategori: "Prestasi",
    status: "published",
    author_id: "admin-1",
    author_name: "Admin Racer",
    created_at: "2026-05-15T10:00:00.000Z",
    foto_url: ""
  },
  {
    id: "news-2",
    judul: "Pendaftaran kelas baru periode Juli 2026 dibuka",
    slug: "pendaftaran-kelas-baru-periode-juli-2026-dibuka",
    konten: "PT Racer Robotik resmi membuka pendaftaran untuk kelas baru periode Juli 2026. Dapatkan diskon khusus 15% untuk pendaftaran program semesteran (semua jenjang TK-SMA) sebelum tanggal 15 Juni 2026. Kuota terbatas untuk memastikan efektivitas belajar kelompok kecil!",
    kategori: "Pengumuman",
    status: "published",
    author_id: "admin-1",
    author_name: "Admin Racer",
    created_at: "2026-05-10T09:30:00.000Z",
    foto_url: ""
  },
  {
    id: "news-3",
    judul: "Workshop AI dan machine learning untuk siswa SMA",
    slug: "workshop-ai-dan-machine-learning-untuk-siswa-sma",
    konten: "Sebagai bagian dari kurikulum lanjutan tingkat SMA, PT Racer Robotik mengadakan workshop intensif Artificial Intelligence dan Machine Learning menggunakan MicroPython dan modul ESP32. Siswa akan belajar mendeteksi objek dan mengendalikan robot menggunakan logika AI sederhana.",
    kategori: "Kegiatan",
    status: "published",
    author_id: "admin-1",
    author_name: "Admin Racer",
    created_at: "2026-05-05T14:15:00.000Z",
    foto_url: ""
  }
];

const defaultPeralatan: Peralatan[] = [
  {
    id: "eq-1",
    kode: "EQ-001",
    nama: "Arduino Uno R3 Starter Kit",
    kategori: "Mikrokontroler",
    jumlah: 25,
    kondisi: "Baik",
    keterangan: "Kit dasar untuk pembelajaran sirkuit, LED, resistor, dan pemrograman dasar.",
    created_at: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "eq-2",
    kode: "EQ-002",
    nama: "Raspberry Pi 4 Model B (4GB)",
    kategori: "Komputasi Mini",
    jumlah: 12,
    kondisi: "Baik",
    keterangan: "Modul komputer mini untuk pembelajaran AI, IoT, dan Machine Learning tingkat SMA.",
    created_at: "2026-01-15T08:00:00.000Z"
  },
  {
    id: "eq-3",
    kode: "EQ-003",
    nama: "Sensor Ultrasonic HC-SR04",
    kategori: "Sensor",
    jumlah: 45,
    kondisi: "Baik",
    keterangan: "Sensor pengukur jarak untuk proyek robot obstacle avoidance.",
    created_at: "2026-01-20T08:00:00.000Z"
  },
  {
    id: "eq-4",
    kode: "EQ-004",
    nama: "Lego Mindstorms EV3 Kit",
    kategori: "Kit Robotik",
    jumlah: 8,
    kondisi: "Baik",
    keterangan: "Kit robotik interaktif modular untuk pembelajaran siswa TK dan SD.",
    created_at: "2026-02-05T08:00:00.000Z"
  }
];

const defaultSiswa: Siswa[] = [
  {
    id: "siswa-1",
    nama_lengkap: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    no_telp: "081234567890",
    jenjang: "SD",
    kelas: "Kelas 4",
    asal_sekolah: "SDN Ciledug 01",
    program: "reguler",
    kelas_tipe: "silver",
    durasi_paket: "perbulan",
    jadwal_les: "Senin, 14.00 - 15.00",
    harga: 450000,
    status: "approved",
    created_at: "2026-05-20T07:30:00.000Z"
  },
  {
    id: "siswa-2",
    nama_lengkap: "Annisa Rahmawati",
    email: "annisa.rahma@yahoo.com",
    no_telp: "089876543210",
    jenjang: "SMP",
    kelas: "Kelas 8",
    asal_sekolah: "SMPN 3 Tangerang",
    program: "private",
    durasi_paket: "persemester",
    jadwal_les: "Rabu, 15.00 - 16.00",
    harga: 2400000,
    status: "pending",
    created_at: "2026-05-28T09:15:00.000Z"
  },
  {
    id: "siswa-3",
    nama_lengkap: "Rian Hidayat",
    email: "rian.h@gmail.com",
    no_telp: "085678901234",
    jenjang: "SMA",
    kelas: "Kelas 11",
    asal_sekolah: "SMAS Budi Mulia",
    program: "online",
    durasi_paket: "perbulan",
    jadwal_les: "Sabtu, 10.00 - 11.00",
    harga: 350000,
    status: "approved",
    created_at: "2026-05-25T11:45:00.000Z"
  }
];

const defaultLogs: PeralatanLog[] = [
  {
    id: "log-1",
    peralatan_id: "eq-1",
    peralatan_nama: "Arduino Uno R3 Starter Kit",
    peralatan_kode: "EQ-001",
    jenis: "masuk",
    jumlah: 25,
    keterangan: "Stok awal pembelian modul baru untuk laboratorium.",
    tanggal: "2026-01-10T08:30:00.000Z",
    user_id: "admin-1",
    user_name: "Admin Racer"
  },
  {
    id: "log-2",
    peralatan_id: "eq-3",
    peralatan_nama: "Sensor Ultrasonic HC-SR04",
    peralatan_kode: "EQ-003",
    jenis: "rusak",
    jumlah: 2,
    keterangan: "Sensor rusak saat praktikum kelas SD kelas robot beroda.",
    tanggal: "2026-03-12T14:30:00.000Z",
    user_id: "admin-1",
    user_name: "Admin Racer"
  }
];

// Browser storage helper
const isBrowser = typeof window !== "undefined";

function getStoredData<T>(key: string, defaultValue: T[]): T[] {
  if (!isBrowser) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage`, error);
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage`, error);
  }
}

export const mockDb = {
  getNews: (): News[] => getStoredData<News>("racer_news", defaultNews),
  saveNews: (newsList: News[]) => setStoredData<News>("racer_news", newsList),
  
  getPeralatan: (): Peralatan[] => getStoredData<Peralatan>("racer_peralatan", defaultPeralatan),
  savePeralatan: (peralatanList: Peralatan[]) => setStoredData<Peralatan>("racer_peralatan", peralatanList),

  getSiswa: (): Siswa[] => getStoredData<Siswa>("racer_siswa", defaultSiswa),
  saveSiswa: (siswaList: Siswa[]) => setStoredData<Siswa>("racer_siswa", siswaList),

  getLogs: (): PeralatanLog[] => getStoredData<PeralatanLog>("racer_logs", defaultLogs),
  saveLogs: (logsList: PeralatanLog[]) => setStoredData<PeralatanLog>("racer_logs", logsList),

  // Operations
  addSiswa: (siswa: Omit<Siswa, "id" | "created_at" | "status">): Siswa => {
    const siswaList = mockDb.getSiswa();
    const newSiswa: Siswa = {
      ...siswa,
      id: `siswa-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      created_at: new Date().toISOString()
    };
    siswaList.unshift(newSiswa);
    mockDb.saveSiswa(siswaList);
    return newSiswa;
  },

  updateSiswaStatus: (id: string, status: 'approved' | 'rejected'): boolean => {
    const siswaList = mockDb.getSiswa();
    const index = siswaList.findIndex(s => s.id === id);
    if (index === -1) return false;
    siswaList[index].status = status;
    mockDb.saveSiswa(siswaList);
    return true;
  },

  addPeralatan: (peralatan: Omit<Peralatan, "id" | "created_at">): Peralatan => {
    const peralatanList = mockDb.getPeralatan();
    const newPeralatan: Peralatan = {
      ...peralatan,
      id: `eq-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    peralatanList.unshift(newPeralatan);
    mockDb.savePeralatan(peralatanList);

    // Auto generate "masuk" log for new item
    mockDb.addLog({
      peralatan_id: newPeralatan.id,
      jenis: "masuk",
      jumlah: newPeralatan.jumlah,
      keterangan: `Stok awal input peralatan baru: ${newPeralatan.nama}`,
      user_id: "admin-1"
    });

    return newPeralatan;
  },

  updatePeralatan: (id: string, updated: Partial<Peralatan>): boolean => {
    const peralatanList = mockDb.getPeralatan();
    const index = peralatanList.findIndex(e => e.id === id);
    if (index === -1) return false;
    peralatanList[index] = { ...peralatanList[index], ...updated };
    mockDb.savePeralatan(peralatanList);
    return true;
  },

  deletePeralatan: (id: string): boolean => {
    const peralatanList = mockDb.getPeralatan();
    const filtered = peralatanList.filter(e => e.id !== id);
    if (filtered.length === peralatanList.length) return false;
    mockDb.savePeralatan(filtered);
    return true;
  },

  addLog: (log: Omit<PeralatanLog, "id" | "tanggal" | "peralatan_nama" | "peralatan_kode" | "user_name">): PeralatanLog | null => {
    const items = mockDb.getPeralatan();
    const itemIndex = items.findIndex(e => e.id === log.peralatan_id);
    if (itemIndex === -1) return null;

    const item = items[itemIndex];
    let newQty = item.jumlah;

    if (log.jenis === "masuk") {
      newQty += log.jumlah;
    } else if (log.jenis === "keluar") {
      newQty = Math.max(0, newQty - log.jumlah);
    } else if (log.jenis === "rusak") {
      // In a real inventory, damaged items are marked, let's keep count or subtract from good items depending on logic.
      // Let's just subtract from overall quantity or record it
      newQty = Math.max(0, newQty - log.jumlah);
      // Let's update the condition if large amount are damaged
      if (log.jumlah >= item.jumlah && item.jumlah > 0) {
        item.kondisi = "Rusak Berat";
      } else if (log.jumlah > 0 && item.kondisi === "Baik") {
        item.kondisi = "Rusak Ringan";
      }
    }

    // Update equipment quantity
    item.jumlah = newQty;
    mockDb.savePeralatan(items);

    // Save Log
    const logsList = mockDb.getLogs();
    const newLog: PeralatanLog = {
      ...log,
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      tanggal: new Date().toISOString(),
      peralatan_nama: item.nama,
      peralatan_kode: item.kode,
      user_name: "Admin Racer"
    };
    logsList.unshift(newLog);
    mockDb.saveLogs(logsList);
    return newLog;
  },

  addNews: (news: Omit<News, "id" | "created_at" | "slug" | "author_name" | "author_id">): News => {
    const newsList = mockDb.getNews();
    const slug = news.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newNews: News = {
      ...news,
      id: `news-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      author_id: "admin-1",
      author_name: "Admin Racer",
      created_at: new Date().toISOString()
    };
    newsList.unshift(newNews);
    mockDb.saveNews(newsList);
    return newNews;
  },

  updateNews: (id: string, updated: Partial<News>): boolean => {
    const newsList = mockDb.getNews();
    const index = newsList.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    let newSlug = newsList[index].slug;
    if (updated.judul) {
      newSlug = updated.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    newsList[index] = { ...newsList[index], ...updated, slug: newSlug };
    mockDb.saveNews(newsList);
    return true;
  },

  deleteNews: (id: string): boolean => {
    const newsList = mockDb.getNews();
    const filtered = newsList.filter(n => n.id !== id);
    if (filtered.length === newsList.length) return false;
    mockDb.saveNews(filtered);
    return true;
  }
};
