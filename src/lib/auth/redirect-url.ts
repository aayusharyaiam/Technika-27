export const PRIMARY_SITE_ORIGIN = "https://technika.bitmesra.ac.in";
export const TESTING_SITE_ORIGIN = "https://technika-27-testing.vercel.app";

export const PUBLISHED_AUTH_ORIGINS = [
  PRIMARY_SITE_ORIGIN,
  TESTING_SITE_ORIGIN,
] as const;

export function normalizeOrigin(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`,
    );
    return parsed.origin;
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/**
 * Resolves the origin used inside Supabase email confirmation / password reset links.
 * Uses the active published domain (`technika.bitmesra.ac.in` or `technika-27-testing.vercel.app`)
 * and preserves `localhost` only when actively running locally for testing.
 */
export function resolveClientAuthOrigin(): string {
  const envOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (typeof window === "undefined") {
    return envOrigin || PRIMARY_SITE_ORIGIN;
  }

  const { hostname, origin } = window.location;
  const lowerHost = hostname.toLowerCase();

  if (lowerHost === "technika.bitmesra.ac.in") {
    return PRIMARY_SITE_ORIGIN;
  }
  if (
    lowerHost === "technika-27-testing.vercel.app" ||
    lowerHost.endsWith(".vercel.app")
  ) {
    return origin;
  }
  if (isLocalHostname(lowerHost)) {
    return origin;
  }

  return origin || envOrigin || PRIMARY_SITE_ORIGIN;
}

export function buildAuthCallbackUrl(nextPath = "/dashboard"): string {
  const origin = resolveClientAuthOrigin();
  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

/**
 * Resolves the public origin for server-side redirects from `/auth/callback`,
 * ensuring proxies/hosts resolve to `technika.bitmesra.ac.in` / `technika-27-testing.vercel.app`
 * and never leak an internal `localhost` bind address on published deployments.
 */
export function resolveServerAuthOrigin(
  requestUrlOrigin: string,
  headers: { get(name: string): string | null },
): string {
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const hostHeader = headers.get("host")?.split(",")[0]?.trim();
  const candidateHost = forwardedHost || hostHeader;

  if (candidateHost) {
    const bareHost = candidateHost.split(":")[0].toLowerCase();
    if (bareHost === "technika.bitmesra.ac.in") {
      return PRIMARY_SITE_ORIGIN;
    }
    if (
      bareHost === "technika-27-testing.vercel.app" ||
      bareHost.endsWith(".vercel.app")
    ) {
      return `https://${candidateHost}`;
    }
    if (!isLocalHostname(bareHost)) {
      const proto =
        headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
      return `${proto}://${candidateHost}`;
    }
    if (process.env.NODE_ENV === "development") {
      const proto =
        headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
      return `${proto}://${candidateHost}`;
    }
  }

  try {
    const parsed = new URL(requestUrlOrigin);
    if (!isLocalHostname(parsed.hostname) || process.env.NODE_ENV === "development") {
      return parsed.origin;
    }
  } catch {
    // ignore malformed origin
  }

  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeOrigin(process.env.VERCEL_URL) ||
    PRIMARY_SITE_ORIGIN
  );
}
