import { getSupabase } from "@/lib/supabase/client";

/** Unsaved UI values, not database columns or a published submission contract. */
export type AlumniDraft = {
  name: string;
  yearOfPassing: string;
  phone: string;
  email: string;
  size: string;
};

/** Reusable type for event registration data (uses same structure as alumni) */
export type ParticipantRegistration = AlumniDraft;

export type AlumniProfileResult =
  | { status: "ready"; profile: { full_name: string | null; phone: string | null } }
  | { status: "missing" }
  | { status: "unavailable" };

export type PhoneValidationResult = { valid: boolean; error?: string };

/**
 * Validate phone number: numbers, spaces, hyphens, plus sign, and parentheses only
 * @param phone - phone number to validate
 * @returns true if valid format
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9+\-\s()]*$/;
  return phoneRegex.test(phone) && phone.trim().length >= 7;
}

/**
 * Sanitize phone number: keep only numeric characters for database storage
 * @param phone - phone number to sanitize
 * @returns sanitized phone with only numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/** Helper function for phone validation feedback */
export function getPhoneValidationError(phone: string): string | null {
  if (!phone) return null; // Don't show error while typing
  if (!validatePhoneNumber(phone)) {
    return "Phone number must contain only digits, spaces, hyphens, parentheses, and + symbol";
  }
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 7) {
    return "Phone number must have at least 7 digits";
  }
  return null;
}

/** Alumni integration status and configuration */
export const alumniIntegrations = {
  // Alumni registration form is now collecting data
  registration: {
    status: "available",
    message: "Alumni registration form — please provide your details to stay connected with the Technika community.",
  },
  // TODO(alumni): connect authoritative payment/status verification only when supplied.
  // Account sign-in and local form interactions must never produce a paid/verified letter.
  payment: {
    status: "unavailable",
    message: "Payment verification is not connected. No payment is requested or processed here.",
  },
  // TODO(alumni): populate options from the official merchandise source; do not invent a catalogue.
  merchandise: {
    status: "unavailable",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"] as readonly string[],
    message: "Official merchandise sizes shown for preview; ordering is not connected.",
  },
} as const;

/** Read only existing columns, filtered to the AuthProvider user's own profile. */
export async function readAlumniProfile(userId: string, signal: AbortSignal): Promise<AlumniProfileResult> {
  try {
    const client = getSupabase();
    if (!client) return { status: "unavailable" };
    const { data, error } = await client.from("profiles")
      .select("full_name,phone")
      .eq("id", userId)
      .abortSignal(signal)
      .maybeSingle();
    if (error) return { status: "unavailable" };
    if (!data) return { status: "missing" };
    return {
      status: "ready",
      profile: {
        full_name: typeof data.full_name === "string" ? data.full_name.trim() || null : null,
        phone: typeof data.phone === "string" ? data.phone.trim() || null : null,
      },
    };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * Save alumni registration data to Supabase
 * @param userId - authenticated user ID
 * @param data - alumni form data
 */
export async function saveAlumniRegistration(
  userId: string,
  data: AlumniDraft
): Promise<{ status: "success" | "error"; message?: string }> {
  try {
    const error = getPhoneValidationError(data.phone);
    if (error) {
      return { status: "error", message: error };
    }

    const client = getSupabase();
    if (!client) return { status: "error", message: "Database unavailable" };

    // Save to profiles table
    const { error: profileError } = await client
      .from("profiles")
      .update({
        full_name: data.name,
        phone: sanitizePhoneNumber(data.phone),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Save to alumni_registrations table
    const { error: alumniError } = await client
      .from("alumni_registrations")
      .upsert({
        user_id: userId,
        full_name: data.name,
        email: data.email,
        phone: sanitizePhoneNumber(data.phone),
        year_of_passing: data.yearOfPassing,
        merchandise_size: data.size,
        registered_at: new Date().toISOString(),
      });

    if (alumniError) throw alumniError;

    return { status: "success" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Registration failed",
    };
  }
}
