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
    const custom = { defaultTaxPercent: 0, numberFormat: "KW-{NNNN}" };
    saveSettings(custom);
    expect(getSettings()).toEqual(custom);
  });
});
