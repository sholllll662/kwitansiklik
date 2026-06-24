import { describe, expect, it } from "vitest";
import {
  calculateTotal,
  discountAmount,
  lineTotal,
  subtotal,
  taxAmount,
} from "@/lib/calc";

describe("lineTotal", () => {
  it("mengalikan qty dengan harga satuan", () => {
    expect(lineTotal({ qty: 3, unitPrice: 10_000 })).toBe(30_000);
  });
});

describe("subtotal", () => {
  it("mengakumulasi total semua baris item", () => {
    expect(
      subtotal([
        { qty: 2, unitPrice: 50_000 },
        { qty: 1, unitPrice: 100_000 },
      ]),
    ).toBe(200_000);
  });

  it("mengembalikan 0 untuk daftar item kosong", () => {
    expect(subtotal([])).toBe(0);
  });
});

describe("discountAmount", () => {
  it("mengembalikan 0 jika tidak ada diskon", () => {
    expect(discountAmount(100_000, undefined)).toBe(0);
  });

  it("menghitung diskon persen, dibulatkan ke rupiah terdekat", () => {
    expect(discountAmount(100_000, { type: "percent", value: 10 })).toBe(
      10_000,
    );
    expect(discountAmount(99_999, { type: "percent", value: 33 })).toBe(33_000);
  });

  it("menghitung diskon nominal langsung", () => {
    expect(discountAmount(100_000, { type: "amount", value: 15_000 })).toBe(
      15_000,
    );
  });

  it("tidak pernah melebihi subtotal (mencegah total negatif)", () => {
    expect(discountAmount(50_000, { type: "amount", value: 999_999 })).toBe(
      50_000,
    );
    expect(discountAmount(50_000, { type: "percent", value: 200 })).toBe(
      50_000,
    );
  });

  it("mengabaikan nilai diskon nol atau negatif", () => {
    expect(discountAmount(100_000, { type: "amount", value: 0 })).toBe(0);
    expect(discountAmount(100_000, { type: "amount", value: -5_000 })).toBe(0);
  });
});

describe("taxAmount", () => {
  it("mengembalikan 0 jika tanpa PPN", () => {
    expect(taxAmount(100_000, undefined)).toBe(0);
    expect(taxAmount(100_000, 0)).toBe(0);
  });

  it("menghitung PPN 11% dibulatkan ke rupiah terdekat", () => {
    expect(taxAmount(100_000, 11)).toBe(11_000);
    expect(taxAmount(10_000, 11)).toBe(1_100);
  });
});

describe("calculateTotal", () => {
  it("menghitung subtotal, diskon, PPN, dan total bersama-sama", () => {
    const result = calculateTotal({
      items: [{ qty: 2, unitPrice: 100_000 }],
      discount: { type: "percent", value: 10 },
      taxPercent: 11,
    });
    // subtotal 200.000 - diskon 10% (20.000) = 180.000; PPN 11% dari 180.000 = 19.800
    expect(result).toEqual({
      subtotal: 200_000,
      discountAmount: 20_000,
      taxAmount: 19_800,
      total: 199_800,
    });
  });

  it("menangani item kosong, tanpa diskon/PPN", () => {
    expect(calculateTotal({ items: [] })).toEqual({
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
    });
  });

  it("total tidak pernah negatif meski diskon ekstrem", () => {
    const result = calculateTotal({
      items: [{ qty: 1, unitPrice: 10_000 }],
      discount: { type: "amount", value: 999_999 },
      taxPercent: 11,
    });
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.discountAmount).toBe(10_000);
  });
});
