import { ReceiptForm } from "@/components/form/ReceiptForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Kwitansi",
};

export default function BuatPage() {
  return <ReceiptForm />;
}
