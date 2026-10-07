"use client";

import { createBrowserClient } from "@supabase/ssr";
import { authConfigured, supabaseKey, supabaseUrl } from "./config";

export function getSupabase() {
  if (!authConfigured) return null;
  return createBrowserClient(supabaseUrl, supabaseKey, { cookieOptions: { sameSite: "lax", secure: process.env.NODE_ENV === "production" } });
}
