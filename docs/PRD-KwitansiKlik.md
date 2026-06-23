# PRD: KwitansiKlik

**Versi**: 2.0 | **Tanggal**: 23 Juni 2026 | **Status**: Draft

> **Catatan versi**: v2.0 adalah pivot strategis dari v1.0 (sebelumnya "KwitansiPro").
> Perubahan inti: dari model freemium berlangganan → **gratis & open source**, dengan
> wedge utama **pembuatan kwitansi tanpa perlu daftar akun**. Monetisasi (open-core)
> diparkir untuk fase lanjutan. Prioritas proyek: (1) portofolio, (2) akuisisi user,
> (3) income — dalam urutan itu.

---

## 0. Strategi & Prioritas Proyek

Tiga niat proyek ini menarik ke arah berbeda, jadi diurutkan secara eksplisit:

| Prioritas         | Tujuan                                      | Konsekuensi untuk produk                                                                              |
| ----------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **#1 Portofolio** | Showcase skill bikin produk SaaS end-to-end | Kualitas kode, desain, dan deployment > pangsa pasar. Repo open source **adalah** portofolionya       |
| **#2 User**       | Dapat pengguna nyata yang memakai produk    | Menang lewat **friksi rendah** (tanpa signup), bukan lewat "gratis" (semua kompetitor juga gratis)    |
| **#3 Income**     | Potensi pendapatan jika produk tumbuh       | Lewat **open-core** (versi/fitur premium), **bukan iklan** — iklan tidak cocok untuk tool sesi-pendek |

**Prinsip strategis**: "Gratis" bukan keunggulan — itu harga tiket masuk pasar ini. Diferensiasi nyata = **menghilangkan friksi** yang kompetitor pertahankan (kewajiban daftar akun).

---

## 1. Problem Statement

UMKM, pedagang, dan freelancer Indonesia membutuhkan kwitansi/bukti pembayaran yang rapi, namun solusi yang ada memaksa trade-off yang menyebalkan: tool sederhana (template Word, tulis tangan) tidak profesional dan tidak terarsip, sedangkan aplikasi yang lebih lengkap **mewajibkan registrasi akun** sebelum bisa menghasilkan satu kwitansi pun.

Untuk kebutuhan **sekali-pakai** atau **sesekali** — yang merupakan mayoritas kasus di segmen ini — friksi pendaftaran itu berlebihan. User hanya ingin: masukkan barang, masukkan harga, dapat PDF, selesai.

**Pain point utama:**

- Mayoritas tool kwitansi mewajibkan daftar akun dulu — friksi tinggi untuk kebutuhan cepat
- Membuat kwitansi manual (Word/tulis tangan) lambat dan hasilnya tidak konsisten
- Tidak ada opsi yang benar-benar instan, gratis, dan menghasilkan PDF profesional tanpa hambatan
- User yang ingin menyimpan riwayat terpaksa menyerahkan data/email meski hanya butuh sekali

---

## 2. Target User

**Segmen primer**: UMKM, freelancer, dan individu yang butuh membuat kwitansi cepat — terutama untuk kebutuhan sekali-pakai atau frekuensi rendah, di mana mendaftar akun terasa tidak sepadan.

### Persona A — Pengguna Sekali-Pakai (Wedge Utama)

- **Role**: Penjual online, freelancer, individu yang sesekali butuh kwitansi
- **Konteks**: Butuh 1 kwitansi sekarang, tidak mau ribet daftar
- **Masalah**: Tool lain maksa registrasi; template manual ribet
- **Workaround saat ini**: Edit template Word/Canva tiap kali, atau tulis tangan
- **Kenapa pilih KwitansiKlik**: Buka situs → langsung bikin → download. Tanpa akun, tanpa email

### Persona B — Pengguna Berulang (Akuisisi Lanjutan)

- **Role**: Pedagang/UMKM dengan transaksi rutin
- **Konteks**: Membuat kwitansi beberapa kali per minggu, ingin riwayat tersimpan
- **Masalah**: Mengulang input data penjual & item setiap transaksi
- **Path**: Mulai sebagai pengguna sekali-pakai, lalu terkonversi membuat akun untuk menyimpan riwayat & autofill

---

## 3. Solusi & Value Proposition

**Satu kalimat**: KwitansiKlik membantu siapa pun membuat kwitansi profesional dalam hitungan detik — tanpa perlu mendaftar akun — dan gratis selamanya untuk fitur intinya.

**Wedge utama (tidak bisa ditiru tanpa mengubah model bisnis mereka)**: **Nol friksi.** Kompetitor berfunding mempertahankan kewajiban signup karena mereka butuh menangkap user untuk funnel monetisasi. Sebagai produk gratis/open source, KwitansiKlik bisa membuang friksi itu sepenuhnya — itu justru keunggulan yang lahir dari keterbatasan.

**Kenapa open source**:

- Repo terbuka **adalah** portofolio (prioritas #1) — bukti nyata kemampuan teknis
- Membangun kepercayaan: user tahu data mereka tidak disalahgunakan (apalagi karena MVP berjalan client-side)
- Membuka jalur kontribusi komunitas dan distribusi organik

**Trade-off yang diterima secara sadar**:

- `[TRADE-OFF]` Wedge tanpa-signup bertabrakan dengan fitur riwayat/accounting (yang butuh akun). Solusinya: **dua jalur** — sekali-pakai (tanpa akun, client-side) sebagai pintu masuk, dan akun opsional untuk yang butuh persistensi. MVP fokus pada jalur tanpa-akun dulu.

---

## 4. Competitive Landscape

| Kompetitor                   | Kelebihan                                        | Kelemahan                                         | Wajib daftar? |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------- | ------------- |
| Paper.id                     | Platform invoicing + payment lengkap, berfunding | Berat, generic, overkill untuk kwitansi cepat     | Ya            |
| Materai.id (e-kwitansi)      | Angle keabsahan hukum via e-meterai              | Niche meterai, bukan tool kwitansi cepat          | Ya            |
| Notakilat.com / Paperless.id | Fokus kwitansi/nota                              | Tetap mewajibkan registrasi, tier gratis terbatas | Ya            |
| BukuKas / BukuWarung         | Gratis, familiar di UMKM                         | Output PDF kurang fleksibel, harus daftar         | Ya            |
| Template Word / Canva        | Gratis, fleksibel                                | Manual, tanpa otomatisasi & arsip                 | Tidak         |

**Diferensiasi KwitansiKlik**:

- **Satu-satunya** yang menghasilkan kwitansi PDF profesional **tanpa wajib daftar**
- **Open source** — transparan, gratis selamanya untuk fitur inti, kode jadi portofolio
- **Client-side by default** — data tidak meninggalkan browser user (privasi + biaya infrastruktur mendekati nol)

> **Catatan jujur**: KwitansiKlik tidak akan menang adu fitur melawan Paper.id, dan itu memang bukan tujuannya. Tujuannya: jadi pilihan tercepat & ter-tidak-ribet untuk kebutuhan kwitansi sederhana, sambil berfungsi sebagai portofolio kelas atas.

---

## 5. Feature List & Prioritasi (MoSCoW)

### Must Have (MVP) — Jalur Tanpa-Signup, Client-Side

- [ ] **Form input transaksi** — nama pembeli (opsional), item/jasa, qty, harga satuan, total otomatis
- [ ] **Generate kwitansi PDF di sisi browser** — nomor, tanggal, tanda terima; **tanpa perlu akun**
- [ ] **Download PDF** — langsung, instan, tanpa login/email
- [ ] **Profil penjual via localStorage** — isi sekali di perangkat yang sama, autofill otomatis di kunjungan berikutnya **tanpa akun**
- [ ] **Template kwitansi profesional** — minimal 1 template default yang rapi dan siap kirim
- [ ] **Diskon & PPN** — baris opsional untuk diskon dan pajak

### Should Have (v1.1) — Akun Opsional Membuka Persistensi

- [ ] **Autentikasi opsional** — register/login (email/Google) **hanya jika user mau menyimpan riwayat**
- [ ] **Riwayat tersinkron cloud** — akses kwitansi dari perangkat mana pun (untuk user berakun)
- [ ] **Manajemen item/produk** — simpan item yang sering dijual
- [ ] **Share via WhatsApp** — kirim PDF/link langsung ke WA klien
- [ ] **Multi-mata uang** — IDR & USD untuk freelancer berklien asing
- [ ] **Pilihan template tambahan**

### Could Have (v2.0 — Mini Accounting, untuk user berakun)

- [ ] **Rekap pendapatan bulanan** — total & grafik sederhana
- [ ] **Laporan laba rugi sederhana** — pendapatan vs pengeluaran
- [ ] **Manajemen klien/kontak** — histori transaksi per klien
- [ ] **Export ke Excel/CSV**
- [ ] **Kategori transaksi**

### Won't Have (out of scope 12 bulan pertama)

- Wajib signup untuk fitur inti — **bertentangan langsung dengan wedge utama**
- Iklan sebagai model income — tidak cocok untuk tool sesi-pendek (lihat §8)
- Integrasi payment gateway — kompleks, beda regulasi
- Mobile app native — mulai dari web responsive
- Fitur pajak/SPT lengkap & e-meterai — bukan ranah MVP

---

## 6. User Stories & Acceptance Criteria

### [MVP-1] Generate Kwitansi Tanpa Daftar (Wedge Utama)

**User story**: Sebagai pengguna sekali-pakai, saya ingin langsung membuat kwitansi dan mengunduhnya tanpa harus mendaftar akun, sehingga saya bisa menyelesaikan kebutuhan saya dalam hitungan detik.

**Acceptance criteria**:

- [ ] User dapat membuat & mengunduh kwitansi PDF **tanpa registrasi/login apa pun**
- [ ] User dapat menambah ≥1 item dengan field: nama item, qty, harga satuan
- [ ] Total dihitung otomatis (qty × harga, diakumulasi); diskon & PPN opsional ikut terhitung
- [ ] PDF di-generate di sisi browser dalam <3 detik
- [ ] PDF berisi: nomor kwitansi, tanggal, data penjual, pembeli (opsional), daftar item, total, tanda terima
- [ ] Tidak ada data yang dikirim ke server pada jalur ini (client-side)
- [ ] Edge case: item dengan harga 0 atau qty 0 tidak lolos validasi

### [MVP-2] Profil Penjual Tanpa Akun (localStorage)

**User story**: Sebagai pengguna berulang yang belum mau daftar, saya ingin data bisnis saya tersimpan di browser, sehingga muncul otomatis tanpa harus mengetik ulang atau membuat akun.

**Acceptance criteria**:

- [ ] Field profil: nama bisnis, nama pemilik, alamat, no. telp/WA, logo (opsional)
- [ ] Data disimpan di localStorage perangkat, autofill otomatis pada kunjungan berikutnya
- [ ] Logo muncul di header kwitansi jika di-upload; jika tidak, fallback ke teks
- [ ] User diberi tahu bahwa data tersimpan lokal di perangkat (bukan cloud), dan akan hilang jika clear browser data
- [ ] `[TRADE-OFF]` Karena lokal, profil tidak tersinkron antar perangkat — ini diselesaikan di v1.1 lewat akun opsional

### [v1.1-1] Konversi ke Akun untuk Simpan Riwayat

**User story**: Sebagai pengguna yang sudah sering pakai, saya ingin opsi membuat akun agar riwayat kwitansi saya tersimpan dan bisa diakses dari perangkat lain.

**Acceptance criteria**:

- [ ] Setelah generate, muncul prompt opsional: "Simpan kwitansi ini? Buat akun gratis" (non-intrusif, bisa diabaikan)
- [ ] Pendaftaran tetap opsional — jalur tanpa-akun selalu tersedia penuh
- [ ] Setelah berakun, riwayat & profil tersinkron ke cloud
- [ ] Data localStorage sebelumnya dapat di-migrate ke akun saat pertama login

---

## 7. Tech Requirements & Constraints

**Stack yang direkomendasikan**:

- **Frontend**: Next.js (React) + Tailwind CSS — SSR/SSG, mobile-first, ekosistem luas
- **PDF Generation**: `@react-pdf/renderer` atau `pdf-lib` — **berjalan di browser** untuk jalur tanpa-akun (zero backend untuk fitur inti)
- **Persistensi MVP**: `localStorage` (profil & draft di perangkat) — tanpa database
- **Backend & DB (mulai v1.1)**: Supabase (PostgreSQL + Auth + Storage) — hanya saat akun opsional diperkenalkan
- **Hosting**: Vercel (frontend) — free tier cukup untuk awal
- **Lisensi open source**: `[ASUMSI: belum diputuskan]` — lihat Open Questions (MIT vs AGPL punya implikasi besar untuk open-core nanti)

**Keuntungan arsitektur client-side untuk MVP**:

- Biaya infrastruktur ~$0 (tidak ada server/DB yang harus dibayar untuk fitur inti)
- Privasi maksimal (data tidak ke server) — selaras dengan kepercayaan open source
- Skala "gratis" tidak membebani biaya karena beban komputasi ada di perangkat user

**Constraints**:

- Tim: `[ASUMSI: Solo founder/developer]`
- Timeline MVP: 4–7 minggu (lebih cepat dari v1.0 karena tanpa backend)
- Budget infrastruktur MVP: ~$0/bulan

**Non-functional requirements**:

- **Performance**: PDF generate <3 detik di perangkat mid-range; load <2 detik
- **Mobile-first**: Mayoritas user via HP — UI wajib fully responsive
- **Security**: Jalur MVP tidak menyimpan data di server (mengurangi attack surface); saat akun masuk (v1.1), terapkan Row Level Security per user
- **Accessibility**: `[ASUMSI: nice-to-have]` — basic a11y untuk nilai portofolio

---

## 8. Success Metrics

**Objective**: Membangun portofolio yang kuat + basis pengguna nyata, dengan biaya mendekati nol.

Karena fase ini gratis (tanpa langganan), metrik berfokus pada **portofolio, adopsi, dan engagement** — bukan MRR/churn.

| Metric                                                  | Baseline | Target 3 Bulan | Target 6 Bulan         |
| ------------------------------------------------------- | -------- | -------------- | ---------------------- |
| **GitHub stars** (sinyal portofolio)                    | 0        | 50             | 200                    |
| Kontributor / fork                                      | 0        | 2              | 5                      |
| Unique visitor                                          | 0        | 1.000          | 5.000                  |
| Kwitansi di-generate                                    | 0        | 1.500          | 8.000                  |
| Activation rate (selesai bikin ≥1 kwitansi per visitor) | -        | >40%           | >50%                   |
| Return rate (user kembali dalam 30 hari)                | -        | >15%           | >25%                   |
| Konversi ke akun (setelah v1.1 rilis)                   | -        | -              | >8% dari user berulang |

**Sinyal sukses portofolio (kualitatif)**:

- Repo rapi: README jelas, dokumentasi, struktur kode bersih, deployment live
- Demo live yang berfungsi mulus di mobile
- Beberapa testimoni/feedback user nyata

**Model income (DIPARKIR — fase lanjutan, hanya jika produk tumbuh)**:

- ❌ **Iklan**: tidak direkomendasikan. Tool kwitansi = sesi pendek ("masuk-bikin-keluar"), page view minim, CPM Indonesia rendah → struktur pemakaian bertentangan dengan model iklan
- ✅ **Open-core** (jalur yang masuk akal): app inti gratis & open source; berbayar untuk versi hosted praktis + fitur premium (hapus watermark, branding sendiri, bulk generate, template premium, integrasi, sync cloud lanjutan)
- Catatan: pilihan lisensi open source di awal akan menentukan apakah open-core layak secara legal nanti (lihat Open Questions)

---

## 9. Asumsi & Risiko

**Asumsi yang belum divalidasi**:

- `[ASUMSI: User cukup peduli pada "tanpa signup" sehingga memilih ini ketimbang kompetitor]` → validasi: A/B messaging, ukur activation rate vs bounce
- `[ASUMSI: localStorage cukup untuk kebutuhan persistensi pengguna berulang di tahap awal]` → validasi: observasi permintaan fitur sync/akun
- `[ASUMSI: Open source mendatangkan minimal sebagian distribusi/kontribusi organik]` → validasi: pantau traffic dari GitHub/komunitas

**Risiko utama**:

| Risiko                                                       | Probabilitas | Dampak | Mitigasi                                                                                               |
| ------------------------------------------------------------ | ------------ | ------ | ------------------------------------------------------------------------------------------------------ |
| Tanpa email capture, sulit membangun funnel/relasi user      | Tinggi       | Sedang | Prompt akun opsional non-intrusif setelah generate; tetap jaga jalur tanpa-akun                        |
| Produk gratis tanpa income jadi beban biaya/waktu            | Sedang       | Sedang | Arsitektur client-side menjaga biaya ~$0; nilai utama tetap tercapai (portofolio) meski income nihil   |
| Kompetitor menambah opsi "tanpa signup"                      | Rendah       | Sedang | Tidak likely (bertentangan dengan model funnel mereka); jika terjadi, andalkan open source + kecepatan |
| Kualitas PDF kurang profesional untuk klien serius           | Sedang       | Sedang | Uji template ke 5–10 user nyata sebelum publikasi luas                                                 |
| Lisensi open source salah pilih → menghambat open-core nanti | Sedang       | Sedang | Putuskan lisensi sejak awal dengan sadar (lihat Open Questions)                                        |

---

## 10. Open Questions

- [ ] **Lisensi open source**: MIT (adopsi maksimal, terbaik untuk portofolio, tapi orang bisa bikin fork komersial tertutup) vs AGPL (melindungi dari fork tertutup, lebih aman untuk rencana open-core) — **perlu diputuskan sebelum publikasi repo**
- [ ] **Nama produk**: "KwitansiKlik" working name — apakah dipakai final atau ada preferensi lain?
- [ ] Jumlah template di MVP: cukup 1 default, atau langsung 2–3 pilihan untuk nilai portofolio?
- [ ] Format nomor kwitansi: auto-increment sederhana, atau bisa di-custom (mis. INV/2026/001)?
- [ ] Apakah jalur tanpa-akun perlu opsi "simpan draft sementara" (localStorage) atau cukup generate-and-go?
- [ ] Channel distribusi awal: komunitas developer (untuk star GitHub) vs komunitas UMKM/freelance (untuk user nyata) — keduanya melayani prioritas berbeda (#1 vs #2)
