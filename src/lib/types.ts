export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  created_at: string;
}

export interface Siswa {
  id: string;
  nama_lengkap: string;
  email: string;
  no_telp: string;
  jenjang: 'TK' | 'SD' | 'SMP' | 'SMA';
  kelas: string;
  asal_sekolah: string;
  program: 'reguler' | 'private' | 'online';
  kelas_tipe?: 'gold' | 'silver' | 'bronze'; // for reguler
  durasi_paket: 'perbulan' | 'persemester';
  jadwal_les: string; // e.g. "Senin, 09.00 - 10.00"
  harga: number;
  bukti_pembayaran_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by?: string;
  created_at: string;
}

export interface Peralatan {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  foto_url?: string;
  keterangan?: string;
  created_at: string;
}

export interface PeralatanLog {
  id: string;
  peralatan_id: string;
  peralatan_nama?: string; // hydrated
  peralatan_kode?: string; // hydrated
  jenis: 'masuk' | 'keluar' | 'rusak';
  jumlah: number;
  keterangan: string;
  tanggal: string;
  user_id: string;
  user_name?: string; // hydrated
}

export interface News {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  foto_url?: string;
  kategori: 'Kegiatan' | 'Prestasi' | 'Pengumuman';
  status: 'draft' | 'published';
  author_id: string;
  author_name?: string; // hydrated
  created_at: string;
}
