"use client";

import type { CalcResult } from "@/lib/calc";
import { formatRupiah } from "@/lib/format";

interface SummaryCardProps {
  totals: CalcResult;
  taxEnabled?: boolean;
  taxPercent?: number;
}

export function SummaryCard({ totals, taxEnabled, taxPercent }: SummaryCardProps) {
  return (
    <section className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span className="tabular-nums">{formatRupiah(totals.subtotal)}</span>
      </div>
      {totals.discountAmount > 0 ? (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Diskon</span>
          <span className="tabular-nums">
            -{formatRupiah(totals.discountAmount)}
          </span>
        </div>
      ) : null}
      {taxEnabled ? (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>PPN ({taxPercent ?? 0}%)</span>
          <span className="tabular-nums">{formatRupiah(totals.taxAmount)}</span>
        </div>
      ) : null}
      <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
        <span className="text-base font-semibold">Total</span>
        <span className="tabular-nums text-2xl font-bold text-primary">
          {formatRupiah(totals.total)}
        </span>
      </div>
    </section>
  );
}
