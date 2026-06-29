"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InstallButton } from "@/components/ui/InstallButton";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/pengaturan", label: "Pengaturan" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6">
      <Link href="/" className="text-lg font-bold tracking-tight text-primary">
        KwitansiKlik
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? "inline-flex h-11 items-center font-semibold text-secondary"
                : "inline-flex h-11 items-center text-muted-foreground hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        ))}
        <InstallButton />
      </nav>
    </header>
  );
}
