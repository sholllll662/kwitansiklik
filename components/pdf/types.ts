import type { Receipt, SellerProfile } from "@/lib/types";

export interface ReceiptTemplateProps {
  profile: SellerProfile;
  receipt: Receipt;
}
