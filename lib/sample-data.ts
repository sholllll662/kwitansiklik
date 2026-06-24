import type { Receipt, SellerProfile } from "@/lib/types";

/** Logo contoh (kotak biru solid 96x96) — hanya untuk pratinjau/demo template. */
export const sampleLogoBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAApElEQVR4nO3QQQ0AIBDAsDODMuRjAgd82aPJBCydtY8ezfeDeIAAAQIEKBwgQIAAAQoHCBAgQIDCAQIECBCgcIAAAQIEKBwgQIAAAQoHCBAgQIDCAQIECBCgcIAAAQIEKBwgQIAAAQoHCBAgQIDCAQIECBCgcIAAAQIEKBwgQIAAAQoHCBAgQIDCAQIECBCgcIAAAQIEKBwgQIAAAQoHCBAgQD+7gmYvDR9wdcoAAAAASUVORK5CYII=";

export const sampleSellerProfile: SellerProfile = {
  businessName: "Toko Maju Bersama",
  ownerName: "Budi Santoso",
  address: "Jl. Merdeka No. 45, Bandung, Jawa Barat",
  phone: "0812-3456-7890",
  logoBase64: sampleLogoBase64,
};

export const sampleReceipt: Receipt = {
  id: "sample-receipt-1",
  number: "INV/2026/001",
  date: "2026-06-24",
  buyerName: "Citra Lestari",
  items: [
    { id: "item-1", name: "Jasa Desain Logo", qty: 1, unitPrice: 1_500_000 },
    { id: "item-2", name: "Konsultasi Branding", qty: 2, unitPrice: 750_000 },
    {
      id: "item-3",
      name: "Cetak Kartu Nama (box)",
      qty: 3,
      unitPrice: 110_000,
    },
  ],
  discount: { type: "percent", value: 10 },
  taxPercent: 11,
  notes:
    "Pembayaran lunas via transfer bank. Terima kasih atas kepercayaannya.",
  createdAt: "2026-06-24T08:30:00.000Z",
};
