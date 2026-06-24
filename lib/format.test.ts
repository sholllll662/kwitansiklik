import { describe, expect, it } from "vitest";
import { formatDate, formatRupiah, todayIsoDate } from "@/lib/format";

describe("formatRupiah", () => {
  it("memformat dengan prefiks 'Rp ' dan titik sebagai pemisah ribuan", () => {
    expect(formatRupiah(3_330_000)).toBe("Rp 3.330.000");
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(1_000)).toBe("Rp 1.000");
  });

  it("membulatkan ke bawah untuk nilai desimal", () => {
    expect(formatRupiah(1_500.7)).toBe("Rp 1.500");
  });
});

describe("formatDate", () => {
  it("memformat string ISO date (YYYY-MM-DD) tanpa bergeser hari akibat zona waktu", () => {
    expect(formatDate("2026-06-24")).toBe("24 Juni 2026");
    expect(formatDate("2026-01-01")).toBe("1 Januari 2026");
  });

  it("memformat objek Date", () => {
    expect(formatDate(new Date(2026, 11, 31))).toBe("31 Desember 2026");
  });
});

describe("todayIsoDate", () => {
  it("mengembalikan format YYYY-MM-DD yang cocok dengan tanggal lokal saat ini", () => {
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    expect(todayIsoDate()).toBe(expected);
  });
});
