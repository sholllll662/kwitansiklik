import { describe, expect, it } from "vitest";
import { terbilang, terbilangRupiah } from "@/lib/terbilang";

describe("terbilang", () => {
  it("menangani nol", () => {
    expect(terbilang(0)).toBe("nol");
  });

  it("menangani satuan (1-11)", () => {
    expect(terbilang(1)).toBe("satu");
    expect(terbilang(9)).toBe("sembilan");
    expect(terbilang(10)).toBe("sepuluh");
    expect(terbilang(11)).toBe("sebelas");
  });

  it("menangani belasan (12-19)", () => {
    expect(terbilang(12)).toBe("dua belas");
    expect(terbilang(15)).toBe("lima belas");
    expect(terbilang(19)).toBe("sembilan belas");
  });

  it("menangani puluhan", () => {
    expect(terbilang(20)).toBe("dua puluh");
    expect(terbilang(21)).toBe("dua puluh satu");
    expect(terbilang(99)).toBe("sembilan puluh sembilan");
  });

  it("menangani ratusan, termasuk 'seratus' (bukan 'satu ratus')", () => {
    expect(terbilang(100)).toBe("seratus");
    expect(terbilang(101)).toBe("seratus satu");
    expect(terbilang(199)).toBe("seratus sembilan puluh sembilan");
    expect(terbilang(200)).toBe("dua ratus");
    expect(terbilang(999)).toBe("sembilan ratus sembilan puluh sembilan");
  });

  it("menangani ribuan, termasuk 'seribu' (bukan 'satu ribu')", () => {
    expect(terbilang(1_000)).toBe("seribu");
    expect(terbilang(1_001)).toBe("seribu satu");
    expect(terbilang(1_999)).toBe(
      "seribu sembilan ratus sembilan puluh sembilan",
    );
    expect(terbilang(2_000)).toBe("dua ribu");
    expect(terbilang(11_000)).toBe("sebelas ribu");
    expect(terbilang(19_000)).toBe("sembilan belas ribu");
    expect(terbilang(100_000)).toBe("seratus ribu");
  });

  it("menangani jutaan", () => {
    expect(terbilang(1_000_000)).toBe("satu juta");
    expect(terbilang(1_234_567)).toBe(
      "satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh",
    );
    expect(terbilang(3_330_000)).toBe("tiga juta tiga ratus tiga puluh ribu");
  });

  it("menangani miliaran & triliunan", () => {
    expect(terbilang(1_000_000_000)).toBe("satu miliar");
    expect(terbilang(2_500_000_000)).toBe("dua miliar lima ratus juta");
    expect(terbilang(1_000_000_000_000)).toBe("satu triliun");
  });

  it("menangani angka negatif dengan prefiks 'minus'", () => {
    expect(terbilang(-50)).toBe("minus lima puluh");
  });

  it("membulatkan ke bawah untuk angka desimal", () => {
    expect(terbilang(100.9)).toBe("seratus");
  });
});

describe("terbilangRupiah", () => {
  it("menambahkan sufiks 'rupiah'", () => {
    expect(terbilangRupiah(50_000)).toBe("lima puluh ribu rupiah");
  });
});
