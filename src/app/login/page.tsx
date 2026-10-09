import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";
import { createPrivatePageMetadata } from "@/lib/seo";

export const metadata = createPrivatePageMetadata("/login", "Sign in | Technika ’27", "Sign in to your Technika ’27 account and choose your house at BIT Patna.");

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="login" callbackError={Boolean(error)}/></section>;
}
