import { getItem, setItem } from "@/lib/storage";

export const DEFAULT_NUMBER_FORMAT = "INV/{YYYY}/{NNN}";

const COUNTER_KEY = "counter";

/**
 * Format nomor kwitansi dari template + tanggal + counter.
 * Placeholder: {YYYY} {YY} {MM} {DD} {N...} — jumlah huruf N menentukan lebar padding nol.
 */
export function formatReceiptNumber(
  format: string,
  date: Date,
  counter: number,
): string {
  return format
    .replace(/\{YYYY\}/g, String(date.getFullYear()))
    .replace(/\{YY\}/g, String(date.getFullYear()).slice(-2))
    .replace(/\{MM\}/g, String(date.getMonth() + 1).padStart(2, "0"))
    .replace(/\{DD\}/g, String(date.getDate()).padStart(2, "0"))
    .replace(/\{N+\}/g, (match) =>
      String(counter).padStart(match.length - 2, "0"),
    );
}

export function getCurrentCounter(): number {
  return getItem<number>(COUNTER_KEY) ?? 0;
}

/** Menaikkan & menyimpan counter di localStorage, mengembalikan nilai baru. */
export function incrementCounter(): number {
  const next = getCurrentCounter() + 1;
  setItem(COUNTER_KEY, next);
  return next;
}

/** Generate nomor kwitansi berikutnya: menaikkan counter lokal lalu format. */
export function getNextReceiptNumber(
  format: string = DEFAULT_NUMBER_FORMAT,
  date: Date = new Date(),
): string {
  return formatReceiptNumber(format, date, incrementCounter());
}
