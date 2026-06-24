import { getItem, setItem } from "@/lib/storage";
import type { Receipt } from "@/lib/types";

const RECEIPTS_KEY = "receipts";

/** Riwayat lokal, terbaru lebih dulu. */
export function getReceipts(): Receipt[] {
  return getItem<Receipt[]>(RECEIPTS_KEY) ?? [];
}

export function saveReceipt(receipt: Receipt): void {
  setItem(RECEIPTS_KEY, [receipt, ...getReceipts()]);
}

export function deleteReceipt(id: string): void {
  setItem(
    RECEIPTS_KEY,
    getReceipts().filter((receipt) => receipt.id !== id),
  );
}
