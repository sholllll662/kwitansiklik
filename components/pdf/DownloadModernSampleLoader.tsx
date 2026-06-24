"use client";

import dynamic from "next/dynamic";

// usePDF (react-pdf) memakai API khusus browser (Blob/URL) — tidak bisa
// di-render di server. Muat hanya di client, lewati prerender statis.
const DownloadModernSample = dynamic(
  () =>
    import("@/components/pdf/DownloadModernSample").then(
      (mod) => mod.DownloadModernSample,
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background opacity-50">
        Menyiapkan PDF…
      </span>
    ),
  },
);

export function DownloadModernSampleLoader() {
  return <DownloadModernSample />;
}
