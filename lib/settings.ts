import { getItem, setItem } from "@/lib/storage";
import { DEFAULT_NUMBER_FORMAT } from "@/lib/receipt-number";
import type { AppSettings } from "@/lib/types";

const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: AppSettings = {
  defaultTaxPercent: 11,
  numberFormat: DEFAULT_NUMBER_FORMAT,
  template: "modern",
};

/** Digabung dengan default — settings lama yang tersimpan tanpa field baru tetap valid. */
export function getSettings(): AppSettings {
  const stored = getItem<Partial<AppSettings>>(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings: AppSettings): void {
  setItem(SETTINGS_KEY, settings);
}
