"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Ada yang tidak beres</h1>
      <p className="text-sm text-foreground/60">
        Terjadi kesalahan saat memuat halaman ini. Data kamu aman — coba muat
        ulang.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Coba lagi
      </button>
    </div>
  );
}
