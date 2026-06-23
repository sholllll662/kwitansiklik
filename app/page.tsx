export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium tracking-wide text-foreground/60">
        🚧 Dalam pengembangan · MVP Fase 0
      </span>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        KwitansiKlik
      </h1>

      <p className="max-w-md text-lg leading-relaxed text-foreground/70">
        Buat kwitansi profesional dalam hitungan detik —{" "}
        <span className="font-semibold text-foreground">
          tanpa perlu daftar akun
        </span>
        . Gratis, open source, dan jalan sepenuhnya di browser kamu.
      </p>

      <p className="text-sm text-foreground/50">
        Segera hadir. Pantau perkembangannya.
      </p>
    </main>
  );
}
