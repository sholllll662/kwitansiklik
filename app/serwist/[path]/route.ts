import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

// Hash repo HEAD sebagai revision; jika git tidak tersedia (mis. build di
// platform tanpa .git), fallback ke uuid acak.
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout?.trim() || crypto.randomUUID();

// Catatan: file di public/ (termasuk public/fonts/*) sudah otomatis
// ter-precache oleh @serwist/turbopack — jangan didaftarkan manual lagi di
// sini, itu menyebabkan "add-to-cache-list-conflicting-entries" karena URL
// yang sama muncul dua kali dengan revision berbeda.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  });
