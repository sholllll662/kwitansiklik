import { beforeEach, describe, expect, it, vi } from "vitest";
import { getItem, removeItem, setItem } from "@/lib/storage";

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("getItem mengembalikan null jika key belum ada", () => {
    expect(getItem("profile")).toBeNull();
  });

  it("setItem menyimpan dengan prefix kwitansiklik: dan getItem membacanya kembali", () => {
    expect(setItem("profile", { businessName: "Toko Maju" })).toBe(true);
    expect(window.localStorage.getItem("kwitansiklik:profile")).toBe(
      JSON.stringify({ businessName: "Toko Maju" }),
    );
    expect(getItem("profile")).toEqual({ businessName: "Toko Maju" });
  });

  it("removeItem menghapus key tersimpan", () => {
    setItem("profile", { businessName: "Toko Maju" });
    removeItem("profile");
    expect(getItem("profile")).toBeNull();
  });

  it("getItem mengembalikan null jika JSON tersimpan korup, bukan melempar error", () => {
    window.localStorage.setItem("kwitansiklik:profile", "{bukan json valid");
    expect(getItem("profile")).toBeNull();
  });

  it("setItem mengembalikan false (bukan melempar error) saat storage diblokir/penuh", () => {
    const setSpy = vi
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    expect(setItem("profile", { businessName: "Toko Maju" })).toBe(false);

    setSpy.mockRestore();
  });
});
