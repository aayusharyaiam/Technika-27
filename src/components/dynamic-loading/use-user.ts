"use client";

import { useAuth } from "@/components/auth-provider";

/**
 * Current authenticated Supabase user for client components, reusing the shared
 * AuthProvider context (safe when auth is disabled & checks email confirmation).
 */
export function useUser() {
  return useAuth();
}
