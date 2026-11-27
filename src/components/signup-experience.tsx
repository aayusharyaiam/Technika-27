"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Bird,
  CheckCircle2,
  Eye,
  EyeOff,
  Feather,
  Flame,
  GraduationCap,
  KeyRound,
  Leaf,
  LoaderCircle,
  Mail,
  Phone,
  Sparkles,
  Sun,
  User,
  type LucideIcon,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { isEmailConfirmed } from "@/lib/auth/session-state";
import { isBitMesraEmail } from "@/lib/bit-email";
import {
  houseFromValue,
  houseThemes,
  themeAttributeForHouse,
} from "@/lib/houses";
import {
  getLandingPreference,
  setLandingPreference,
  resolveLandingPath,
  type LandingPreference,
} from "@/lib/landing-preference";
import type { ArrivalParticipant } from "@/lib/common-room/types";
import { useHouse } from "./house-provider";
import { useAuth } from "./auth-provider";
import { useMagic } from "./experience";
import { useRegistrationArrival } from "./registration-arrival";

export const HOUSES = [
  "gryffindor",
  "slytherin",
  "ravenclaw",
  "hufflepuff",
] as const;
export type CanonicalHouse = (typeof HOUSES)[number];

type AuthMode = "login" | "register" | "forgot" | "reset";
type CallbackError = "confirmation" | "reset" | "unconfirmed";
type SupabaseBrowserClient = NonNullable<ReturnType<typeof getSupabase>>;

interface SignupExperienceProps {
  initialMode?: AuthMode;
  callbackError?: CallbackError;
  callbackMessage?: string;
  hasVerifiedRecovery?: boolean;
  onRecoveryComplete?: () => Promise<void> | void;
  onSignupSuccess?: (participant: ArrivalParticipant) => void;
}

const AUTH_EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: AUTH_EASE, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: AUTH_EASE },
  },
};

const houseIcons: Record<CanonicalHouse, LucideIcon> = {
  gryffindor: Flame,
  slytherin: Leaf,
  ravenclaw: Bird,
  hufflepuff: Sun,
};

const houseLore: Record<
  CanonicalHouse,
  { title: string; speech: string; subtext: string }
> = {
  gryffindor: {
    title: "Gryffindor",
    speech:
      "Where dwell the brave at heart! Their daring, nerve, and chivalry set Gryffindors apart.",
    subtext: "Element: Fire · Mascot: Lion · Values: Courage, Daring, Resolve",
  },
  slytherin: {
    title: "Slytherin",
    speech:
      "You could be great, you know... and Slytherin will help you on the way to greatness!",
    subtext:
      "Element: Water · Mascot: Serpent · Values: Ambition, Cunning, Resolve",
  },
  ravenclaw: {
    title: "Ravenclaw",
    speech:
      "For those of wit and learning, where curiosity unlocks every ancient door of wisdom.",
    subtext: "Element: Air · Mascot: Eagle · Values: Intelligence, Wisdom, Wit",
  },
  hufflepuff: {
    title: "Hufflepuff",
    speech:
      "Just and loyal! Patient and true, where a shared bond is the strongest spell of all.",
    subtext:
      "Element: Earth · Mascot: Badger · Values: Loyalty, Dedication, Heart",
  },
};

const IDLE_SPEECH =
  "Step forward, wizard... The Great Hall falls quiet as you take the stool. Whisper your credentials, and let the Hat discover the colours of your destiny.";
const IDLE_SUBTEXT =
  "Four houses. Equal belonging. The Hat weighs ambition, daring, intellect, and heart.";

/* ------------------------------------------------------------------ */
/* House helpers (assignment logic intentionally preserved)            */
/* ------------------------------------------------------------------ */

function normalizeHouse(value: unknown): CanonicalHouse | null {
  if (typeof value !== "string") return null;
  const v = value.toLowerCase().trim();
  return (HOUSES as readonly string[]).includes(v)
    ? (v as CanonicalHouse)
    : null;
}

/**
 * Evenly and randomly distributes house assignment across the 4 canonical houses:
 * gryffindor, slytherin, ravenclaw, hufflepuff.
 */
async function getBalancedHouse(
  client: SupabaseBrowserClient,
): Promise<CanonicalHouse> {
  try {
    const { data, error } = await client.from("profiles").select("house");

    if (!error && Array.isArray(data)) {
      const counts: Record<CanonicalHouse, number> = {
        gryffindor: 0,
        slytherin: 0,
        ravenclaw: 0,
        hufflepuff: 0,
      };

      for (const row of data) {
        const h = normalizeHouse(row?.house);
        if (h && h in counts) {
          counts[h]++;
        }
      }

      const minCount = Math.min(
        counts.gryffindor,
        counts.slytherin,
        counts.ravenclaw,
        counts.hufflepuff,
      );

      const candidates = HOUSES.filter((h) => counts[h] === minCount);
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  } catch (err) {
    console.warn("Could not determine balanced house from profiles:", err);
  }

  return HOUSES[Math.floor(Math.random() * HOUSES.length)];
}

async function resolveHouse(
  client: SupabaseBrowserClient,
  userId: string,
): Promise<CanonicalHouse> {
  try {
    const { data } = await client
      .from("profiles")
      .select("house")
      .eq("id", userId)
      .maybeSingle();
    const existing = normalizeHouse(data?.house);
    if (existing) return existing;
  } catch (err) {
    console.warn("Could not read profile house:", err);
  }

  const assigned = await getBalancedHouse(client);
  try {
    await client
      .from("profiles")
      .upsert({ id: userId, house: assigned }, { onConflict: "id" });
  } catch {
    /* best-effort */
  }

  return assigned;
}

async function syncHouseMetadata(
  client: SupabaseBrowserClient,
  house: CanonicalHouse,
  currentMetaHouse: unknown,
) {
  if (currentMetaHouse === house) return;
  try {
    await client.auth.updateUser({ data: { house } });
  } catch {
    /* metadata sync is best-effort */
  }
}

function parseAuthError(caught: unknown): string {
  const message =
    caught instanceof Error
      ? caught.message
      : typeof caught === "string"
        ? caught
        : (caught as { message?: string })?.message ||
          "The Owlery could not complete that request. Please try again.";
  if (/invalid login credentials/i.test(message))
    return "That email and password do not match. Please verify your credentials or reset your password.";
  if (/already registered|already exists/i.test(message))
    return "An account already exists for that email. Sign in or request a password reset.";
  if (/(email|user)[ _]not[ _]confirmed/i.test(message))
    return "Please confirm the verification letter sent to your inbox before signing in.";
  if (/fetch|network|timeout/i.test(message))
    return "Cannot reach the Supabase account service. Check your internet connection.";
  const code =
    typeof caught === "object" && caught !== null && "code" in caught
      ? String((caught as { code?: unknown }).code || "")
      : "";
  if (
    /email rate limit|over_email_send_rate_limit/i.test(message) ||
    code === "over_email_send_rate_limit"
  ) {
    return "The verification email quota has been reached for now. Please wait ~1 hour (Supabase's default email limit is 2 emails/hour unless Custom SMTP is configured) or sign in if you already confirmed your email.";
  }
  if (/rate limit|too many/i.test(message))
    return "Too many attempts reached the Owlery. Please wait a moment before trying again.";
  if (/database error saving new user/i.test(message))
    return "The castle ledger encountered an error saving your student record. Please try again or sign in directly.";
  return message;
}

/* ------------------------------------------------------------------ */
/* Reusable theme-reactive input field                                */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-base text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-500 text-ellipsis hover:border-white/20 focus:border-brand focus:bg-white/[0.05] focus:ring-2 focus:ring-brand/25 disabled:opacity-60 sm:text-sm";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  hint?: string;
  trailing?: ReactNode;
}

function Field({
  label,
  icon: Icon,
  hint,
  trailing,
  ...inputProps
}: FieldProps) {
  return (
    <label className="group/field flex min-w-0 flex-col gap-1.5 text-xs font-medium text-zinc-300">
      <span className="font-orbiter tracking-[0.04em] text-zinc-300">
        {label}
      </span>
      <span className="relative block">
        <Icon
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-brand/80 transition-colors duration-200 group-focus-within/field:text-fg-brand"
        />
        <input
          {...inputProps}
          className={`${inputBase} pl-10 ${trailing ? "pr-11" : "pr-4"}`}
        />
        {trailing}
      </span>
      {hint && (
        <span className="text-[11px] font-normal text-zinc-500">{hint}</span>
      )}
    </label>
  );
}

const linkBtn =
  "font-orbiter font-medium text-fg-brand underline underline-offset-4 decoration-brand/50 transition-all duration-200 hover:decoration-brand hover:brightness-110 disabled:opacity-60";

/* ------------------------------------------------------------------ */

export function SignupLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#080808] p-6 text-zinc-200"
      aria-busy="true"
    >
      <LoaderCircle size={32} className="mb-4 animate-spin text-fg-brand" />
      <h1 className="font-serif text-2xl tracking-wider text-zinc-100">
        The Sorting Hat Awaits
      </h1>
      <p className="font-orbiter mt-2 text-xs uppercase tracking-[0.22em] text-fg-brand/80">
        Opening the Great Hall doors…
      </p>
    </div>
  );
}

export function SignupExperience({
  initialMode = "login",
  callbackError,
  callbackMessage,
  hasVerifiedRecovery = false,
  onRecoveryComplete,
  onSignupSuccess,
}: SignupExperienceProps) {
  const router = useRouter();
  const { setHouse } = useHouse();
  const { user } = useAuth();
  const { enabled } = useMagic();
  const { begin: beginArrival, active: arrivalActive } = useRegistrationArrival();

  const [clientRecovered, setClientRecovered] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [continuation, setContinuation] = useState<
    "/dashboard" | "/login" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [landing, setLanding] = useState<LandingPreference | null>(() =>
    getLandingPreference(),
  );
  const [assignedHouse, setAssignedHouse] = useState<CanonicalHouse | null>(
    null,
  );

  const [hatMood, setHatMood] = useState<
    | "idle"
    | "focus_email"
    | "focus_password"
    | "deliberating"
    | "revealed"
    | "error"
  >("idle");
  const [hatSpeech, setHatSpeech] = useState(IDLE_SPEECH);
  const [hatSubtext, setHatSubtext] = useState(IDLE_SUBTEXT);

  const [error, setError] = useState(() => {
    if (callbackError === "reset") {
      return (
        callbackMessage ||
        "That password reset link has expired or could not be verified. Request a new reset letter below."
      );
    }
    if (callbackError === "confirmation") {
      return (
        callbackMessage ||
        "That confirmation link has expired. Request a new confirmation email below."
      );
    }
    if (callbackError === "unconfirmed") {
      return "Please confirm the verification email sent to your inbox before accessing your account.";
    }
    return "";
  });
  const [message, setMessage] = useState("");

  const alertRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockRef = useRef(false);
  const mounted = useRef(true);
  const verification = useRef<AbortController | null>(null);

  const effectiveRecovery = hasVerifiedRecovery || clientRecovered;
  const mode: AuthMode =
    clientRecovered && initialMode === "forgot" ? "reset" : initialMode;
  const isSignup = mode === "register";
  const isReset = mode === "reset";
  const isForgot = mode === "forgot";
  const isNewPassword = isSignup || isReset;
  const disabled = busy || leaving || continuation !== null;

  useEffect(() => {
    if (initialMode !== "forgot" && initialMode !== "reset") return;
    const client = getSupabase();
    if (!client) return;

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session?.user) {
        setClientRecovered(true);
        setError("");
      }
    });

    return () => subscription.unsubscribe();
  }, [initialMode]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      verification.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (error) alertRef.current?.focus();
  }, [error]);

  const resetHat = () => {
    setHatMood("idle");
    setHatSpeech(IDLE_SPEECH);
    setHatSubtext(IDLE_SUBTEXT);
  };

  const handleInputFocus = (field: "email" | "password") => {
    if (disabled) return;
    if (field === "email") {
      setHatMood("focus_email");
      setHatSpeech(
        "Mmm, yes... searching the enchanted scrolls for your mark upon the castle ledger...",
      );
      setHatSubtext("Enter your registered student or owl-post address.");
    } else {
      setHatMood("focus_password");
      setHatSpeech(
        "A guarded incantation... ancient doors yield only to a true and steadfast key.",
      );
      setHatSubtext("Speak your secret passphrase to unseal the chambers.");
    }
  };

  const handleInputBlur = () => {
    if (disabled || assignedHouse) return;
    resetHat();
  };

  const fetchWithRetry = async (
    url: string,
    signal: AbortSignal,
    maxRetries = 3,
  ): Promise<Response> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await fetch(url, { cache: "no-store", signal });
        if (res.ok) return res;
        if (i < maxRetries - 1)
          await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      } catch (err) {
        if (signal.aborted) throw err;
        if (i < maxRetries - 1)
          await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        else throw err;
      }
    }
    throw new Error(`Failed after ${maxRetries} retries`);
  };

  /** Reads the house the database assigned, announces it, then redirects. */
  const sortAndEnter = async (
    client: SupabaseBrowserClient,
    userId: string,
    knownHouse: unknown,
    delay: number,
  ) => {
    setLeaving(true);
    const house =
      normalizeHouse(knownHouse) || (await resolveHouse(client, userId));
    if (!mounted.current) return;

    if (isSignup) {
      const controller = new AbortController();
      verification.current = controller;
      const timeout = setTimeout(() => controller.abort(), 30_000);
      try {
        const response = await fetchWithRetry(
          "/api/common-room/arrival",
          controller.signal,
          5,
        );
        const result: {
          status?: string;
          participant?: Partial<ArrivalParticipant>;
        } = await response.json();
        const saved = result?.participant;
        const verifiedHouse = houseFromValue(saved?.house);
        if (!response.ok)
          throw new Error(`API returned ${response.status}: ${result?.status}`);
        if (result?.status !== "ready")
          throw new Error(`Arrival not ready: ${result?.status}`);
        if (saved?.id !== userId) throw new Error("User ID mismatch");
        if (typeof saved.displayName !== "string" || !saved.displayName.trim())
          throw new Error("No displayName");
        if (!verifiedHouse || verifiedHouse === "default")
          throw new Error(`Invalid house: ${saved?.house}`);
        if (saved.house !== verifiedHouse)
          throw new Error("House verification failed");
        if (!mounted.current) return;
        const participant: ArrivalParticipant = {
          id: userId,
          displayName: saved.displayName,
          house: verifiedHouse,
        };
        setAssignedHouse(verifiedHouse);
        setHouse(verifiedHouse);
        setHatMood("revealed");
        setHatSpeech("Your acceptance letter has arrived.");
        setHatSubtext(houseThemes[verifiedHouse].motto);
        setMessage(
          "Your registration is confirmed. Your acceptance letter is ready.",
        );
        void syncHouseMetadata(client, verifiedHouse, knownHouse);
        (onSignupSuccess ?? beginArrival)(participant);
      } catch (err) {
        console.warn("[signup] arrival verification failed:", err);
        if (!mounted.current) return;
        setAssignedHouse(null);
        setHatMood("idle");
        setHatSpeech(
          "Your record is safe. The profile ledger needs another look.",
        );
        setMessage(
          "Your registration succeeded, but we could not verify your session and saved house. Continue to your Dashboard to retry.",
        );
        setContinuation("/dashboard");
      } finally {
        clearTimeout(timeout);
        verification.current = null;
      }
      return;
    }

    setAssignedHouse(house);
    setHouse(house);
    setHatMood("revealed");
    setHatSpeech(`BETTER BE... ${house.toUpperCase()}!`);
    setHatSubtext(houseThemes[house].motto);
    setMessage(
      `${houseThemes[house].name} welcomes you! ${houseThemes[house].motto}`,
    );
    void syncHouseMetadata(client, house, knownHouse);

    timerRef.current = setTimeout(() => {
      router.push(resolveLandingPath());
      router.refresh();
    }, delay);
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail || resendingEmail) return;
    const client = getSupabase();
    if (!client) return;

    setResendingEmail(true);
    setError("");
    try {
      const { error: resendErr } = await client.auth.resend({
        type: "signup",
        email: pendingVerificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
        },
      });
      if (resendErr) throw resendErr;
      setMessage(
        `A fresh verification email has been sent to ${pendingVerificationEmail}. Please check your inbox and spam folder.`,
      );
    } catch (caught) {
      setError(parseAuthError(caught));
    } finally {
      if (mounted.current) setResendingEmail(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lockRef.current || leaving || continuation) return;
    setError("");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();
    const college = String(form.get("college") || "").trim();
    const phone = String(form.get("phone") || "")
      .trim()
      .replace(/[\s().-]/g, "");
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (isSignup && name.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (isSignup && college.length < 2) {
      setError("Please enter your college or institution name.");
      return;
    }
    if (isSignup && !/^\+?\d{10,15}$/.test(phone)) {
      setError(
        "Enter a valid 10-15 digit phone number (e.g. +91 98765 43210).",
      );
      return;
    }
    if (
      isNewPassword &&
      (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password))
    ) {
      setError(
        "Choose a password of 12+ characters containing at least one letter and one number.",
      );
      return;
    }
    if (isNewPassword && password !== confirmPassword) {
      setError("Your passwords do not match. Please verify both fields.");
      return;
    }

    const client = getSupabase();
    if (!client) {
      const err =
        "The Owlery is temporarily unreachable. Please check your Supabase configuration.";
      setError(err);
      setHatMood("error");
      setHatSpeech(
        "The connection to the castle towers has faded into mist...",
      );
      setHatSubtext(err);
      return;
    }

    lockRef.current = true;
    setBusy(true);
    setHatMood("deliberating");
    setHatSpeech("Hmm... what do we have here? Difficult, very difficult...");
    setHatSubtext(
      "The Sorting Hat weighs ambition, daring, intellect, and heart…",
    );

    try {
      if (isForgot) {
        const { error: resetErr } = await client.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              "/reset-password",
            )}`,
          },
        );
        if (resetErr) throw resetErr;
        const msg =
          "If an account exists for that email, a password reset letter is on its way. Check your inbox and spam folder.";
        setMessage(msg);
        setHatMood("idle");
        setHatSpeech(
          "An owl has taken flight. Check your correspondence for the password reset scroll.",
        );
        setHatSubtext(msg);
      } else if (isSignup) {
        const chosenHouse = await getBalancedHouse(client);
        const isBit = isBitMesraEmail(email);
        void import("./acceptance-letter").catch(() => {});
        const { data: signUpData, error: signUpErr } = await client.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                full_name: name,
                display_name: name,
                name,
                college,
                phone,
                house: chosenHouse,
                is_bit: isBit,
              },
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                "/dashboard",
              )}`,
            },
          },
        );
        if (!mounted.current) return;
        if (signUpErr) throw signUpErr;

        if (
          signUpData.user &&
          Array.isArray(signUpData.user.identities) &&
          signUpData.user.identities.length === 0
        ) {
          throw new Error("User already registered");
        }

        const emailConfirmed = isEmailConfirmed(signUpData.user);

        if (!emailConfirmed) {
          if (signUpData.session) await client.auth.signOut();
          setPendingVerificationEmail(email);
          const signupMsg = `Verification email sent to ${email}. Click the confirmation link in your inbox to verify your email and complete your registration.`;
          setMessage(signupMsg);
          setHatMood("idle");
          setHatSpeech(
            "An owl has left for your inbox. Verify your email address to complete enrollment.",
          );
          setHatSubtext(signupMsg);
          setContinuation("/login");
          return;
        }

        if (signUpData.session && signUpData.user) {
          try {
            await client.from("profiles").upsert(
              {
                id: signUpData.user.id,
                full_name: name,
                college,
                phone,
                house: chosenHouse,
                is_bit: isBit,
              },
              { onConflict: "id" },
            );
          } catch {
            /* best-effort sync after verified registration */
          }

          await sortAndEnter(client, signUpData.user.id, chosenHouse, 1800);
        } else {
          setPendingVerificationEmail(email);
          setMessage(
            "Verification email sent. Confirm your inbox and then sign in to complete your entry.",
          );
          setHatMood("idle");
          setContinuation("/login");
        }
      } else if (isReset) {
        if (!effectiveRecovery) {
          setError(
            "Please open the verified password reset link from your email first.",
          );
          setHatMood("error");
          return;
        }
        const { data: verified, error: verifyErr } =
          await client.auth.getUser();
        if (verifyErr || !verified.user || !isEmailConfirmed(verified.user)) {
          setError(
            "Please open the verified password reset link from your email first.",
          );
          setHatMood("error");
          return;
        }
        const { error: updateErr } = await client.auth.updateUser({ password });
        if (updateErr) throw updateErr;
        try {
          await onRecoveryComplete?.();
        } catch {
          /* ignore cookie cleanup failure */
        }
        setMessage(
          "Your password has been updated. Taking you to your dashboard…",
        );
        setHatMood("revealed");
        setHatSpeech("Your castle key is renewed. Step into the Great Hall!");
        setLeaving(true);
        timerRef.current = setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 1200);
      } else {
        setHatSpeech(
          "I see courage, yes... and a keen intellect... where shall I place you?",
        );

        const { data: authData, error: authErr } =
          await client.auth.signInWithPassword({
            email,
            password,
          });
        if (authErr) throw authErr;

        if (!isEmailConfirmed(authData.user)) {
          await client.auth.signOut();
          setPendingVerificationEmail(email);
          throw new Error("Email not confirmed");
        }

        const isBit = isBitMesraEmail(authData.user.email || email);

        let userHouse: CanonicalHouse | null = null;
        let storedIsBit: boolean | null = null;
        let hasProfileRow = false;
        try {
          const { data: prof } = await client
            .from("profiles")
            .select("house, is_bit")
            .eq("id", authData.user.id)
            .maybeSingle();
          hasProfileRow = Boolean(prof);
          storedIsBit = typeof prof?.is_bit === "boolean" ? prof.is_bit : null;
          userHouse = normalizeHouse(prof?.house);
        } catch {
          // ignore
        }

        if (!userHouse) {
          userHouse = normalizeHouse(authData.user.user_metadata?.house);
        }

        if (!userHouse) {
          userHouse = await getBalancedHouse(client);
        }

        const effectiveIsBit = isBit || storedIsBit === true;
        if (
          !hasProfileRow ||
          storedIsBit === null ||
          (isBit && storedIsBit !== true)
        ) {
          try {
            await client.from("profiles").upsert(
              {
                id: authData.user.id,
                full_name:
                  (authData.user.user_metadata?.full_name as string) ||
                  (authData.user.user_metadata?.display_name as string) ||
                  authData.user.email?.split("@")[0] ||
                  "Wizard",
                college: (authData.user.user_metadata?.college as string) || "",
                phone: (authData.user.user_metadata?.phone as string) || "",
                house: userHouse,
                is_bit: effectiveIsBit,
              },
              { onConflict: "id" },
            );
            await client.auth.updateUser({
              data: { house: userHouse, is_bit: effectiveIsBit },
            });
          } catch {
            /* best-effort sync */
          }
        }

        setAssignedHouse(userHouse);
        setHouse(userHouse);
        setHatMood("revealed");
        setHatSpeech(houseLore[userHouse].speech);
        setHatSubtext(houseLore[userHouse].subtext);

        await sortAndEnter(
          client,
          authData.user.id,
          userHouse,
          enabled ? 1750 : 850,
        );
      }
    } catch (caught) {
      const friendlyErr = parseAuthError(caught);
      setError(friendlyErr);
      setHatMood("error");
      setHatSpeech(
        "The lock resists that incantation. The Owlery shakes its head. Check your key and try again.",
      );
      setHatSubtext(friendlyErr);
    } finally {
      if (mounted.current) {
        lockRef.current = false;
        setBusy(false);
      }
    }
  };

  const currentTheme = assignedHouse
    ? houseThemes[assignedHouse]
    : houseThemes.default;
  const HouseIcon = assignedHouse ? houseIcons[assignedHouse] : null;

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#080808] px-4 pb-16 pt-28 text-zinc-100 transition-colors duration-700 selection:bg-brand-soft selection:text-fg-strong sm:px-6 sm:pt-32 lg:px-8 ${arrivalActive ? "pointer-events-none opacity-0" : ""}`}
      data-theme={
        assignedHouse ? themeAttributeForHouse(assignedHouse) : undefined
      }
      data-house={assignedHouse || undefined}
    >
      {/* Ambient theme-reactive radial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[58rem] -translate-x-1/2 rounded-full bg-brand-soft opacity-45 blur-3xl transition-colors duration-700"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand-soft opacity-30 blur-3xl transition-colors duration-700"
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-brand-border bg-white/[0.025] shadow-2xl shadow-black/80 backdrop-blur-2xl transition-[border-color,box-shadow] duration-700 lg:min-h-[44rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      >
        {/* Top subtle shimmer hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
        />

        {/* ============ LEFT: SORTING HAT CHAMBER ============ */}
        <aside className="relative flex min-w-0 flex-col items-center gap-5 overflow-hidden border-b border-white/10 bg-gradient-to-b from-brand-soft/40 via-[#09090d]/90 to-[#080808] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-white/10">
          <div
            className="pointer-events-none absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-soft opacity-60 blur-3xl transition-colors duration-700"
            aria-hidden="true"
          />

          <motion.div
            variants={itemVariants}
            className="font-orbiter relative z-10 flex flex-wrap items-center justify-center gap-x-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-fg-brand"
          >
            <span aria-hidden="true">✦</span>
            <span>The Great Hall · BIT Patna</span>
            <span aria-hidden="true">✦</span>
          </motion.div>

          <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-5">
            {/* Sorting Hat artwork with gentle breathing float */}
            <motion.div
              animate={{
                y: hatMood === "revealed" ? [0, -8, 0] : [0, -5, 0],
                scale:
                  hatMood === "deliberating"
                    ? 1.06
                    : hatMood === "revealed"
                      ? 1.08
                      : 1,
              }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.6, ease: AUTH_EASE },
              }}
              className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40 lg:h-44 lg:w-44"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-brand-soft opacity-80 blur-2xl transition-colors duration-700"
              />
              <Image
                src="/images/sorting-hat.png"
                alt="The Sorting Hat"
                width={260}
                height={260}
                priority
                sizes="(min-width: 1024px) 176px, 160px"
                className="h-full w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)]"
              />
            </motion.div>

            {/* Hat dialogue card */}
            <div className="flex w-full max-w-md flex-col gap-4">
              <div className="relative rounded-2xl border border-brand-border bg-[#0c0c11]/90 p-4 shadow-glow-brand backdrop-blur-xl transition-[border-color,box-shadow] duration-500 sm:p-5">
                <div
                  className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-brand-border bg-[#0c0c11] transition-colors duration-500"
                  aria-hidden="true"
                />

                <div className="mb-3 flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="shrink-0 animate-spin text-xs text-fg-brand [animation-duration:7s]"
                    >
                      ✦
                    </span>
                    <span className="font-orbiter truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-200 sm:text-xs">
                      The Sorting Hat
                    </span>
                  </div>

                  <div className="font-orbiter flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] uppercase tracking-wider text-zinc-300">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        hatMood === "deliberating"
                          ? "animate-ping bg-brand"
                          : hatMood === "revealed"
                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            : hatMood === "error"
                              ? "bg-red-400"
                              : "bg-brand"
                      }`}
                    />
                    <span>
                      {hatMood === "deliberating"
                        ? "Deliberating…"
                        : hatMood === "revealed"
                          ? "Sorted"
                          : hatMood === "error"
                            ? "Lock resisted"
                            : "Listening"}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {hatMood === "revealed" && assignedHouse && HouseIcon && (
                    <motion.div
                      key={`house-${assignedHouse}`}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.5, ease: AUTH_EASE }}
                      className="mb-3 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-soft/60 p-3"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-[#080808]/80 text-fg-brand">
                        <HouseIcon size={22} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-orbiter block text-[9px] font-semibold uppercase tracking-widest text-fg-brand">
                          Decree of the Founders
                        </span>
                        <h3 className="font-serif text-lg font-bold uppercase leading-tight tracking-wider text-zinc-100 sm:text-xl">
                          {currentTheme.name}
                        </h3>
                        <p className="break-words text-[11px] italic leading-snug text-zinc-300">
                          {currentTheme.motto}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex min-h-[5.5rem] items-start gap-2.5 sm:min-h-[6rem]">
                  <Feather
                    size={14}
                    className="mt-1.5 shrink-0 text-fg-brand"
                    aria-hidden="true"
                  />
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={hatSpeech}
                      initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: AUTH_EASE }}
                      className="break-words font-serif text-sm italic leading-relaxed text-zinc-100 sm:text-[15px]"
                    >
                      &ldquo;{hatSpeech}&rdquo;
                    </motion.p>
                  </AnimatePresence>
                </div>

                {hatSubtext && (
                  <div className="mt-3 flex items-start gap-1.5 border-t border-white/10 pt-2.5 text-[11px] leading-snug text-zinc-400">
                    <Sparkles
                      size={11}
                      className="mt-0.5 shrink-0 text-fg-brand"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">{hatSubtext}</span>
                  </div>
                )}
              </div>

              {/* Four houses informational emblem bar (non-editable) */}
              <div className="flex flex-col gap-2">
                <span className="font-orbiter text-center text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  Four houses · balanced destiny
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {HOUSES.map((h) => {
                    const Icon = houseIcons[h];
                    const isSelected = assignedHouse === h;
                    return (
                      <div
                        key={h}
                        className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-[9px] font-medium capitalize transition-colors duration-300 ${
                          isSelected
                            ? "border-brand bg-brand-soft text-fg-brand shadow-glow-brand"
                            : "border-white/10 bg-white/[0.02] text-zinc-400"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={
                            isSelected ? "text-fg-brand" : "text-zinc-500"
                          }
                        />
                        <span className="font-orbiter max-w-full truncate">
                          {h}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="font-orbiter relative z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-zinc-500 sm:flex">
            <span>The Hat decides</span>
            <span aria-hidden="true" className="text-fg-brand">
              ✦
            </span>
            <span>Your chapter awaits</span>
          </div>
        </aside>

        {/* ============ RIGHT: AUTH FORM ============ */}
        <section className="flex min-w-0 flex-col justify-center bg-gradient-to-br from-[#0b0b10]/95 via-[#080808] to-[#0a0a0f]/95 p-6 sm:p-9 lg:p-11">
          <div className="mx-auto flex w-full max-w-md flex-col gap-5">
            <motion.div variants={itemVariants}>
              <span className="font-orbiter mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-fg-brand">
                {isSignup
                  ? "Chapter I · New Student Enrollment"
                  : isForgot
                    ? "Lost Castle Key · Owl Dispatch"
                    : isReset
                      ? "Verified Recovery · New Cipher"
                      : "Return To The Common Room"}
              </span>

              <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight text-zinc-100 sm:text-4xl">
                {isSignup ? (
                  <>
                    The Hat{" "}
                    <em className="italic text-fg-brand">Awaits</em>
                  </>
                ) : isForgot ? (
                  <>
                    Recover your{" "}
                    <em className="italic text-fg-brand">castle key</em>
                  </>
                ) : isReset ? (
                  <>
                    A fresh start.{" "}
                    <em className="italic text-fg-brand">A stronger spell</em>
                  </>
                ) : (
                  <>
                    The Hat{" "}
                    <em className="italic text-fg-brand">Remembers You</em>
                  </>
                )}
              </h1>

              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                {isSignup
                  ? "Create your student record and verify your email address before completing enrollment."
                  : isForgot
                    ? "Enter your registered email to receive an owl-post password reset link."
                    : isReset
                      ? "Choose a strong new passphrase for your Technika account."
                      : "Sign in with your verified email and password to enter your house chamber."}
              </p>
            </motion.div>

            {user && isEmailConfirmed(user) && !isReset && !leaving && !busy && (
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-brand-border bg-brand-soft/60 p-3 text-xs text-zinc-200">
                <span className="min-w-0 break-all">
                  Signed in as {user.email}.
                </span>
                <Link
                  href="/dashboard"
                  className="font-orbiter inline-flex shrink-0 items-center gap-1 font-semibold text-fg-brand underline hover:brightness-110"
                >
                  Dashboard <ArrowRight size={13} />
                </Link>
              </div>
            )}

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="flex flex-col gap-3.5"
            >
              {isSignup && (
                <>
                  <Field
                    label="Full name"
                    icon={User}
                    name="name"
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    placeholder="Name on your Hogwarts letter"
                    disabled={disabled}
                    required
                  />
                  <Field
                    label="College / University"
                    icon={GraduationCap}
                    name="college"
                    type="text"
                    autoComplete="organization"
                    minLength={2}
                    maxLength={160}
                    placeholder="Your college or university"
                    disabled={disabled}
                    required
                  />
                  <Field
                    label="Phone number"
                    icon={Phone}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={25}
                    placeholder="e.g. +91 98765 43210"
                    hint="Include the country code (+91 for India)."
                    disabled={disabled}
                    required
                  />
                </>
              )}

              {!isReset && (
                <Field
                  label="Email address"
                  icon={Mail}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@your-college.ac.in"
                  disabled={disabled}
                  onFocus={() => handleInputFocus("email")}
                  onBlur={handleInputBlur}
                  required
                />
              )}

              {!isForgot && (
                <Field
                  label={isReset ? "New password" : "Password"}
                  icon={KeyRound}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isNewPassword ? "new-password" : "current-password"
                  }
                  minLength={isNewPassword ? 12 : 1}
                  maxLength={128}
                  placeholder="Your secret key to the castle"
                  hint={
                    isNewPassword
                      ? "12+ characters, including a letter and a number."
                      : undefined
                  }
                  disabled={disabled}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                  required
                  trailing={
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition-colors hover:text-fg-brand"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              )}

              {isNewPassword && (
                <Field
                  label={isReset ? "Confirm new password" : "Confirm password"}
                  icon={KeyRound}
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  placeholder={
                    isReset
                      ? "Repeat your new password"
                      : "Repeat your password"
                  }
                  disabled={disabled}
                  required
                />
              )}

              {mode === "login" && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="font-orbiter text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Where shall the owl take you after signing in?
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        ["great-hall", "Great Hall", "Command dashboard"],
                        ["common-room", "Common Room", "3D house hearth"],
                      ] as const
                    ).map(([value, label, hint]) => {
                      const active = landing === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={disabled}
                          aria-pressed={active}
                          onClick={() => {
                            setLanding(value);
                            setLandingPreference(value);
                          }}
                          className={`rounded-xl border p-2.5 text-left transition-all duration-200 disabled:opacity-60 ${
                            active
                              ? "border-brand bg-brand-soft text-fg-strong shadow-glow-brand"
                              : "border-white/10 bg-white/[0.02] hover:border-brand-border hover:bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className={`font-orbiter block text-xs font-semibold ${active ? "text-fg-brand" : "text-zinc-200"}`}
                          >
                            {label}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-zinc-400">
                            {hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === "login" && (
                <Link
                  href="/reset-password"
                  className="font-orbiter -mt-1 self-end text-xs text-fg-brand/90 transition-colors hover:text-fg-brand hover:underline"
                >
                  Forgot your password?
                </Link>
              )}

              <AnimatePresence mode="sync">
                {error && (
                  <motion.p
                    key="auth-error"
                    ref={alertRef}
                    tabIndex={-1}
                    role="alert"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="break-words rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs leading-relaxed text-red-200 outline-none"
                  >
                    {error}
                  </motion.p>
                )}

                {message && (
                  <motion.p
                    key="auth-message"
                    role="status"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs leading-relaxed text-emerald-200"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    <span className="min-w-0 break-words">{message}</span>
                  </motion.p>
                )}

                {pendingVerificationEmail && !leaving && (
                  <motion.button
                    key="resend-btn"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    disabled={resendingEmail || busy}
                    onClick={handleResendVerification}
                    className="font-orbiter self-start text-xs font-medium text-fg-brand underline underline-offset-4 transition-colors hover:brightness-110 disabled:opacity-60"
                  >
                    {resendingEmail
                      ? "Sending another verification email…"
                      : `Resend verification email to ${pendingVerificationEmail}`}
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={disabled}
                whileHover={disabled ? undefined : { y: -1 }}
                whileTap={disabled ? undefined : { scale: 0.99 }}
                className="font-orbiter mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-on shadow-glow-brand transition-colors duration-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {continuation ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>
                      {pendingVerificationEmail
                        ? "Verification email sent"
                        : "Registration recorded"}
                    </span>
                  </>
                ) : disabled ? (
                  <>
                    <LoaderCircle size={16} className="shrink-0 animate-spin" />
                    <span>
                      {leaving
                        ? assignedHouse
                          ? `Entering ${assignedHouse.toUpperCase()}…`
                          : "Opening Dashboard…"
                        : "The Hat is Deliberating…"}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {isSignup
                        ? "Begin Your Ceremony"
                        : isForgot
                          ? "Send Reset Letter"
                          : isReset
                            ? "Save New Password"
                            : "Return To Your House"}
                    </span>
                    <ArrowRight size={16} className="shrink-0" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {continuation && (
              <Link
                href={continuation}
                className={`${linkBtn} inline-flex min-h-11 items-center justify-center gap-2 text-sm`}
                data-no-transition
              >
                {continuation === "/login"
                  ? "Go to sign in"
                  : "Continue to Dashboard"}
                <ArrowRight size={15} />
              </Link>
            )}

            <motion.div
              variants={itemVariants}
              className="border-t border-white/10 pt-4 text-center text-xs text-zinc-400"
            >
              {isSignup ? (
                <>
                  Already sorted into a house?{" "}
                  <Link href="/login" className={linkBtn}>
                    Return to sign in
                  </Link>
                </>
              ) : isForgot ? (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <Link href="/login" className={linkBtn}>
                    ← Back to sign in
                  </Link>
                  <span aria-hidden="true" className="text-zinc-700">
                    ·
                  </span>
                  <Link href="/register" className={linkBtn}>
                    Create an account
                  </Link>
                </div>
              ) : isReset ? (
                <Link href="/login" className={linkBtn}>
                  Return to sign in →
                </Link>
              ) : (
                <>
                  New to the castle?{" "}
                  <Link href="/register" className={linkBtn}>
                    Create an account
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
