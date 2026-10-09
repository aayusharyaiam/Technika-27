import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";
import { createPrivatePageMetadata } from "@/lib/seo";

export const metadata = createPrivatePageMetadata("/signup", "Create an account | Technika ’27", "Create your Technika ’27 account and choose your house at BIT Patna.");

export default function Signup() {
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="signup"/></section>;
}
