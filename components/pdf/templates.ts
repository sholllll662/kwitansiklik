import type { ComponentType } from "react";
import { KlasikTemplate } from "@/components/pdf/KlasikTemplate";
import { MinimalisTemplate } from "@/components/pdf/MinimalisTemplate";
import { ModernTemplate } from "@/components/pdf/ModernTemplate";
import type { ReceiptTemplateProps } from "@/components/pdf/types";
import type { ReceiptTemplateId } from "@/lib/types";

export const TEMPLATE_COMPONENTS: Record<
  ReceiptTemplateId,
  ComponentType<ReceiptTemplateProps>
> = {
  modern: ModernTemplate,
  klasik: KlasikTemplate,
  minimalis: MinimalisTemplate,
};

export const TEMPLATE_OPTIONS: { id: ReceiptTemplateId; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "klasik", label: "Klasik" },
  { id: "minimalis", label: "Minimalis" },
];
