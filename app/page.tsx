import Link from "next/link";
import type { Metadata } from "next";
import { InstallToast } from "@/components/ui/InstallToast";
import { LandingInstallCta } from "@/components/ui/LandingInstallCta";

export const metadata: Metadata = {
  title: "KwitansiKlik — Kwitansi Profesional Sekali Klik",
  description:
    "Buat dan unduh kwitansi PDF profesional dalam hitungan detik. Gratis, tanpa daftar akun — data tersimpan aman di perangkatmu.",
};

const FEATURES = [
  {
    emoji: "⚡",
    title: "Langsung jadi",
    desc: "Isi form, pilih template, klik unduh. Tidak perlu install — jalan langsung di browser.",
  },
  {
    emoji: "🔒",
    title: "Data tetap di kamu",
    desc: "Tidak ada akun, tidak ada server. Semua tersimpan aman di perangkatmu sendiri.",
  },
  {
    emoji: "🎨",
    title: "Tiga template keren",
    desc: "Modern, Klasik, atau Minimalis — pilih gaya yang paling cocok dengan bisnismu.",
  },
] as const;

const STEPS = [
  {
    n: "1",
    title: "Lengkapi profil",
    desc: "Masukkan nama bisnis, nomor telepon, dan alamat — cukup sekali.",
  },
  {
    n: "2",
    title: "Tambah item & harga",
    desc: "Tulis barang atau jasa yang dijual, harga satuan, dan jumlahnya.",
  },
  {
    n: "3",
    title: "Unduh PDF",
    desc: "Klik tombol Unduh PDF — kwitansi langsung tersimpan ke perangkatmu.",
  },
] as const;

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-12 text-center lg:pb-28 lg:pt-16">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 right-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span aria-hidden="true">✨</span>
            <span>Gratis &amp; open source untuk semua</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-secondary sm:text-5xl lg:text-6xl">
            Kwitansi profesional,{" "}
            <span className="text-primary">sekali klik.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Buat dan unduh kwitansi PDF dalam hitungan detik. Cocok untuk UMKM
            dan freelancer Indonesia — tanpa daftar, tanpa bayar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/buat"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
            >
              Buat Kwitansi Sekarang
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <p className="text-sm text-muted-foreground">
              <span aria-hidden="true">🎉</span> Tidak perlu kartu kredit. Tidak
              perlu daftar.
            </p>
          </div>

          {/* Mock receipt preview */}
          <div className="mx-auto mt-14 max-w-xs">
            <div className="rounded-2xl border-2 border-secondary/15 bg-card p-6 text-left shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Toko Sholah
                  </p>
                  <p className="text-xs text-muted-foreground">
                    INV/2026/001
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">30 Jun 2026</p>
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Jasa desain logo</span>
                  <span>Rp 500.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Revisi tambahan</span>
                  <span>Rp 150.000</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-bold text-primary">
                  Rp 650.000
                </span>
              </div>
            </div>
            {/* Floating badge */}
            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                PDF siap diunduh!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {f.emoji}
              </span>
              <h3 className="text-base font-bold text-secondary">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-secondary/5 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-secondary lg:text-4xl">
              Cuma 3 langkah,{" "}
              <span className="text-primary">gampang banget!</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Dari buka browser sampai kwitansi jadi, tidak perlu waktu lama.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
            {/* Connecting line (desktop only) */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-primary/30 sm:block"
            />

            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground shadow-md ring-4 ring-background">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-base font-bold text-secondary">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingInstallCta />

      <InstallToast />

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>
            <span className="font-semibold text-secondary">KwitansiKlik</span>
            {" "}· © 2026 · Lisensi{" "}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              AGPL-3.0
            </a>
          </p>
          <p>Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
        </div>
      </footer>
    </main>
  );
}
