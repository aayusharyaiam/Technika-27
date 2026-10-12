"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useMagic } from "./experience";
import { AuthForm } from "./auth-form";
import { AuthScene } from "./auth-scene";
import { SortingCeremony } from "./sorting-ceremony";

export function SignupLoading() {
  return <section className="signup-loading shell" aria-busy="true"><LoaderCircle size={22} className="spin"/><h1>The Hat Awaits</h1><p role="status">Opening your letter…</p></section>;
}

export function SignupExperience() {
  const { user, loading } = useAuth();
  const { enabled } = useMagic();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const previousStep = useRef(false);
  const ceremonyRequested = submitted || searchParams.get("step") === "ceremony";
  // Neither a URL parameter nor form state can substitute for an authenticated session.
  const ceremony = !loading && Boolean(user);

  useEffect(() => {
    if (!loading && !user && ceremonyRequested) router.replace("/login");
  }, [loading, user, ceremonyRequested, router]);

  useEffect(() => {
    if (ceremony && !previousStep.current) {
      container.current?.scrollIntoView({ behavior: enabled ? "smooth" : "instant", block: "start" });
    }
    previousStep.current = ceremony;
  }, [ceremony, enabled]);

  if (loading || (!user && ceremonyRequested)) return <SignupLoading/>;
  return <div ref={container} className="signup-experience shell">
    <ol className="signup-journey" aria-label="Signup progress">
      <li className={user ? "complete" : !ceremony ? "current" : ""} aria-current={!ceremony ? "step" : undefined}>
        <span>{user ? <Check size={14} aria-hidden="true"/> : "01"}</span>Create your account
      </li>
      <li className={ceremony ? "current" : ""} aria-current={ceremony ? "step" : undefined}><span>02</span>Meet the Hat</li>
      <li><span>03</span>Your common room</li>
    </ol>
    {ceremony ? <SortingCeremony embedded/> : <section className="auth-page"><AuthScene/><AuthForm mode="signup" onSignupSuccess={() => setSubmitted(true)}/></section>}
  </div>;
}
