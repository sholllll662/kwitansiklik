import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Kamu sedang offline</h1>
      <p className="text-sm text-muted-foreground">
        Halaman ini belum pernah dibuka sebelumnya sehingga tidak tersimpan
        untuk mode offline. Buka kembali saat online, atau kembali ke halaman
        yang sudah pernah dibuka.
      </p>
    </div>
  );
}
