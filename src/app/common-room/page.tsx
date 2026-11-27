import { redirect } from "next/navigation";
import { AccountRoom } from "@/components/account-room";
import { isEmailConfirmed } from "@/lib/auth/session-state";
import { loadRoomAccount } from "@/lib/common-room/server";
import { createPrivateMetadata } from "@/lib/seo";
import { getServerSupabase } from "@/lib/supabase/server";

export const metadata = createPrivateMetadata(
  "Common Room — Your House Sanctuary",
  "Enter your private Technika 2K26 House Common Room.",
  "/common-room",
);

export const dynamic = "force-dynamic";

export default async function CommonRoomPage() {
  const supabase = await getServerSupabase();
  if (!supabase) {
    redirect("/login?next=%2Fcommon-room");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !isEmailConfirmed(user)) {
    redirect("/login?next=%2Fcommon-room");
  }

  const access = await loadRoomAccount(supabase);
  if (access.status === "signed-out") {
    redirect("/login?next=%2Fcommon-room");
  }

  return <AccountRoom access={access} />;
}
