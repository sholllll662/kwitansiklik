"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallToast() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent>();
  const [visible, setVisible] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function handlePrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      const t = window.setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
    function handleInstalled() {
      setInstallEvent(undefined);
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    window.setTimeout(() => setGone(true), 300);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(undefined);
      setVisible(false);
    }
  }

  if (!installEvent || gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-50 w-[calc(100vw-2.5rem)] max-w-sm -translate-x-1/2 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl bg-secondary px-5 py-4 shadow-2xl">
        <span className="mt-0.5 text-xl leading-none" aria-hidden="true">
          📱
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-secondary-foreground">
            Pasang di perangkatmu
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-secondary-foreground/70">
            Akses offline, lebih cepat, seperti aplikasi asli.
          </p>
          <button
            type="button"
            onClick={install}
            className="mt-3 inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Install Sekarang
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Tutup notifikasi"
          className="shrink-0 rounded-full p-1.5 text-secondary-foreground/50 hover:bg-white/10 hover:text-secondary-foreground"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
