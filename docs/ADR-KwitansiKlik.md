# ADR: Arsitektur KwitansiKlik

**Versi**: 1.0 | **Tanggal**: 23 Juni 2026 | **Status**: Proposed

---

## Konteks

KwitansiKlik adalah aplikasi pembuat kwitansi digital, **gratis & open source** (lisensi **AGPL-3.0**),
dengan prioritas proyek: (1) portofolio, (2) akuisisi user, (3) income (via open-core, bukan iklan).

Constraints yang membentuk keputusan arsitektur:

- **Wedge utama**: pembuatan kwitansi **tanpa perlu daftar akun** → MVP harus berjalan tanpa auth wajib
- **Biaya mendekati nol** → hindari server/DB berbayar di MVP
- **Privasi sebagai nilai jual** → minimalkan data yang menyentuh server
- **Solo developer** → simplicity first, hindari kompleksitas ops
- **Open source** → kode harus bersih & jadi showcase teknis

Keputusan inti: **arsitektur dua fase**.

- **Fase 1 (MVP)** — _client-side / local-first_. Tanpa backend, tanpa database, tanpa auth.
- **Fase 2 (v1.1)** — tambah backend (Supabase) untuk akun **opsional** + sinkronisasi cloud.

`[ASUMSI: Solo developer, traffic <1.000 user di 3 bulan pertama]`

---

## Tech Stack

| Layer          | MVP (Fase 1)                        | v1.1 (Fase 2)                            | Alasan                                                                            |
| -------------- | ----------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Frontend       | Next.js (App Router) + Tailwind CSS | (sama)                                   | SSG untuk landing cepat, ekosistem React terbesar, mudah di-deploy ke Vercel      |
| Backend        | **Tidak ada**                       | Supabase (managed)                       | MVP cukup client-side; backend baru diperlukan saat ada akun & sync               |
| Database       | **localStorage** (browser)          | PostgreSQL (Supabase)                    | localStorage cukup untuk single-device; Postgres saat butuh multi-device & relasi |
| Auth           | **Tidak ada**                       | Supabase Auth (email + Google), opsional | Jangan bangun auth sendiri; jalur tanpa-akun tetap selalu tersedia                |
| PDF generation | `@react-pdf/renderer` (di browser)  | (sama) + opsi server-side untuk bulk     | PDF vektor sejati, jalan client-side, DX baik                                     |
| File/logo      | localStorage (base64, terkompresi)  | Supabase Storage                         | MVP simpan logo lokal; cloud saat berakun                                         |
| Hosting        | Vercel (free tier)                  | Vercel + Supabase (free → pro)           | Gratis di awal, skala mulus                                                       |
| Payment        | **Tidak ada**                       | Midtrans / Xendit (saat open-core aktif) | Diparkir; baru relevan jika tier berbayar diluncurkan                             |

**Estimasi biaya infra/bulan**:

- MVP: **~Rp 0** (Vercel free tier; tidak ada server/DB)
- v1.1: **~Rp 0–400.000** (Supabase free tier cukup hingga ribuan user; naik ke Pro ~$25 saat melewati batas)

---

## Architecture Diagram

### Fase 1 — MVP (client-side)

```
                    ┌─────────────┐
                    │ Vercel CDN  │  (hanya menyajikan static assets)
                    └──────┬──────┘
                           │ load app
        ┌──────────────────▼───────────────────────────┐
        │  User's browser  (tanpa server)               │
        │                                               │
        │            ┌───────────────────┐              │
        │            │  KwitansiKlik app  │              │
        │            │  Next.js · React   │              │
        │            └─────┬─────────┬────┘              │
        │       baca/tulis │         │ generate          │
        │            ┌─────▼────┐ ┌──▼─────────┐         │
        │            │localStorage│ │ PDF engine │        │
        │            │profil &   │ │ react-pdf  │        │
        │            │riwayat    │ └──────┬─────┘         │
        │            └───────────┘        │               │
        └─────────────────────────────────┼──────────────┘
                                           │ download
                                    ┌──────▼──────┐
                                    │ Kwitansi PDF│
                                    └─────────────┘
```

Tidak ada permintaan ke server pada jalur inti. Seluruh komputasi (hitung total, render PDF)
terjadi di perangkat user.

### Fase 2 — v1.1 (akun opsional + sync)

```
   Browser (jalur tanpa-akun TETAP berfungsi penuh seperti MVP)
        │
        │  jika user memilih buat akun:
        ▼
   ┌─────────────────────────────────────────┐
   │ Supabase                                 │
   │  ├─ Auth (email / Google OAuth)          │
   │  ├─ PostgreSQL (profiles, receipts,      │
   │  │   receipt_items) + Row Level Security │
   │  └─ Storage (logo)                       │
   └─────────────────────────────────────────┘
        ▲
        │  Supabase JS SDK langsung dari client (RLS menjaga isolasi data)
        │  → umumnya TIDAK perlu API layer kustom untuk CRUD dasar
```

Prinsip: backend hanya melayani user yang memilih berakun. Jalur tanpa-akun tidak pernah
menyentuh Supabase.

---

## Data Model

Didesain **sekali**, diimplementasi sebagai JSON di localStorage (MVP) dan sebagai tabel
PostgreSQL (v1.1). Bentuknya sengaja dibuat memetakan 1:1 agar migrasi lokal → cloud bersih.

### Bentuk data (MVP — localStorage, TypeScript)

```typescript
interface SellerProfile {
  businessName: string;
  ownerName?: string;
  address?: string;
  phone?: string; // WA / telp
  logoBase64?: string; // gambar terkompresi, disimpan lokal
}

interface ReceiptItem {
  id: string; // uuid (client-generated)
  name: string;
  qty: number;
  unitPrice: number; // INTEGER rupiah — bukan float (akurasi accounting)
  // lineTotal dihitung = qty * unitPrice (tidak disimpan)
}

interface Receipt {
  id: string; // uuid
  number: string; // mis. "001" atau "INV/2026/001"
  date: string; // ISO date
  buyerName?: string;
  items: ReceiptItem[];
  discount?: { type: "amount" | "percent"; value: number };
  taxPercent?: number; // PPN, mis. 11
  notes?: string;
  createdAt: string; // ISO timestamp
  // subtotal, taxAmount, total dihitung saat render (tidak disimpan)
}
```

**Kunci localStorage** (prefix `kwitansiklik:`):

- `kwitansiklik:profile` → `SellerProfile`
- `kwitansiklik:receipts` → `Receipt[]` (riwayat lokal)
- `kwitansiklik:counter` → nomor kwitansi terakhir (untuk auto-increment)
- `kwitansiklik:settings` → default (PPN %, format nomor, mata uang)

**Catatan teknis localStorage**:

- Limit ~5 MB per origin. Receipt JSON kecil; yang besar adalah `logoBase64` → **kompres & resize logo** (mis. maks 200×200, ~50 KB) sebelum simpan.
- Data hilang jika user clear browser data → komunikasikan ke user bahwa ini penyimpanan lokal.
- `[REKOMENDASI]` Tambahkan **riwayat lokal ringan** ke dalam MVP (bukan v1.1). Mekanismenya sama dengan profil (localStorage), nyaris gratis, tapi menaikkan return-rate secara signifikan. Sinkronisasi antar-perangkat-lah yang butuh akun (v1.1) — bukan riwayat itu sendiri.

### Skema PostgreSQL (v1.1)

`profiles` 1—1 `auth.users` · `receipts` 1—N `receipt_items`

```sql
-- profiles: data bisnis penjual (1 baris per user)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  address TEXT,
  phone TEXT,
  logo_url TEXT,                       -- referensi ke Supabase Storage
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- receipts: header kwitansi
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  date DATE NOT NULL,
  buyer_name TEXT,
  discount_type TEXT,                  -- 'amount' | 'percent' | NULL
  discount_value BIGINT,
  tax_percent NUMERIC(5,2),            -- mis. 11.00
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,              -- soft delete
  UNIQUE (user_id, number)             -- nomor unik per user
);

-- receipt_items: baris item
CREATE TABLE receipt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  qty NUMERIC NOT NULL CHECK (qty > 0),
  unit_price BIGINT NOT NULL CHECK (unit_price >= 0),  -- INTEGER rupiah
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_receipts_user ON receipts(user_id);
CREATE INDEX idx_receipts_created ON receipts(created_at);
CREATE INDEX idx_items_receipt ON receipt_items(receipt_id);
```

> **Prinsip schema**: UUID sebagai PK (aman untuk API publik), `created_at`/`updated_at`
> di tiap tabel, soft delete untuk data penting, `unit_price` sebagai `BIGINT` rupiah
> (hindari masalah floating point).

---

## API Design

### MVP — Tidak ada API

Seluruh operasi terjadi di client. Tidak ada endpoint untuk dirancang atau diamankan.
Ini menghilangkan seluruh kelas risiko (auth bypass, data exposure, injection) di MVP.

### v1.1 — Minimalis lewat Supabase

Dengan Supabase + Row Level Security, **client SDK bisa langsung melakukan CRUD** ke database
secara aman tanpa perlu API layer kustom. Ini menyederhanakan arsitektur secara signifikan.

```sql
-- RLS: user hanya bisa mengakses datanya sendiri
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own receipts" ON receipts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

**API kustom (Next.js Route Handlers) baru diperlukan jika**:

- Generate PDF bulk di server (fitur open-core)
- Webhook payment gateway (saat tier berbayar aktif)
- Operasi yang butuh service-role key (tidak boleh di client)

Jika nanti dibutuhkan, ikuti konvensi REST: `GET/POST /api/v1/[resource]`, envelope
`{ success, data, meta }` / `{ success, error: { code, message } }`.

---

## Auth Pattern

| Fase | Pola                                                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| MVP  | **Tanpa auth.** Identitas user tidak diperlukan untuk fitur inti                                                                 |
| v1.1 | Supabase Auth (email+password / magic link / Google OAuth). JWT di **httpOnly cookie** (bukan localStorage — hindari risiko XSS) |

**Alur konversi (v1.1)**: setelah generate, tampilkan prompt non-intrusif "Simpan kwitansi
ini? Buat akun gratis". Saat pertama login, **migrasikan** data localStorage yang ada ke akun
(baca `kwitansiklik:profile` + `kwitansiklik:receipts` → upsert ke Supabase).

---

## Open-Core Boundary (implikasi AGPL)

Karena kode bersifat open source (AGPL), fitur **tidak bisa disembunyikan** di dalam kode —
siapa pun dapat build dari source dan menghapus, misalnya, watermark. Maka:

- **Monetisasi = layanan & kenyamanan, bukan kerahasiaan kode.** Yang berbayar adalah versi
  _hosted_ yang langsung jalan (sync cloud, backup, bulk, integrasi terkelola), bukan akses ke fitur.
- **Jaga modularitas open-core sejak awal.** Pisahkan kode layanan premium (integrasi payment,
  worker bulk PDF server-side) ke modul/paket terpisah agar core AGPL tetap bersih dan, jika perlu,
  dapat dilisensikan terpisah (lo pemegang hak cipta → bebas dual-license).
- AGPL melindungi dari kompetitor yang mengambil kode lo lalu menutupnya — itu sebabnya cocok
  untuk rencana open-core, sesuai pilihan yang sudah dibuat.

---

## Trade-offs yang Diterima

| Keputusan                             | Yang Dikorbankan                                    | Alasan Tetap Dipilih                                                                  |
| ------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| MVP client-side, tanpa backend        | Riwayat hanya 1 perangkat; tanpa email capture      | Biaya ~$0, privasi maksimal, ship cepat. Cross-device diselesaikan di v1.1            |
| `@react-pdf/renderer`                 | Kurva belajar styling (subset flexbox sendiri)      | PDF vektor tajam & profesional; alternatif (html2canvas) menghasilkan teks buram      |
| localStorage untuk persistensi MVP    | Limit 5 MB; data bisa terhapus user                 | Cukup untuk single-device; nol biaya; memetakan bersih ke Postgres nanti              |
| Supabase (v1.1), bukan backend kustom | Sedikit vendor lock-in                              | Auth + DB + Storage + RLS dalam satu paket; client SDK menghapus kebutuhan API layer  |
| Tanpa auth di MVP                     | Tidak bisa membangun funnel/relasi user lewat email | Itu **inti wedge** (tanpa friksi); funnel dimitigasi via prompt akun opsional di v1.1 |
| `unit_price` sebagai integer rupiah   | Tidak fleksibel untuk mata uang berdesimal          | Akurasi accounting; multi-currency desimal ditangani saat fitur itu datang            |

---

## Kapan Harus Re-evaluate

- [ ] **Banyak user minta sync antar-perangkat / riwayat hilang** → percepat Fase 2 (Supabase + akun opsional)
- [ ] **Logo/riwayat melebihi limit localStorage** → dorong user ke akun (cloud storage)
- [ ] **Traffic > ~50.000 user aktif** atau Supabase free tier terlampaui → naik ke Supabase Pro (~$25/bln)
- [ ] **Tier berbayar (open-core) diluncurkan** → tambah Midtrans/Xendit + Route Handlers untuk webhook
- [ ] **Butuh bulk generate / PDF server-side** → tambah API layer + worker, pertimbangkan Puppeteer di server
- [ ] **PDF perlu fitur kompleks** (multi-halaman rumit, tabel panjang) yang sulit di react-pdf → evaluasi server-side rendering

---

## Open Questions

- [ ] Riwayat lokal masuk MVP atau ditunda? (Rekomendasi ADR: **masuk MVP** — murah, naikkan retensi)
- [ ] Jumlah template kwitansi di MVP: 1 default, atau 2–3 untuk nilai portofolio?
- [ ] Nomor kwitansi: auto-increment sederhana, atau format custom (INV/2026/001) sejak MVP?
- [ ] Default PPN: hardcode 11%, atau dibuat dapat diubah user di settings sejak MVP?
- [ ] PWA (installable + offline) — layak ditambah di MVP untuk nilai teknis portofolio, atau tunda?
- [ ] Strategi i18n: cukup Bahasa Indonesia dulu, atau siapkan struktur multi-bahasa sejak awal?
