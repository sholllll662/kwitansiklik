/** Bentuk draft form — nilai angka disimpan sebagai string mentah (boleh kosong saat diedit). */
export interface ItemDraft {
  id: string;
  name: string;
  qty: string;
  unitPrice: string;
}

export type DiscountType = "none" | "amount" | "percent";

export function createEmptyItemDraft(): ItemDraft {
  return { id: crypto.randomUUID(), name: "", qty: "1", unitPrice: "" };
}
