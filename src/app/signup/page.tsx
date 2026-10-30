import { Suspense } from "react";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("Sign Up — Begin Your Ceremony", "Create a Technika 2K26 account before the Sorting Ceremony begins.", "/signup");

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupExperience />
    </Suspense>
  );
}
