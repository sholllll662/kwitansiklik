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
    <div className="rounded-xl border border-foreground/10 p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(item.id, { name: e.target.value })}
          placeholder={`Nama item ${index + 1}`}
          aria-label={`Nama item ${index + 1}`}
          className="min-w-0 flex-1 rounded border-b border-foreground/15 bg-transparent pb-1 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-[#2563EB]/30"
        />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Hapus item ${index + 1}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/5 hover:text-red-600"
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
        <span className="text-foreground/60">Subtotal item</span>
        <span className="font-medium">{formatRupiah(lineTotal)}</span>
      </div>

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
