import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";
import { isEmailConfirmed, sanitizeNextPath } from "@/lib/auth/session-state";
import { createPrivateMetadata } from "@/lib/seo";
import { getServerSupabase } from "@/lib/supabase/server";

export const metadata = createPrivateMetadata(
  "Sign In — Return to the Common Room",
  "Sign in to your Technika 2K26 account and return to your common room.",
  "/login",
);

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    message?: string | string[];
    next?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;

  const supabase = await getServerSupabase();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (isEmailConfirmed(user)) {
      redirect(sanitizeNextPath(nextParam, { fallback: "/dashboard" }));
    }
  }

  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const message = Array.isArray(params.message)
    ? params.message[0]
    : params.message;
  const callbackError =
    error === "reset" || error === "confirmation" || error === "unconfirmed"
      ? error
      : undefined;

  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupExperience
        initialMode="login"
        callbackError={callbackError}
        callbackMessage={message}
      />
    </Suspense>
  );
}
