"use client";

import { useState } from "react";
import { compressImageToBase64 } from "@/lib/image";

interface LogoUploadProps {
  logoBase64?: string;
  onChange: (logoBase64: string | undefined) => void;
}

export function LogoUpload({ logoBase64, onChange }: LogoUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>();

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG/JPG).");
      return;
    }

    setError(undefined);
    setIsProcessing(true);
    try {
      const compressed = await compressImageToBase64(file);
      onChange(compressed);
    } catch {
      setError("Gagal memproses gambar. Coba file lain.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground/70">
        Logo (opsional)
      </span>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-foreground/15 bg-foreground/5">
          {logoBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element -- base64 lokal, bukan aset yang perlu dioptimasi next/image
            <img
              src={logoBase64}
              alt="Logo bisnis"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-foreground/40">Tanpa logo</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="cursor-pointer rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium hover:bg-foreground/5">
            {isProcessing
              ? "Memproses…"
              : logoBase64
                ? "Ganti logo"
                : "Unggah logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isProcessing}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {logoBase64 ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-xs text-red-600 hover:underline"
            >
              Hapus logo
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
