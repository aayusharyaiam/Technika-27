"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle, Mail } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { houseThemes } from "@/lib/houses";
import { savedProfileHouse } from "@/lib/ceremony-preview";
import { useHouse } from "./house-provider";
import { useAuth } from "./auth-provider";
import { useMagic } from "./experience";

type Mode = "login" | "signup" | "forgot" | "reset";
type CallbackError = "confirmation" | "reset";

function authError(caught: unknown) {
  const message = caught instanceof Error ? caught.message : "The Owlery could not complete that request. Please try again.";
  if (/invalid login credentials/i.test(message)) return "That email and password do not match. Please try again or reset your password.";
  if (/already registered|already exists/i.test(message)) return "An account already exists for that email. Return to the Hall to sign in, or reset your password.";
  if (/(email|user)[ _]not[ _]confirmed/i.test(message)) return "Please open the confirmation letter in your inbox before signing in.";
  if (/fetch|network|timeout/i.test(message)) return "We could not reach the account service. Check your connection and try again.";
  if (/rate limit|too many/i.test(message)) return "Too many requests reached the Owlery. Please wait a moment before trying again.";
  return message;
}

export function AuthForm({ mode: initialMode, callbackError, onSignupSuccess }: { mode: Mode; callbackError?: CallbackError; onSignupSuccess?: () => void }) {
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(
    callbackError === "reset"
      ? "That password reset link has expired or could not be verified. Request a new reset letter below."
      : callbackError === "confirmation"
        ? "That confirmation link has expired or could not be verified. Request a new confirmation email below."
        : "",
  );
  const [message, setMessage] = useState("");
  const { setHouse } = useHouse();
  const { user } = useAuth();
  const { enabled } = useMagic();
  const router = useRouter();
  const lock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alert = useRef<HTMLParagraphElement>(null);
  const signup = mode === "signup";
  const newPassword = signup || mode === "reset";
  const disabled = busy || leaving;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (error) alert.current?.focus(); }, [error]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lock.current || leaving) return;
    setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();
    const college = String(form.get("college") || "").trim();
    const phone = String(form.get("phone") || "").trim().replace(/[\s().-]/g, "");
    const password = String(form.get("password") || "");
    if (signup && name.length < 2) { setError("Please enter your full name, using at least two characters."); return; }
    if (signup && college.length < 2) { setError("Please enter your college or university name."); return; }
    if (signup && !/^\+?\d{10,15}$/.test(phone)) { setError("Enter a valid phone number with 10–15 digits. You can include a country code, such as +91."); return; }
    if (newPassword && (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password))) {
      setError("Choose a password with at least 12 characters, including a letter and a number."); return;
    }
    if (mode === "reset" && password !== String(form.get("confirmPassword") || "")) {
      setError("Your passwords do not match. Please check both fields."); return;
    }
    const client = getSupabase();
    if (!client) { setError("Account services are temporarily unavailable. Please try again when the Owlery is connected."); return; }
    lock.current = true;
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}` });
        if (error) throw error;
        setMessage("If an account exists for that email, a password reset letter is on its way. Check your inbox and spam folder.");
      } else if (signup) {
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: name, college, phone }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/signup?step=ceremony")}` } });
        if (error) throw error;
        const emailConfirmed = Boolean(data.user?.email_confirmed_at || data.user?.confirmed_at);
        if (!emailConfirmed) {
          if (data.session) await client.auth.signOut();
          setMessage("Your account was created. Check your inbox for the Supabase confirmation email, then use that link to open the Hat and continue.");
          return;
        }
        if (data.session) {
          if (!data.user) throw new Error("The account service returned an incomplete session. Please try again.");
          setLeaving(true);
          const { data: profile } = await client.from("profiles").select("house").eq("id", data.user.id).maybeSingle();
          const savedHouse = savedProfileHouse(profile?.house) || savedProfileHouse(data.user?.user_metadata?.house);
          if (savedHouse) {
            setHouse(savedHouse);
            router.push("/account"); router.refresh();
          } else if (onSignupSuccess) {
            // The signup container swaps the form for the ceremony without navigating away.
            onSignupSuccess();
          } else router.replace("/signup?step=ceremony");
        } else {
          // Supabase can deliberately obscure duplicate emails; don't assert that a new account was created.
          setMessage("If this email can receive mail, Supabase has sent a confirmation letter. Open it before returning to continue with the Hat. If you already have an account, return to the Hall to sign in or reset your password.");
        }
      } else if (mode === "reset") {
        const { data: verified, error: verificationError } = await client.auth.getUser();
        if (verificationError || !verified.user) { setError("Open the verified password reset link from your email first."); return; }
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password has been changed. Your common room is ready.");
      } else {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
          await client.auth.signOut();
          throw new Error("Email not confirmed");
        }
        const { data: profile } = await client.from("profiles").select("house").eq("id", data.user.id).maybeSingle();
        const savedHouse = savedProfileHouse(profile?.house) || savedProfileHouse(data.user?.user_metadata?.house);
        setLeaving(true);
        if (savedHouse) {
          setHouse(savedHouse);
          setMessage(`${houseThemes[savedHouse].name} welcomes you back. ${houseThemes[savedHouse].motto}`);
          timer.current = setTimeout(() => { router.push("/account"); router.refresh(); }, enabled ? 1000 : 0);
        } else { router.push("/signup?step=ceremony"); router.refresh(); }
      }
    } catch (caught) { setError(authError(caught)); }
    finally { lock.current = false; setBusy(false); }
  };

  return <div className="auth-form-panel">
    <span className="auth-chapter">{signup ? "CHAPTER I · YOUR LETTER HAS ARRIVED" : mode === "forgot" ? "A LOST KEY CAN BE FOUND" : mode === "reset" ? "A NEW KEY TO THE CASTLE" : "WELCOME BACK TO THE COMMON ROOM"}</span>
    <h1>{signup ? <>The Hat <em>Awaits</em></> : mode === "forgot" ? <>Recover your <em>castle key.</em></> : mode === "reset" ? <>A fresh start. <em>A stronger spell.</em></> : <>The Hat <em>Remembers You</em></>}</h1>
    <p className="auth-intro">{signup ? "Every great journey begins with a choice. Your story begins here. Supabase will send a confirmation email before the Hat opens." : mode === "forgot" ? "We’ll send a verified reset link to your email." : mode === "reset" ? "Choose a new password for your Technika account." : "Ahh… welcome back. Your place in the wizarding world awaits."}</p>
    {user && mode !== "reset" && !leaving && <p className="auth-already">You are already signed in. <Link href="/account">Open your common room →</Link></p>}
    <form onSubmit={submit} className="wizard-auth-form" aria-busy={disabled}>
      {signup && <label htmlFor="auth-name">Full name<input id="auth-name" name="name" autoComplete="name" maxLength={80} minLength={2} placeholder="The name on your letter" disabled={disabled} required/></label>}
      {signup && <label htmlFor="auth-college">College<input id="auth-college" name="college" autoComplete="organization" maxLength={160} minLength={2} placeholder="Your college or university" disabled={disabled} required/></label>}
      {signup && <label htmlFor="auth-phone"><span id="auth-phone-label">Phone number</span><input id="auth-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} aria-labelledby="auth-phone-label" aria-describedby="phone-hint" placeholder="e.g. +91 98765 43210" disabled={disabled} required/><small id="phone-hint">Include your country code for international numbers.</small></label>}
      {mode !== "reset" && <label htmlFor="auth-email">Email address<div className="auth-input-wrap"><Mail size={15} aria-hidden="true"/><input id="auth-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@your-college.ac.in" disabled={disabled} required/></div></label>}
      {mode !== "forgot" && <label htmlFor="auth-password"><span id="auth-password-label">{mode === "reset" ? "New password" : "Password"}</span><div className="auth-input-wrap"><KeyRound size={15} aria-hidden="true"/><input id="auth-password" name="password" aria-labelledby="auth-password-label" aria-describedby={newPassword ? "password-hint" : undefined} type={visible ? "text" : "password"} autoComplete={newPassword ? "new-password" : "current-password"} minLength={newPassword ? 12 : 1} maxLength={128} placeholder="Your key to the castle" disabled={disabled} required/><button type="button" className="password-visibility" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} disabled={disabled} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>{newPassword && <small id="password-hint">12+ characters, including a letter and a number.</small>}</label>}
      {mode === "reset" && <label htmlFor="auth-confirm">Confirm password<input id="auth-confirm" name="confirmPassword" type={visible ? "text" : "password"} autoComplete="new-password" minLength={12} maxLength={128} placeholder="Repeat your password" disabled={disabled} required/></label>}
      {mode === "login" && <button type="button" className="forgot-password" disabled={disabled} onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}>Forgot your password?</button>}
      {error && <p ref={alert} tabIndex={-1} className="auth-feedback auth-error" role="alert">{error}</p>}
      {message && <p className="auth-feedback auth-success" role="status"><CheckCircle2 size={17}/>{message}</p>}
      <button type="submit" className="button button-gold auth-submit" disabled={disabled}>{disabled ? <><LoaderCircle size={15} className="spin"/>{leaving ? "Opening the Hall…" : "Contacting the Owlery…"}</> : <>{signup ? "BEGIN YOUR CEREMONY" : mode === "forgot" ? "Send my reset letter" : mode === "reset" ? "Save my new password" : "RETURN TO YOUR HOUSE"}<ArrowRight size={16}/></>}</button>
      {signup && <span className="auth-house-note">Confirm your email before the ceremony begins. Four houses. Equal belonging.</span>}
    </form>
    <div className="auth-switch">{signup ? <>Already have an account? <Link href="/login">Return to the Hall.</Link></> : mode === "forgot" ? <button type="button" disabled={disabled} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>← Return to sign in</button> : mode === "reset" ? <Link href="/account">Return to your common room →</Link> : <>New to the ceremony? <Link href="/signup">Let the Hat discover you.</Link></>}</div>
  </div>;
}
