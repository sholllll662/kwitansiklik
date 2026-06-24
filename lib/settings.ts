import { getItem, setItem } from "@/lib/storage";
import { DEFAULT_NUMBER_FORMAT } from "@/lib/receipt-number";
import type { AppSettings } from "@/lib/types";

const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: AppSettings = {
  defaultTaxPercent: 11,
  numberFormat: DEFAULT_NUMBER_FORMAT,
};

export function getSettings(): AppSettings {
  return getItem<AppSettings>(SETTINGS_KEY) ?? DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  setItem(SETTINGS_KEY, settings);
}
