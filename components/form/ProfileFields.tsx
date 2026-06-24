"use client";

import { TEXT_INPUT_CLASS } from "@/components/form/styles";
import type { SellerProfile } from "@/lib/types";

interface ProfileFieldsProps {
  profile: SellerProfile;
  error?: string;
  onChange: (patch: Partial<SellerProfile>) => void;
}

export function ProfileFields({
  profile,
  error,
  onChange,
}: ProfileFieldsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-4">
      <h2 className="text-sm font-semibold text-foreground/80">
        Profil Penjual
      </h2>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/70">
          Nama bisnis *
        </span>
        <input
          type="text"
          value={profile.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          placeholder="mis. Toko Maju Bersama"
          className={TEXT_INPUT_CLASS}
        />
      </label>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground/70">
            Nama pemilik
          </span>
          <input
            type="text"
            value={profile.ownerName ?? ""}
            onChange={(e) => onChange({ ownerName: e.target.value })}
            className={TEXT_INPUT_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground/70">
            No. telp/WA
          </span>
          <input
            type="text"
            value={profile.phone ?? ""}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={TEXT_INPUT_CLASS}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/70">Alamat</span>
        <input
          type="text"
          value={profile.address ?? ""}
          onChange={(e) => onChange({ address: e.target.value })}
          className={TEXT_INPUT_CLASS}
        />
      </label>
    </section>
  );
}
