import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/ui/Analytics";
import { AppHeader } from "@/components/ui/AppHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Analytics />
        <VercelAnalytics />
        <SerwistProvider swUrl="/serwist/sw.js">
          <AppHeader />
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}
