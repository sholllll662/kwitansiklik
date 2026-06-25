import Script from "next/script";

/**
 * Plausible Analytics — opt-in lewat env var, no-op kalau tidak diisi.
 * Tanpa cookie, tidak melacak data pribadi; selaras dengan nilai privasi proyek ini.
 *
 * Pakai format embed terbaru Plausible: satu script unik per situs (bukan
 * script.js generik + data-domain) + pemanggilan plausible.init() terpisah.
 */
export function Analytics() {
  const scriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;
  if (!scriptUrl) return null;

  return (
    <>
      <Script async src={scriptUrl} />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
      </Script>
    </>
  );
}
