"use client";

import { TEMPLATE_OPTIONS } from "@/components/pdf/templates";
import type { ReceiptTemplateId } from "@/lib/types";

interface TemplateSelectorProps {
  value: ReceiptTemplateId;
  onChange: (id: ReceiptTemplateId) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-foreground/10 p-4">
      <h2 className="text-sm font-semibold text-foreground/80">Template</h2>
      <div className="flex gap-2">
        {TEMPLATE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={
              value === option.id
                ? "flex-1 rounded-full bg-foreground px-3 py-2 text-sm font-medium text-background"
                : "flex-1 rounded-full border border-foreground/15 px-3 py-2 text-sm font-medium hover:bg-foreground/5"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
