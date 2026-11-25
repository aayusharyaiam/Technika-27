import { getSupabase } from "@/lib/supabase/client";
import { selectableHouses, type House } from "@/lib/houses";

/**
 * Randomly select a house from the selectable options
 * @returns a random house (gryffindor, slytherin, ravenclaw, or hufflepuff)
 */
export function getRandomHouse(): (typeof selectableHouses)[number] {
  const index = Math.floor(Math.random() * selectableHouses.length);
  return selectableHouses[index];
}

/**
 * Assign a random house to a user if they don't have one yet
 * Called on first login (when profiles.house is NULL)
 * @param userId - authenticated user ID
 * @returns the assigned house, or error
 */
export async function assignHouseIfUnassigned(
  userId: string
): Promise<{ house: House | null; error?: string }> {
  try {
    const client = getSupabase();
    if (!client) return { house: null, error: "Database unavailable" };

    // Check if user already has a house assigned
    const { data: profile, error: fetchError } = await client
      .from("profiles")
      .select("house")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
      return { house: null, error: "Could not fetch profile" };
    }

    // If house is already assigned, return it
    if (profile?.house) {
      return { house: profile.house as House };
    }

    // Assign a random house
    const randomHouse = getRandomHouse();

    // Save to database
    const { error: updateError } = await client
      .from("profiles")
      .update({
        house: randomHouse,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error assigning house:", updateError);
      return { house: null, error: "Could not assign house" };
    }

    return { house: randomHouse };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("House assignment error:", message);
    return { house: null, error: message };
  }
}

/**
 * Force reassign a house to a user (for testing or admin purposes)
 * @param userId - authenticated user ID
 * @param house - house to assign (or undefined for random)
 */
export async function reassignHouse(
  userId: string,
  house?: (typeof selectableHouses)[number]
): Promise<{ success: boolean; house?: House; error?: string }> {
  try {
    const client = getSupabase();
    if (!client) return { success: false, error: "Database unavailable" };

    const houseToAssign = house || getRandomHouse();

    const { error } = await client
      .from("profiles")
      .update({
        house: houseToAssign,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, house: houseToAssign };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
