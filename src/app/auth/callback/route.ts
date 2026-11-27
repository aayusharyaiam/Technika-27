import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { resolveServerAuthOrigin } from "@/lib/auth/redirect-url";
import {
  isEmailConfirmed,
  RECOVERY_COOKIE_NAME,
  sanitizeNextPath,
} from "@/lib/auth/session-state";
import { isBitMesraEmail } from "@/lib/bit-email";
import { houseFromValue } from "@/lib/houses";

function resolveBaseOrigin(request: NextRequest): string {
  return resolveServerAuthOrigin(request.nextUrl.origin, request.headers);
}

function metaText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Auth callback route for Supabase email verification and password reset links.
 * Exchanges the auth code / OTP token for a verified session, persists `profiles`
 * only after email confirmation, and sets the recovery guard cookie for password resets.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const baseOrigin = resolveBaseOrigin(request);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const isRecoveryHint =
    type === "recovery" || Boolean(rawNext?.startsWith("/reset-password"));

  // Handle link errors from Supabase (e.g., expired or invalid link)
  if (error) {
    const target = isRecoveryHint ? "/reset-password" : "/login";
    const errorType = isRecoveryHint
      ? "reset"
      : error === "access_denied"
        ? "confirmation"
        : "reset";
    return NextResponse.redirect(
      `${baseOrigin}${target}?error=${errorType}&message=${encodeURIComponent(errorDescription || "Link expired or invalid")}`,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${baseOrigin}/login`);
  }

  const cookiesToApply: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        items.forEach((item) => cookiesToApply.push(item));
      },
    },
  });

  const applyPendingCookies = (res: NextResponse) => {
    cookiesToApply.forEach(({ name, value, options }) => {
      res.cookies.set(name, value, options);
    });
    return res;
  };

  let authError: { message: string } | null = null;

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    authError = exchangeError;
  } else if (tokenHash && type) {
    const { error: otpError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    authError = otpError;
  } else {
    return NextResponse.redirect(`${baseOrigin}/login`);
  }

  if (authError) {
    const target = isRecoveryHint ? "/reset-password" : "/login";
    const errorType = isRecoveryHint ? "reset" : "confirmation";
    return applyPendingCookies(
      NextResponse.redirect(
        `${baseOrigin}${target}?error=${errorType}&message=${encodeURIComponent(authError.message)}`,
      ),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isEmailConfirmed(user)) {
    await supabase.auth.signOut();
    return applyPendingCookies(
      NextResponse.redirect(`${baseOrigin}/login?error=confirmation`),
    );
  }

  // Only once email is verified by Supabase, ensure the profiles record & `is_bit` exist
  // without altering an already-assigned house.
  try {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("full_name, college, phone, house, is_bit")
      .eq("id", user.id)
      .maybeSingle();

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const fullName =
      metaText(existingProfile?.full_name) ||
      metaText(meta.full_name) ||
      metaText(meta.display_name) ||
      metaText(meta.name) ||
      user.email?.split("@")[0] ||
      "Wizard";
    const college = metaText(existingProfile?.college) || metaText(meta.college);
    const phone = metaText(existingProfile?.phone) || metaText(meta.phone);
    const preservedHouse =
      houseFromValue(existingProfile?.house) || houseFromValue(meta.house);
    const isBit = isBitMesraEmail(user.email);

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        college,
        phone,
        ...(preservedHouse && preservedHouse !== "default"
          ? { house: preservedHouse }
          : {}),
        is_bit: isBit,
      },
      { onConflict: "id" },
    );
  } catch {
    /* best-effort profile sync after verification */
  }

  if (isRecoveryHint) {
    const res = NextResponse.redirect(`${baseOrigin}/reset-password`);
    applyPendingCookies(res);
    res.cookies.set(RECOVERY_COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    return res;
  }

  const safeNext = sanitizeNextPath(rawNext, { fallback: "/dashboard" });
  return applyPendingCookies(NextResponse.redirect(`${baseOrigin}${safeNext}`));
}
