/**
 * Matches BIT Patna student email format containing `15xxx.2x@bitmesra` (or `@birmesra`)
 * (e.g. `15001.24@bitmesra.ac.in`, `btech15042.25@bitmesra.ac.in`, `btech15037.25@birmesra.ac.in`).
 */
export const BIT_EMAIL_REGEX = /(?:^|\D)15\d{3}\.2\d@bi[tr]mesra(?:\.|$)/i;

/** Returns `true` when the email matches the BIT student format `15xxx.2x@bitmesra` / `@birmesra`. */
export function isBitMesraEmail(email: string | null | undefined): boolean {
  if (typeof email !== "string") return false;
  return BIT_EMAIL_REGEX.test(email.trim());
}
