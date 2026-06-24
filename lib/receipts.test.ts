import { beforeEach, describe, expect, it } from "vitest";
import { deleteReceipt, getReceipts, saveReceipt } from "@/lib/receipts";
import type { Receipt } from "@/lib/types";

function makeReceipt(id: string): Receipt {
  return {
    id,
    number: `INV/2026/${id}`,
    date: "2026-06-24",
    items: [{ id: "item-1", name: "Item", qty: 1, unitPrice: 1000 }],
    createdAt: "2026-06-24T00:00:00.000Z",
  };
}

describe("receipts", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mengembalikan array kosong jika belum ada riwayat", () => {
    expect(getReceipts()).toEqual([]);
  });

  it("saveReceipt menambah ke depan (terbaru lebih dulu)", () => {
    saveReceipt(makeReceipt("001"));
    saveReceipt(makeReceipt("002"));
    expect(getReceipts().map((r) => r.id)).toEqual(["002", "001"]);
  });

  it("deleteReceipt menghapus berdasarkan id", () => {
    saveReceipt(makeReceipt("001"));
    saveReceipt(makeReceipt("002"));
    deleteReceipt("001");
    expect(getReceipts().map((r) => r.id)).toEqual(["002"]);
  });
});
