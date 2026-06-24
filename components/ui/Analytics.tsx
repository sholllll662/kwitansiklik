import Script from "next/script";

/**
 * Plausible Analytics — opt-in lewat env var, no-op kalau tidak diisi.
 * Tanpa cookie, tidak melacak data pribadi; selaras dengan nilai privasi proyek ini.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
