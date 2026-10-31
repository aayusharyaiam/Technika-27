import { SignupExperience } from "@/components/signup-experience";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata(
  "Reset Password — A New Castle Key",
  "Choose a new password for your Technika 2K26 account.",
  "/reset-password"
);

export default function ResetPassword() {
  return <SignupExperience initialMode="reset" />;
}
