"use client";

import { useEffect, useState } from "react";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

interface PdfPreviewProps {
  document: ReactElement<DocumentProps>;
}

/** Render dokumen react-pdf -> blob -> tampilkan di iframe. Regenerasi hanya saat prop `document` berganti referensi (dikontrol oleh pemanggil, bukan setiap keystroke). */
export function PdfPreview({ document }: PdfPreviewProps) {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi dengan API browser (Blob/URL), bukan derived state
    setLoading(true);
    pdf(document)
      .toBlob()
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document]);

  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10">
      {loading || !url ? (
        <div className="flex h-[500px] items-center justify-center text-sm text-foreground/60">
          Memuat pratinjau…
        </div>
      ) : (
        <iframe
          src={url}
          className="h-[500px] w-full"
          title="Pratinjau kwitansi"
        />
      )}
    </div>
  );
}
