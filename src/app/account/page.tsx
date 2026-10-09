import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { AccountRoom } from "@/components/account-room";

export const metadata: Metadata = { title: "My Account — Your Common Room", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const client = await getServerSupabase();
  if (!client) redirect("/login");
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login");
  const displayName = typeof user.user_metadata.display_name === "string" ? user.user_metadata.display_name : "wizard";
  return <AccountRoom name={displayName} email={user.email || ""}/>;
}
