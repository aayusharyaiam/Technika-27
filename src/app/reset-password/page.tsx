import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("Reset Password — A New Castle Key", "Choose a new password for your Technika 2K26 account.", "/reset-password");
export default function ResetPassword() {
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="reset"/></section>;
}
