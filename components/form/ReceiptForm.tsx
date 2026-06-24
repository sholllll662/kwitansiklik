"use client";

import { useEffect, useState } from "react";
import { DiscountTaxFields } from "@/components/form/DiscountTaxFields";
import { ItemsSection } from "@/components/form/ItemsSection";
import { ProfileFields } from "@/components/form/ProfileFields";
import { ReceiptMetaFields } from "@/components/form/ReceiptMetaFields";
import { SummaryCard } from "@/components/form/SummaryCard";
import {
  createEmptyItemDraft,
  type DiscountType,
  type ItemDraft,
} from "@/components/form/types";
import { downloadPdfDocument } from "@/components/pdf/download";
import { ModernTemplate } from "@/components/pdf/ModernTemplate";
import { calculateTotal } from "@/lib/calc";
import { todayIsoDate } from "@/lib/format";
import {
  DEFAULT_NUMBER_FORMAT,
  formatReceiptNumber,
  getCurrentCounter,
  incrementCounter,
} from "@/lib/receipt-number";
import type { Receipt, ReceiptItem, SellerProfile } from "@/lib/types";

function peekNextNumber(): string {
  return formatReceiptNumber(
    DEFAULT_NUMBER_FORMAT,
    new Date(),
    getCurrentCounter() + 1,
  );
}

function sanitizeFilename(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "-");
}

export function ReceiptForm() {
  const [profile, setProfile] = useState<SellerProfile>({ businessName: "" });
  const [items, setItems] = useState<ItemDraft[]>([createEmptyItemDraft()]);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxPercent, setTaxPercent] = useState("11");

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string>();

  // Nilai-nilai ini bergantung pada localStorage/jam perangkat — beda antara
  // render server & client, jadi sengaja ditunda ke effect (bukan lazy
  // initializer) supaya tidak terjadi hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNumber(peekNextNumber());
    setDate(todayIsoDate());
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
    : "Nama bisnis wajib diisi";
  const itemsGeneralError =
    items.length === 0 ? "Tambahkan minimal 1 item" : undefined;
  const isValid =
    !businessNameError &&
    !itemsGeneralError &&
    Object.keys(itemErrors).length === 0;

  async function handleDownload() {
    setDownloadSuccess(false);
    setDownloadError(undefined);
    setHasAttemptedSubmit(true);

    if (!isValid) return;

    const receiptItems: ReceiptItem[] = items.map((item) => ({
      id: item.id,
      name: item.name.trim(),
      qty: Number(item.qty || 0),
      unitPrice: Number(item.unitPrice || 0),
    }));

    const receipt: Receipt = {
      id: crypto.randomUUID(),
      number: number || peekNextNumber(),
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

    setIsGenerating(true);
    try {
      await downloadPdfDocument(
        <ModernTemplate profile={profile} receipt={receipt} />,
        `kwitansi-${sanitizeFilename(receipt.number)}.pdf`,
      );
      incrementCounter();
      setNumber(peekNextNumber());
      setDownloadSuccess(true);
    } catch {
      setDownloadError("Gagal membuat PDF. Coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">KwitansiKlik</h1>
        <p className="text-sm text-foreground/60">
          Tanpa akun. Data tidak dikirim ke server.
        </p>
      </header>

      <ProfileFields
        profile={profile}
        error={hasAttemptedSubmit ? businessNameError : undefined}
        onChange={(patch) => setProfile((prev) => ({ ...prev, ...patch }))}
      />

      <ReceiptMetaFields
        number={number}
        date={date}
        buyerName={buyerName}
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

      <SummaryCard totals={totals} />

      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="h-12 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {isGenerating ? "Menyiapkan PDF…" : "Unduh PDF"}
      </button>

      {downloadSuccess ? (
        <p className="text-center text-sm text-green-600">
          Kwitansi berhasil diunduh.
        </p>
      ) : null}
      {downloadError ? (
        <p className="text-center text-sm text-red-600">{downloadError}</p>
      ) : null}
    </div>
  );
}
