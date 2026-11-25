"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useHouse } from "@/components/house-provider";
import { assignHouseIfUnassigned, reassignHouse } from "@/lib/assign-house";
import type { House } from "@/lib/houses";

export type HouseAssignmentState =
  | { status: "loading" }
  | { status: "ready"; house: House }
  | { status: "error"; error: string };

/**
 * Hook for managing user house assignment
 * Automatically assigns a house on first login if none exists
 * Provides access to reassign house if needed
 */
export function useHouseAssignment() {
  const { user, loading: authLoading } = useAuth();
  const { house: currentHouse } = useHouse();
  const [state, setState] = useState<HouseAssignmentState>({
    status: "loading",
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setState({ status: "ready", house: "default" });
      return;
    }

    // House is already assigned by auth provider
    if (currentHouse !== "default") {
      setState({ status: "ready", house: currentHouse });
      return;
    }

    // Try to assign a house if not already assigned
    assignHouseIfUnassigned(user.id)
      .then(({ house, error }) => {
        if (error) {
          setState({ status: "error", error });
        } else if (house) {
          setState({ status: "ready", house });
        } else {
          setState({ status: "ready", house: "default" });
        }
      })
      .catch((err) => {
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      });
  }, [user, authLoading, currentHouse]);

  const reassign = async (house?: string) => {
    if (!user) {
      return { success: false, error: "No user logged in" };
    }

    const result = await reassignHouse(
      user.id,
      house as any
    );

    if (result.success && result.house) {
      setState({ status: "ready", house: result.house });
    } else if (result.error) {
      setState({ status: "error", error: result.error });
    }

    return result;
  };

  return {
    ...state,
    reassign,
  };
}
