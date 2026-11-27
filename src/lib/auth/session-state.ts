import type { User } from "@supabase/supabase-js";

/** HttpOnly cookie set by `/auth/callback` while completing a verified password reset. */
export const RECOVERY_COOKIE_NAME = "tn_recovery";

const AUTH_PAGES = ["/login", "/register", "/reset-password", "/auth"];

/** Returns true only after Supabase confirms the user's email address. */
export function isEmailConfirmed(
  user: Pick<User, "email_confirmed_at" | "confirmed_at"> | null | undefined,
): boolean {
  return Boolean(user && (user.email_confirmed_at || user.confirmed_at));
}

/**
 * Validates an internal redirect path and avoids open redirects or auth-route loops.
 */
export function sanitizeNextPath(
  next: string | null | undefined,
  options?: { fallback?: string; allowAuthRoutes?: boolean },
): string {
  const fallback = options?.fallback ?? "/dashboard";
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  if (!options?.allowAuthRoutes) {
    const pathname = next.split("?")[0] ?? "";
    const isAuthRoute = AUTH_PAGES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    if (isAuthRoute) return fallback;
  }

  return next;
}

type ClaimsLike = {
  amr?: Array<{ method?: string } | string>;
} | null | undefined;

/** Determines whether the current session entered via a verified password-recovery flow. */
export function hasRecoverySignal({
  cookieValue,
  claims,
}: {
  cookieValue?: string;
  claims?: ClaimsLike;
}): boolean {
  if (cookieValue === "1") return true;
  if (!Array.isArray(claims?.amr)) return false;

  return claims.amr.some((entry) =>
    typeof entry === "string"
      ? entry === "recovery"
      : entry?.method === "recovery",
  );
}
