import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";

export const metadata: Metadata = { title: "Login — The Hat Remembers You", description: "Return to the Hall and sign in to your Technika 27 common room.", alternates: { canonical: "/login" }, robots: { index: false, follow: true } };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="login" callbackError={Boolean(error)}/></section>;
}
