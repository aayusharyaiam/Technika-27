import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";

export const metadata: Metadata = {
  title: "Sign Up — Begin Your Ceremony",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupExperience />
    </Suspense>
  );
}
