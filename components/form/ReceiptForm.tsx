"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DiscountTaxFields } from "@/components/form/DiscountTaxFields";
import { ItemsSection } from "@/components/form/ItemsSection";
import { ReceiptMetaFields } from "@/components/form/ReceiptMetaFields";
import { SummaryCard } from "@/components/form/SummaryCard";
import { TemplateSelector } from "@/components/form/TemplateSelector";
import {
  createEmptyItemDraft,
  type DiscountType,
  type ItemDraft,
} from "@/components/form/types";
import { downloadPdfDocument } from "@/components/pdf/download";
import { PdfPreview } from "@/components/pdf/PdfPreview";
import { TEMPLATE_COMPONENTS } from "@/components/pdf/templates";
import { trackEvent } from "@/lib/analytics";
import { calculateTotal } from "@/lib/calc";
import { todayIsoDate } from "@/lib/format";
import { getProfile } from "@/lib/profile";
import {
  formatReceiptNumber,
  getCurrentCounter,
  incrementCounter,
} from "@/lib/receipt-number";
import { saveReceipt } from "@/lib/receipts";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/settings";
import type {
  AppSettings,
  Receipt,
  ReceiptItem,
  ReceiptTemplateId,
  SellerProfile,
} from "@/lib/types";

function peekNextNumber(format: string): string {
  return formatReceiptNumber(format, new Date(), getCurrentCounter() + 1);
}

function sanitizeFilename(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "-");
}

export function ReceiptForm() {
  const [profile, setProfile] = useState<SellerProfile>({ businessName: "" });
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<ItemDraft[]>([createEmptyItemDraft()]);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxPercent, setTaxPercent] = useState(
    String(DEFAULT_SETTINGS.defaultTaxPercent),
  );

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

  // Nilai-nilai ini bergantung pada localStorage/jam perangkat — beda antara
  // render server & client, jadi sengaja ditunda ke effect (bukan lazy
  // initializer) supaya tidak terjadi hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const loadedSettings = getSettings();
    const loadedProfile = getProfile();
    setSettings(loadedSettings);
    setNumber(peekNextNumber(loadedSettings.numberFormat));
    setDate(todayIsoDate());
    setTaxPercent(String(loadedSettings.defaultTaxPercent));
    if (loadedProfile) setProfile(loadedProfile);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const totals = calculateTotal({
    items: items.map((item) => ({
      qty: Number(item.qty || 0),
      unitPrice: Number(item.unitPrice || 0),
    })),
    discount:
      discountType === "none"
        ? undefined
        : { type: discountType, value: Number(discountValue || 0) },
    taxPercent: taxEnabled ? Number(taxPercent || 0) : undefined,
  });

  // Dihitung ulang setiap render dari state saat ini (bukan disimpan di state
  // sendiri) supaya pesan error selalu sinkron begitu user membenahi input —
  // tidak nyangkut basi sampai submit berikutnya.
  const itemErrors: Record<string, string> = {};
  for (const item of items) {
    const qty = Number(item.qty || 0);
    const price = Number(item.unitPrice || 0);
    if (!item.name.trim()) {
      itemErrors[item.id] = "Nama item wajib diisi";
    } else if (qty <= 0) {
      itemErrors[item.id] = "Qty harus lebih dari 0";
    } else if (price <= 0) {
      itemErrors[item.id] = "Harga harus lebih dari 0";
    }
  }
  const businessNameError = profile.businessName.trim()
    ? undefined
    : "Lengkapi profil penjual (nama bisnis) dulu";
  const itemsGeneralError =
    items.length === 0 ? "Tambahkan minimal 1 item" : undefined;
  const isValid =
    !businessNameError &&
    !itemsGeneralError &&
    Object.keys(itemErrors).length === 0;

  function buildReceiptDraft(): Receipt {
    const receiptItems: ReceiptItem[] = items.map((item) => ({
      id: item.id,
      name: item.name.trim(),
      qty: Number(item.qty || 0),
      unitPrice: Number(item.unitPrice || 0),
    }));

    return {
      id: crypto.randomUUID(),
      number: number || peekNextNumber(settings.numberFormat),
      date: date || todayIsoDate(),
      buyerName: buyerName.trim() || undefined,
      items: receiptItems,
      discount:
        discountType === "none"
          ? undefined
          : { type: discountType, value: Number(discountValue || 0) },
      taxPercent: taxEnabled ? Number(taxPercent || 0) : undefined,
      createdAt: new Date().toISOString(),
    };
  }

  function handleTemplateChange(id: ReceiptTemplateId) {
    const next = { ...settings, template: id };
    setSettings(next);
    saveSettings(next);
  }

  // Sengaja TIDAK depend pada setiap field form (item/profil/dll) — pratinjau
  // hanya regenerasi saat ganti template, buka/tutup, atau klik "Perbarui"
  // secara eksplisit. Regenerasi PDF di setiap keystroke terlalu berat untuk
  // HP kelas menengah.
  const previewDocument = useMemo(() => {
    const Template = TEMPLATE_COMPONENTS[settings.template];
    return <Template profile={profile} receipt={buildReceiptDraft()} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.template, isPreviewOpen, previewVersion]);

  async function handleDownload() {
    setDownloadSuccess(false);
    setDownloadError(undefined);
    setHasAttemptedSubmit(true);

    if (!isValid) return;

    const receipt = buildReceiptDraft();
    const Template = TEMPLATE_COMPONENTS[settings.template];

    setIsGenerating(true);
    try {
      await downloadPdfDocument(
        <Template profile={profile} receipt={receipt} />,
        `kwitansi-${sanitizeFilename(receipt.number)}.pdf`,
      );
      incrementCounter();
      saveReceipt(receipt);
      trackEvent("Kwitansi Diunduh", { template: settings.template });
      setNumber(peekNextNumber(settings.numberFormat));
      setDownloadSuccess(true);
    } catch {
      setDownloadError("Gagal membuat PDF. Coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <p className="text-sm text-muted-foreground">
        Tanpa akun. Data tidak dikirim ke server.
      </p>

      <section className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Profil Penjual</p>
          <p className="truncate text-sm font-medium">
            {profile.businessName || "Belum diisi"}
          </p>
        </div>
        <Link
          href="/profil"
          className="inline-flex h-11 shrink-0 items-center rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          {profile.businessName ? "Ubah" : "Lengkapi profil"}
        </Link>
      </section>
      {hasAttemptedSubmit && businessNameError ? (
        <p className="text-xs text-destructive">{businessNameError}</p>
      ) : null}

      <ReceiptMetaFields
        number={number}
        date={date}
        buyerName={buyerName}
        numberFormat={settings.numberFormat}
        onNumberChange={setNumber}
        onDateChange={setDate}
        onBuyerNameChange={setBuyerName}
      />

      <ItemsSection
        items={items}
        errors={hasAttemptedSubmit ? itemErrors : {}}
        generalError={hasAttemptedSubmit ? itemsGeneralError : undefined}
        onChange={setItems}
      />

      <DiscountTaxFields
        discountType={discountType}
        discountValue={discountValue}
        taxEnabled={taxEnabled}
        taxPercent={taxPercent}
        onDiscountTypeChange={setDiscountType}
        onDiscountValueChange={setDiscountValue}
        onTaxEnabledChange={setTaxEnabled}
        onTaxPercentChange={setTaxPercent}
      />

      <TemplateSelector
        value={settings.template}
        onChange={handleTemplateChange}
      />

      <button
        type="button"
        onClick={() => setIsPreviewOpen((prev) => !prev)}
        className="inline-flex h-11 items-center self-start rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
      >
        {isPreviewOpen ? "Tutup Pratinjau" : "Lihat Pratinjau"}
      </button>

      {isPreviewOpen ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPreviewVersion((v) => v + 1)}
            className="self-end py-2 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Perbarui pratinjau dengan data terbaru
          </button>
          <PdfPreview document={previewDocument} />
        </div>
      ) : null}

      <SummaryCard totals={totals} />

      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="h-12 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isGenerating ? "Menyiapkan PDF…" : "Unduh PDF"}
      </button>

      {downloadSuccess ? (
        <p className="text-center text-sm text-success">
          Kwitansi berhasil diunduh.
        </p>
      ) : null}
      {downloadError ? (
        <p className="text-center text-sm text-destructive">{downloadError}</p>
      ) : null}
    </div>
  );
}
