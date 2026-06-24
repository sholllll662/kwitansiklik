"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Tombol "Install" — hanya tampil jika browser menawarkan beforeinstallprompt (Chromium-based; Safari/iOS tidak mendukung event ini sama sekali). */
export function InstallButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent>();

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }
    function handleAppInstalled() {
      setInstallEvent(undefined);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!installEvent) return null;

  async function handleInstall() {
    // Aman: fungsi ini hanya terpasang ke tombol yang dirender setelah guard
    // `if (!installEvent) return null;` di atas.
    await installEvent!.prompt();
    setInstallEvent(undefined);
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      Install
    </button>
  );
}
