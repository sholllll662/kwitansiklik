import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/settings";

describe("settings", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mengembalikan DEFAULT_SETTINGS jika belum pernah disimpan", () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("saveSettings menyimpan & getSettings membacanya kembali", () => {
    const custom = {
      defaultTaxPercent: 0,
      numberFormat: "KW-{NNNN}",
      template: "klasik" as const,
    };
    saveSettings(custom);
    expect(getSettings()).toEqual(custom);
  });

  it("mengisi field baru yang hilang dari data lama (migrasi skema)", () => {
    // Simulasikan data tersimpan dari versi lama, sebelum field `template` ada.
    window.localStorage.setItem(
      "kwitansiklik:settings",
      JSON.stringify({ defaultTaxPercent: 8, numberFormat: "OLD/{NNN}" }),
    );
    expect(getSettings()).toEqual({
      defaultTaxPercent: 8,
      numberFormat: "OLD/{NNN}",
      template: "modern",
    });
  });
});
