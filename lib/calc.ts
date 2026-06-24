import type { ReceiptDiscount } from "@/lib/types";

type CalcItem = {
  qty: number;
  unitPrice: number;
};

export interface CalcResult {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export function lineTotal(item: CalcItem): number {
  return item.qty * item.unitPrice;
}

export function subtotal(items: CalcItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

/** Dibulatkan ke rupiah terdekat; tidak pernah melebihi subtotal (mencegah total negatif). */
export function discountAmount(
  subtotalValue: number,
  discount?: ReceiptDiscount,
): number {
  if (!discount || discount.value <= 0) return 0;
  const raw =
    discount.type === "percent"
      ? Math.round((subtotalValue * discount.value) / 100)
      : Math.round(discount.value);
  return Math.min(raw, subtotalValue);
}

/** PPN dihitung dari jumlah setelah diskon, dibulatkan ke rupiah terdekat. */
export function taxAmount(
  amountAfterDiscount: number,
  taxPercent?: number,
): number {
  if (!taxPercent || taxPercent <= 0) return 0;
  return Math.round((amountAfterDiscount * taxPercent) / 100);
}

export function calculateTotal(input: {
  items: CalcItem[];
  discount?: ReceiptDiscount;
  taxPercent?: number;
}): CalcResult {
  const sub = subtotal(input.items);
  const disc = discountAmount(sub, input.discount);
  const afterDiscount = sub - disc;
  const tax = taxAmount(afterDiscount, input.taxPercent);
  return {
    subtotal: sub,
    discountAmount: disc,
    taxAmount: tax,
    total: afterDiscount + tax,
  };
}
