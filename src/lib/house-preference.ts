"use client";

import { getSupabase } from "@/lib/supabase/client";
import type { House } from "@/lib/houses";

export type ProfileHouse = Exclude<House, "default">;

/** Persist a selected house for the currently authenticated profile. */
export async function saveHousePreference(userId: string, house: ProfileHouse) {
  const client = getSupabase();
  if (!client) return new Error("Account services are unavailable right now.");

  const { error } = await client
    .from("profiles")
    .update({ house })
    .eq("id", userId)
    .select("house")
    .single();

  return error;
}
