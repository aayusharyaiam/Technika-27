"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { isEmailConfirmed } from "@/lib/auth/session-state";
import { houseFromValue } from "@/lib/houses";
import { isBitMesraEmail } from "@/lib/bit-email";
import { useHouse } from "./house-provider";
import { assignHouseIfUnassigned } from "@/lib/assign-house";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

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
        const computedIsBit = isBitMesraEmail(value.email);
        const { data } = await client
          .from("profiles")
          .select("house, is_bit")
          .eq("id", value.id)
          .maybeSingle();

        // Repair `is_bit` on verified BIT student emails even if an earlier row stored false
        if (computedIsBit && (!data || data.is_bit !== true)) {
          try {
            if (data) {
              await client
                .from("profiles")
                .update({ is_bit: true })
                .eq("id", value.id);
            } else {
              await client.from("profiles").upsert(
                {
                  id: value.id,
                  full_name:
                    (value.user_metadata?.full_name as string) ||
                    (value.user_metadata?.display_name as string) ||
                    value.email?.split("@")[0] ||
                    "Wizard",
                  college: (value.user_metadata?.college as string) || "",
                  phone: (value.user_metadata?.phone as string) || "",
                  is_bit: true,
                },
                { onConflict: "id" },
              );
            }
          } catch {
            /* best-effort sync */
          }
        }

        const profileHouse = houseFromValue(data?.house);
        if (profileHouse) return profileHouse;

        // If no house is assigned, assign one randomly on first login
        if (data && !data.house) {
          const { house: assignedHouse } = await assignHouseIfUnassigned(
            value.id
          );
          if (assignedHouse) return assignedHouse;
        }
      }

      return houseFromValue(value.user_metadata?.house) || "default";
    };

    const apply = async (value: User | null) => {
      const currentRequest = ++requestId;
      if (!active) return;
      const verifiedUser = isEmailConfirmed(value) ? value : null;
      setUser(verifiedUser);
      if (!verifiedUser) {
        setHouse("default");
        setLoading(false);
        return;
      }
      setLoading(true);
      const house = await resolveHouse(verifiedUser).catch(
        () => houseFromValue(verifiedUser.user_metadata?.house) || ("default" as const),
      );
      if (!active || currentRequest !== requestId) return;
      setHouse(house);
      setLoading(false);
    };

    if (!client) {
      const timer = window.setTimeout(() => void apply(null), 0);
      return () => {
        active = false;
        window.clearTimeout(timer);
      };
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        // Let Supabase finish its auth callback before making the profile query.
        window.setTimeout(() => void apply(session?.user || null), 0);
      }
    );

    void client.auth
      .getUser()
      .then(({ data }) => apply(data.user))
      .catch(() => apply(null));

    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
    };
  }, [setHouse]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
