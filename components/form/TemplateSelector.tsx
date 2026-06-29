"use client";

import { TEMPLATE_OPTIONS } from "@/components/pdf/templates";
import type { ReceiptTemplateId } from "@/lib/types";

interface TemplateSelectorProps {
  value: ReceiptTemplateId;
  onChange: (id: ReceiptTemplateId) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">Template</h2>
      <div className="flex gap-2">
        {TEMPLATE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={
              value === option.id
                ? "flex-1 rounded-full bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
                : "flex-1 rounded-full border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
