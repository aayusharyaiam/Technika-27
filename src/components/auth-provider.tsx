"use client";



import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { houseFromValue } from "@/lib/houses";
import { useHouse } from "./house-provider";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHouse } = useHouse();
  useEffect(() => {
    let active = true;
    let requestId = 0;
    const client = getSupabase();
    const resolveHouse = async (value: User | null) => {
      if (!value) return "default" as const;

      // The profiles row is the source of truth. Metadata is retained only as
      // a compatibility fallback for older accounts that predate that row.
      if (client) {
        const { data } = await client
          .from("profiles")
          .select("house")
          .eq("id", value.id)
          .maybeSingle();
        const profileHouse = houseFromValue(data?.house);
        if (profileHouse) return profileHouse;
      }

      return houseFromValue(value.user_metadata?.house) || "default";
    };
    const apply = async (value: User | null) => {
      const currentRequest = ++requestId;
      if (!active) return;
      setUser(value);
      if (!value) {
        setHouse("default");
        setLoading(false);
        return;
      }
      setLoading(true);
      const house = await resolveHouse(value).catch(() => "default" as const);
      if (!active || currentRequest !== requestId) return;
      setHouse(house);
      setLoading(false);
    };
    if (!client) {
      const timer = window.setTimeout(() => void apply(null), 0);
      return () => { active = false; window.clearTimeout(timer); };
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      // Let Supabase finish its auth callback before making the profile query.
      window.setTimeout(() => void apply(session?.user || null), 0);
    });
    void client.auth.getUser().then(({ data }) => apply(data.user)).catch(() => apply(null));
    return () => { active = false; requestId += 1; subscription.unsubscribe(); };
  }, [setHouse]);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
