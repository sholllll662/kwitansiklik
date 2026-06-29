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
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">Profil Penjual</h2>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
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
      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
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
          <span className="text-xs font-medium text-muted-foreground">
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
        <span className="text-xs font-medium text-muted-foreground">
          Alamat
        </span>
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
