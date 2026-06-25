declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

/**
 * Kirim custom event ke Plausible (kalau aktif). No-op total kalau Plausible
 * tidak dimuat (NEXT_PUBLIC_PLAUSIBLE_DOMAIN tidak diisi) — tidak pernah throw.
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  window.plausible?.(eventName, props ? { props } : undefined);
}
