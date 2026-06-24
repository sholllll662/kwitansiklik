import { beforeEach, describe, expect, it } from "vitest";
import { getProfile, saveProfile } from "@/lib/profile";

describe("profile", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mengembalikan null jika belum pernah disimpan", () => {
    expect(getProfile()).toBeNull();
  });

  it("saveProfile menyimpan & getProfile membacanya kembali", () => {
    const profile = { businessName: "Toko Maju Bersama", phone: "0812" };
    saveProfile(profile);
    expect(getProfile()).toEqual(profile);
  });
});
