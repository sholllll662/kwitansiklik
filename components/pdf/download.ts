import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

/** Render dokumen react-pdf -> blob -> trigger unduh di browser. */
export async function downloadPdfDocument(
  documentElement: ReactElement<DocumentProps>,
  filename: string,
): Promise<void> {
  const blob = await pdf(documentElement).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
