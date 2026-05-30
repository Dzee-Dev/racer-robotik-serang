import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT Racer Robotik | Pusat Edukasi Robotika TK - SMA",
  description: "Belajar Robotik dari Usia Dini Bersama PT Racer Robotik Indonesia. Program kelas robotik terstruktur, interaktif, dan modern untuk siswa TK, SD, SMP, dan SMA.",
  keywords: "racer robotik, les robotik, belajar robotik, kursus robotik anak, robotik jakarta, robotik ciledug",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen selection:bg-brand-cyan/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

