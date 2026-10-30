import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("Dashboard — Your Technika Command Centre", "Your private Technika 2K26 account dashboard.", "/dashboard");

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, college, phone, house")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardClient
      email={user.email || ""}
      profile={profile}
    />
  );
}
