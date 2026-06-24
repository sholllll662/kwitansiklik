"use client";

import { NumericTextField } from "@/components/form/NumericTextField";
import type { DiscountType } from "@/components/form/types";

interface DiscountTaxFieldsProps {
  discountType: DiscountType;
  discountValue: string;
  taxEnabled: boolean;
  taxPercent: string;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: string) => void;
  onTaxEnabledChange: (enabled: boolean) => void;
  onTaxPercentChange: (value: string) => void;
}

export function DiscountTaxFields({
  discountType,
  discountValue,
  taxEnabled,
  taxPercent,
  onDiscountTypeChange,
  onDiscountValueChange,
  onTaxEnabledChange,
  onTaxPercentChange,
}: DiscountTaxFieldsProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-foreground/10 p-4">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground/80">
          Diskon
        </h2>
        <div className="flex items-end gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/70">
              Jenis
            </span>
            <select
              value={discountType}
              onChange={(e) =>
                onDiscountTypeChange(e.target.value as DiscountType)
              }
              className="rounded-lg border border-foreground/15 px-3 py-2 text-sm outline-none focus:border-foreground/40"
            >
              <option value="none">Tidak ada</option>
              <option value="percent">Persen (%)</option>
              <option value="amount">Nominal (Rp)</option>
            </select>
          </label>
          {discountType !== "none" ? (
            <NumericTextField
              value={discountValue}
              onChange={onDiscountValueChange}
              prefix={discountType === "amount" ? "Rp" : undefined}
              placeholder="0"
              className="flex-1"
              aria-label="Nilai diskon"
            />
          ) : null}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => onTaxEnabledChange(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-foreground/80">PPN</span>
        </label>
        {taxEnabled ? (
          <div className="mt-2">
            <NumericTextField
              value={taxPercent}
              onChange={onTaxPercentChange}
              placeholder="11"
              aria-label="Persen PPN"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
