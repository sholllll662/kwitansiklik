const SATUAN = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

function terbilangInt(n: number): string {
  if (n < 12) return n === 0 ? "nol" : SATUAN[n];
  if (n < 20) return `${terbilangInt(n - 10)} belas`;

  if (n < 100) {
    const sisa = n % 10;
    return `${terbilangInt(Math.floor(n / 10))} puluh${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 200) {
    const sisa = n - 100;
    return `seratus${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 1_000) {
    const sisa = n % 100;
    return `${terbilangInt(Math.floor(n / 100))} ratus${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 2_000) {
    const sisa = n - 1_000;
    return `seribu${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 1_000_000) {
    const sisa = n % 1_000;
    return `${terbilangInt(Math.floor(n / 1_000))} ribu${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 1_000_000_000) {
    const sisa = n % 1_000_000;
    return `${terbilangInt(Math.floor(n / 1_000_000))} juta${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  if (n < 1_000_000_000_000) {
    const sisa = n % 1_000_000_000;
    return `${terbilangInt(Math.floor(n / 1_000_000_000))} miliar${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
  }
  const sisa = n % 1_000_000_000_000;
  return `${terbilangInt(Math.floor(n / 1_000_000_000_000))} triliun${sisa ? ` ${terbilangInt(sisa)}` : ""}`;
}

/** Angka (boleh negatif/desimal) -> kata Bahasa Indonesia. Desimal dibulatkan ke bawah. */
export function terbilang(value: number): string {
  const n = Math.floor(Math.abs(value));
  const words = value < 0 ? `minus ${terbilangInt(n)}` : terbilangInt(n);
  return words.replace(/\s+/g, " ").trim();
}

export function terbilangRupiah(value: number): string {
  return `${terbilang(value)} rupiah`;
}
