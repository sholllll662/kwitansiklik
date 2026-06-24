export interface CompressImageOptions {
  maxDimension?: number;
  maxBytes?: number;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(reader.error ?? new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar"));
    img.src = src;
  });
}

function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.ceil((base64.length * 3) / 4);
}

/**
 * Resize gambar ke maks maxDimension x maxDimension (jaga aspect ratio,
 * tidak upscale) lalu kompres ke bawah maxBytes. Coba PNG dulu (jaga
 * transparansi logo); kalau masih kebesaran (mis. logo berupa foto),
 * fallback ke JPEG dengan quality menurun.
 */
export async function compressImageToBase64(
  file: File,
  { maxDimension = 200, maxBytes = 50 * 1024 }: CompressImageOptions = {},
): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context tidak tersedia");
  ctx.drawImage(img, 0, 0, width, height);

  const pngOutput = canvas.toDataURL("image/png");
  if (estimateBase64Bytes(pngOutput) <= maxBytes) return pngOutput;

  let quality = 0.85;
  let jpegOutput = canvas.toDataURL("image/jpeg", quality);
  while (estimateBase64Bytes(jpegOutput) > maxBytes && quality > 0.3) {
    quality -= 0.15;
    jpegOutput = canvas.toDataURL("image/jpeg", quality);
  }
  return jpegOutput;
}
