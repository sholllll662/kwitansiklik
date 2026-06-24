"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/pengaturan", label: "Pengaturan" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 pt-6">
      <Link href="/" className="text-lg font-bold tracking-tight">
        KwitansiKlik
      </Link>
      <nav className="flex gap-4 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? "font-semibold"
                : "text-foreground/60 hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
