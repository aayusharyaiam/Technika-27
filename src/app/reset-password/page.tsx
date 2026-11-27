import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";
import {
  hasRecoverySignal,
  isEmailConfirmed,
  RECOVERY_COOKIE_NAME,
} from "@/lib/auth/session-state";
import { createPrivateMetadata } from "@/lib/seo";
import { getServerSupabase } from "@/lib/supabase/server";

export const metadata = createPrivateMetadata(
  "Reset Password — A New Castle Key",
  "Recover your Technika 2K26 account or choose a new password after email verification.",
  "/reset-password",
);

export const dynamic = "force-dynamic";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    message?: string | string[];
  }>;
};

async function clearRecoveryCookie() {
  "use server";
  const store = await cookies();
  store.delete(RECOVERY_COOKIE_NAME);
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const supabase = await getServerSupabase();
  let confirmed = false;
  let isRecovery = false;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    confirmed = isEmailConfirmed(user);

    if (confirmed) {
      const cookieStore = await cookies();
      const { data: claimsData } = await supabase.auth.getClaims();
      isRecovery = hasRecoverySignal({
        cookieValue: cookieStore.get(RECOVERY_COOKIE_NAME)?.value,
        claims: claimsData?.claims as
          | { amr?: Array<{ method?: string } | string> }
          | undefined,
      });

      if (!isRecovery) {
        redirect("/dashboard");
      }
    }
  }

  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const message = Array.isArray(params.message)
    ? params.message[0]
    : params.message;

  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupExperience
        initialMode={confirmed && isRecovery ? "reset" : "forgot"}
        hasVerifiedRecovery={confirmed && isRecovery}
        callbackError={error === "reset" ? "reset" : undefined}
        callbackMessage={message}
        onRecoveryComplete={clearRecoveryCookie}
      />
    </Suspense>
  );
}
