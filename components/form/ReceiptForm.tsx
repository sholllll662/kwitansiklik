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
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M10 2l6 2.5v4c0 3.5-2.5 6.5-6 7.5-3.5-1-6-4-6-7.5v-4L10 2z" />
          <path d="M7.5 10.5l2 2 3.5-3.5" />
        </svg>
        <p>Tanpa akun. Data tidak dikirim ke server.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="flex flex-col gap-4">
          <section className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Profil Penjual
              </p>
              <p
                className={`truncate text-sm font-semibold ${
                  profile.businessName ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                {profile.businessName || "Belum diisi"}
              </p>
            </div>
            <Link
              href="/profil"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              {profile.businessName ? (
                <>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M14.5 2.5a2.121 2.121 0 013 3L6 17H3v-3L14.5 2.5z" />
                  </svg>
                  Ubah
                </>
              ) : (
                "Lengkapi profil"
              )}
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
            className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              {isPreviewOpen ? (
                <>
                  <path d="M2 10s3.5-5.5 8-5.5S18 10 18 10s-3.5 5.5-8 5.5S2 10 2 10z" />
                  <circle cx="10" cy="10" r="2.5" />
                  <line x1="3" y1="3" x2="17" y2="17" />
                </>
              ) : (
                <>
                  <path d="M2 10s3.5-5.5 8-5.5S18 10 18 10s-3.5 5.5-8 5.5S2 10 2 10z" />
                  <circle cx="10" cy="10" r="2.5" />
                </>
              )}
            </svg>
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
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-6">
          <SummaryCard
            totals={totals}
            taxEnabled={taxEnabled}
            taxPercent={Number(taxPercent || 0)}
          />

          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 disabled:opacity-50"
          >
            {!isGenerating ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10 3v11M5 10l5 5 5-5" />
                <path d="M3 17h14" />
              </svg>
            ) : null}
            {isGenerating ? "Menyiapkan PDF…" : "Unduh PDF"}
          </button>

          {downloadSuccess ? (
            <p className="text-center text-sm text-success">
              Kwitansi berhasil diunduh.
            </p>
          ) : null}
          {downloadError ? (
            <p className="text-center text-sm text-destructive">
              {downloadError}
            </p>
          ) : null}

          <div className="flex gap-3 rounded-xl bg-secondary/10 p-4">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="M10 9v5M10 7h.01" />
            </svg>
            <p className="text-xs leading-relaxed text-secondary/80">
              Format PDF dikirim langsung ke perangkat Anda tanpa melalui server
              pihak ketiga untuk privasi maksimal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
