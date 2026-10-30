import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { AccountRoom } from "@/components/account-room";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("My Account — Your Common Room", "Manage your private Technika 2K26 account and ceremony preview.", "/account");
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const client = await getServerSupabase();
  if (!client) redirect("/login");
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login");
  const displayName = typeof user.user_metadata.display_name === "string" ? user.user_metadata.display_name : "wizard";
  return <AccountRoom name={displayName} email={user.email || ""}/>;
}
