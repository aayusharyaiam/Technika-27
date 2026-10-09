import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { AccountRoom } from "@/components/account-room";
import { createPrivatePageMetadata } from "@/lib/seo";

export const metadata = createPrivatePageMetadata("/account", "My account | Technika ’27", "Your private Technika ’27 account room.");
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const client = await getServerSupabase();
  if (!client) redirect("/login");
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login");
  const displayName = typeof user.user_metadata.display_name === "string" ? user.user_metadata.display_name : "wizard";
  return <AccountRoom name={displayName} email={user.email || ""}/>;
}
