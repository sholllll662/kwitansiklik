"use client";

import { usePDF } from "@react-pdf/renderer";
import { ModernTemplate } from "@/components/pdf/ModernTemplate";
import { sampleReceipt, sampleSellerProfile } from "@/lib/sample-data";

export function DownloadModernSample() {
  const [instance] = usePDF({
    document: (
      <ModernTemplate profile={sampleSellerProfile} receipt={sampleReceipt} />
    ),
  });

  if (instance.error) {
    return (
      <p className="text-sm text-red-600">
        Gagal membuat PDF: {instance.error}
      </p>
    );
  }

  return (
    <a
      href={instance.url ?? undefined}
      download="contoh-kwitansi-kwitansiklik.pdf"
      aria-disabled={instance.loading}
      className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:hover:bg-[#ccc]"
    >
      {instance.loading ? "Menyiapkan PDF…" : "Unduh Contoh Kwitansi (PDF)"}
    </a>
  );
}
