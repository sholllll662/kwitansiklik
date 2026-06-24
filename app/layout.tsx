import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppHeader } from "@/components/ui/AppHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "KwitansiKlik";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "KwitansiKlik — Buat kwitansi tanpa daftar akun",
    template: "%s — KwitansiKlik",
  },
  description:
    "Buat kwitansi profesional dalam hitungan detik, gratis & tanpa perlu daftar akun. Jalan di browser, data tersimpan lokal di perangkatmu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SerwistProvider swUrl="/serwist/sw.js">
          <AppHeader />
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}
