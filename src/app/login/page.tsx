import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";

export const metadata: Metadata = { title: "Login — Your Common Room", description: "Sign in to your Technika 27 account and choose your Hogwarts house.", alternates: { canonical: "/login" }, robots: { index: false, follow: true } };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="login" callbackError={Boolean(error)}/></section>;
}
