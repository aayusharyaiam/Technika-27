import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;
  const requestedNext = url.searchParams.get("next");
  const next = requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const errorType = next === "/reset-password" ? "reset" : "confirmation";
  return NextResponse.redirect(new URL(`/login?error=${errorType}`, origin));
}
