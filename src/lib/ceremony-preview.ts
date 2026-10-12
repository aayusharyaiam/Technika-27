import { isHouse, type House } from "./houses";

export type SortedHouse = Exclude<House, "default">;
export function savedProfileHouse(value: unknown): SortedHouse | null {
  return isHouse(value) && value !== "default" ? value : null;
}

// Presentation state only. Never used as a profile, house count, or membership record.
export type CeremonyPreview = { step: number; house: SortedHouse | null };
export const emptyPreview: CeremonyPreview = { step: 0, house: null };
export function readPreview(key: string): CeremonyPreview {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "null");
    if (value && Number.isInteger(value.step) && value.step >= 0 && value.step <= 3) {
      return { step: value.step, house: savedProfileHouse(value.house) };
    }
  } catch { /* Storage can be unavailable in private browsing. */ }
  return emptyPreview;
}
export function writePreview(key: string, value: CeremonyPreview) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* The ceremony still works in memory. */ }
}
