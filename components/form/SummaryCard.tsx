"use client";

import type { CalcResult } from "@/lib/calc";
import { formatRupiah } from "@/lib/format";

interface SummaryCardProps {
  totals: CalcResult;
}

export function SummaryCard({ totals }: SummaryCardProps) {
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
      {totals.taxAmount > 0 ? (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>PPN</span>
          <span className="tabular-nums">{formatRupiah(totals.taxAmount)}</span>
        </div>
      ) : null}
      <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{formatRupiah(totals.total)}</span>
      </div>
    </section>
  );
}
