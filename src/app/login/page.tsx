import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";
export const metadata: Metadata = {
  title: "Sign In — Return to the Common Room",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const callbackError = error === "reset" || error === "confirmation" ? error : undefined;

  return (
    <section className="auth-page shell">
      <AuthScene />
      <AuthForm mode="login" callbackError={callbackError} />
    </section>
  );
}
