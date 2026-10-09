import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authConfigured, supabaseKey, supabaseUrl } from "./config";

export async function getServerSupabase() {
  if (!authConfigured) return null;
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: { sameSite: "lax", secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (items) => {
        // Server Components cannot write cookies; the auth proxy refreshes them.
        try { items.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {}
      },
    },
  });
}
