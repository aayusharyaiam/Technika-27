import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";
import { createPrivatePageMetadata } from "@/lib/seo";

export const metadata = createPrivatePageMetadata("/reset-password", "Reset your password | Technika ’27", "Reset your Technika ’27 account password.");
export default function ResetPassword() {
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="reset"/></section>;
}
