import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, college, phone, house")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <p>Please contact support or complete your profile setup.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen space-y-4 p-8">
      <h1 className="text-3xl font-bold">Welcome, {profile.full_name}!</h1>

      <p>College: {profile.college}</p>
      <p>Phone: {profile.phone}</p>

      <div className="rounded-xl border p-4">
        <h2 className="text-xl font-semibold">Your Hogwarts House</h2>
        <p className="mt-2 text-lg">{profile.house}</p>
      </div>
    </main>
  );
}
