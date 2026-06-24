"use client";

import { ItemRow } from "@/components/form/ItemRow";
import { createEmptyItemDraft, type ItemDraft } from "@/components/form/types";

interface ItemsSectionProps {
  items: ItemDraft[];
  errors: Record<string, string>;
  generalError?: string;
  onChange: (items: ItemDraft[]) => void;
}

export function ItemsSection({
  items,
  errors,
  generalError,
  onChange,
}: ItemsSectionProps) {
  function updateItem(id: string, patch: Partial<ItemDraft>) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, createEmptyItemDraft()]);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground/80">Item</h2>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            error={errors[item.id]}
            onChange={updateItem}
            onRemove={removeItem}
          />
        ))}
      </div>

      {generalError ? (
        <p className="text-xs text-red-600">{generalError}</p>
      ) : null}

      <button
        type="button"
        onClick={addItem}
        className="self-start rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium hover:bg-foreground/5"
      >
        + Tambah Item
      </button>
    </section>
  );
}
