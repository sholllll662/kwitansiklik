"use client";

import { NumericTextField } from "@/components/form/NumericTextField";
import type { ItemDraft } from "@/components/form/types";
import { formatRupiah } from "@/lib/format";

interface ItemRowProps {
  item: ItemDraft;
  index: number;
  error?: string;
  onChange: (id: string, patch: Partial<ItemDraft>) => void;
  onRemove: (id: string) => void;
}

export function ItemRow({
  item,
  index,
  error,
  onChange,
  onRemove,
}: ItemRowProps) {
  const lineTotal = Number(item.qty || 0) * Number(item.unitPrice || 0);

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(item.id, { name: e.target.value })}
          placeholder={`Nama item ${index + 1}`}
          aria-label={`Nama item ${index + 1}`}
          className="min-w-0 flex-1 rounded border-b border-border bg-transparent pb-1 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
        />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Hapus item ${index + 1}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <NumericTextField
          label="Qty"
          value={item.qty}
          onChange={(v) => onChange(item.id, { qty: v })}
          placeholder="1"
        />
        <NumericTextField
          label="Harga satuan"
          value={item.unitPrice}
          onChange={(v) => onChange(item.id, { unitPrice: v })}
          placeholder="0"
          prefix="Rp"
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal item</span>
        <span className="font-medium tabular-nums">
          {formatRupiah(lineTotal)}
        </span>
      </div>

      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
