import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";

export const metadata: Metadata = { title: "Reset Password — A New Castle Key", robots: { index: false, follow: false } };
export default function ResetPassword() {
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="reset"/></section>;
}
