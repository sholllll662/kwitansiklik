"use client";

import { useEffect, useState } from "react";
import { NumericTextField } from "@/components/form/NumericTextField";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/settings";
import type { AppSettings } from "@/lib/types";

export default function PengaturanPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [taxPercentInput, setTaxPercentInput] = useState(
    String(DEFAULT_SETTINGS.defaultTaxPercent),
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(existing);
    setTaxPercentInput(String(existing.defaultTaxPercent));
  }, []);

  function handleSave() {
    const next: AppSettings = {
      ...settings,
      defaultTaxPercent: Number(taxPercentInput || 0),
      numberFormat: settings.numberFormat,
    };
    saveSettings(next);
    setSettings(next);
    setSaved(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <p className="text-sm text-foreground/60">
        Pengaturan ini dipakai sebagai default saat membuat kwitansi baru.
        Disimpan lokal di perangkat ini.
      </p>

      <section className="flex flex-col gap-4 rounded-xl border border-foreground/10 p-4">
        <NumericTextField
          label="PPN default (%)"
          value={taxPercentInput}
          onChange={setTaxPercentInput}
          placeholder="11"
        />

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground/70">
            Format nomor kwitansi
          </span>
          <input
            type="text"
            value={settings.numberFormat}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, numberFormat: e.target.value }))
            }
            className="rounded-lg border border-foreground/15 px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
          <span className="text-[11px] text-foreground/40">
            Placeholder: {"{YYYY}"} {"{YY}"} {"{MM}"} {"{DD}"} dan {"{NNN}"}{" "}
            (jumlah N = lebar padding nol)
          </span>
        </label>

        <p className="text-xs text-foreground/40">
          Mata uang: IDR — dukungan multi-mata uang direncanakan di versi
          mendatang.
        </p>
      </section>

      <button
        type="button"
        onClick={handleSave}
        className="h-12 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Simpan Pengaturan
      </button>

      {saved ? (
        <p className="text-center text-sm text-green-600">
          Pengaturan tersimpan.
        </p>
      ) : null}
    </div>
  );
}
