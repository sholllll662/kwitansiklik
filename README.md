# KwitansiKlik

> Pembuat kwitansi digital **gratis & open source** — bikin kwitansi profesional dalam hitungan detik, **tanpa perlu daftar akun**.

KwitansiKlik membantu UMKM, freelancer, dan siapa pun di Indonesia membuat kwitansi/bukti pembayaran yang rapi: masukkan item & harga → dapat PDF → selesai. Tanpa login, tanpa email, tanpa server — semua diproses **di browser kamu** (client-side), jadi datamu tidak ke mana-mana.

**Status:** 🚧 MVP dalam pengembangan — saat ini di **Fase 0 (setup & fondasi)**. Lihat [roadmap](#-roadmap).

## ✨ Kenapa KwitansiKlik

- **Tanpa daftar akun** — buka, bikin, unduh. Nol friksi.
- **Privasi maksimal** — arsitektur client-side; data kwitansi & profil disimpan lokal di perangkat (localStorage), tidak dikirim ke server.
- **PDF profesional** — di-generate di browser dengan [`@react-pdf/renderer`](https://react-pdf.org/) (PDF vektor, tajam).
- **Mobile-first & PWA** — installable dan bisa jalan offline.
- **Open source (AGPL-3.0)** — transparan dan gratis selamanya untuk fitur inti.

## 🧱 Tech Stack

| Layer             | Teknologi                                 |
| ----------------- | ----------------------------------------- |
| Framework         | Next.js (App Router) + React + TypeScript |
| Styling           | Tailwind CSS                              |
| PDF               | `@react-pdf/renderer` (client-side)       |
| Persistensi (MVP) | `localStorage` (tanpa backend/DB)         |
| Hosting           | Vercel                                    |

Arsitektur lengkap & alasan keputusan ada di [`docs/ADR-KwitansiKlik.md`](docs/ADR-KwitansiKlik.md).

## 🚀 Menjalankan Secara Lokal

Butuh **Node.js 18.18+** (disarankan Node 20/22+).

```bash
# 1. Install dependency
npm install

# 2. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Skrip yang tersedia

| Perintah               | Fungsi                               |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Dev server (hot reload)              |
| `npm run build`        | Build produksi                       |
| `npm run start`        | Jalankan hasil build produksi        |
| `npm run lint`         | Cek lint (ESLint)                    |
| `npm run typecheck`    | Cek tipe TypeScript (`tsc --noEmit`) |
| `npm run format`       | Format kode dengan Prettier          |
| `npm run format:check` | Cek format tanpa mengubah file       |
| `npm run test`         | Jalankan unit test (Vitest)          |
| `npm run test:watch`   | Unit test mode watch                 |

## 🗺️ Roadmap

MVP dibangun bertahap (detail di [`docs/MVP-Build-Plan-KwitansiKlik.md`](docs/MVP-Build-Plan-KwitansiKlik.md)):

- [x] **Fase 0** — Setup & fondasi
- [x] **Fase 1** — Data layer & logika inti (kalkulasi, nomor kwitansi, terbilang)
- [x] **Fase 2** — PDF spike (`@react-pdf/renderer`)
- [ ] **Fase 3** — Form input UI (mobile-first)
- [ ] **Fase 4** — Profil & riwayat (localStorage)
- [ ] **Fase 5** — Tiga template + selector
- [ ] **Fase 6** — PWA (installable + offline)
- [ ] **Fase 7** — Polish & launch

Konteks produk & strategi: [`docs/PRD-KwitansiKlik.md`](docs/PRD-KwitansiKlik.md).

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk sekarang: buka [issue](https://github.com/OWNER/kwitansiklik/issues) untuk bug/ide, atau ajukan pull request. Sebelum mengirim PR, pastikan `npm run lint`, `npm run typecheck`, dan `npm run build` lolos. (`CONTRIBUTING.md` lengkap menyusul di Fase 7.)

## 📄 Lisensi

Dilisensikan di bawah **GNU Affero General Public License v3.0 (AGPL-3.0)** — lihat [`LICENSE`](LICENSE). Singkatnya: bebas dipakai, dipelajari, dimodifikasi, dan didistribusikan, dengan syarat karya turunan (termasuk yang dijalankan sebagai layanan jaringan) tetap open source di bawah lisensi yang sama.

---

<sub>📸 Screenshot & demo live menyusul setelah MVP siap.</sub>
