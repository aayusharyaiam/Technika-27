"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button onClick={handleLogout} className="mt-6 rounded-lg border px-4 py-2">
      Logout
    </button>
  );
}
