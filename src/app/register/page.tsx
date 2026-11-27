import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";
import { isEmailConfirmed } from "@/lib/auth/session-state";
import { createPrivateMetadata } from "@/lib/seo";
import { getServerSupabase } from "@/lib/supabase/server";

export const metadata = createPrivateMetadata(
  "Register — Begin Your Ceremony",
  "Create a Technika 2K26 account and verify your email before entering the Sorting Ceremony.",
  "/register",
);

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const supabase = await getServerSupabase();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (isEmailConfirmed(user)) {
      redirect("/dashboard");
    }
  }

  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupExperience initialMode="register" />
    </Suspense>
  );
}
