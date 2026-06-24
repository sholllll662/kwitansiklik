export interface SellerProfile {
  businessName: string;
  ownerName?: string;
  address?: string;
  phone?: string;
  /** Gambar terkompresi (mis. maks 200x200, ~50KB), disimpan lokal sebagai base64. */
  logoBase64?: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  /** Harga satuan dalam rupiah, INTEGER — bukan float (akurasi accounting). */
  unitPrice: number;
}

export interface ReceiptDiscount {
  type: "amount" | "percent";
  value: number;
}

export interface Receipt {
  id: string;
  number: string;
  /** Tanggal kwitansi, format ISO date (YYYY-MM-DD). */
  date: string;
  buyerName?: string;
  items: ReceiptItem[];
  discount?: ReceiptDiscount;
  /** PPN dalam persen, mis. 11. */
  taxPercent?: number;
  notes?: string;
  /** ISO timestamp saat kwitansi dibuat. */
  createdAt: string;
}

export type ReceiptTemplateId = "modern" | "klasik" | "minimalis";

export interface AppSettings {
  /** PPN default (%) saat membuat kwitansi baru, mis. 11. */
  defaultTaxPercent: number;
  /** Template format nomor kwitansi, mis. "INV/{YYYY}/{NNN}". */
  numberFormat: string;
  /** Template kwitansi pilihan terakhir. */
  template: ReceiptTemplateId;
}
