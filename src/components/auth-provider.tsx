"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { isHouse } from "@/lib/houses";
import { useHouse } from "./house-provider";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHouse } = useHouse();
  useEffect(() => {
    let active = true;
    const client = getSupabase();
    const apply = (value: User | null) => {
      if (!active) return;
      setUser(value); setLoading(false);
      if (isHouse(value?.user_metadata?.house)) setHouse(value.user_metadata.house);
    };
    if (!client) { const timer = window.setTimeout(() => apply(null), 0); return () => window.clearTimeout(timer); }
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => apply(session?.user || null));
    client.auth.getUser().then(({ data }) => apply(data.user)).catch(() => apply(null));
    return () => { active = false; subscription.unsubscribe(); };
  }, [setHouse]);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
