"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle, Mail } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useHouse } from "./house-provider";
import { HouseSelector } from "./house-selector";
import { useAuth } from "./auth-provider";

type Mode = "login" | "signup" | "forgot" | "reset";

export function AuthForm({ mode: initialMode, callbackError = false }: { mode: Mode; callbackError?: boolean }) {
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(callbackError ? "That confirmation link has expired or could not be verified. Request a new email below." : "");
  const [message, setMessage] = useState("");
  const { house, theme } = useHouse();
  const { user } = useAuth();
  const router = useRouter();
  const signup = mode === "signup";
  const passwordMode = mode !== "forgot";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if ((signup || mode === "reset") && (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password))) {
      setError("Choose a password with at least 12 characters, including a letter and a number."); return;
    }
    if ((signup || mode === "reset") && password !== String(form.get("confirmPassword") || "")) {
      setError("Your passwords do not match. Please check both fields."); return;
    }
    const client = getSupabase();
    if (!client) { setError("Account services need to be connected. Set the Supabase URL and publishable key in the site environment; your house selection is already saved on this device."); return; }
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setMessage("If an account exists for that email, a password reset letter is on its way. Check your inbox and spam folder.");
      } else if (signup) {
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: String(form.get("name") || "").trim(), house }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` } });
        if (error) throw error;
        if (data.session) { router.push("/account"); router.refresh(); }
        else setMessage("Check your inbox to confirm your email before entering the common room. If you already have an account, sign in or reset your password.");
      } else if (mode === "reset") {
        const { data: verified, error: verificationError } = await client.auth.getUser();
        if (verificationError || !verified.user) { setError("Open the verified password reset link from your email first."); return; }
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password has been changed. Your common room is ready.");
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { error: preferenceError } = await client.auth.updateUser({ data: { house } });
        if (preferenceError) setMessage("Signed in. Your house is saved on this device; the profile update could not be completed.");
        router.push("/account"); router.refresh();
      }
    } catch (caught) {
      const text = caught instanceof Error ? caught.message : "The Owlery could not complete that request. Please try again.";
      setError(text === "Invalid login credentials" ? "That email and password do not match. Please try again or reset your password." : text);
    } finally { setBusy(false); }
  };

  return <div className="auth-form-panel">
    <span className="auth-chapter">{signup ? "CHAPTER I · YOUR LETTER HAS ARRIVED" : mode === "forgot" ? "A LOST KEY CAN BE FOUND" : mode === "reset" ? "A NEW KEY TO THE CASTLE" : "WELCOME BACK TO THE COMMON ROOM"}</span>
    <h1>{signup ? <>Every wizard<br />starts with <em>a name.</em></> : mode === "forgot" ? <>Recover your<br /><em>castle key.</em></> : mode === "reset" ? <>A fresh start.<br /><em>A stronger spell.</em></> : <>The castle<br /><em>remembers you.</em></>}</h1>
    <p className="auth-intro">{signup ? "Create your Technika account. Choose your colours. Begin your story." : mode === "forgot" ? "We’ll send a verified reset link to your email." : mode === "reset" ? "Choose a new password for your Technika account." : "Sign in, choose your house, and make yourself at home."}</p>
    {user && mode !== "reset" && <p className="auth-already">You are already signed in. <Link href="/account">Open your common room →</Link></p>}
    <form onSubmit={submit} className="wizard-auth-form">
      {signup && <label htmlFor="auth-name">Your name<input id="auth-name" name="name" autoComplete="name" maxLength={80} minLength={2} placeholder="The name on your Hogwarts letter" required/></label>}
      {mode !== "reset" && <label htmlFor="auth-email">Email address<div className="auth-input-wrap"><Mail size={15}/><input id="auth-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@your-college.ac.in" required/></div></label>}
      {passwordMode && <label htmlFor="auth-password"><span id="auth-password-label">{mode === "reset" ? "New password" : "Password"}</span><div className="auth-input-wrap"><KeyRound size={15}/><input id="auth-password" name="password" aria-labelledby="auth-password-label" type={visible ? "text" : "password"} autoComplete={signup || mode === "reset" ? "new-password" : "current-password"} minLength={signup || mode === "reset" ? 12 : 1} maxLength={128} placeholder={signup || mode === "reset" ? "12+ characters, a letter and a number" : "Your key to the castle"} required/><button type="button" className="password-visibility" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>}
      {(signup || mode === "reset") && <label htmlFor="auth-confirm">Confirm password<input id="auth-confirm" name="confirmPassword" type={visible ? "text" : "password"} autoComplete="new-password" minLength={12} maxLength={128} placeholder="Repeat your password" required/></label>}
      {(signup || mode === "login") && <HouseSelector compact/>}
      {mode === "login" && <button type="button" className="forgot-password" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}>Forgot your password?</button>}
      {error && <p className="auth-feedback auth-error" role="alert">{error}</p>}
      {message && <p className="auth-feedback auth-success" role="status"><CheckCircle2 size={17}/>{message}</p>}
      <button type="submit" className="button button-gold auth-submit" disabled={busy}>{busy ? <><LoaderCircle size={15} className="spin"/>Contacting the Owlery…</> : <>{signup ? "Write my first chapter" : mode === "forgot" ? "Send my reset letter" : mode === "reset" ? "Save my new password" : "Enter the common room"}<ArrowRight size={16}/></>}</button>
      <span className="auth-house-note">{house === "default" ? "Original enchanted gold" : `${theme.name} colours`} · saved on this device</span>
    </form>
    <div className="auth-switch">{signup ? <>Already received your letter? <Link href="/login">Sign in</Link></> : mode === "forgot" ? <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }}>← Return to sign in</button> : mode === "reset" ? <Link href="/account">Return to your common room →</Link> : <>Your first visit? <Link href="/signup">Create an account</Link></>}</div>
  </div>;
}
