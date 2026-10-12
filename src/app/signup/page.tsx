import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupExperience, SignupLoading } from "@/components/signup-experience";

export const metadata: Metadata = { title: "Sign Up — The Hat Awaits", description: "Begin your Technika 27 story with an account and explore the Sorting Hat ceremony.", alternates: { canonical: "/signup" }, robots: { index: false, follow: true } };

export default function Signup() {
  return <Suspense fallback={<SignupLoading/>}><SignupExperience/></Suspense>;
}
