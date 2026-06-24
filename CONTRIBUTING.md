# Kontribusi untuk KwitansiKlik

Terima kasih sudah tertarik berkontribusi! Proyek ini open source (AGPL-3.0) dan kontribusi dalam bentuk apa pun — kode, laporan bug, ide fitur, perbaikan dokumentasi — diterima dengan senang hati.

## Cara Mulai

```bash
git clone https://github.com/sholllll662/kwitansiklik.git
cd kwitansiklik
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Sebelum Mengirim Pull Request

Pastikan semua perintah ini lolos tanpa error:

```bash
npm run format:check   # format kode (Prettier)
npm run lint           # lint (ESLint)
npm run typecheck      # cek tipe TypeScript
npm run test           # unit test (Vitest)
npm run build          # build produksi
```

Kalau `format:check` gagal, jalankan `npm run format` untuk memperbaiki otomatis.

## Konvensi Kode

- **TypeScript ketat** — hindari `any`; gunakan tipe dari `lib/types.ts` untuk struktur data inti (`Receipt`, `SellerProfile`, dll).
- **Fungsi murni di `lib/`** — logika bisnis (kalkulasi, format, terbilang) dipisah dari komponen UI, dan diuji unit test. Kalau menambah fungsi baru di `lib/`, sertakan test-nya.
- **Komponen client vs server** — `lib/` dan komponen presentasional boleh server-side; apa pun yang pakai `useState`/`useEffect`/browser API butuh `"use client"`.
- **Tidak ada backend** — MVP ini sengaja 100% client-side (localStorage, PDF di-generate di browser). Jangan menambah panggilan API/server tanpa diskusi dulu — itu mengubah arsitektur inti proyek.
- **Bahasa Indonesia di UI** — semua teks yang dilihat pengguna pakai Bahasa Indonesia. Komentar kode & commit message boleh Indonesia atau Inggris, konsisten dengan gaya sekitar.

## Struktur Proyek

Lihat [`docs/ADR-KwitansiKlik.md`](docs/ADR-KwitansiKlik.md) untuk keputusan arsitektur dan model data, serta [`docs/MVP-Build-Plan-KwitansiKlik.md`](docs/MVP-Build-Plan-KwitansiKlik.md) untuk roadmap fase.

Ringkas:

- `app/` — route Next.js App Router (satu folder per halaman)
- `components/form/` — komponen form input kwitansi
- `components/pdf/` — template react-pdf (Modern/Klasik/Minimalis) + util render/unduh
- `components/ui/` — komponen UI generik (header, install button, dll)
- `lib/` — fungsi murni & wrapper localStorage, semua diuji

## Melaporkan Bug

Buka [issue baru](https://github.com/sholllll662/kwitansiklik/issues) dengan:

- Langkah reproduksi
- Yang diharapkan vs yang terjadi
- Browser/perangkat (terutama kalau soal PDF atau offline/PWA)

## Mengajukan Fitur

Proyek ini sengaja membatasi scope MVP (lihat bagian "Won't Have" di [`docs/PRD-KwitansiKlik.md`](docs/PRD-KwitansiKlik.md)) — terutama untuk menjaga wedge utama: **tanpa wajib akun**. Fitur yang mensyaratkan akun/server sebaiknya didiskusikan dulu di issue sebelum dikerjakan.

## Lisensi

Dengan berkontribusi, kamu setuju kontribusimu dilisensikan di bawah AGPL-3.0, sama seperti proyek ini.
