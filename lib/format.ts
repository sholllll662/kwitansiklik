const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Intl menyisipkan non-breaking space (U+00A0, kode 160) antara "Rp" dan angka.
const NON_BREAKING_SPACE_RE = new RegExp(String.fromCharCode(160), "g");

/** Format integer rupiah -> "Rp 3.330.000". Desimal dibulatkan ke bawah. */
export function formatRupiah(amount: number): string {
  // Ganti non-breaking space ke spasi biasa agar konsisten saat dicari/disalin di PDF.
  return rupiahFormatter
    .format(Math.floor(amount))
    .replace(NON_BREAKING_SPACE_RE, " ");
}

/**
 * Format tanggal -> "24 Juni 2026". Menerima ISO date string ("YYYY-MM-DD") atau Date.
 * String tanggal-saja diparsing sebagai waktu lokal (bukan UTC) agar tidak bergeser
 * sehari di zona waktu negatif UTC.
 */
export function formatDate(date: string | Date): string {
  if (typeof date === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (match) {
      const [, year, month, day] = match;
      return dateFormatter.format(
        new Date(Number(year), Number(month) - 1, Number(day)),
      );
    }
    return dateFormatter.format(new Date(date));
  }
  return dateFormatter.format(date);
}

/** Tanggal hari ini sebagai ISO date string ("YYYY-MM-DD"), berdasarkan waktu lokal. */
export function todayIsoDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
