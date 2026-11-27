"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "./use-user";
import { NAV_ACTIONS } from "./nav-routes";

/** Square, bordered, mono-caps buttons (same look as the nav text). */
const BASE =
  "tk-nav-text inline-flex items-center justify-center whitespace-nowrap border text-[12px] font-bold uppercase tracking-[0.14em] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-white/70";
const GHOST =
  "border-white/20 bg-[#080808] text-[#a3a19b] hover:border-white/45 hover:text-white";
const PRIMARY =
  "border-transparent bg-[var(--tk-accent)] text-black hover:brightness-110";

/**
 * Right-hand side of the navbar:
 *   [Common Room]  [Register now]      – signed out
 *   [Common Room]  [avatar + name]     – signed in (Supabase)
 *
 * Needs an ancestor that sets `--tk-accent` (the Navbar does).
 */
export function NavActions({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  /** Called when a link is clicked (the mobile menu uses it to close itself) */
  onNavigate?: () => void;
}) {
  const { user, loading } = useUser();
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const size = variant === "mobile" ? "h-11 px-3" : "h-10 px-5";

  const meta = (user?.user_metadata ?? {}) as Record<
    string,
    string | undefined
  >;
  const rawName = (
    meta.full_name ??
    meta.name ??
    user?.email?.split("@")[0] ??
    ""
  ).trim();
  const fullName = rawName || "Profile";
  const name = fullName.split(/\s+/)[0] || "Profile"; // first name keeps the button compact
  const avatar = meta.avatar_url ?? meta.picture;
  const showAvatar = Boolean(avatar && failedAvatarUrl !== avatar);

  return (
    <div
      className={
        variant === "mobile"
          ? "grid grid-cols-2 gap-2"
          : "flex items-center gap-2.5"
      }
    >
      <Link
        href={user ? NAV_ACTIONS.commonRoom.href : NAV_ACTIONS.signInHref}
        onClick={onNavigate}
        className={`${BASE} ${GHOST} ${size}`}
      >
        {NAV_ACTIONS.commonRoom.label}
      </Link>

      {loading ? (
        // same footprint as the real button, so nothing jumps when auth resolves
        <span
          aria-hidden="true"
          className={`block ${variant === "mobile" ? "h-11" : "h-10 w-[8.75rem]"} animate-pulse border border-white/10 bg-white/5`}
        />
      ) : user ? (
        <Link
          href={NAV_ACTIONS.profileHref}
          onClick={onNavigate}
          aria-label={`Your profile (${fullName})`}
          className={`${BASE} ${GHOST} gap-2.5 ${variant === "mobile" ? "h-11 px-1.5" : "h-10 pl-1.5 pr-4"}`}
        >
          {showAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setFailedAvatarUrl(avatar ?? null)}
              className="h-7 w-7 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center bg-[var(--tk-accent)] text-black"
            >
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="max-w-[7rem] truncate">{name}</span>
        </Link>
      ) : (
        <Link
          href={NAV_ACTIONS.register.href}
          onClick={onNavigate}
          className={`${BASE} ${PRIMARY} ${size}`}
        >
          {NAV_ACTIONS.register.label}
        </Link>
      )}
    </div>
  );
}
