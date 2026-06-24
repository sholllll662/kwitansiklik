"use client";

import { useEffect, useState } from "react";
import { ModernTemplate } from "@/components/pdf/ModernTemplate";
import { downloadPdfDocument } from "@/components/pdf/download";
import { TEXT_INPUT_CLASS } from "@/components/form/styles";
import { calculateTotal } from "@/lib/calc";
import { formatDate, formatRupiah } from "@/lib/format";
import { getProfile } from "@/lib/profile";
import { deleteReceipt, getReceipts } from "@/lib/receipts";
import type { Receipt } from "@/lib/types";

function sanitizeFilename(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "-");
}

export default function RiwayatPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [query, setQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string>();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReceipts(getReceipts());
  }, []);

  const filtered = receipts.filter((receipt) => {
    const haystack =
      `${receipt.number} ${receipt.buyerName ?? ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  async function handleRedownload(receipt: Receipt) {
    setDownloadingId(receipt.id);
    try {
      const profile = getProfile() ?? { businessName: "" };
      await downloadPdfDocument(
        <ModernTemplate profile={profile} receipt={receipt} />,
        `kwitansi-${sanitizeFilename(receipt.number)}.pdf`,
      );
    } finally {
      setDownloadingId(undefined);
    }
  }

  function handleDelete(id: string) {
    if (!window.confirm("Hapus kwitansi ini dari riwayat?")) return;
    deleteReceipt(id);
    setReceipts(getReceipts());
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <p className="text-sm text-foreground/60">
        Riwayat tersimpan lokal di perangkat ini, satu daftar per browser.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari nomor atau nama pembeli…"
        className={TEXT_INPUT_CLASS}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-foreground/60">
          {receipts.length === 0
            ? "Belum ada riwayat kwitansi."
            : "Tidak ada kwitansi yang cocok."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((receipt) => {
            const total = calculateTotal({
              items: receipt.items,
              discount: receipt.discount,
              taxPercent: receipt.taxPercent,
            }).total;

            return (
              <div
                key={receipt.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {receipt.number}
                  </p>
                  <p className="truncate text-xs text-foreground/60">
                    {formatDate(receipt.date)}
                    {receipt.buyerName ? ` · ${receipt.buyerName}` : ""}
                  </p>
                  <p className="text-sm font-semibold">{formatRupiah(total)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRedownload(receipt)}
                    disabled={downloadingId === receipt.id}
                    className="inline-flex h-11 items-center rounded-full border border-foreground/15 px-3 text-xs font-medium hover:bg-foreground/5 disabled:opacity-50"
                  >
                    {downloadingId === receipt.id ? "…" : "Unduh"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(receipt.id)}
                    className="inline-flex h-11 items-center rounded-full border border-foreground/15 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
