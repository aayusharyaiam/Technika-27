import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthScene } from "@/components/auth-scene";

export const metadata: Metadata = { title: "Sign Up — Your Hogwarts Letter", description: "Create your Technika 27 account, choose a house, and step into the Wizarding World at BIT Patna.", alternates: { canonical: "/signup" }, robots: { index: false, follow: true } };

export default function Signup() {
  return <section className="auth-page shell"><AuthScene/><AuthForm mode="signup"/></section>;
}
