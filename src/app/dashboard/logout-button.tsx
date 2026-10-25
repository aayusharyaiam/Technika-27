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

  return <button onClick={handleLogout} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:border-brand/50 hover:bg-brand-soft hover:text-fg-strong focus-visible:ring-2 focus-visible:ring-ring">Logout</button>;
}
