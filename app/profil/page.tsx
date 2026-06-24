"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoUpload } from "@/components/form/LogoUpload";
import { ProfileFields } from "@/components/form/ProfileFields";
import { getProfile, saveProfile } from "@/lib/profile";
import type { SellerProfile } from "@/lib/types";

export default function ProfilPage() {
  const [profile, setProfile] = useState<SellerProfile>({ businessName: "" });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [saved, setSaved] = useState(false);

  // localStorage hanya tersedia di client — muat setelah mount, bukan lewat
  // lazy initializer, supaya tidak terjadi hydration mismatch.
  useEffect(() => {
    const existing = getProfile();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (existing) setProfile(existing);
  }, []);

  const businessNameError = profile.businessName.trim()
    ? undefined
    : "Nama bisnis wajib diisi";

  function handleSave() {
    setHasAttemptedSubmit(true);
    setSaved(false);
    if (businessNameError) return;
    saveProfile(profile);
    setSaved(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <p className="text-sm text-foreground/60">
        Profil dipakai untuk mengisi otomatis kepala kwitansi. Disimpan{" "}
        <strong>lokal di perangkat ini</strong> (localStorage) — bukan di cloud,
        dan akan hilang jika kamu membersihkan data browser.
      </p>

      <ProfileFields
        profile={profile}
        error={hasAttemptedSubmit ? businessNameError : undefined}
        onChange={(patch) => setProfile((prev) => ({ ...prev, ...patch }))}
      />

      <div className="rounded-xl border border-foreground/10 p-4">
        <LogoUpload
          logoBase64={profile.logoBase64}
          onChange={(logoBase64) =>
            setProfile((prev) => ({ ...prev, logoBase64 }))
          }
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="h-12 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Simpan Profil
      </button>

      {saved ? (
        <p className="text-center text-sm text-green-600">
          Profil tersimpan.{" "}
          <Link href="/" className="underline">
            Kembali ke form kwitansi
          </Link>
        </p>
      ) : null}
    </div>
  );
}
