import { getItem, setItem } from "@/lib/storage";
import type { SellerProfile } from "@/lib/types";

const PROFILE_KEY = "profile";

export function getProfile(): SellerProfile | null {
  return getItem<SellerProfile>(PROFILE_KEY);
}

export function saveProfile(profile: SellerProfile): void {
  setItem(PROFILE_KEY, profile);
}
