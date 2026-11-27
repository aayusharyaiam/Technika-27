import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  hasRecoverySignal,
  isEmailConfirmed,
  RECOVERY_COOKIE_NAME,
  sanitizeNextPath,
} from "@/lib/auth/session-state";

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Deployments without auth configuration still render public routes.
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const confirmed = isEmailConfirmed(user);
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, request.url));
    copyCookies(response, redirectResponse);
    return redirectResponse;
  };

  // Protected authenticated pages: require a verified, signed-in Supabase user.
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/common-room" ||
    pathname.startsWith("/common-room/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/")
  ) {
    if (!confirmed) {
      return redirectTo(`/login?next=${encodeURIComponent(`${pathname}${search}`)}`);
    }
    return response;
  }

  // Signed-in & verified users cannot visit /login or /register.
  if (pathname === "/login" || pathname === "/register") {
    if (confirmed) {
      const next = sanitizeNextPath(request.nextUrl.searchParams.get("next"), {
        fallback: "/dashboard",
      });
      return redirectTo(next);
    }
    return response;
  }

  // /reset-password: allow unauthenticated users (request email) or users with a
  // verified recovery session; redirect normally signed-in users to /dashboard.
  if (pathname === "/reset-password" && confirmed) {
    const { data: claimsData } = await supabase.auth.getClaims();
    const isRecovery = hasRecoverySignal({
      cookieValue: request.cookies.get(RECOVERY_COOKIE_NAME)?.value,
      claims: claimsData?.claims as { amr?: Array<{ method?: string } | string> } | undefined,
    });

    if (!isRecovery) {
      return redirectTo("/dashboard");
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/common-room/:path*",
    "/dashboard/:path*",
    "/auth/:path*",
    "/register",
    "/login",
    "/reset-password",
    "/sorting",
  ],
};
