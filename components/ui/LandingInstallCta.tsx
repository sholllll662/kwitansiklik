"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function LandingInstallCta() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent>();
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return;

    // iOS Safari detection: no Chrome/Firefox, has touch, iOS UA
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)) {
      setIsIos(true);
    }

    function handlePrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setInstallEvent(undefined);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(undefined);
  }

  return (
    <section className="bg-secondary py-20 text-center">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-secondary-foreground lg:text-4xl">
          Siap bikin kwitansi pertamamu?{" "}
          <span aria-hidden="true">🚀</span>
        </h2>
        <p className="mt-4 text-secondary-foreground/80 lg:text-lg">
          Langsung pakai di browser — tidak perlu install, tidak perlu daftar.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/buat"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          >
            Mulai Sekarang — Gratis!
          </Link>

          {/* Install CTA — tampil di HP jika browser mendukung */}
          {installEvent ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={install}
                className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/25 px-5 py-2.5 text-sm font-medium text-secondary-foreground/80 transition-colors hover:border-secondary-foreground/50 hover:text-secondary-foreground"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="4" y="1" width="12" height="18" rx="2" />
                  <path d="M8 17h4" />
                </svg>
                Pasang di HP / PC untuk akses offline
              </button>
              <p className="text-xs text-secondary-foreground/50">
                Bekerja tanpa internet, lebih cepat seperti aplikasi asli
              </p>
            </div>
          ) : isIos ? (
            <div className="rounded-2xl border border-secondary-foreground/15 bg-white/5 px-6 py-4 text-left">
              <p className="text-sm font-semibold text-secondary-foreground">
                📱 Pakai di iPhone atau iPad?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary-foreground/70">
                Ketuk{" "}
                <span className="font-semibold text-secondary-foreground/90">
                  Bagikan
                </span>{" "}
                (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline h-3.5 w-3.5 align-text-top"
                  aria-label="ikon bagikan"
                >
                  <path d="M10 2v11M5 7l5-5 5 5" />
                  <path d="M3 15v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
                </svg>
                ) di Safari, lalu pilih{" "}
                <span className="font-semibold text-secondary-foreground/90">
                  Tambah ke Layar Utama
                </span>{" "}
                untuk pasang KwitansiKlik di HP kamu.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
