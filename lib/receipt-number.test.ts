import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_NUMBER_FORMAT,
  formatReceiptNumber,
  getCurrentCounter,
  getNextReceiptNumber,
  incrementCounter,
} from "@/lib/receipt-number";

const SAMPLE_DATE = new Date(2026, 5, 24); // 24 Juni 2026

describe("formatReceiptNumber", () => {
  it("mengganti placeholder tanggal & counter dengan padding nol", () => {
    expect(formatReceiptNumber(DEFAULT_NUMBER_FORMAT, SAMPLE_DATE, 1)).toBe(
      "INV/2026/001",
    );
    expect(formatReceiptNumber(DEFAULT_NUMBER_FORMAT, SAMPLE_DATE, 42)).toBe(
      "INV/2026/042",
    );
    expect(formatReceiptNumber(DEFAULT_NUMBER_FORMAT, SAMPLE_DATE, 1000)).toBe(
      "INV/2026/1000",
    );
  });

  it("mendukung format custom dengan {YY}, {MM}, {DD}, dan lebar padding berbeda", () => {
    expect(formatReceiptNumber("{YY}{MM}{DD}-{NNNN}", SAMPLE_DATE, 7)).toBe(
      "260624-0007",
    );
  });

  it("mendukung format tanpa placeholder counter", () => {
    expect(formatReceiptNumber("INV-{YYYY}", SAMPLE_DATE, 1)).toBe("INV-2026");
  });
});

describe("counter di localStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("dimulai dari 0 saat belum ada riwayat", () => {
    expect(getCurrentCounter()).toBe(0);
  });

  it("incrementCounter menaikkan & menyimpan nilai secara persisten", () => {
    expect(incrementCounter()).toBe(1);
    expect(incrementCounter()).toBe(2);
    expect(getCurrentCounter()).toBe(2);
  });

  it("getNextReceiptNumber menggabungkan increment counter + format", () => {
    expect(getNextReceiptNumber(DEFAULT_NUMBER_FORMAT, SAMPLE_DATE)).toBe(
      "INV/2026/001",
    );
    expect(getNextReceiptNumber(DEFAULT_NUMBER_FORMAT, SAMPLE_DATE)).toBe(
      "INV/2026/002",
    );
  });
});
