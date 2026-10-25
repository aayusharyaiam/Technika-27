import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard — Your Technika Command Centre",
  robots: { index: false, follow: false },
};

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
