"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";
import { houseThemes } from "@/lib/houses";
import { savedProfileHouse } from "@/lib/ceremony-preview";
import { HouseBanners } from "./house-banners";

export function AccountRoom({ name, email }: { name: string; email: string }) {
  const { user } = useAuth();
  const house = savedProfileHouse(user?.user_metadata?.house);
  const theme = houseThemes[house || "default"];
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const logout = async () => {
    setBusy(true);
    setFeedback("");
    try {
      const client = getSupabase();
      if (!client) throw new Error("The account service is unavailable. Please try again.");
      const { error } = await client.auth.signOut();
      if (error) throw error;
      router.replace("/login"); router.refresh();
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Could not sign out. Please try again."); }
    finally { setBusy(false); }
  };
  return <section className="common-room shell"><div className="common-room-heading"><HouseBanners/><span className="eyebrow"><ShieldCheck size={13}/>Your verified common room</span><h1>Welcome home,<br /><em>{name}.</em></h1><p>{theme.motto}</p><span className="account-email">{email}</span></div><div className="account-parchment parchment-sheet"><span className="notebook-overline">A note from the Sorting Hat</span><h2>Your colours tell <em>your story.</em></h2><p>{!house ? "Your account is ready. Explore the ceremony preview while official house assignment is being connected." : `${theme.name} is the house saved in your profile. Welcome back to your Technika ’27 story.`}</p><div className="account-actions"><Link href="/signup?step=ceremony" className="button button-gold">{house ? "View my house" : "Continue to the Hat"} <ArrowUpRight size={14}/></Link><button type="button" className="account-signout" disabled={busy} onClick={logout}><LogOut size={14}/>Sign out</button></div>{feedback && <p className="account-feedback" role="status">{feedback}</p>}</div><Link className="button button-glass" href="/">Return to the festival <ArrowUpRight size={15}/></Link></section>;
}
