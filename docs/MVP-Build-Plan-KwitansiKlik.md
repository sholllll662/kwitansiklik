# MVP Build Plan: KwitansiKlik

**Versi**: 1.0 | **Tanggal**: 23 Juni 2026

Urutan kerja eksekusi untuk MVP — client-side, gratis, open source (AGPL), mobile-first.
Disusun untuk solo developer. Centang `[ ]` saat selesai.

> **Prinsip sequencing**: de-risk dulu. Bagian paling tidak pasti (rendering PDF di react-pdf)
> dikerjakan di awal (Fase 2), bukan di akhir. Tiap fase berakhir di sesuatu yang **bisa dites/didemo**.

> `[ASUMSI: estimasi hari mengacu pada solo dev, ritme paruh-penuh. Total ~16 hari kerja ≈ 3 minggu full-time atau 5–7 minggu sambilan. Sesuaikan dengan ritme lo.]`

---

## Ringkasan Fase

| Fase | Fokus                           | Output testable                            | Estimasi |
| ---- | ------------------------------- | ------------------------------------------ | -------- |
| 0    | Setup & fondasi                 | App kosong live di Vercel                  | 1–2 hari |
| 1    | Data layer & logika inti        | Logika hitung + nomor + terbilang (teruji) | 2–3 hari |
| 2    | **PDF spike (de-risk)**         | 1 PDF asli bisa diunduh                    | 2 hari   |
| 3    | Form input UI                   | Form fungsional, total live                | 3 hari   |
| 4    | Profil & riwayat (localStorage) | Pengalaman pengguna berulang (1 perangkat) | 2 hari   |
| 5    | 3 template + selector           | Ketiga template bisa diunduh               | 2 hari   |
| 6    | PWA (installable + offline)     | Bisa di-install & jalan offline            | 1–2 hari |
| 7    | Polish & launch prep            | Siap rilis publik                          | 2 hari   |

---

## Fase 0 — Setup & Fondasi

_Tujuan: kerangka proyek berdiri + pipeline deploy terbukti jalan sejak hari pertama._

- [ ] Init proyek: `Next.js (App Router) + TypeScript + Tailwind CSS`
- [ ] Tetapkan struktur folder (lihat lampiran di bawah)
- [ ] Setup ESLint + Prettier + Git, commit awal
- [ ] Tambah `LICENSE` (AGPL-3.0) + `README.md` skeleton sejak awal — higiene open source
- [ ] Deploy "hello world" ke Vercel → **buktikan deploy bekerja sebelum nulis fitur**

**Milestone**: URL live di Vercel menampilkan app kosong.

---

## Fase 1 — Data Layer & Logika Inti

_Tujuan: semua logika bisnis jadi fungsi murni yang bisa diuji, terpisah dari UI._

- [ ] Definisikan tipe TypeScript: `SellerProfile`, `Receipt`, `ReceiptItem` (ambil dari ADR)
- [ ] Util localStorage: get/set/remove untuk kunci `kwitansiklik:*` + parse/stringify + error handling (try/catch, fallback saat storage penuh/diblokir)
- [ ] Fungsi kalkulasi (pure): `subtotal`, `discountAmount` (amount/percent), `taxAmount` (PPN), `total` — **uang sebagai integer rupiah**
- [ ] Generator nomor kwitansi dengan **format custom**: template string (mis. `INV/{YYYY}/{NNN}`) + counter di localStorage + padding nol
- [ ] Fungsi `terbilang(angka)` → kata Bahasa Indonesia (dibutuhkan template Klasik). Isolasi & uji — ini non-trivial (satuan, belasan, ribuan, jutaan, miliar)
- [ ] Unit test ringan untuk kalkulasi, generator nomor, dan terbilang

**Milestone**: logika inti jalan & lulus beberapa test. Belum ada UI berarti.

> **Kenapa terbilang dipisah & diuji**: gampang salah di kasus tepi (mis. 11–19 "belas", "seribu" vs "satu ribu", angka 0). Bug di sini bikin kwitansi formal terlihat tidak kredibel.

---

## Fase 2 — PDF Spike (DE-RISK paling penting)

_Tujuan: buktikan react-pdf bisa menghasilkan PDF berkualitas SEBELUM membangun app di atasnya._

- [ ] Integrasi `@react-pdf/renderer`
- [ ] Bangun SATU template (Modern) sebagai komponen dokumen react-pdf, diisi data contoh hardcoded
- [ ] Implementasi unduh: render → blob → trigger download
- [ ] Validasi kualitas output:
  - [ ] Font terbaca tajam (daftarkan font kustom jika perlu; default Helvetica terbatas untuk karakter Indonesia)
  - [ ] Format Rupiah benar (`Rp 3.330.000`)
  - [ ] Embed logo (base64) tampil proporsional
  - [ ] Layout rapi di ukuran A4 / struk

**Milestone**: bisa generate & unduh satu PDF asli yang terlihat profesional. **Unknown terbesar teratasi.**

> **Kalau di sini react-pdf ternyata terlalu kaku** untuk desain yang diinginkan → ini saat termurah untuk pivot (mis. evaluasi pendekatan lain), bukan setelah 2 minggu coding.

---

## Fase 3 — Form Input UI

_Tujuan: form mobile-first fungsional sesuai mockup, dengan total yang hidup._

- [ ] Layout form mobile-first (rujuk mockup): chip profil, detail kwitansi, item, diskon, PPN, ringkasan
- [ ] Field nomor kwitansi editable + entry point pengaturan format
- [ ] Manajemen item: tambah/hapus baris, input qty & harga, **line total live**
- [ ] Toggle PPN (default 11%, bisa dimatikan) + input diskon (amount/percent)
- [ ] Hubungkan state form → fungsi kalkulasi (Fase 1) → ringkasan total live
- [ ] Validasi: tolak item harga/qty 0, batasi input non-numerik di field uang
- [ ] Hubungkan tombol "Unduh PDF" → generator PDF (Fase 2, template Modern dulu)

**Milestone**: form jalan penuh, total live, PDF Modern terunduh dari data form nyata.

---

## Fase 4 — Profil & Riwayat (localStorage)

_Tujuan: pengalaman pengguna berulang di satu perangkat — tanpa akun._

- [ ] Layar profil penjual: buat/edit (nama bisnis, pemilik, alamat, telp/WA)
- [ ] Upload logo → **kompres & resize** (mis. maks 200×200, ~50KB) → simpan base64 di localStorage
- [ ] Autofill profil ke form otomatis
- [ ] Riwayat lokal: simpan tiap kwitansi → daftar (nomor, tanggal, pembeli, total) → buka & unduh ulang
- [ ] Pencarian riwayat (nama pembeli / nomor)
- [ ] Layar settings: default PPN, format nomor default, mata uang
- [ ] Beri tahu user bahwa data tersimpan lokal di perangkat (bukan cloud)

**Milestone**: buka app lagi → profil terisi otomatis, riwayat kwitansi tersimpan & bisa diunduh ulang.

> **Catatan**: riwayat lokal ini sengaja masuk MVP (bukan v1.1). Mekanismenya sama dengan profil (localStorage), murah, tapi menaikkan retensi. Sync antar-perangkat-lah yang butuh akun (v1.1).

---

## Fase 5 — Tiga Template + Selector

_Tujuan: lengkapi 3 template & biarkan user memilih + pratinjau._

- [ ] Bangun template **Klasik** sebagai komponen react-pdf (judul tengah, terbilang, kolom jumlah berbingkai, ruang tanda tangan + kota/tanggal)
- [ ] Bangun template **Minimalis** sebagai komponen react-pdf (bersih, garis tipis, angka monospace)
- [ ] Selector template di form + simpan pilihan (localStorage)
- [ ] Layar/komponen pratinjau: render template terpilih sebelum unduh
- [ ] Pastikan ketiga template menarik data dari struktur `Receipt` yang sama

**Milestone**: ketiga template bisa dipilih, dipratinjau, dan diunduh dengan data sama.

---

## Fase 6 — PWA (Installable + Offline)

_Tujuan: bisa di-install ke home screen & berfungsi penuh tanpa internet._

- [ ] Web app manifest: nama, ikon (beberapa ukuran), theme color, `display: standalone`
- [ ] Service worker: cache app shell + assets (pakai `next-pwa`/`@serwist/next` atau manual)
- [ ] Tangani prompt install (`beforeinstallprompt`) + tombol "Install" di header
- [ ] **Uji offline**: matikan jaringan → buka app → buat & unduh PDF harus tetap jalan

**Milestone**: app bisa di-install dan menghasilkan kwitansi sepenuhnya offline.

> **Kenapa PWA cocok di sini**: arsitektur lo sudah client-side, jadi offline nyaris "gratis" secara teknis — sekaligus jadi diferensiasi nyata (kompetitor berbasis akun tidak bisa offline) dan nilai showcase portofolio.

---

## Fase 7 — Polish & Launch Prep

_Tujuan: layak rilis publik & layak jadi portofolio._

- [ ] QA responsif di beberapa ukuran layar (HP kecil → tablet → desktop)
- [ ] Pass aksesibilitas: label form, urutan fokus, kontras, target sentuh ≥44px
- [ ] Empty states, loading states, pesan error yang ramah
- [ ] README lengkap: apa & kenapa, cara run lokal, cara kontribusi, screenshot, catatan AGPL + `CONTRIBUTING.md`
- [ ] Analytics privat (mis. Plausible/Umami) untuk lacak activation rate — hindari yang invasif demi konsistensi nilai privasi
- [ ] Deploy final + domain kustom

**Milestone**: rilis publik. Repo rapi & demo live berfungsi.

---

## Definition of Done (MVP)

- [ ] Bisa buat & unduh kwitansi PDF **tanpa akun**, di 3 template
- [ ] Nomor kwitansi custom; diskon & PPN berfungsi; total akurat
- [ ] Profil & riwayat tersimpan lokal; autofill jalan
- [ ] Installable (PWA) & berfungsi offline
- [ ] Mobile-first, responsif, aksesibel
- [ ] Live di domain; repo open source rapi dengan README

---

## Eksplisit DI LUAR MVP (jangan dikerjakan dulu)

Tahan diri dari scope creep — ini semua v1.1+:

- Autentikasi & akun (Supabase Auth)
- Sinkronisasi cloud / riwayat antar-perangkat
- Share via WhatsApp
- Multi-mata uang
- Mini accounting (laporan, manajemen klien, export Excel)
- Open-core / pembayaran
- Native app

---

## Lampiran — Struktur Folder Usulan

```
kwitansiklik/
├─ app/                    # Next.js App Router
│  ├─ page.tsx             # halaman utama (form)
│  ├─ riwayat/page.tsx     # daftar riwayat
│  ├─ profil/page.tsx      # edit profil
│  └─ pengaturan/page.tsx  # settings
├─ components/
│  ├─ form/                # komponen form (ItemRow, Summary, dll)
│  ├─ pdf/                 # komponen react-pdf per template
│  │  ├─ ModernTemplate.tsx
│  │  ├─ KlasikTemplate.tsx
│  │  └─ MinimalisTemplate.tsx
│  └─ ui/                  # komponen UI generik
├─ lib/
│  ├─ types.ts             # SellerProfile, Receipt, ReceiptItem
│  ├─ calc.ts              # fungsi kalkulasi (pure)
│  ├─ terbilang.ts         # angka → kata
│  ├─ receipt-number.ts    # generator nomor custom
│  └─ storage.ts           # util localStorage
├─ public/                 # ikon PWA, manifest
├─ LICENSE                 # AGPL-3.0
└─ README.md
```

---

## Open Questions (teknis, tidak memblokir mulai)

- [ ] Ukuran kertas default PDF: A4, atau format struk (kecil)? Pengaruhi layout template
- [ ] Library PWA: `next-pwa` (matang) vs `@serwist/next` (lebih baru) — putuskan di Fase 6
- [ ] Apakah perlu mode "generate-and-go" (tanpa simpan ke riwayat) sebagai opsi, atau semua otomatis tersimpan lokal?
